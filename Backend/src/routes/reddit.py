from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import jsonify, request, g, current_app
from dotenv import load_dotenv
import json
import os
from src.utils.auth import verify_supabase_token
from src.utils.prompt_generator import reddit_post_generator_prompt, karma_helper_prompt
from src.utils.models import Model
from supabase import create_client, Client
from src.utils.reddit_helpers import get_posts

load_dotenv()

blp = Blueprint('Reddit', __name__, description='Reddit Operations')

@blp.route('/generate-reddit-post')
class GenerateRedditPost(MethodView):
    @verify_supabase_token
    def post(self):
        try:
            data = request.get_json()
            product_id = data.get('product_id')
            
            if not product_id:
                return jsonify({'error': 'Missing required field: product_id'}), 400
            
            # Get user ID from authenticated token
            user_id = g.current_user['id']
            
            # Fetch product details from Supabase
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Get product details, ensuring it belongs to the authenticated user
            result = supabase.table('products').select('*').eq('id', product_id).eq('user_id', user_id).execute()
            
            if not result.data:
                return jsonify({'error': 'Product not found or access denied'}), 404
            
            product = result.data[0]
            
            user_prompt = f"""
            Product/app name: {product.get('name')}
            One-line description: {product.get('description')}
            Target audience: {product.get('target_audience')}
            Main benefit/problem it solves: {product.get('problem_solved')}
            Website/app store link: {product.get('url')}
            """

            messages = reddit_post_generator_prompt(user_prompt)

            model = Model()
            response = model.gemini_chat_completion(messages)

            return jsonify({'response': response})
            
        except Exception as e:
            print(f"Error generating reddit post: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
        
@blp.route('/get_karma')
class GetKarma(MethodView):
    @verify_supabase_token
    def get(self):
        subreddit_name = request.args.get('subreddit_name')
        posts = get_posts(subreddit_name)

        messages = karma_helper_prompt(posts)

        model = Model()
        response = model.gemini_chat_completion(messages)

        return jsonify({'response': response})


