from flask.views import MethodView
from flask_smorest import Blueprint
from flask import jsonify, request, g, current_app
from src.utils.auth import verify_supabase_token
from dotenv import load_dotenv
import os
import json
from datetime import datetime, timezone
from supabase import create_client, Client

# Paddle SDK
from paddle_billing import Client as PaddleClient, Environment, Options
from paddle_billing.Notifications import Secret, Verifier

load_dotenv()

blp = Blueprint('Billing', __name__, description='Billing and Paddle integration')


def get_paddle_client() -> PaddleClient:
    api_key = os.getenv('PADDLE_API_SECRET_KEY')
    if not api_key:
        raise RuntimeError('PADDLE_API_SECRET_KEY is not set')

    env_name = os.getenv('PADDLE_ENV', 'SANDBOX').upper()
    env = Environment.SANDBOX if env_name == 'SANDBOX' else Environment.LIVE
    return PaddleClient(api_key, options=Options(env))


def get_supabase_client() -> Client:
    supabase_url = current_app.config['SUPABASE_URL']
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    return create_client(supabase_url, supabase_key)


@blp.route('/billing/create-checkout')
class CreateCheckout(MethodView):
    @verify_supabase_token
    def post(self):
        try:
            data = request.get_json(silent=True) or {}
            user_id = g.current_user['id']
            user_email = g.current_user['email']

            print(f"=== Paddle Checkout Debug ===")
            print(f"User ID: {user_id}")
            print(f"User Email: {user_email}")
            print(f"Request Data: {data}")

            # Get price ID from environment or request
            price_id = data.get('price_id') or os.getenv('PADDLE_PRICE_ID_PRO_MONTHLY')
            print(f"Price ID: {price_id}")
            
            if not price_id:
                error_msg = 'Missing price_id. Set PADDLE_PRICE_ID_PRO_MONTHLY or pass price_id in body.'
                print(f"ERROR: {error_msg}")
                return jsonify({'error': error_msg}), 400

            # Validate Paddle configuration
            api_key = os.getenv('PADDLE_API_SECRET_KEY')
            env_name = os.getenv('PADDLE_ENV', 'SANDBOX').upper()
            print(f"Paddle API Key exists: {bool(api_key)}")
            print(f"Paddle Environment: {env_name}")

            if not api_key:
                error_msg = 'PADDLE_API_SECRET_KEY is not configured'
                print(f"ERROR: {error_msg}")
                return jsonify({'error': error_msg}), 500

            paddle = get_paddle_client()
            print("Paddle client created successfully")

            # Create transaction with metadata to link back to user
            operation = {
                'items': [
                    {
                        'price_id': price_id,
                        'quantity': 1,
                    }
                ],
                'custom_data': {
                    'user_id': user_id,
                    'user_email': user_email,
                    'plan': 'pro_monthly'
                },
                'customer_email': user_email,
                'return_url': data.get('return_url', 'http://localhost:5173/payment'),
                'success_url': data.get('success_url', 'http://localhost:5173/dashboard?subscription=active'),
                'cancel_url': data.get('cancel_url', 'http://localhost:5173/pricing?canceled=true')
            }

            print(f"Paddle operation: {operation}")

            # Create the transaction
            try:
                tx = paddle.transactions.create(operation)
                print(f"Paddle transaction created: {tx}")
            except Exception as paddle_error:
                print(f"Paddle API Error: {paddle_error}")
                print(f"Paddle Error Type: {type(paddle_error)}")
                print(f"Paddle Error Details: {str(paddle_error)}")
                
                # Try to get more details from the error
                if hasattr(paddle_error, 'response'):
                    print(f"Paddle Response: {paddle_error.response}")
                if hasattr(paddle_error, 'status_code'):
                    print(f"Paddle Status Code: {paddle_error.status_code}")
                
                return jsonify({
                    'error': 'Paddle API error',
                    'details': str(paddle_error),
                    'operation': operation
                }), 400

            tx_id = getattr(tx, 'id', None)
            
            # Extract checkout URL from transaction object
            checkout_url = None
            if hasattr(tx, 'checkout') and tx.checkout:
                checkout_url = getattr(tx.checkout, 'url', None)
            elif hasattr(tx, 'checkout_url'):
                checkout_url = tx.checkout_url
            elif hasattr(tx, 'checkoutUrl'):
                checkout_url = tx.checkoutUrl
            
            print(f"Transaction ID: {tx_id}")
            print(f"Transaction checkout object: {getattr(tx, 'checkout', None)}")
            print(f"Checkout URL: {checkout_url}")

            if not checkout_url:
                error_msg = 'Failed to create checkout - no checkout URL received'
                print(f"ERROR: {error_msg}")
                print(f"Transaction object: {tx}")
                print(f"Transaction attributes: {dir(tx)}")
                return jsonify({'error': error_msg, 'transaction_id': tx_id}), 500

            # Store transaction record in database (new schema: transactions)
            supabase = get_supabase_client()

            # Try to extract amount and currency from Paddle transaction object
            amount_cents = None
            currency = None

            try:
                # Common shapes: tx.totals.total (in minor units) and tx.currency
                if hasattr(tx, 'totals') and tx.totals:
                    # Some SDKs expose totals in minor units directly
                    amount_cents = getattr(tx.totals, 'total', None) or getattr(tx.totals, 'grand_total', None)
                # Some SDKs expose amount on top-level
                if amount_cents is None:
                    amount_cents = getattr(tx, 'amount', None)
                # Currency often top-level or within totals
                currency = getattr(tx, 'currency', None) or (getattr(tx.totals, 'currency', None) if hasattr(tx, 'totals') and tx.totals else None)
            except Exception as e:
                print(f"Warning extracting amount/currency from tx: {e}")

            if amount_cents is None or currency is None:
                print("Totals missing on transaction; attempting to resolve via Price API")
                try:
                    price = None
                    # Try prices.get if available
                    if hasattr(paddle, 'prices') and hasattr(paddle.prices, 'get'):
                        price = paddle.prices.get(price_id)
                    elif hasattr(paddle, 'prices') and hasattr(paddle.prices, 'list'):
                        prices_list = paddle.prices.list({'id': price_id})
                        if prices_list and hasattr(prices_list, 'data') and prices_list.data:
                            price = prices_list.data[0]

                    if price:
                        # Common shapes: price.unit_price.amount (string/decimal) + price.unit_price.currency_code
                        unit_price = getattr(price, 'unit_price', None) or getattr(price, 'unitPrice', None) or {}
                        price_amount = None
                        price_currency = None

                        if unit_price:
                            price_amount = unit_price.get('amount') if isinstance(unit_price, dict) else getattr(unit_price, 'amount', None)
                            price_currency = unit_price.get('currency_code') if isinstance(unit_price, dict) else getattr(unit_price, 'currency_code', None)

                        # Some SDKs store at top-level
                        if price_amount is None:
                            price_amount = getattr(price, 'amount', None)
                        if price_currency is None:
                            price_currency = getattr(price, 'currency', None) or getattr(price, 'currency_code', None)

                        # Convert decimal string to cents when needed
                        if price_amount is not None:
                            try:
                                # If already integer minor units, use directly; else multiply
                                if isinstance(price_amount, (int, float)) and float(price_amount).is_integer() and abs(price_amount) > 10_000:
                                    amount_cents = int(price_amount)
                                else:
                                    amount_cents = int(round(float(price_amount) * 100))
                            except Exception as conv_err:
                                print(f"Price amount conversion error: {conv_err}")
                                amount_cents = None

                        currency = currency or price_currency

                except Exception as price_err:
                    print(f"Failed to resolve price via Paddle API: {price_err}")

            if amount_cents is None or currency is None:
                print("ERROR: Missing amount_cents or currency after price resolution; cannot satisfy schema")
                return jsonify({
                    'error': 'Paddle transaction missing totals',
                    'details': 'amount_cents or currency not found on transaction response'
                }), 502

            transaction_record = {
                'user_id': user_id,
                'paddle_transaction_id': tx_id,
                'status': 'pending',
                'checkout_url': checkout_url,
                'price_id': price_id,
                'amount_cents': int(amount_cents),
                'currency': str(currency)
            }
            
            try:
                supabase.table('transactions').insert(transaction_record).execute()
                print("Transaction record stored in database (transactions)")
            except Exception as db_error:
                print(f"Warning: Failed to store transaction record: {db_error}")

            print("=== Checkout created successfully ===")
            return jsonify({
                'checkout_url': checkout_url, 
                'transaction_id': tx_id,
                'user_id': user_id
            })

        except Exception as e:
            print(f"=== Paddle create-checkout error ===")
            print(f"Error Type: {type(e)}")
            print(f"Error Message: {str(e)}")
            print(f"Error Details: {e}")
            
            # Print full traceback for debugging
            import traceback
            print(f"Full Traceback:")
            traceback.print_exc()
            
            return jsonify({
                'error': 'Internal server error',
                'details': str(e),
                'type': str(type(e))
            }), 500


