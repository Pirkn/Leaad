from flask.views import MethodView
from flask_smorest import Blueprint
from flask import jsonify, request, g, current_app
from dotenv import load_dotenv
from src.utils.auth import verify_supabase_token
from src.utils.prompt_generator import lead_generation_prompt, lead_generation_prompt_2
from src.utils.models import Model
from supabase import create_client, Client
from src.utils.reddit_helpers import list_new_posts_metadata, fetch_comments_for_posts
import os
import json
import uuid
import datetime
import random
import logging
from typing import Optional, List, Dict, Any
from flask import current_app
import traceback

import logging
logger = logging.getLogger(__name__)

load_dotenv()

blp = Blueprint('Leads', __name__, description='Lead Operations')

def check_existing_reddit_posts(supabase, user_id, new_leads):
    """
    Check for existing Reddit post IDs to prevent duplicate leads.
    Returns only leads that don't already exist for this user.
    """
    if not new_leads:
        return []
    
    # Get existing Reddit post IDs for this user
    existing_result = supabase.table('leads').select('reddit_post_id').eq('uid', user_id).execute()
    existing_post_ids = {lead['reddit_post_id'] for lead in existing_result.data if lead.get('reddit_post_id')}
    
    # Filter out duplicates
    unique_leads = []
    for lead in new_leads:
        if lead.get('reddit_post_id') and lead['reddit_post_id'] not in existing_post_ids:
            unique_leads.append(lead)
    
    logger.info(f"Found {len(new_leads)} total leads, {len(unique_leads)} are unique (skipped {len(new_leads) - len(unique_leads)} duplicates)")
    return unique_leads

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
        
        # Phase 1: fetch lightweight post metadata only (no comments)
        unformatted_posts, posts = list_new_posts_metadata(subreddits)
        
        logger.info(f"Processing {len(posts)} posts from {len(subreddits)} subreddits")

        # Process posts in batches of 10
        batch_size = 10
        selected_posts = []
        selected_indexes: List[int] = []
        
        # Create one Model instance to reuse for all batches
        model = Model()
        
        for i in range(0, len(posts), batch_size):
            batch = posts[i:i + batch_size]
            messages = lead_generation_prompt(product_data, batch)

            response = model.gemini_lead_checking(messages)

            try:
                response_data = json.loads(response)
                post_ids = response_data.get('selected_post_ids', [])
                logger.debug(f"AI selected post indices: {post_ids}")
                for post_id in post_ids:
                    if post_id < len(posts):
                        selected_posts.append(posts[post_id])
                        selected_indexes.append(post_id)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response: {e}")
                logger.debug(f"Raw response: {response}")
        
        # Phase 2: fetch comments only for shortlisted posts and enrich selected posts
        try:
            selected_reddit_ids = [unformatted_posts[idx]['reddit_post_id'] for idx in selected_indexes]
            comments_by_post_id = fetch_comments_for_posts(selected_reddit_ids, comments_per_post=3)
        except Exception as e:
            logger.error(f"Failed to fetch comments for shortlisted posts: {e}")
            comments_by_post_id = {}

        selected_posts_with_comments = []
        for idx in selected_indexes:
            try:
                base = posts[idx]
                reddit_id = unformatted_posts[idx]['reddit_post_id']
                enriched = {**base, "top_comments": comments_by_post_id.get(reddit_id, [])}
                selected_posts_with_comments.append(enriched)
            except Exception as e:
                logger.error(f"Error enriching post {idx} with comments: {e}")

        messages = lead_generation_prompt_2(product_data, selected_posts_with_comments)

        response = model.gemini_chat_completion(messages)
        response_data = json.loads(response)
        comments = response_data.get('comments', [])

        logger.info(f"Generated {len(comments)} comments from {len(selected_posts)} selected posts")

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
                new_post['reddit_post_id'] = unformatted_post.get('reddit_post_id')  # Add Reddit post ID
                new_post['score'] = unformatted_post['score']
                new_post['read'] = False
                new_post['num_comments'] = unformatted_post['num_comments']
                new_post['author'] = unformatted_post['author']
                new_post['subreddit'] = unformatted_post['subreddit']
                new_post['date'] = unformatted_post['date']
                new_post['created_at'] = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                generated_leads.append(new_post)

        # Check for duplicates before inserting
        user_id = g.current_user['id']
        unique_leads = check_existing_reddit_posts(supabase, user_id, generated_leads)
        
        if not unique_leads:
            return jsonify({'message': 'No new leads found. All leads already exist.', 'leads': []})
        
        leads_to_insert = []

        # Calculate scheduling intervals using dynamic algorithm
        base_interval_minutes = 120.0 / len(unique_leads)
        base_interval_minutes = max(5.0, min(45.0, base_interval_minutes))  # Min 5 min, max 45 min
        
        scheduled_time = datetime.datetime.now(datetime.timezone.utc)
        time_now = datetime.datetime.now(datetime.timezone.utc)

        for i, lead in enumerate(unique_leads):            
            lead_data = {
                'id': lead['id'],
                'uid': user_id,
                'comment': lead['comment'],
                'selftext': lead['selftext'],
                'title': lead['title'],
                'url': lead['url'],
                'reddit_post_id': lead['reddit_post_id'],  # Include Reddit post ID
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
                logger.info(f"Saved {len(leads_to_insert)} unique leads to database")
            except Exception as e:
                logger.error(f"Error saving leads to database: {e}")

        return jsonify({
            'message': f'Generated {len(unique_leads)} new leads (skipped {len(generated_leads) - len(unique_leads)} duplicates)',
            'leads': unique_leads
        })
    

@blp.route('/get-leads')
class GetLeads(MethodView):
    @verify_supabase_token
    def get(self):
        try:
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_key:
                logger.error("SUPABASE_SERVICE_ROLE_KEY not found in environment")
                return jsonify({'error': 'Database configuration error'}), 500
                
            supabase: Client = create_client(supabase_url, supabase_key)

            user_id = g.current_user['id']
            logger.info(f"Fetching leads for user {user_id}")

            current_time = datetime.datetime.now(datetime.timezone.utc)
            
            # Only return leads that have reached their scheduled time (drip-feed system)
            try:
                result = supabase.table('leads').select('id, selftext, title, url, score, read, num_comments, author, subreddit, date, comment').eq('uid', user_id).lte(
                    'scheduled_at', current_time.isoformat()
                ).order('scheduled_at', desc=True).execute()

                leads = result.data or []
                logger.info(f"Retrieved {len(leads)} leads for user {user_id}")
                return jsonify(leads)
                
            except Exception as e:
                logger.error(f"Database error fetching leads for user {user_id}: {e}")
                return jsonify({'error': 'Database error'}), 500
                
        except Exception as e:
            logger.error(f"Unexpected error in get-leads: {e}")
            logger.error(traceback.format_exc())
            return jsonify({'error': 'Internal server error'}), 500
    

@blp.route('/mark-lead-as-read')
class MarkLeadAsRead(MethodView):
    @verify_supabase_token
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400
                
            lead_id = data.get('lead_id')
            if not lead_id:
                return jsonify({'error': 'lead_id is required'}), 400

            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_key:
                logger.error("SUPABASE_SERVICE_ROLE_KEY not found in environment")
                return jsonify({'error': 'Database configuration error'}), 500
                
            supabase: Client = create_client(supabase_url, supabase_key)

            user_id = g.current_user['id']
            logger.info(f"Marking lead {lead_id} as read for user {user_id}")

            try:
                result = supabase.table('leads').update({'read': True}).eq('id', lead_id).eq('uid', user_id).execute()
                
                if not result.data:
                    logger.warning(f"Lead {lead_id} not found or not owned by user {user_id}")
                    return jsonify({'error': 'Lead not found'}), 404
                    
                logger.info(f"Successfully marked lead {lead_id} as read for user {user_id}")
                return jsonify(result.data)
                
            except Exception as e:
                logger.error(f"Database error marking lead {lead_id} as read: {e}")
                return jsonify({'error': 'Database error'}), 500
                
        except Exception as e:
            logger.error(f"Unexpected error in mark-lead-as-read: {e}")
            logger.error(traceback.format_exc())
            return jsonify({'error': 'Internal server error'}), 500
    
@blp.route('/mark-lead-as-unread')
class MarkLeadAsUnread(MethodView):
    @verify_supabase_token
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400
                
            lead_id = data.get('lead_id')
            if not lead_id:
                return jsonify({'error': 'lead_id is required'}), 400

            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_key:
                logger.error("SUPABASE_SERVICE_ROLE_KEY not found in environment")
                return jsonify({'error': 'Database configuration error'}), 500
                
            supabase: Client = create_client(supabase_url, supabase_key)

            user_id = g.current_user['id']
            logger.info(f"Marking lead {lead_id} as unread for user {user_id}")

            try:
                result = supabase.table('leads').update({'read': False}).eq('id', lead_id).eq('uid', user_id).execute()
                
                if not result.data:
                    logger.warning(f"Lead {lead_id} not found or not owned by user {user_id}")
                    return jsonify({'error': 'Lead not found'}), 404
                    
                logger.info(f"Successfully marked lead {lead_id} as unread for user {user_id}")
                return jsonify(result.data)
                
            except Exception as e:
                logger.error(f"Database error marking lead {lead_id} as unread: {e}")
                return jsonify({'error': 'Database error'}), 500
                
        except Exception as e:
            logger.error(f"Unexpected error in mark-lead-as-unread: {e}")
            logger.error(traceback.format_exc())
            return jsonify({'error': 'Internal server error'}), 500
    
@blp.route('/delete-lead')
class DeleteLead(MethodView):
    @verify_supabase_token
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400
                
            lead_id = data.get('lead_id')
            if not lead_id:
                return jsonify({'error': 'lead_id is required'}), 400

            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_key:
                logger.error("SUPABASE_SERVICE_ROLE_KEY not found in environment")
                return jsonify({'error': 'Database configuration error'}), 500
                
            supabase: Client = create_client(supabase_url, supabase_key)

            user_id = g.current_user['id']
            logger.info(f"Deleting lead {lead_id} for user {user_id}")

            try:
                result = supabase.table('leads').delete().eq('id', lead_id).eq('uid', user_id).execute()
                
                if not result.data:
                    logger.warning(f"Lead {lead_id} not found or not owned by user {user_id}")
                    return jsonify({'error': 'Lead not found'}), 404
                    
                logger.info(f"Successfully deleted lead {lead_id} for user {user_id}")
                return jsonify(result.data)
                
            except Exception as e:
                logger.error(f"Database error deleting lead {lead_id}: {e}")
                return jsonify({'error': 'Database error'}), 500
                
        except Exception as e:
            logger.error(f"Unexpected error in delete-lead: {e}")
            logger.error(traceback.format_exc())
            return jsonify({'error': 'Internal server error'}), 500
    

def generate_leads(user_id):
    """
    Generate leads for a given user.
    
    Args:
        user_id: The user ID to generate leads for
        
    Returns:
        Dict with success status and data, or None on critical failure
    """
    try:
        # Validate input
        if not user_id or not isinstance(user_id, str):
            logger.error(f"Invalid user_id provided: {user_id}")
            return {"error": "Invalid user_id", "success": False}
        
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_key:
            logger.error("SUPABASE_SERVICE_ROLE_KEY not found in environment")
            return {"error": "Database configuration error", "success": False}
            
        supabase: Client = create_client(supabase_url, supabase_key)

        # Get product for the user with better error handling
        try:
            product_result = supabase.table('products').select('id').eq('user_id', user_id).execute()
        except Exception as e:
            logger.error(f"Database error fetching products for user {user_id}: {e}")
            return {"error": "Database error", "success": False}
        
        if not product_result.data:
            logger.warning(f"No products found for user {user_id}")
            return {"error": "No products found", "success": False}
        
        product_id = product_result.data[0]['id']
        
        # Get subreddits with error handling
        try:
            result = supabase.table('lead_subreddits').select('*').eq('product_id', product_id).execute()
        except Exception as e:
            logger.error(f"Database error fetching subreddits for product {product_id}: {e}")
            return {"error": "Database error", "success": False}
            
        subreddits = [lead['subreddit'] for lead in result.data]

        if not subreddits:
            logger.warning(f"No subreddits found for product {product_id}")
            return {"error": "No subreddits configured", "success": False}

        # Get product data with error handling
        try:
            product_result = supabase.table('products').select('*').eq('id', product_id).execute()
        except Exception as e:
            logger.error(f"Database error fetching product data for {product_id}: {e}")
            return {"error": "Database error", "success": False}
        
        if not product_result.data:
            logger.error(f"Product data not found for product_id {product_id}")
            return {"error": "Product not found", "success": False}
        
        product_data = product_result.data[0]
        
        # Get posts with error handling
        try:
            # Phase 1: fetch lightweight post metadata only (no comments)
            unformatted_posts, posts = list_new_posts_metadata(subreddits)
        except Exception as e:
            logger.error(f"Error fetching Reddit posts: {e}")
            return {"error": "Failed to fetch Reddit posts", "success": False}

        # Remove file writing - use logging instead
        logger.info(f"Fetched {len(posts)} posts from {len(subreddits)} subreddits")

        # Process posts in batches with configurable size
        batch_size = 10
        selected_posts = []
        selected_indexes: List[int] = []
        
        # Create one Model instance to reuse for all batches
        model = Model()
        
        for i in range(0, len(posts), batch_size):
            batch = posts[i:i + batch_size]
            messages = lead_generation_prompt(product_data, batch)

            try:
                response = model.gemini_lead_checking(messages)
                response_data = json.loads(response)
                post_ids = response_data.get('selected_post_ids', [])
                logger.info(f"AI returned post_ids: {post_ids}")
                for post_id in post_ids:
                    if post_id < len(posts):  # Bounds checking
                        selected_posts.append(posts[post_id])
                        selected_indexes.append(post_id)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response: {e}")
                logger.error(f"Raw response: {response}")
                continue  # Skip this batch instead of failing completely
            except Exception as e:
                logger.error(f"Error processing batch {i//batch_size}: {e}")
                continue
        
        if not selected_posts:
            logger.warning(f"No posts selected by AI for user {user_id}")
            return {"error": "No suitable posts found", "success": False}

        # Phase 2: fetch comments only for shortlisted posts and enrich selected posts
        try:
            selected_reddit_ids = [unformatted_posts[idx]['reddit_post_id'] for idx in selected_indexes]
            comments_by_post_id = fetch_comments_for_posts(selected_reddit_ids, comments_per_post=3)
        except Exception as e:
            logger.error(f"Failed to fetch comments for shortlisted posts: {e}")
            comments_by_post_id = {}

        selected_posts_with_comments = []
        for idx in selected_indexes:
            try:
                base = posts[idx]
                reddit_id = unformatted_posts[idx]['reddit_post_id']
                enriched = {**base, "top_comments": comments_by_post_id.get(reddit_id, [])}
                selected_posts_with_comments.append(enriched)
            except Exception as e:
                logger.error(f"Error enriching post {idx} with comments: {e}")

        messages = lead_generation_prompt_2(product_data, selected_posts_with_comments)

        try:
            response = model.gemini_chat_completion(messages)
            response_data = json.loads(response)
            comments = response_data.get('comments', [])
        except Exception as e:
            logger.error(f"Error generating comments: {e}")
            return {"error": "Failed to generate comments", "success": False}

        # Handle case where comments might be a JSON string
        if isinstance(comments, str):
            try:
                comments = json.loads(comments)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse comments string: {e}")
                comments = []

        generated_leads = []
        for comment in comments:
            for key, value in comment.items():
                try:
                    post_index = int(key)
                    if post_index >= len(unformatted_posts):
                        logger.warning(f"Invalid post index: {post_index}")
                        continue
                        
                    unformatted_post = unformatted_posts[post_index]
                    new_post = {
                        'id': str(uuid.uuid4()),
                        'comment': value,
                        'selftext': unformatted_post['selftext'],
                        'title': unformatted_post['title'],
                        'url': unformatted_post['url'],
                        'reddit_post_id': unformatted_post.get('reddit_post_id'),
                        'score': unformatted_post['score'],
                        'read': False,
                        'num_comments': unformatted_post['num_comments'],
                        'author': unformatted_post['author'],
                        'subreddit': unformatted_post['subreddit'],
                        'date': unformatted_post['date'],
                        'created_at': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                    }
                    generated_leads.append(new_post)
                except (ValueError, KeyError, IndexError) as e:
                    logger.error(f"Error processing comment {key}: {e}")
                    continue

        # Check for duplicates before inserting
        if not generated_leads:
            logger.warning(f"No leads generated for user {user_id}")
            return {"error": "No leads generated", "success": False}
        
        unique_leads = check_existing_reddit_posts(supabase, user_id, generated_leads)
        
        if not unique_leads:
            logger.info(f"No new leads found for user {user_id}. All leads already exist.")
            return {"message": "No new leads found", "success": True, "data": []}
        
        leads_to_insert = []

        # Calculate scheduling intervals using dynamic algorithm
        base_interval_minutes = 120.0 / len(unique_leads)
        base_interval_minutes = max(5.0, min(45.0, base_interval_minutes))  # Min 5 min, max 45 min
        
        scheduled_time = datetime.datetime.now(datetime.timezone.utc)
        time_now = datetime.datetime.now(datetime.timezone.utc)

        for i, lead in enumerate(unique_leads):            
            lead_data = {
                'id': lead['id'],
                'uid': user_id,
                'comment': lead['comment'],
                'selftext': lead['selftext'],
                'title': lead['title'],
                'url': lead['url'],
                'reddit_post_id': lead['reddit_post_id'],
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
                logger.info(f"Successfully saved {len(leads_to_insert)} unique leads to database for user {user_id}")
            except Exception as e:
                logger.error(f"Error saving leads to database: {e}")
                return {"error": "Failed to save leads", "success": False}

        return {"success": True, "data": unique_leads, "count": len(unique_leads)}
        
    except Exception as e:
        logger.error(f"Unexpected error in generate_leads for user {user_id}: {e}")
        logger.error(traceback.format_exc())
        return {"error": "Internal server error", "success": False}

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
        
        logger.info(f"Found {len(result.data) if result.data else 0} users due for lead generation")
        past_search_times = result.data if result.data else []

        for past_search_time in past_search_times:
            try:
                result = generate_leads(past_search_time['user_id'])
                if result and result.get('success'):
                    logger.info(f"Generated leads for user {past_search_time['user_id']}: {result.get('count', 0)} leads")
                else:
                    logger.warning(f"Failed to generate leads for user {past_search_time['user_id']}: {result.get('error', 'Unknown error')}")

                current_time = datetime.datetime.now(datetime.timezone.utc)
                next_search_time = current_time + datetime.timedelta(hours=2)

                supabase.table('search_time').update({'search_time': next_search_time.isoformat()}).eq('id', past_search_time['id']).execute()
            except Exception as e:
                logger.error(f"Error generating leads for user {past_search_time['user_id']}: {e}")

        
        return jsonify({'message': 'Leads generated successfully'})


@blp.route('/move-leads')
class MoveLeads(MethodView):
    def get(self):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Missing or invalid Authorization header'}), 401

            token = auth_header.split(' ')[1]
            cron_token = os.getenv('CRON_TOKEN')
            if token != cron_token:
                return jsonify({'error': 'Invalid token'}), 401

            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_key:
                logger.error("SUPABASE_SERVICE_ROLE_KEY not found in environment")
                return jsonify({'error': 'Database configuration error'}), 500
                
            supabase: Client = create_client(supabase_url, supabase_key)

            now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

            # Get all due and unread leads
            try:
                due_res = supabase.table('leads') \
                    .select('*') \
                    .lte('scheduled_at', now_iso) \
                    .eq('read', False) \
                    .execute()
                due_leads = due_res.data or []
            except Exception as e:
                logger.error(f"Error fetching due leads: {e}")
                return jsonify({'error': 'Database error fetching leads'}), 500

            if not due_leads:
                logger.info("No due leads found to move")
                return jsonify({'moved': 0})

            logger.info(f"Found {len(due_leads)} due leads to process")

            # Avoid duplicates: fetch already moved lead_ids
            lead_ids = [l['id'] for l in due_leads]
            try:
                existing_res = supabase.table('active_leads') \
                    .select('lead_id') \
                    .in_('lead_id', lead_ids) \
                    .execute()
                existing = {row['lead_id'] for row in (existing_res.data or [])}
            except Exception as e:
                logger.error(f"Error checking existing leads: {e}")
                return jsonify({'error': 'Database error checking existing leads'}), 500

            rows = []
            for l in due_leads:
                if l['id'] in existing:
                    logger.debug(f"Lead {l['id']} already exists in active_leads, skipping")
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
                try:
                    ins = supabase.table('active_leads').insert(rows).execute()
                    inserted = len(ins.data or [])
                    logger.info(f"Successfully moved {inserted} leads to active_leads")
                except Exception as e:
                    logger.error(f"Error inserting leads into active_leads: {e}")
                    return jsonify({'error': 'Database error inserting leads'}), 500
            else:
                logger.info("No new leads to move (all already exist in active_leads)")

            return jsonify({'moved': inserted})
            
        except Exception as e:
            logger.error(f"Unexpected error in move-leads: {e}")
            logger.error(traceback.format_exc())
            return jsonify({'error': 'Internal server error'}), 500