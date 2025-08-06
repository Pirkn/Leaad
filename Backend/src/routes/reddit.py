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
import uuid

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

            # Parse the AI response to extract post data
            try:
                response_data = json.loads(response)
                posts_to_insert = []
                
                for post_data in response_data.get('response', []):
                    post_entry = {
                        'id': str(uuid.uuid4()),
                        'user_id': user_id,
                        'product_id': product_id,
                        'subreddit': post_data.get('r/subreddit', '').replace('r/', ''),
                        'title': post_data.get('Title', ''),
                        'description': post_data.get('Post', ''),
                        'read': False
                    }
                    posts_to_insert.append(post_entry)
                
                # Save the generated posts to the posts table
                if posts_to_insert:
                    supabase.table('posts').insert(posts_to_insert).execute()
                    print(f"Successfully saved {len(posts_to_insert)} posts to database")
                
                
            except json.JSONDecodeError as e:
                print(f"Failed to parse AI response: {e}")
                print(f"Raw response: {response}")
            except Exception as e:
                print(f"Error saving posts to database: {e}")
                # Continue with the response even if database save fails

            return jsonify({'response': response})
            
        except Exception as e:
            print(f"Error generating reddit post: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
        
@blp.route('/get-reddit-posts')
class GetRedditPosts(MethodView):
    @verify_supabase_token
    def get(self):
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        user_id = g.current_user['id']
        result = supabase.table('posts').select('*').eq('user_id', user_id).execute()
        posts = result.data

        return jsonify(posts)

@blp.route('/mark-reddit-post-as-read')
class MarkRedditPostAsRead(MethodView):
    @verify_supabase_token
    def post(self):
        data = request.get_json()
        post_id = data.get('post_id')

        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        result = supabase.table('posts').update({'read': True}).eq('id', post_id).execute()
        return jsonify(result.data)

        
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
            messages, subreddit, webp_base64 = create_karma_post()

            model = Model()
            response = model.gemini_chat_completion(messages)
            post = json.loads(response)

            # Convert base64 to data URL for display
            image_data_url = f"data:image/webp;base64,{webp_base64}"

            return jsonify({
                'title': post['title'],
                'subreddit': subreddit,
                'description': post.get('description', None),
                'image_url': image_data_url
            })
            
        except Exception as e:
            print(f"Error in create_karma_post: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
    