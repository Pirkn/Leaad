from flask.views import MethodView
from flask_smorest import Blueprint
from flask import jsonify, request, g, current_app
from dotenv import load_dotenv
from src.utils.auth import verify_supabase_token
from supabase import create_client, Client
import os
import datetime

load_dotenv()

blp = Blueprint('Onboarding', __name__, description='Onboarding Operations')

@blp.route('/onboarding-status')
class OnboardingStatus(MethodView):
    @verify_supabase_token
    def get(self):
        """
        Get the current onboarding status for the authenticated user
        Returns the onboarding record with status and created_at timestamp
        """
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        user_id = g.current_user['id']
        
        try:
            # Get onboarding status for the current user
            result = supabase.table('onboarding').select('*').eq('user_id', user_id).execute()
            
            if result.data:
                # User has an onboarding record
                onboarding_data = result.data[0]
                return jsonify({
                    'success': True,
                    'onboarding': onboarding_data,
                    'completed': onboarding_data['status']
                })
            else:
                # User doesn't have an onboarding record yet, create one with status = false
                new_onboarding = {
                    'user_id': user_id,
                    'status': False,
                    'created_at': datetime.datetime.now().isoformat()
                }
                
                insert_result = supabase.table('onboarding').insert(new_onboarding).execute()
                
                return jsonify({
                    'success': True,
                    'onboarding': insert_result.data[0],
                    'completed': False
                })
                
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
                         }), 500

@blp.route('/onboarding-reset')
class OnboardingReset(MethodView):
    @verify_supabase_token
    def post(self):
        """
        Reset onboarding status to incomplete for the authenticated user
        Updates the status field to False
        """
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        user_id = g.current_user['id']
        
        try:
            # Check if onboarding record exists
            check_result = supabase.table('onboarding').select('*').eq('user_id', user_id).execute()
            
            if check_result.data:
                # Update existing record
                result = supabase.table('onboarding').update({
                    'status': False
                }).eq('user_id', user_id).execute()
                
                return jsonify({
                    'success': True,
                    'message': 'Onboarding reset to incomplete',
                    'onboarding': result.data[0]
                })
            else:
                # Create new record with incomplete status
                new_onboarding = {
                    'user_id': user_id,
                    'status': False,
                    'created_at': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
                }
                
                insert_result = supabase.table('onboarding').insert(new_onboarding).execute()
                
                return jsonify({
                    'success': True,
                    'message': 'Onboarding created with incomplete status',
                    'onboarding': insert_result.data[0]
                })
                
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500

@blp.route('/onboarding-completed')
class OnboardingCompleted(MethodView):
    @verify_supabase_token
    def post(self):
        """
        Mark onboarding as completed for the authenticated user
        Updates the status field to True
        """
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        user_id = g.current_user['id']
        
        try:
            # Check if onboarding record exists
            check_result = supabase.table('onboarding').select('*').eq('user_id', user_id).execute()
            
            if check_result.data:
                # Update existing record
                result = supabase.table('onboarding').update({
                    'status': True
                }).eq('user_id', user_id).execute()
                
                return jsonify({
                    'success': True,
                    'message': 'Onboarding marked as completed',
                    'onboarding': result.data[0]
                })
            else:
                # Create new record with completed status
                new_onboarding = {
                    'user_id': user_id,
                    'status': True,
                    'created_at': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
                }
                
                insert_result = supabase.table('onboarding').insert(new_onboarding).execute()
                
                return jsonify({
                    'success': True,
                    'message': 'Onboarding created and marked as completed',
                    'onboarding': insert_result.data[0]
                })
                
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500 