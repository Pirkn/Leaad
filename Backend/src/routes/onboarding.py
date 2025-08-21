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
from src.utils.reddit_helpers import list_new_posts_metadata, fetch_comments_for_posts
from src.utils.models import Model
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import uuid
import random

load_dotenv()

blp = Blueprint('Onboarding', __name__, description='Onboarding Operations')

@blp.route('/onboarding-lead-generation')
class OnboardingLeadGeneration(MethodView):
    @verify_supabase_token
    def post(self):
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

        # Phase 1: fetch only lightweight metadata (no comments) to speed up onboarding
        unformatted_posts, posts = list_new_posts_metadata(subreddits)
        # Process posts in batches of 10 with parallel AI checks (max 3 concurrent)
        batch_size = 10
        selected_posts = []
        selected_indexes = []
        
        def process_batch(batch_data):
            batch, batch_start_idx = batch_data
            messages = lead_generation_prompt(product_data, batch)
            response = model.gemini_lead_checking(messages)
            
            try:
                response_data = json.loads(response)
                post_ids = response_data.get('selected_post_ids', [])
                print(f"Batch starting at index {batch_start_idx}: AI selected {post_ids}")
                # Adjust post_ids to global indices
                global_post_ids = [batch_start_idx + pid for pid in post_ids]
                return global_post_ids
            except json.JSONDecodeError as e:
                print(f"Failed to parse AI response for batch starting at {batch_start_idx}: {e}")
                print(f"Raw response: {response}")
                return []
        
        # Prepare batches with their starting indices
        batches = []
        for i in range(0, len(posts), batch_size):
            batch = posts[i:i + batch_size]
            batches.append((batch, i))
        
        # Process batches in parallel with max 3 concurrent workers
        with ThreadPoolExecutor(max_workers=3) as executor:
            # Submit all batch processing tasks
            future_to_batch = {executor.submit(process_batch, batch_data): batch_data for batch_data in batches}
            
            # Collect results as they complete
            for future in as_completed(future_to_batch):
                batch_data = future_to_batch[future]
                try:
                    global_post_ids = future.result()
                    for post_id in global_post_ids:
                        if post_id < len(posts):
                            selected_posts.append(posts[post_id])
                            selected_indexes.append(post_id)
                except Exception as e:
                    print(f"Error processing batch {batch_data[1]}: {e}")

        # Phase 2: fetch comments only for shortlisted posts
        try:
            selected_reddit_ids = [unformatted_posts[idx]['reddit_post_id'] for idx in selected_indexes]
            comments_by_post_id = fetch_comments_for_posts(selected_reddit_ids, comments_per_post=3)
        except Exception as e:
            print(f"Failed to fetch comments for shortlisted posts: {e}")
            comments_by_post_id = {}

        # Enrich selected posts with fetched top comments for better final generation context
        selected_posts_with_comments = []
        for idx in selected_indexes:
            try:
                base = posts[idx]
                reddit_id = unformatted_posts[idx]['reddit_post_id']
                enriched = {**base, "top_comments": comments_by_post_id.get(reddit_id, [])}
                selected_posts_with_comments.append(enriched)
            except Exception as e:
                print(f"Error enriching post {idx} with comments: {e}")

        messages = lead_generation_prompt_2(product_data, selected_posts_with_comments)

        response = model.gemini_chat_completion(messages)
        response_data = json.loads(response)
        comments = response_data.get('comments', [])
        
        # Handle case where comments might be a JSON string
        if isinstance(comments, str):
            print(comments)
            open('comments.json', 'w').write(comments)
            try:
                comments = json.loads(comments)
            except json.JSONDecodeError as e:
                print(f"Failed to parse comments string: {e}")
                comments = []
    
        generated_leads = []
        for comment in comments:
            # Handle different comment formats
            if isinstance(comment, dict):
                for key, value in comment.items():
                    try:
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
                        new_post['reddit_post_id'] = unformatted_post['reddit_post_id']
                        new_post['created_at'] = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                        generated_leads.append(new_post)
                    except (ValueError, KeyError, IndexError) as e:
                        print(f"Error processing comment with key {key}: {e}")
                        continue
            elif isinstance(comment, str):
                print(f"Skipping string comment: {comment[:100]}...")
                continue
            else:
                print(f"Skipping unknown comment type: {type(comment)}")
                continue

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
                    'reddit_post_id': lead['reddit_post_id'],
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
                    'reddit_post_id': lead['reddit_post_id'],
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

        if leads_to_insert:
            try:
                supabase.table('leads').insert(leads_to_insert).execute()
                print(f"Successfully saved {len(leads_to_insert)} leads to database")
            except Exception as e:
                print(f"Error saving leads to database: {e}")
        else:
            print("No leads to save")

        return jsonify({"generated_leads": generated_leads[:2], "subreddits": subreddits})
        

@blp.route('/set-onboarding-complete')
class SetOnboardingComplete(MethodView):
    @verify_supabase_token
    def post(self):
        user_id = g.current_user['id']
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Check if user record exists
        result = supabase.table('onboarding').select('user_id').eq('user_id', user_id).execute()
        
        if result.data:
            # User exists, update status
            supabase.table('onboarding').update({'status': True}).eq('user_id', user_id).execute()
        else:
            # User doesn't exist, insert new record
            user_data = {
                'user_id': user_id,
                'status': True,
                'created_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            supabase.table('onboarding').insert(user_data).execute()
        
        current_time = datetime.datetime.now(datetime.timezone.utc)
        search_time = current_time + datetime.timedelta(hours=2)
        
        search_record = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'search_time': search_time.isoformat(),
            'created_at': current_time.isoformat()
        }
        
        try:
            if supabase.table('search_time').select('*').eq('user_id', user_id).execute().data:
                supabase.table('search_time').update(search_record).eq('user_id', user_id).execute()
            else:
                supabase.table('search_time').insert(search_record).execute()
            print(f"Successfully saved search record for user {user_id}")
        except Exception as e:
            print(f"Error saving search record: {e}")
        
        return jsonify({"message": "Onboarding complete"})
    
@blp.route('/get-onboarding-status')
class GetOnboardingStatus(MethodView):
    @verify_supabase_token
    def get(self):
        user_id = g.current_user['id']
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)
        
        result = supabase.table('onboarding').select('status').eq('user_id', user_id).execute()
        
        if result.data:
            return jsonify({"status": result.data[0]['status']})
        else:
            # User doesn't exist in database, return False (not completed)
            return jsonify({"status": False})