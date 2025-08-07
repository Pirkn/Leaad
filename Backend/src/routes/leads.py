from flask.views import MethodView
from flask_smorest import Blueprint
from flask import jsonify, request, g, current_app
from dotenv import load_dotenv
from src.utils.auth import verify_supabase_token
from src.utils.prompt_generator import generate_product_details_prompt, lead_subreddits_for_product_prompt, lead_generation_prompt, lead_generation_prompt_2
from src.utils.models import Model
from supabase import create_client, Client
from src.utils.website_scraper import get_website_content
from src.utils.reddit_helpers import lead_posts
import os
import json
import uuid
load_dotenv()

blp = Blueprint('Leads', __name__, description='Lead Operations')

@blp.route('/lead-generation')
class LeadGeneration(MethodView):
    @verify_supabase_token
    def post(self):
        data = request.get_json()
        product_id = data.get('product_id')

        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)
        
        result = supabase.table('lead_subreddits').select('*').eq('product_id', product_id).execute()
        subreddits = [lead['subreddit'] for lead in result.data]

        # Get product data
        product_result = supabase.table('products').select('*').eq('id', product_id).execute()
        product_data = product_result.data[0]

        unformatted_posts, posts = lead_posts(subreddits)
        
        # Creates a file with the posts
        with open('posts.json', 'w') as f:
            json.dump(posts, f)

        # Process posts in batches of 10
        batch_size = 10
        selected_posts = []
        
        # Create one Model instance to reuse for all batches
        model = Model()
        
        for i in range(0, len(posts), batch_size):
            batch = posts[i:i + batch_size]
            messages = lead_generation_prompt(product_data, batch)

            response = model.gemini_lead_checking(messages)

            try:
                response_data = json.loads(response)
                post_ids = response_data.get('post_ids', [])
                print(post_ids)
                for post_id in post_ids:
                    selected_posts.append(posts[post_id])
            except json.JSONDecodeError as e:
                print(f"Failed to parse AI response: {e}")
                print(f"Raw response: {response}")
        
        messages = lead_generation_prompt_2(product_data, selected_posts)

        response = model.gemini_chat_completion(messages)
        response_data = json.loads(response)
        comments = response_data.get('comments', [])

        # Creates a file with the comments
        with open('comments.json', 'w') as f:
            json.dump(comments, f)

        generated_leads = []
        for comment in comments:
            for key, value in comment.items():
                new_post = {}
                unformatted_post = unformatted_posts[int(key)]
                new_post['id'] = str(uuid.uuid4())
                new_post['comment'] = value
                new_post['selftext'] = unformatted_post['selftext']
                new_post['title'] = unformatted_post['title']
                new_post['url'] = unformatted_post['url']
                new_post['score'] = unformatted_post['score']
                new_post['read'] = False
                generated_leads.append(new_post)

        # Save generated leads to the leads table
        user_id = g.current_user['id']
        leads_to_insert = []
        
        for lead in generated_leads:
            lead_data = {
                'id': lead['id'],
                'uid': user_id,
                'comment': lead['comment'],
                'selftext': lead['selftext'],
                'title': lead['title'],
                'url': lead['url'],
                'score': lead['score'],
                'read': lead['read']
            }
            leads_to_insert.append(lead_data)
        
        if leads_to_insert:
            try:
                supabase.table('leads').insert(leads_to_insert).execute()
                print(f"Successfully saved {len(leads_to_insert)} leads to database")
            except Exception as e:
                print(f"Error saving leads to database: {e}")

        return jsonify(generated_leads)
    

@blp.route('/get-leads')
class GetLeads(MethodView):
    @verify_supabase_token
    def get(self):
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        user_id = g.current_user['id']
        result = supabase.table('leads').select('*').eq('uid', user_id).order('created_at', desc=True).execute()
        leads = result.data

        return jsonify(leads)
    

@blp.route('/mark-lead-as-read')
class MarkLeadAsRead(MethodView):
    @verify_supabase_token
    def post(self):
        data = request.get_json()
        lead_id = data.get('lead_id')

        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        result = supabase.table('leads').update({'read': True}).eq('id', lead_id).execute()
        return jsonify(result.data)