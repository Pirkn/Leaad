import praw
import os
from dotenv import load_dotenv
import random
import requests
from src.utils.image_handling import convert_to_webp
from src.utils.prompt_generator import post_karma_prompt

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

        return messages, random_subreddit, webp_data