@blp.route('/billing/webhook')
class PaddleWebhook(MethodView):
    def post(self):
        try:
            secret = os.getenv('PADDLE_WEBHOOK_SECRET')
            if not secret:
                return jsonify({'error': 'Webhook secret not configured'}), 500

            verifier = Verifier()
            if not verifier.verify(request, Secret(secret)):
                return jsonify({'error': 'Signature verification failed'}), 400

            payload = request.get_json() or {}
            event_type = payload.get('event_type') or payload.get('eventType')
            data = payload.get('data', {})

            print(f"Paddle webhook received: {event_type}")
            print(f"Event type: {event_type}")

            # Handle different webhook events
            if event_type == 'subscription.created':
                self._handle_subscription_created(payload)
            elif event_type == 'subscription.activated':
                self._handle_subscription_activated(data)
            elif event_type == 'subscription.canceled':
                self._handle_subscription_canceled(data)
            elif event_type == 'subscription.paused':
                self._handle_subscription_paused(data)
            elif event_type == 'subscription.resumed':
                self._handle_subscription_resumed(data)
            elif event_type == 'subscription.trialing':
                self._handle_subscription_trialing(data)
            elif event_type == 'transaction.completed':
                self._handle_transaction_completed(data)
            elif event_type == 'transaction.payment_failed':
                self._handle_payment_failed(data)
            else:
                print(f"Unhandled webhook event: {event_type}")

            return jsonify({'status': 'ok'})

        except Exception as e:
            print(f"Paddle webhook error: {e}")
            return jsonify({'error': 'Internal server error'}), 500

    def _handle_subscription_created(self, payload):
        """Handle subscription.created webhook"""
        # Some webhook variants include top-level ids; keep full payload for activities
        subscription = payload.get('data', payload)
        event_id = payload.get('event_id') or payload.get('eventId') or payload.get('notification_id')
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            subscription_record = {
                'user_id': user_id,
                'paddle_subscription_id': subscription.get('id'),
                'status': 'trialing' if subscription.get('status') == 'trialing' else 'active',
                'trial_start': subscription.get('trial_start') or subscription.get('trialStart'),
                'trial_end': subscription.get('trial_end') or subscription.get('trialEnd'),
                'current_period_start': subscription.get('current_billing_period_start') or subscription.get('currentPeriodStart'),
                'current_period_end': subscription.get('current_billing_period_end') or subscription.get('currentPeriodEnd')
            }
            
            try:
                supabase.table('subscriptions').upsert(subscription_record, on_conflict='user_id').execute()
                # Log activity
                supabase.table('subscription_activities').insert({
                    'user_id': user_id,
                    'paddle_subscription_id': subscription.get('id'),
                    'event_id': event_id,
                    'event_type': 'trial_started' if subscription_record['status'] == 'trialing' else 'activated',
                    'metadata': payload
                }).execute()
                print(f"Subscription created for user {user_id}")
            except Exception as e:
                print(f"Error storing subscription record: {e}")

    def _handle_subscription_activated(self, data):
        """Handle subscription.activated webhook"""
        subscription = data  # data IS the subscription object
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            
            # Update subscription status
            try:
                supabase.table('subscriptions').update({
                    'status': 'active',
                    'current_period_start': data.get('current_billing_period_start') or data.get('currentPeriodStart'),
                    'current_period_end': data.get('current_billing_period_end') or data.get('currentPeriodEnd'),
                    'cancel_at_period_end': False
                }).eq('user_id', user_id).execute()
                # Log activity
                supabase.table('subscription_activities').insert({
                    'user_id': user_id,
                    'paddle_subscription_id': data.get('id'),
                    'event_type': 'activated',
                    'metadata': data
                }).execute()
                print(f"Subscription activated for user {user_id}")
            except Exception as e:
                print(f"Error updating subscription status: {e}")

    def _handle_subscription_canceled(self, data):
        """Handle subscription.canceled webhook"""
        subscription = data  # data IS the subscription object
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            
            try:
                cancel_at_period_end = bool(subscription.get('cancel_at_period_end') or subscription.get('cancelAtPeriodEnd'))
                update_fields = {
                    'status': 'canceled' if not cancel_at_period_end else 'active',
                    'cancel_at_period_end': cancel_at_period_end,
                }
                if not cancel_at_period_end:
                    update_fields['canceled_at'] = datetime.now(timezone.utc).isoformat()

                supabase.table('subscriptions').update(update_fields).eq('user_id', user_id).execute()
                # Log activity
                supabase.table('subscription_activities').insert({
                    'user_id': user_id,
                    'paddle_subscription_id': subscription.get('id'),
                    'event_type': 'canceled',
                    'metadata': subscription
                }).execute()
                print(f"Subscription canceled for user {user_id}")
            except Exception as e:
                print(f"Error updating subscription status: {e}")

    def _handle_subscription_paused(self, data):
        """Handle subscription.paused webhook"""
        subscription = data  # data IS the subscription object
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            
            try:
                supabase.table('subscriptions').update({
                    'status': 'paused',
                    'paused_at': datetime.now(timezone.utc).isoformat()
                }).eq('user_id', user_id).execute()
                supabase.table('subscription_activities').insert({
                    'user_id': user_id,
                    'paddle_subscription_id': subscription.get('id'),
                    'event_type': 'expired',
                    'metadata': subscription
                }).execute()
                print(f"Subscription paused for user {user_id}")
            except Exception as e:
                print(f"Error updating subscription status: {e}")

    def _handle_subscription_resumed(self, data):
        """Handle subscription.resumed webhook"""
        subscription = data  # data IS the subscription object
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            
            try:
                supabase.table('subscriptions').update({
                    'status': 'active',
                    'current_period_start': data.get('current_billing_period_start') or data.get('currentPeriodStart'),
                    'current_period_end': data.get('current_billing_period_end') or data.get('currentPeriodEnd'),
                    'cancel_at_period_end': False
                }).eq('user_id', user_id).execute()
                supabase.table('subscription_activities').insert({
                    'user_id': user_id,
                    'paddle_subscription_id': subscription.get('id'),
                    'event_type': 'renewed',
                    'metadata': subscription
                }).execute()
                print(f"Subscription resumed for user {user_id}")
            except Exception as e:
                print(f"Error updating subscription status: {e}")

    def _handle_subscription_trialing(self, data):
        """Handle subscription.trialing webhook"""        
        # The data IS the subscription object, not wrapped
        subscription = data
        
        custom_data = subscription.get('custom_data', {})
        
        user_id = custom_data.get('user_id')

        if user_id:
            supabase = get_supabase_client()

            try:
                # Record trialing status on subscriptions table
                subscription_record = {
                    'user_id': user_id,
                    'paddle_subscription_id': subscription.get('id'),
                    'status': 'trialing',
                    'trial_start': datetime.now(timezone.utc).isoformat(),
                    'trial_end': subscription.get('trial_end') or subscription.get('trialEnd')
                }
                print(f"Subscription record to upsert: {subscription_record}")
                
                result = supabase.table('subscriptions').upsert(subscription_record, on_conflict='user_id').execute()
                print(f"Subscription upsert result: {result}")

                # Log activity
                result2 = supabase.table('subscription_activities').insert({
                    'user_id': user_id,
                    'paddle_subscription_id': subscription.get('id'),
                    'event_type': 'trial_started',
                    'metadata': subscription
                }).execute()
                print(f"Subscription activity insert result: {result2}")

                print(f"Subscription trialing for user {user_id} -> pro access granted")
            except Exception as e:
                print(f"Error updating trialing subscription status: {e}")
                import traceback
                traceback.print_exc()
        else:
            print(f"ERROR: No user_id found in custom_data: {custom_data}")

    def _handle_transaction_completed(self, data):
        """Handle transaction.completed webhook"""
        transaction = data  # data IS the transaction object
        transaction_id = transaction.get('id')
        
        if transaction_id:
            supabase = get_supabase_client()
            
            try:
                supabase.table('transactions').update({
                    'status': 'completed',
                    'completed_at': datetime.now(timezone.utc).isoformat()
                }).eq('paddle_transaction_id', transaction_id).execute()
                
                print(f"Transaction {transaction_id} completed")
            except Exception as e:
                print(f"Error updating transaction status: {e}")

    def _handle_payment_failed(self, data):
        """Handle transaction.payment_failed webhook"""
        transaction = data  # data IS the transaction object
        transaction_id = transaction.get('id')
        
        if transaction_id:
            supabase = get_supabase_client()
            
            try:
                supabase.table('transactions').update({
                    'status': 'failed',
                    'failed_at': datetime.now(timezone.utc).isoformat()
                }).eq('paddle_transaction_id', transaction_id).execute()
                
                print(f"Transaction {transaction_id} payment failed")
            except Exception as e:
                print(f"Error updating transaction status: {e}")


