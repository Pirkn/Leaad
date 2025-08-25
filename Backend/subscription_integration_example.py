# Example of how to integrate subscription checks into existing routes
# This shows how to modify the lead generation route to require subscription

from flask import Blueprint, jsonify, request, current_app, g
from flask_smorest import abort
from flask.views import MethodView
from supabase import create_client, Client
import os
import datetime
import logging
from src.utils.auth import verify_supabase_token
from src.utils.subscription_utils import require_subscription, increment_usage

logger = logging.getLogger(__name__)

blp = Blueprint("subscription_example", __name__, description="Example of subscription integration")

@blp.route('/lead-generation-with-subscription')
class LeadGenerationWithSubscription(MethodView):
    @verify_supabase_token
    @require_subscription('unlimited_leads')  # This will check if user has access to unlimited_leads feature
    def post(self):
        """
        Example of lead generation with subscription requirement.
        This route requires the user to have an active subscription with 'unlimited_leads' feature.
        """
        try:
            user_id = g.current_user['id']
            data = request.get_json()
            product_id = data.get('product_id')

            # Your existing lead generation logic here...
            # ... (same as original lead generation code)

            # After successful lead generation, increment usage
            increment_usage(user_id, 'leads_generated')
            
            return jsonify({
                'success': True,
                'message': 'Leads generated successfully',
                'leads_count': len(comments)  # or whatever your response contains
            })

        except Exception as e:
            logger.error(f"Error in lead generation: {e}")
            return jsonify({'error': 'Failed to generate leads'}), 500

@blp.route('/karma-content-with-subscription')
class KarmaContentWithSubscription(MethodView):
    @verify_supabase_token
    @require_subscription('karma_content')  # This will check if user has access to karma_content feature
    def post(self):
        """
        Example of karma content generation with subscription requirement.
        This route requires the user to have an active subscription with 'karma_content' feature.
        """
        try:
            user_id = g.current_user['id']
            data = request.get_json()
            
            # Your existing karma content generation logic here...
            # ... (same as original karma generation code)

            # After successful karma content generation, increment usage
            increment_usage(user_id, 'karma_content_generated')
            
            return jsonify({
                'success': True,
                'message': 'Karma content generated successfully'
            })

        except Exception as e:
            logger.error(f"Error in karma content generation: {e}")
            return jsonify({'error': 'Failed to generate karma content'}), 500

@blp.route('/posts-with-subscription')
class PostsWithSubscription(MethodView):
    @verify_supabase_token
    @require_subscription('unlimited_posts')  # This will check if user has access to unlimited_posts feature
    def post(self):
        """
        Example of post creation with subscription requirement.
        This route requires the user to have an active subscription with 'unlimited_posts' feature.
        """
        try:
            user_id = g.current_user['id']
            data = request.get_json()
            
            # Your existing post creation logic here...
            # ... (same as original post creation code)

            # After successful post creation, increment usage
            increment_usage(user_id, 'posts_created')
            
            return jsonify({
                'success': True,
                'message': 'Post created successfully'
            })

        except Exception as e:
            logger.error(f"Error in post creation: {e}")
            return jsonify({'error': 'Failed to create post'}), 500

# Alternative approach: Manual subscription check (if you need more control)
@blp.route('/manual-subscription-check')
class ManualSubscriptionCheck(MethodView):
    @verify_supabase_token
    def post(self):
        """
        Example of manual subscription check for more complex scenarios.
        This gives you more control over the subscription check logic.
        """
        try:
            user_id = g.current_user['id']
            from src.utils.subscription_utils import check_subscription_access
            
            # Check subscription access manually
            access_check = check_subscription_access(user_id, 'unlimited_leads')
            
            if not access_check['has_access']:
                return jsonify({
                    'error': 'Subscription required',
                    'message': access_check['reason'],
                    'upgrade_url': '/pricing'  # Redirect to pricing page
                }), 403
            
            # If access is granted, proceed with the feature
            # Your feature logic here...
            
            # Increment usage
            from src.utils.subscription_utils import increment_usage
            increment_usage(user_id, 'leads_generated')
            
            return jsonify({
                'success': True,
                'message': 'Feature executed successfully'
            })

        except Exception as e:
            logger.error(f"Error in manual subscription check: {e}")
            return jsonify({'error': 'Failed to execute feature'}), 500
