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

    post_content = ""

    for post in subreddit.rising(limit=10):
        post_content += f"""
        Title: {post.title}
        Author: {post.author.name if post.author else 'deleted'}
        Score: {post.score} (↑{post.ups} ↓{post.downs})
        Comments: {post.num_comments}
        Created: {post.created}
        URL: {post.url}
        Self Text: {post.selftext[:1000]}..." if post.selftext else "No text")
        NSFW: {post.over_18}
        Stickied: {post.stickied}
        """

    return post_content

# posts = get_posts("microsaas")
# from prompt_generator import karma_helper_prompt
# from models import Model


# messages = karma_helper_prompt(posts)

# model = Model()
# response = model.gemini_chat_completion(messages)
# print(response)