@blp.route('/billing/debug-config')
class DebugConfig(MethodView):
    @verify_supabase_token
    def get(self):
        """Debug endpoint to check Paddle configuration"""
        try:
            config = {
                'paddle_api_key_exists': bool(os.getenv('PADDLE_API_SECRET_KEY')),
                'paddle_webhook_secret_exists': bool(os.getenv('PADDLE_WEBHOOK_SECRET')),
                'paddle_env': os.getenv('PADDLE_ENV', 'SANDBOX'),
                'price_id': os.getenv('PADDLE_PRICE_ID_PRO_MONTHLY'),
                'supabase_url': current_app.config.get('SUPABASE_URL'),
                'supabase_service_key_exists': bool(os.getenv('SUPABASE_SERVICE_ROLE_KEY'))
            }
            
            # Test Paddle client creation
            try:
                paddle = get_paddle_client()
                config['paddle_client_created'] = True
                config['paddle_client_type'] = str(type(paddle))
            except Exception as e:
                config['paddle_client_created'] = False
                config['paddle_client_error'] = str(e)
            
            return jsonify(config)
        except Exception as e:
            return jsonify({'error': str(e)}), 500


@blp.route('/billing/subscription-status')
class SubscriptionStatus(MethodView):
    @verify_supabase_token
    def get(self):
        """Get current subscription status for the authenticated user"""
        try:
            user_id = g.current_user['id']
            supabase = get_supabase_client()
            
            # Get subscription status from subscriptions table
            result = supabase.table('subscriptions').select('status, trial_start, trial_end, current_period_start, current_period_end, canceled_at, cancel_at_period_end').eq('user_id', user_id).limit(1).execute()

            if result.data:
                sub = result.data[0]
                status = sub.get('status') or 'trialing'
                # Map to legacy statuses expected by frontend: 'pro' during trial/active, else table status
                if status in ['active', 'trialing']:
                    mapped = 'pro'
                elif status in ['paused', 'past_due']:
                    mapped = status
                else:
                    mapped = 'canceled' if status in ['canceled', 'expired'] else 'free'

                return jsonify({
                    'subscription_status': mapped,
                    'activated_at': sub.get('current_period_start'),
                    'canceled_at': sub.get('canceled_at'),
                    'raw_status': status,
                    'trial_end': sub.get('trial_end'),
                    'cancel_at_period_end': sub.get('cancel_at_period_end')
                })
            
            # No subscription row -> free
            return jsonify({'subscription_status': 'free'})
                
        except Exception as e:
            print(f"Error getting subscription status: {e}")
            return jsonify({'error': 'Internal server error'}), 500


