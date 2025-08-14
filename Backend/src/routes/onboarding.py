from flask.views import MethodView
from flask_smorest import Blueprint
from flask import jsonify, request, g, current_app
from dotenv import load_dotenv
from src.utils.auth import verify_supabase_token
from supabase import create_client, Client
import os
import datetime
from src.utils.prompt_generator import generate_product_details_prompt, lead_subreddits_for_product_prompt
from src.utils.prompt_generator import lead_generation_prompt, lead_generation_prompt_2
from src.utils.reddit_helpers import lead_posts
from src.utils.models import Model
import json
import uuid
import random

load_dotenv()

blp = Blueprint('Onboarding', __name__, description='Onboarding Operations')

@blp.route('/onboarding-lead-generation')
class OnboardingLeadGeneration(MethodView):
    @verify_supabase_token
    def post(self):
        #product_data = {name, target_audience, problem_solved, description}
        product_data = request.get_json()

        # Subreddit generation
        messages = lead_subreddits_for_product_prompt(product_data)
        model = Model()
        response = model.gemini_chat_completion(messages)
        response_data = json.loads(response)

        subreddits = []
        for subreddit in response_data.get('subreddits', []):
            # Clean the subreddit name (remove 'r/' prefix if present)
            clean_subreddit = subreddit.replace('r/', '') if subreddit.startswith('r/') else subreddit
            subreddits.append(clean_subreddit)        

        unformatted_posts, posts = lead_posts(subreddits)
        print("posts found: ", len(posts))

        # Process posts in batches of 10
        batch_size = 10
        selected_posts = []
        
        for i in range(0, len(posts), batch_size):
            batch = posts[i:i + batch_size]
            messages = lead_generation_prompt(product_data, batch)

            response = model.gemini_lead_checking(messages)

            try:
                response_data = json.loads(response)
                post_ids = response_data.get('selected_post_ids', [])
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

        user_id = g.current_user['id']

        # Calculate scheduling intervals using dynamic algorithm
        if len(generated_leads) > 2:
            base_interval_minutes = 120.0 / len(generated_leads[2:])
            base_interval_minutes = max(5.0, min(45.0, base_interval_minutes))  # Min 5 min, max 45 min
        else:
            base_interval_minutes = 30.0  # Default interval if less than 3 leads
        
        schedule_time = datetime.datetime.now(datetime.timezone.utc)

        leads_to_insert = []
        for i, lead in enumerate(generated_leads):
            if i < 2:  # First two leads scheduled immediately
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
                    'scheduled_at': schedule_time.strftime('%Y-%m-%dT%H:%M:%S')
                }
                leads_to_insert.append(lead_data)
            else:  # Remaining leads scheduled with intervals
                # Calculate random delay between 0.7x and 1.3x of base interval
                min_delay = base_interval_minutes * 0.7
                max_delay = base_interval_minutes * 1.3
                random_delay = random.uniform(min_delay, max_delay)
                
                # Add cumulative delay for this lead
                total_delay_minutes = ((i - 2) * base_interval_minutes) + random_delay
                scheduled_time = schedule_time + datetime.timedelta(minutes=total_delay_minutes)
                
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
        
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)

        current_time = datetime.datetime.now(datetime.timezone.utc)
        search_time = current_time + datetime.timedelta(hours=2)
        
        search_record = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'search_time': search_time.isoformat(),
            'created_at': current_time.isoformat()
        }
        
        try:
            supabase.table('search_time').insert(search_record).execute()
            print(f"Successfully saved search record for user {user_id}")
        except Exception as e:
            print(f"Error saving search record: {e}")

        if leads_to_insert:
            try:
                supabase.table('leads').insert(leads_to_insert).execute()
                print(f"Successfully saved {len(leads_to_insert)} leads to database")
            except Exception as e:
                print(f"Error saving leads to database: {e}")
        else:
            print("No leads to save")

        return jsonify({"generated_leads": generated_leads[:2], "subreddits": subreddits})
        