from supabase import create_client, Client
import os
import datetime
import logging
from functools import wraps
from flask import jsonify, g, current_app

logger = logging.getLogger(__name__)

def get_supabase_client():
    """Get Supabase client with service role key"""
    supabase_url = current_app.config['SUPABASE_URL']
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
    return create_client(supabase_url, supabase_key)

def check_subscription_access(user_id, feature):
    """
    Check if user has access to a specific feature
    
    Args:
        user_id (str): User ID
        feature (str): Feature name to check access for
    
    Returns:
        dict: Access check result with has_access boolean and reason
    """
    try:
        supabase = get_supabase_client()
        
        # Get user's subscription
        result = supabase.table('user_subscriptions').select(
            '*, subscription_plans(*)'
        ).eq('user_id', user_id).execute()
        
        if not result.data:
            return {
                'has_access': False,
                'reason': 'No active subscription'
            }
        
        subscription = result.data[0]
        plan = subscription['subscription_plans']
        
        # Check if subscription is active or in trial
        if subscription['status'] not in ['active', 'trialing']:
            return {
                'has_access': False,
                'reason': f'Subscription status: {subscription["status"]}'
            }
        
        # Check if feature is included in plan
        features = plan.get('features', [])
        if feature not in features:
            return {
                'has_access': False,
                'reason': f'Feature {feature} not included in plan'
            }
        
        # Check trial period if in trial
        if subscription['status'] == 'trialing':
            trial_end = datetime.datetime.fromisoformat(subscription['trial_end'].replace('Z', '+00:00'))
            if datetime.datetime.now(datetime.timezone.utc) > trial_end:
                return {
                    'has_access': False,
                    'reason': 'Trial period expired'
                }
        
        return {
            'has_access': True,
            'subscription': subscription
        }
        
    except Exception as e:
        logger.error(f"Error checking subscription access: {e}")
        return {
            'has_access': False,
            'reason': 'Error checking subscription access'
        }

def require_subscription(feature):
    """
    Decorator to require subscription access for a specific feature
    
    Args:
        feature (str): Feature name to check access for
    
    Returns:
        function: Decorated function
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = g.current_user['id']
            access_check = check_subscription_access(user_id, feature)
            
            if not access_check['has_access']:
                return jsonify({
                    'error': 'Subscription required',
                    'message': access_check['reason'],
                    'feature': feature
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def increment_usage(user_id, feature):
    """
    Increment usage for a specific feature
    
    Args:
        user_id (str): User ID
        feature (str): Feature name
    
    Returns:
        bool: Success status
    """
    try:
        supabase = get_supabase_client()
        
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
        
        return True
        
    except Exception as e:
        logger.error(f"Error incrementing usage: {e}")
        return False

def get_user_subscription(user_id):
    """
    Get user's current subscription
    
    Args:
        user_id (str): User ID
    
    Returns:
        dict: Subscription data or None
    """
    try:
        supabase = get_supabase_client()
        
        result = supabase.table('user_subscriptions').select(
            '*, subscription_plans(*)'
        ).eq('user_id', user_id).execute()
        
        if result.data:
            return result.data[0]
        return None
        
    except Exception as e:
        logger.error(f"Error getting user subscription: {e}")
        return None

def is_subscription_active(subscription):
    """
    Check if subscription is active (including trial)
    
    Args:
        subscription (dict): Subscription data
    
    Returns:
        bool: True if active
    """
    if not subscription:
        return False
    
    status = subscription.get('status')
    if status not in ['active', 'trialing']:
        return False
    
    # Check trial period if in trial
    if status == 'trialing':
        trial_end = datetime.datetime.fromisoformat(subscription['trial_end'].replace('Z', '+00:00'))
        if datetime.datetime.now(datetime.timezone.utc) > trial_end:
            return False
    
    return True
