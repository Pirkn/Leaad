import pandas as pd
import praw
import os
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT'),
    client_secret=os.getenv('REDDIT_SECRET'),
    user_agent="MarketingAgent/1.0",
)

# Use valid subreddits that actually exist
subreddits = ['marketing', 'entrepreneur', 'business', 'smallbusiness', 'startups', 'saas', 'sideproject', 'indiehackers']

for subreddit_name in subreddits:
    try:
        print(f"\n=== Testing subreddit: r/{subreddit_name} ===")
        subreddit = reddit.subreddit(subreddit_name)
        
        # Test if subreddit exists by trying to get its display name
        display_name = subreddit.display_name
        print(f"✅ Subreddit exists: r/{display_name}")
        
        # Get a few posts to test
        post_count = 0
        for post in subreddit.new(limit=3):
            print(f"  - {post.title[:60]}...")
            post_count += 1
            if post_count >= 3:
                break
                
    except Exception as e:
        print(f"❌ Error with subreddit r/{subreddit_name}: {str(e)}")
        continue

print("\n=== Test completed ===")