from flask import Blueprint, jsonify, request, current_app, g
from flask_smorest import abort
from flask.views import MethodView
from supabase import create_client, Client
import os
import datetime
import logging
from src.utils.auth import verify_supabase_token
from paddle_billing import Client as PaddleClient
from paddle_billing.Environment import Environment
from paddle_billing.Entities.Shared import Status
from paddle_billing.Exceptions import PaddleException

logger = logging.getLogger(__name__)

blp = Blueprint("subscriptions", __name__, description="Subscription management")

def get_paddle_client():
    """Initialize and return Paddle client"""
    try:
        vendor_id = os.getenv('PADDLE_VENDOR_ID')
        vendor_auth_code = os.getenv('PADDLE_VENDOR_AUTH_CODE')
        environment = os.getenv('PADDLE_ENVIRONMENT', 'sandbox')
        
        if not vendor_id or not vendor_auth_code:
            logger.error("Paddle credentials not found in environment variables")
            return None
        
        env = Environment.SANDBOX if environment == 'sandbox' else Environment.PRODUCTION
        return PaddleClient(vendor_id, vendor_auth_code, env)
    except Exception as e:
        logger.error(f"Error initializing Paddle client: {e}")
        return None

@blp.route('/subscription/plans')
class SubscriptionPlans(MethodView):
    def get(self):
        """Get available subscription plans"""
        try:
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            result = supabase.table('subscription_plans').select('*').eq('is_active', True).execute()
            
            return jsonify(result.data)
        except Exception as e:
            logger.error(f"Error fetching subscription plans: {e}")
            return jsonify({'error': 'Failed to fetch subscription plans'}), 500

@blp.route('/subscription/create-checkout')
class CreateCheckout(MethodView):
    @verify_supabase_token
    def post(self):
        """Create a Paddle checkout session for subscription"""
        try:
            user_id = g.current_user['id']
            data = request.get_json()
            
            paddle_client = get_paddle_client()
            if not paddle_client:
                return jsonify({'error': 'Paddle client not available'}), 500
            
            # Get the subscription plan
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            plan_result = supabase.table('subscription_plans').select('*').eq('is_active', True).limit(1).execute()
            if not plan_result.data:
                return jsonify({'error': 'No active subscription plan found'}), 404
            
            plan = plan_result.data[0]
            
            # Create checkout session using Paddle SDK
            from paddle_billing.Entities.Transactions import TransactionCreate
            from paddle_billing.Entities.Transactions import TransactionItem
            from paddle_billing.Entities.Shared import Money
            from paddle_billing.Entities.Shared import CurrencyCode
            from paddle_billing.Entities.Shared import BillingDetails
            from paddle_billing.Entities.Shared import Customer
            from paddle_billing.Entities.Shared import Address
            from paddle_billing.Entities.Shared import CustomData
            
            # Get user details from Supabase
            user_result = supabase.auth.admin.get_user_by_id(user_id)
            user_data = user_result.user
            
            # Create customer
            customer = Customer(
                email=user_data.email,
                custom_data=CustomData({
                    "user_id": user_id
                })
            )
            
            # Create transaction item
            item = TransactionItem(
                price_id=plan['paddle_product_id'],
                quantity=1
            )
            
            # Create transaction
            transaction = TransactionCreate(
                items=[item],
                customer=customer,
                custom_data=CustomData({
                    "user_id": user_id,
                    "plan_id": plan['id']
                })
            )
            
            # Create the transaction
            response = paddle_client.transactions.create(transaction)
            
            return jsonify({
                'checkout_url': response.checkout.url,
                'transaction_id': response.id
            })
            
        except PaddleException as e:
            logger.error(f"Paddle error creating checkout: {e}")
            return jsonify({'error': 'Failed to create checkout session'}), 500
        except Exception as e:
            logger.error(f"Error creating checkout: {e}")
            return jsonify({'error': 'Failed to create checkout session'}), 500

