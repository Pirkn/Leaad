from flask.views import MethodView
from flask_smorest import Blueprint
from flask import jsonify, request, g, current_app
from dotenv import load_dotenv
from src.utils.auth import verify_supabase_token
from src.utils.prompt_generator import lead_generation_prompt, lead_generation_prompt_2
from src.utils.models import Model
from supabase import create_client, Client
from src.utils.reddit_helpers import lead_posts
import os
import json
import uuid
import datetime
import random
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

        if not subreddits:
            return jsonify({'error': 'No subreddits found for this product. Please add subreddits first.'}), 400

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
                post_ids = response_data.get('selected_post_ids', [])
                print(f"AI returned post_ids: {post_ids}")
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
                new_post['num_comments'] = unformatted_post['num_comments']
                new_post['author'] = unformatted_post['author']
                new_post['subreddit'] = unformatted_post['subreddit']
                new_post['date'] = unformatted_post['date']
                new_post['created_at'] = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                generated_leads.append(new_post)

        # Save generated leads to the leads table
        user_id = g.current_user['id']
        leads_to_insert = []

        # Calculate scheduling intervals using dynamic algorithm
        base_interval_minutes = 120.0 / len(generated_leads)
        base_interval_minutes = max(5.0, min(45.0, base_interval_minutes))  # Min 5 min, max 45 min
        
        scheduled_time = datetime.datetime.now(datetime.timezone.utc)
        time_now = datetime.datetime.now(datetime.timezone.utc)

        for i, lead in enumerate(generated_leads):            
            lead_data = {
                'id': lead['id'],
                'uid': user_id,
                'comment': lead['comment'],
                'selftext': lead['selftext'],
                'title': lead['title'],
                'url': lead['url'],
                'score': lead['score'],
                'read': lead['read'],
                'num_comments': lead['num_comments'],
                'author': lead['author'],
                'subreddit': lead['subreddit'],
                'date': lead['date'],
                'scheduled_at': scheduled_time.strftime('%Y-%m-%dT%H:%M:%S')
            }
            leads_to_insert.append(lead_data)

            # Calculate random delay between 0.7x and 1.3x of base interval
            min_delay = base_interval_minutes * 0.7
            max_delay = base_interval_minutes * 1.3
            random_delay = random.uniform(min_delay, max_delay)
            
            # Add cumulative delay for this lead
            total_delay_minutes = (i * base_interval_minutes) + random_delay
            scheduled_time = time_now + datetime.timedelta(minutes=total_delay_minutes)
        
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

        current_time = datetime.datetime.now(datetime.timezone.utc)
        
        # Only return leads that have reached their scheduled time (drip-feed system)
        result = supabase.table('leads').select('id, selftext, title, url, score, read, num_comments, author, subreddit, date, comment').eq('uid', user_id).lte(
            'scheduled_at', current_time.isoformat()
        ).order('scheduled_at', desc=True).execute()

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
    
@blp.route('/mark-lead-as-unread')
class MarkLeadAsUnread(MethodView):
    @verify_supabase_token
    def post(self):
        data = request.get_json()
        lead_id = data.get('lead_id')

        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        result = supabase.table('leads').update({'read': False}).eq('id', lead_id).execute()
        return jsonify(result.data)
    
@blp.route('/delete-lead')
class DeleteLead(MethodView):
    @verify_supabase_token
    def post(self):
        data = request.get_json()
        lead_id = data.get('lead_id')

        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        result = supabase.table('leads').delete().eq('id', lead_id).execute()

        return jsonify(result.data)
    

