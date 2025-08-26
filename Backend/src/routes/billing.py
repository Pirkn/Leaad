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

            # Store transaction record in database
            supabase = get_supabase_client()
            transaction_record = {
                'id': tx_id,
                'user_id': user_id,
                'status': 'pending',
                'checkout_url': checkout_url,
                'price_id': price_id,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            try:
                supabase.table('paddle_transactions').upsert(transaction_record).execute()
                print("Transaction record stored in database")
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

            # Handle different webhook events
            if event_type == 'subscription.created':
                self._handle_subscription_created(data)
            elif event_type == 'subscription.activated':
                self._handle_subscription_activated(data)
            elif event_type == 'subscription.canceled':
                self._handle_subscription_canceled(data)
            elif event_type == 'subscription.paused':
                self._handle_subscription_paused(data)
            elif event_type == 'subscription.resumed':
                self._handle_subscription_resumed(data)
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

    def _handle_subscription_created(self, data):
        """Handle subscription.created webhook"""
        subscription = data.get('subscription', {})
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            subscription_record = {
                'user_id': user_id,
                'paddle_subscription_id': subscription.get('id'),
                'status': 'created',
                'plan': 'pro_monthly',
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            try:
                supabase.table('subscriptions').upsert(subscription_record).execute()
                print(f"Subscription created for user {user_id}")
            except Exception as e:
                print(f"Error storing subscription record: {e}")

    def _handle_subscription_activated(self, data):
        """Handle subscription.activated webhook"""
        subscription = data.get('subscription', {})
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            
            # Update subscription status
            try:
                supabase.table('subscriptions').update({
                    'status': 'active',
                    'activated_at': datetime.now(timezone.utc).isoformat()
                }).eq('user_id', user_id).execute()
                
                # Update user's subscription status in user_subscriptions table
                supabase.table('user_subscriptions').upsert({
                    'user_id': user_id,
                    'subscription_status': 'pro',
                    'subscription_activated_at': datetime.now(timezone.utc).isoformat(),
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }).execute()
                
                print(f"Subscription activated for user {user_id}")
            except Exception as e:
                print(f"Error updating subscription status: {e}")

    def _handle_subscription_canceled(self, data):
        """Handle subscription.canceled webhook"""
        subscription = data.get('subscription', {})
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            
            try:
                # Update subscription status
                supabase.table('subscriptions').update({
                    'status': 'canceled',
                    'canceled_at': datetime.now(timezone.utc).isoformat()
                }).eq('user_id', user_id).execute()
                
                # Update user's subscription status in user_subscriptions table
                supabase.table('user_subscriptions').upsert({
                    'user_id': user_id,
                    'subscription_status': 'canceled',
                    'subscription_canceled_at': datetime.now(timezone.utc).isoformat(),
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }).execute()
                
                print(f"Subscription canceled for user {user_id}")
            except Exception as e:
                print(f"Error updating subscription status: {e}")

    def _handle_subscription_paused(self, data):
        """Handle subscription.paused webhook"""
        subscription = data.get('subscription', {})
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            
            try:
                supabase.table('subscriptions').update({
                    'status': 'paused',
                    'paused_at': datetime.now(timezone.utc).isoformat()
                }).eq('user_id', user_id).execute()
                
                supabase.table('user_subscriptions').upsert({
                    'user_id': user_id,
                    'subscription_status': 'paused',
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }).execute()
                
                print(f"Subscription paused for user {user_id}")
            except Exception as e:
                print(f"Error updating subscription status: {e}")

    def _handle_subscription_resumed(self, data):
        """Handle subscription.resumed webhook"""
        subscription = data.get('subscription', {})
        custom_data = subscription.get('custom_data', {})
        user_id = custom_data.get('user_id')
        
        if user_id:
            supabase = get_supabase_client()
            
            try:
                supabase.table('subscriptions').update({
                    'status': 'active',
                    'resumed_at': datetime.now(timezone.utc).isoformat()
                }).eq('user_id', user_id).execute()
                
                supabase.table('user_subscriptions').upsert({
                    'user_id': user_id,
                    'subscription_status': 'pro',
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }).execute()
                
                print(f"Subscription resumed for user {user_id}")
            except Exception as e:
                print(f"Error updating subscription status: {e}")

    def _handle_transaction_completed(self, data):
        """Handle transaction.completed webhook"""
        transaction = data.get('transaction', {})
        transaction_id = transaction.get('id')
        
        if transaction_id:
            supabase = get_supabase_client()
            
            try:
                supabase.table('paddle_transactions').update({
                    'status': 'completed',
                    'completed_at': datetime.now(timezone.utc).isoformat()
                }).eq('id', transaction_id).execute()
                
                print(f"Transaction {transaction_id} completed")
            except Exception as e:
                print(f"Error updating transaction status: {e}")

    def _handle_payment_failed(self, data):
        """Handle transaction.payment_failed webhook"""
        transaction = data.get('transaction', {})
        transaction_id = transaction.get('id')
        
        if transaction_id:
            supabase = get_supabase_client()
            
            try:
                supabase.table('paddle_transactions').update({
                    'status': 'failed',
                    'failed_at': datetime.now(timezone.utc).isoformat()
                }).eq('id', transaction_id).execute()
                
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
            
            # Get subscription status from user_subscriptions table
            result = supabase.table('user_subscriptions').select('subscription_status, subscription_activated_at, subscription_canceled_at').eq('user_id', user_id).execute()
            
            if result.data:
                user_data = result.data[0]
                return jsonify({
                    'subscription_status': user_data.get('subscription_status', 'free'),
                    'activated_at': user_data.get('subscription_activated_at'),
                    'canceled_at': user_data.get('subscription_canceled_at')
                })
            else:
                # If no record exists, create one with default 'free' status
                try:
                    supabase.table('user_subscriptions').insert({
                        'user_id': user_id,
                        'subscription_status': 'free'
                    }).execute()
                except Exception as e:
                    print(f"Warning: Could not create user_subscriptions record: {e}")
                
                return jsonify({'subscription_status': 'free'})
                
        except Exception as e:
            print(f"Error getting subscription status: {e}")
            return jsonify({'error': 'Internal server error'}), 500