@blp.route('/subscription/current')
class CurrentSubscription(MethodView):
    @verify_supabase_token
    def get(self):
        """Get current user's subscription status"""
        try:
            user_id = g.current_user['id']
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Get user's subscription with plan details
            result = supabase.table('user_subscriptions').select(
                '*, subscription_plans(*)'
            ).eq('user_id', user_id).execute()
            
            if result.data:
                subscription = result.data[0]
                return jsonify({
                    'has_subscription': True,
                    'subscription': subscription
                })
            else:
                return jsonify({
                    'has_subscription': False,
                    'subscription': None
                })
                
        except Exception as e:
            logger.error(f"Error fetching current subscription: {e}")
            return jsonify({'error': 'Failed to fetch subscription status'}), 500

@blp.route('/subscription/cancel')
class CancelSubscription(MethodView):
    @verify_supabase_token
    def post(self):
        """Cancel user's subscription"""
        try:
            user_id = g.current_user['id']
            
            # Get user's subscription
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            result = supabase.table('user_subscriptions').select('*').eq('user_id', user_id).execute()
            if not result.data:
                return jsonify({'error': 'No subscription found'}), 404
            
            subscription = result.data[0]
            paddle_subscription_id = subscription['paddle_subscription_id']
            
            # Cancel subscription using Paddle SDK
            paddle_client = get_paddle_client()
            if not paddle_client:
                return jsonify({'error': 'Paddle client not available'}), 500
            
            from paddle_billing.Entities.Subscriptions import SubscriptionCancel
            
            cancel_request = SubscriptionCancel(
                effective_from="next_billing_period"
            )
            
            response = paddle_client.subscriptions.cancel(paddle_subscription_id, cancel_request)
            
            # Update local database
            supabase.table('user_subscriptions').update({
                'status': 'cancelled',
                'cancel_at_period_end': True,
                'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            }).eq('user_id', user_id).execute()
            
            return jsonify({
                'success': True,
                'message': 'Subscription cancelled successfully',
                'effective_from': response.effective_from
            })
            
        except PaddleException as e:
            logger.error(f"Paddle error cancelling subscription: {e}")
            return jsonify({'error': 'Failed to cancel subscription'}), 500
        except Exception as e:
            logger.error(f"Error cancelling subscription: {e}")
            return jsonify({'error': 'Failed to cancel subscription'}), 500

@blp.route('/subscription/check-access')
class CheckSubscriptionAccess(MethodView):
    @verify_supabase_token
    def post(self):
        """Check if user has access to a specific feature"""
        try:
            user_id = g.current_user['id']
            data = request.get_json()
            feature = data.get('feature')
            
            if not feature:
                return jsonify({'error': 'Feature parameter required'}), 400
            
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Get user's subscription
            result = supabase.table('user_subscriptions').select(
                '*, subscription_plans(*)'
            ).eq('user_id', user_id).execute()
            
            if not result.data:
                return jsonify({
                    'has_access': False,
                    'reason': 'No active subscription'
                })
            
            subscription = result.data[0]
            plan = subscription['subscription_plans']
            
            # Check if subscription is active or in trial
            if subscription['status'] not in ['active', 'trialing']:
                return jsonify({
                    'has_access': False,
                    'reason': f'Subscription status: {subscription["status"]}'
                })
            
            # Check if feature is included in plan
            features = plan.get('features', [])
            if feature not in features:
                return jsonify({
                    'has_access': False,
                    'reason': f'Feature {feature} not included in plan'
                })
            
            # Check trial period if in trial
            if subscription['status'] == 'trialing':
                trial_end = datetime.datetime.fromisoformat(subscription['trial_end'].replace('Z', '+00:00'))
                if datetime.datetime.now(datetime.timezone.utc) > trial_end:
                    return jsonify({
                        'has_access': False,
                        'reason': 'Trial period expired'
                    })
            
            return jsonify({
                'has_access': True,
                'subscription': subscription
            })
                
        except Exception as e:
            logger.error(f"Error checking subscription access: {e}")
            return jsonify({'error': 'Failed to check access'}), 500

@blp.route('/subscription/usage')
class SubscriptionUsage(MethodView):
    @verify_supabase_token
    def get(self):
        """Get current usage statistics"""
        try:
            user_id = g.current_user['id']
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Get current month's usage
            current_date = datetime.datetime.now().date()
            first_day_of_month = current_date.replace(day=1)
            
            result = supabase.table('subscription_usage').select('*').eq('user_id', user_id).eq('reset_date', first_day_of_month.isoformat()).execute()
            
            usage_data = {}
            for usage in result.data:
                usage_data[usage['feature_name']] = usage['usage_count']
            
            return jsonify(usage_data)
                
        except Exception as e:
            logger.error(f"Error fetching usage: {e}")
            return jsonify({'error': 'Failed to fetch usage'}), 500

@blp.route('/subscription/increment-usage')
class IncrementUsage(MethodView):
    @verify_supabase_token
    def post(self):
        """Increment usage for a specific feature"""
        try:
            user_id = g.current_user['id']
            data = request.get_json()
            feature = data.get('feature')
            
            if not feature:
                return jsonify({'error': 'Feature parameter required'}), 400
            
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Get current month's usage
            current_date = datetime.datetime.now().date()
            first_day_of_month = current_date.replace(day=1)
            
            # Check if usage record exists
            result = supabase.table('subscription_usage').select('*').eq('user_id', user_id).eq('feature_name', feature).eq('reset_date', first_day_of_month.isoformat()).execute()
            
            if result.data:
                # Update existing record
                current_count = result.data[0]['usage_count']
                supabase.table('subscription_usage').update({
                    'usage_count': current_count + 1,
                    'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
                }).eq('id', result.data[0]['id']).execute()
            else:
                # Create new record
                usage_record = {
                    'user_id': user_id,
                    'feature_name': feature,
                    'usage_count': 1,
                    'reset_date': first_day_of_month.isoformat()
                }
                supabase.table('subscription_usage').insert(usage_record).execute()
            
            return jsonify({'success': True, 'message': f'Usage incremented for {feature}'})
                
        except Exception as e:
            logger.error(f"Error incrementing usage: {e}")
            return jsonify({'error': 'Failed to increment usage'}), 500

@blp.route('/subscription/webhook')
class PaddleWebhook(MethodView):
    def post(self):
        """Handle Paddle webhook events using SDK"""
        try:
            # Get webhook data
            webhook_data = request.get_json()
            
            # Verify webhook signature (recommended for production)
            webhook_secret = os.getenv('PADDLE_WEBHOOK_SECRET')
            if webhook_secret:
                # TODO: Implement webhook signature verification
                pass
            
            logger.info(f"Received Paddle webhook: {webhook_data.get('event_type')}")
            
            # Use Paddle SDK to parse webhook
            paddle_client = get_paddle_client()
            if not paddle_client:
                logger.error("Paddle client not available for webhook processing")
                return jsonify({'error': 'Paddle client not available'}), 500
            
            # Parse webhook using SDK
            webhook = paddle_client.webhooks.parse(webhook_data)
            
            # Handle different event types
            if webhook.event_type == 'subscription.created':
                self._handle_subscription_created_sdk(webhook)
            elif webhook.event_type == 'subscription.updated':
                self._handle_subscription_updated_sdk(webhook)
            elif webhook.event_type == 'subscription.cancelled':
                self._handle_subscription_cancelled_sdk(webhook)
            elif webhook.event_type == 'subscription.paused':
                self._handle_subscription_paused_sdk(webhook)
            elif webhook.event_type == 'subscription.resumed':
                self._handle_subscription_resumed_sdk(webhook)
            elif webhook.event_type == 'transaction.completed':
                self._handle_transaction_completed_sdk(webhook)
            
            return jsonify({'success': True})
                
        except PaddleException as e:
            logger.error(f"Paddle webhook error: {e}")
            return jsonify({'error': 'Webhook processing failed'}), 500
        except Exception as e:
            logger.error(f"Error processing webhook: {e}")
            return jsonify({'error': 'Webhook processing failed'}), 500
    
    def _handle_subscription_created_sdk(self, webhook):
        """Handle subscription.created webhook using SDK"""
        try:
            subscription = webhook.data
            user_id = subscription.custom_data.get('user_id') if subscription.custom_data else None
            paddle_subscription_id = subscription.id
            
            if not user_id or not paddle_subscription_id:
                logger.error("Missing user_id or subscription_id in webhook data")
                return
            
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Get the plan
            plan_result = supabase.table('subscription_plans').select('id').eq('is_active', True).limit(1).execute()
            if not plan_result.data:
                logger.error("No active subscription plan found")
                return
            
            plan_id = plan_result.data[0]['id']
            
            # Calculate trial dates
            trial_start = datetime.datetime.now(datetime.timezone.utc)
            trial_end = trial_start + datetime.timedelta(days=3)
            
            subscription_record = {
                'user_id': user_id,
                'plan_id': plan_id,
                'paddle_subscription_id': paddle_subscription_id,
                'status': 'trialing',
                'trial_start': trial_start.isoformat(),
                'trial_end': trial_end.isoformat(),
                'current_period_start': trial_start.isoformat(),
                'current_period_end': trial_end.isoformat()
            }
            
            supabase.table('user_subscriptions').insert(subscription_record).execute()
            logger.info(f"Created subscription for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling subscription.created webhook: {e}")
    
    def _handle_transaction_completed_sdk(self, webhook):
        """Handle transaction.completed webhook using SDK"""
        try:
            transaction = webhook.data
            user_id = transaction.custom_data.get('user_id') if transaction.custom_data else None
            
            if not user_id:
                logger.error("Missing user_id in transaction webhook data")
                return
            
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Update subscription status to active if transaction is successful
            if transaction.status == Status.COMPLETED:
                supabase.table('user_subscriptions').update({
                    'status': 'active',
                    'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
                }).eq('user_id', user_id).execute()
                
                logger.info(f"Updated subscription to active for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling transaction.completed webhook: {e}")
    
    def _handle_subscription_updated_sdk(self, webhook):
        """Handle subscription.updated webhook using SDK"""
        try:
            subscription = webhook.data
            paddle_subscription_id = subscription.id
            
            if not paddle_subscription_id:
                return
            
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Update subscription status and dates
            update_data = {
                'status': subscription.status.value if subscription.status else 'active',
                'current_period_start': subscription.current_period_start.isoformat() if subscription.current_period_start else None,
                'current_period_end': subscription.current_period_end.isoformat() if subscription.current_period_end else None,
                'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            
            supabase.table('user_subscriptions').update(update_data).eq('paddle_subscription_id', paddle_subscription_id).execute()
            logger.info(f"Updated subscription {paddle_subscription_id}")
            
        except Exception as e:
            logger.error(f"Error handling subscription.updated webhook: {e}")
    
    def _handle_subscription_cancelled_sdk(self, webhook):
        """Handle subscription.cancelled webhook using SDK"""
        try:
            subscription = webhook.data
            paddle_subscription_id = subscription.id
            
            if not paddle_subscription_id:
                return
            
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            update_data = {
                'status': 'cancelled',
                'cancel_at_period_end': True,
                'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            
            supabase.table('user_subscriptions').update(update_data).eq('paddle_subscription_id', paddle_subscription_id).execute()
            logger.info(f"Cancelled subscription {paddle_subscription_id}")
            
        except Exception as e:
            logger.error(f"Error handling subscription.cancelled webhook: {e}")
    
    def _handle_subscription_paused_sdk(self, webhook):
        """Handle subscription.paused webhook using SDK"""
        try:
            subscription = webhook.data
            paddle_subscription_id = subscription.id
            
            if not paddle_subscription_id:
                return
            
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            update_data = {
                'status': 'paused',
                'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            
            supabase.table('user_subscriptions').update(update_data).eq('paddle_subscription_id', paddle_subscription_id).execute()
            logger.info(f"Paused subscription {paddle_subscription_id}")
            
        except Exception as e:
            logger.error(f"Error handling subscription.paused webhook: {e}")
    
    def _handle_subscription_resumed_sdk(self, webhook):
        """Handle subscription.resumed webhook using SDK"""
        try:
            subscription = webhook.data
            paddle_subscription_id = subscription.id
            
            if not paddle_subscription_id:
                return
            
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            update_data = {
                'status': 'active',
                'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            
            supabase.table('user_subscriptions').update(update_data).eq('paddle_subscription_id', paddle_subscription_id).execute()
            logger.info(f"Resumed subscription {paddle_subscription_id}")
            
        except Exception as e:
            logger.error(f"Error handling subscription.resumed webhook: {e}")
