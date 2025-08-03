import praw
import os
from dotenv import load_dotenv

load_dotenv()

# Set up Reddit instance
reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT'),
    client_secret=os.getenv('REDDIT_SECRET'),
    user_agent="MarketingAgent/1.0",
)

def get_posts(subreddit_name):
    subreddit = reddit.subreddit(subreddit_name)

    post_content = []

    for post in subreddit.rising(limit=10):
        try:
            comments = []
            
            # Construct the proper Reddit comment URL using post ID
            # This ensures we get the comment page URL, not the direct image/media URL
            comment_url = f"https://www.reddit.com/r/{subreddit_name}/comments/{post.id}/"
            
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

# posts = get_posts("microsaas")
# from prompt_generator import karma_helper_prompt
# from models import Model


# messages = karma_helper_prompt(posts)

# model = Model()
# response = model.gemini_chat_completion(messages)
# print(response)
