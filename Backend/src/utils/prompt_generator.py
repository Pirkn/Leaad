import os

def reddit_post_generator_prompt(user_prompt):
    # ===== Create User Prompt =====
    current_user_prompt = user_prompt
    
    # ===== Create System Prompt =====
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'reddit_post_generator_prompt.txt')
    with open(config_path, 'r') as file:
        system_prompt = file.read()

    # ===== Create Messages =====
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": current_user_prompt}
    ]

    return messages

def generate_product_details_prompt(website_content):
    # ===== Create System Prompt =====
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'product_details_prompt.txt')
    with open(config_path, 'r') as file:
        system_prompt = file.read()

    # ===== Create Messages =====
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": website_content}
    ]

    return messages
    
def comment_karma_prompt(posts):
    # ===== Create System Prompt =====
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'karma_helper_prompt.txt')
    with open(config_path, 'r') as file:
        system_prompt = file.read()
    
    # ===== Format Posts Data for Better AI Understanding =====
    formatted_posts = []
    
    for i, post in enumerate(posts, 1):
        formatted_post = f"""
            === POST {i} ===
            Title: {post['title']}
            Author: {post['author']}
            Score: {post['score']} upvotes
            Total Comments: {post['comments']}
            URL: {post['url']}
            Content: {post['selftext']}
            NSFW: {post['nsfw']}
            Stickied: {post['stickied']}

            TOP COMMENTS:
        """
        
        for j, comment in enumerate(post['top_comments'], 1):
            formatted_post += f"{j}. Score: {comment['score']} | Comment: {comment['comment']}\n"
        
        formatted_post += "=" * 30
        formatted_posts.append(formatted_post)
    
    # Combine all formatted posts
    formatted_content = "\n\n".join(formatted_posts)
    print(formatted_content)
    # ===== Create Messages =====
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Here are the top 10 rising posts from the subreddit:\n\n{formatted_content}"}
    ]

    return messages

def post_karma_prompt(webp_base64, subreddit):
    if subreddit == 'aww':
        messages = [
            {
                "role": "system", 
                "content": f"Create a catchy, wholesome post title for r/{subreddit} based on the image. Keep it under 50 characters and make it engaging."
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Return title as a json object with the key 'title' and the value as the title."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/webp;base64,{webp_base64}"
                        }
                    }
                ]
            }
        ]

    return messages