import praw
import os
from dotenv import load_dotenv
import random
import requests
import datetime
from src.utils.image_handling import convert_to_webp
from src.utils.prompt_generator import post_karma_prompt
from flask import jsonify, current_app
from supabase import create_client, Client

load_dotenv()

# Set up Reddit instance
reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT'),
    client_secret=os.getenv('REDDIT_SECRET'),
    user_agent="MarketingAgent/1.0",
)

def get_rising_posts():
    subreddits = ['ask', 'help', 'askreddit', 'mildlyinteresting', 'nostupidquestions']
    
    random_subreddit = random.choice(subreddits)

    subreddit = reddit.subreddit(random_subreddit)

    post_content = []
    
    for post in subreddit.rising(limit=5):
        if post.over_18 == True:
            continue
        try:
            comments = []
            
            # Construct the proper Reddit comment URL using post ID
            # This ensures we get the comment page URL, not the direct image/media URL
            comment_url = f"https://www.reddit.com/r/{random_subreddit}/comments/{post.id}/"
            
            # Get the post using the comment URL
            post = reddit.submission(url=comment_url)
            post.comment_sort = 'top'   

            for comment in post.comments[:3]:
                new_comment = {
                    "comment": comment.body,
                    "score": comment.score
                }
                comments.append(new_comment)

            rising_post = {
                "title": post.title,
                "author": post.author.name if post.author else 'deleted',
                "score": post.score,
                "comments": post.num_comments,
                "created": post.created,
                "url": comment_url,  # Use the comment URL, not the original post.url
                "selftext": post.selftext[:1000] if post.selftext else "No text",
                "nsfw": post.over_18,
                "stickied": post.stickied,
                "top_comments": comments
            }
            post_content.append(rising_post)
            
        except Exception as e:
            print(f"Error processing post {post.id}: {str(e)}")
            continue

    return post_content


def create_karma_post():
    subreddits = ['aww']
    random_subreddit = random.choice(subreddits)

    if random_subreddit == 'aww':
        response = requests.get("https://genrandom.com/api/cat")
        image_data = response.content

        webp_data = convert_to_webp(image_data)
        
        # Convert WebP to base64
        import base64
        webp_base64 = base64.b64encode(webp_data).decode('utf-8')
        
        messages = post_karma_prompt(webp_base64, random_subreddit)

        return messages, random_subreddit, webp_base64
    
def get_product_lead_subreddits(product_id):
    supabase_url = current_app.config['SUPABASE_URL']
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
    supabase: Client = create_client(supabase_url, supabase_key)
    
    leads_result = supabase.table('lead_subreddits').select('*').eq('product_id', product_id).order('created_at', desc=True).execute()
    
    if leads_result.data is not None:
        return jsonify({
            'leads': leads_result.data,
            'total_count': len(leads_result.data)
        }), 200
    else:
        return jsonify({'error': 'Failed to fetch leads'}), 500
    
def lead_posts(subreddits):
    post_content = []
    for subreddit_name in subreddits:
        try:
            subreddit = reddit.subreddit(subreddit_name)
            
            # Test if subreddit exists
            display_name = subreddit.display_name
            print(f"✅ Processing subreddit: r/{display_name}")
            
            for post in subreddit.new(limit=10):
                if post.over_18 == True:
                    continue
                
                comments = []
                
                # Construct the proper Reddit comment URL using post ID
                # This ensures we get the comment page URL, not the direct image/media URL
                comment_url = f"https://www.reddit.com/r/{subreddit_name}/comments/{post.id}/"
                subreddit_name_clean = str(subreddit_name)
                # Get the post using the comment URL
                post = reddit.submission(url=comment_url)
                post.comment_sort = 'top'   

                for comment in post.comments[:3]:
                    new_comment = {
                        "comment": comment.body,
                        "score": comment.score
                    }
                    comments.append(new_comment)

                # Convert epoch to ISO datetime string (YYYY-MM-DDTHH:MM:SS) for Postgres timestamp column using timezone-aware UTC
                created_iso_date = datetime.datetime.fromtimestamp(post.created_utc, tz=datetime.timezone.utc).isoformat()

                lead_post = {
                    "title": post.title,
                    "score": post.score,
                    "comments": post.num_comments,
                    "created": post.created,
                    "url": comment_url,
                    "selftext": post.selftext[:1000] if post.selftext else "No text",
                    "top_comments": comments,
                    "num_comments": post.num_comments,
                    "author": post.author.name if post.author else 'deleted',
                    "subreddit": subreddit_name_clean,
                    "date": created_iso_date
                }
                post_content.append(lead_post)
                
        except Exception as e:
            print(f"❌ Error processing subreddit r/{subreddit_name}: {str(e)}")
            continue

    # ===== Format Posts Data as JSON for Better AI Understanding =====
    formatted_posts = []
    
    for i, post in enumerate(post_content, 0):
        formatted_post = {
            "post_id": i,
            "title": post['title'],
            "score": post['score'],
            "total_comments": post['comments'],
            "url": post['url'],
            "content": post['selftext'],
            "top_comments": [
                {
                    "comment_number": j,
                    "score": comment['score'],
                    "comment": comment['comment']
                }
                for j, comment in enumerate(post['top_comments'], 1)
            ]
        }
        formatted_posts.append(formatted_post)
    
    return post_content, formatted_posts