from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import jsonify, request, g, current_app
from dotenv import load_dotenv
import json
import os
from src.utils.auth import verify_supabase_token
from src.utils.prompt_generator import reddit_post_generator_prompt, comment_karma_prompt
from src.utils.models import Model
from supabase import create_client, Client
from src.utils.reddit_helpers import get_rising_posts, create_karma_post
from src.utils.image_handling import upload_image_to_storage, get_signed_url

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
        
@blp.route('/create_karma_comment')
class CreateKarmaComment(MethodView):
    @verify_supabase_token
    def post(self):
        posts = get_rising_posts()

        messages = comment_karma_prompt(posts)

        model = Model()
        response = model.gemini_chat_completion(messages)

        return jsonify({'response': response})


@blp.route('/create_karma_post')
class CreateKarmaPost(MethodView):
    @verify_supabase_token
    def post(self):
        try:
            # Get user ID from authenticated token
            user_id = g.current_user['id']
            
            messages, subreddit, webp_data = create_karma_post()

            model = Model()
            response = model.gemini_chat_completion(messages)
            post = json.loads(response)
            
            try:
                storage_path = upload_image_to_storage(webp_data, user_id)
                signed_url = get_signed_url(storage_path)
            except Exception as e:
                storage_path = None
                signed_url = None

            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)

            # Save the post to the karma_posts table
            karma_post_data = {
                'user_id': user_id,
                'subreddit': subreddit,
                'title': post['title'],
                'description': post.get('description', None),
                'storage_path': storage_path
            }
            
            result = supabase.table('karma_posts').insert(karma_post_data).execute()
            
            if not result.data:
                raise Exception("Failed to save karma post to database")

            return jsonify({
                'id': result.data[0]['id'],
                'title': post['title'],
                'subreddit': subreddit,
                'description': post.get('description', None),
                'image_url': signed_url,
            })
            
        except Exception as e:
            print(f"Error in get_post_karma: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
        
@blp.route('/get_karma_posts')
class GetKarmaPosts(MethodView):
    @verify_supabase_token
    def get(self):
        user_id = g.current_user['id']
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        result = supabase.table('karma_posts').select('id, subreddit, title, description, storage_path').eq('user_id', user_id).execute()
        posts = []
        for post in result.data:
            new_post = {}
            new_post['id'] = post['id']
            new_post['image_url'] = get_signed_url(post['storage_path'], 3600)
            new_post['subreddit'] = post['subreddit']
            new_post['title'] = post['title']
            new_post['description'] = post['description']
            posts.append(new_post)

        return jsonify({'karma_posts': posts})