def generate_leads(user_id):
    supabase_url = current_app.config['SUPABASE_URL']
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
    supabase: Client = create_client(supabase_url, supabase_key)

    # Get product for the user
    product_result = supabase.table('products').select('id').eq('user_id', user_id).execute()
    
    if not product_result.data:
        print(f"No products found for user {user_id}")
        return
    
    product_id = product_result.data[0]['id']
    
    result = supabase.table('lead_subreddits').select('*').eq('product_id', product_id).execute()
    subreddits = [lead['subreddit'] for lead in result.data]

    if not subreddits:
        print(f"No subreddits found for product {product_id}")
        return

    # Get product data
    product_result = supabase.table('products').select('*').eq('id', product_id).execute()
    
    if not product_result.data:
        print(f"Product data not found for product_id {product_id}")
        return
    
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
            post_ids = response_data.get('selected_post_ids', [])
            print(f"AI returned post_ids: {post_ids}")
            for post_id in post_ids:
                selected_posts.append(posts[post_id])
        except json.JSONDecodeError as e:
            print(f"Failed to parse AI response: {e}")
            print(f"Raw response: {response}")
    
    messages = lead_generation_prompt_2(product_data, selected_posts)

    response = model.gemini_chat_completion(messages)
    response_data = json.loads(response)
    comments = response_data.get('comments', [])

    # Handle case where comments might be a JSON string
    if isinstance(comments, str):
        try:
            comments = json.loads(comments)
        except json.JSONDecodeError as e:
            print(f"Failed to parse comments string: {e}")
            comments = []

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
            new_post['num_comments'] = unformatted_post['num_comments']
            new_post['author'] = unformatted_post['author']
            new_post['subreddit'] = unformatted_post['subreddit']
            new_post['date'] = unformatted_post['date']
            new_post['created_at'] = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
            generated_leads.append(new_post)

    # Save generated leads to the leads table
    if not generated_leads:
        print(f"No leads generated for user {user_id}")
        return
    
    leads_to_insert = []

    # Calculate scheduling intervals using dynamic algorithm
    base_interval_minutes = 120.0 / len(generated_leads)
    base_interval_minutes = max(5.0, min(45.0, base_interval_minutes))  # Min 5 min, max 45 min
    
    scheduled_time = datetime.datetime.now(datetime.timezone.utc)
    time_now = datetime.datetime.now(datetime.timezone.utc)

    for i, lead in enumerate(generated_leads):            
        lead_data = {
            'id': lead['id'],
            'uid': user_id,
            'comment': lead['comment'],
            'selftext': lead['selftext'],
            'title': lead['title'],
            'url': lead['url'],
            'score': lead['score'],
            'read': lead['read'],
            'num_comments': lead['num_comments'],
            'author': lead['author'],
            'subreddit': lead['subreddit'],
            'date': lead['date'],
            'scheduled_at': scheduled_time.strftime('%Y-%m-%dT%H:%M:%S')
        }
        leads_to_insert.append(lead_data)

        # Calculate random delay between 0.7x and 1.3x of base interval
        min_delay = base_interval_minutes * 0.7
        max_delay = base_interval_minutes * 1.3
        random_delay = random.uniform(min_delay, max_delay)
        
        # Add cumulative delay for this lead
        total_delay_minutes = (i * base_interval_minutes) + random_delay
        scheduled_time = time_now + datetime.timedelta(minutes=total_delay_minutes)
    
    if leads_to_insert:
        try:
            supabase.table('leads').insert(leads_to_insert).execute()
            print(f"Successfully saved {len(leads_to_insert)} leads to database")
        except Exception as e:
            print(f"Error saving leads to database: {e}")

    return jsonify(generated_leads)

@blp.route('/next-lead-search')
class NextLeadSearch(MethodView):
    def get(self):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid Authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        cron_token = os.getenv('CRON_TOKEN')
        
        if token != cron_token:
            return jsonify({'error': 'Invalid token'}), 401

        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)
        
        current_time = datetime.datetime.now(datetime.timezone.utc)
        
        result = supabase.table('search_time').select('*').lt('search_time', current_time.isoformat()).order('search_time', desc=True).execute()
        
        print(f"User Data: {result.data}")
        past_search_times = result.data if result.data else []

        for past_search_time in past_search_times:
            try:
                generate_leads(past_search_time['user_id'])
                print(f"Generated leads for user {past_search_time['user_id']}")

                current_time = datetime.datetime.now(datetime.timezone.utc)
                next_search_time = current_time + datetime.timedelta(hours=2)

                supabase.table('search_time').update({'search_time': next_search_time.isoformat()}).eq('id', past_search_time['id']).execute()
            except Exception as e:
                print(f"Error generating leads: {e}")

        
        return jsonify({'message': 'Leads generated successfully'})


@blp.route('/move-leads')
class MoveLeads(MethodView):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid Authorization header'}), 401

        token = auth_header.split(' ')[1]
        cron_token = os.getenv('CRON_TOKEN')
        if token != cron_token:
            return jsonify({'error': 'Invalid token'}), 401

        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Get all due and unread leads
        due_res = supabase.table('leads') \
            .select('*') \
            .lte('scheduled_at', now_iso) \
            .eq('read', False) \
            .execute()
        due_leads = due_res.data or []
        if not due_leads:
            return jsonify({'moved': 0})

        # Avoid duplicates: fetch already moved lead_ids
        lead_ids = [l['id'] for l in due_leads]
        existing_res = supabase.table('active_leads') \
            .select('lead_id') \
            .in_('lead_id', lead_ids) \
            .execute()
        existing = {row['lead_id'] for row in (existing_res.data or [])}

        rows = []
        now_ts = datetime.datetime.now(datetime.timezone.utc).isoformat()
        for l in due_leads:
            if l['id'] in existing:
                continue
            rows.append({
                'lead_id': l['id'],
                'uid': l['uid'],
                'comment': l.get('comment'),
                'selftext': l.get('selftext'),
                'title': l.get('title'),
                'url': l.get('url'),
                'score': l.get('score'),
                'read': l.get('read', False),
                'num_comments': l.get('num_comments'),
                'author': l.get('author'),
                'subreddit': l.get('subreddit'),
                'date': l.get('date'),
            })

        inserted = 0
        if rows:
            ins = supabase.table('active_leads').insert(rows).execute()
            inserted = len(ins.data or [])

        return jsonify({'moved': inserted})