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

def lead_subreddits_for_product_prompt(product_data):
    prompt = f"""
    Analyze this product and find the BEST subreddits for lead generation:
    
    Product: {product_data['name']}
    Target Audience: {product_data['target_audience']}
    Problem Solved: {product_data['problem_solved']}
    Description: {product_data['description']}
    
    Find subreddits where:
    1. The target audience actively seeks help
    2. People discuss the exact problem this product solves
    3. Community allows helpful recommendations (not anti-promotion)
    4. Active enough for regular lead opportunities
    
    Return top 10 subreddits with reasoning for each.
    Return in the following format:
    {{"subreddits": ["subreddit1", "subreddit2", "subreddit3"]}}
    """
    
    messages = [{"role": "user", "content": prompt}]

    return messages

def lead_generation_prompt(product_data, posts):
    system_prompt = f"""
    You are an expert lead generation specialist analyzing Reddit posts for marketing opportunities.
    
    PRODUCT ANALYSIS:
    - Product: {product_data['name']}
    - Target Audience: {product_data['target_audience']}
    - Problem Solved: {product_data['problem_solved']}
    - Description: {product_data['description']}
    
    LEAD GENERATION CRITERIA:
    1. **Perfect Problem Match**: Post directly discusses the exact problem your product solves
    2. **Active Engagement**: Post has good upvotes and comments (shows community interest)
    3. **Help-Seeking Behavior**: OP is asking for solutions, recommendations, or advice
    4. **Relevant Context**: Post content aligns with your product's value proposition
    5. **Comment-Friendly**: Post encourages discussion and allows helpful responses
    
    COMMENTING STRATEGY (80% Value / 20% Selling):
    - **80% Value**: Provide genuine help, insights, or solutions to their problem
    - **20% Selling**: Subtly mention your product as a relevant solution
    - **Approach**: "Here's how to solve this... [valuable advice]... BTW, I found [product] helpful for this exact issue"
    
    QUALITY STANDARDS:
    - Only select posts where you can provide genuine value
    - Skip posts that are too generic, off-topic, or don't need your solution
    - If no posts meet criteria, return empty array
    - Maximum 3 posts per batch to maintain quality
    """

    formatted_posts_string = "\n\n".join(posts)

    user_prompt = f"""
    Analyze these Reddit posts for lead generation opportunities:
    {formatted_posts_string}
    
    EVALUATION PROCESS:
    1. Read each post carefully
    2. Assess if it matches your lead generation criteria
    3. Consider if you can provide genuine value (80%) + subtle promotion (20%)
    4. Only select posts where you can make a meaningful contribution
    
    RETURN JSON FORMAT:
    {{"post_ids": [Postnumber1, Postnumber2, ...]}}
    
    IMPORTANT:
    - Return empty array {{"post_ids": []}} if no posts meet criteria
    - Maximum 3 posts per response
    - Quality over quantity - only select the best opportunities
    """
    
    messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
    return messages

def lead_generation_prompt_2(product_data, posts):
    system_prompt = f"""
    You are an expert lead generation specialist analyzing Reddit posts for marketing opportunities.
    
    PRODUCT ANALYSIS:
    - Product: {product_data['name']}
    - Target Audience: {product_data['target_audience']}
    - Problem Solved: {product_data['problem_solved']}
    - Description: {product_data['description']}
    
    LEAD GENERATION CRITERIA:
    1. **Perfect Problem Match**: Post directly discusses the exact problem your product solves
    2. **Active Engagement**: Post has good upvotes and comments (shows community interest)
    3. **Help-Seeking Behavior**: OP is asking for solutions, recommendations, or advice
    4. **Relevant Context**: Post content aligns with your product's value proposition
    5. **Comment-Friendly**: Post encourages discussion and allows helpful responses
    
    COMMENTING STRATEGY (80% Value / 20% Selling):
    - **80% Value**: Provide genuine help, insights, or solutions to their problem
    - **20% Selling**: Subtly mention your product as a relevant solution
    - **Approach**: "Here's how to solve this... [valuable advice]... BTW, I found [product] helpful for this exact issue"
    - **Mention** Product in the comment subtly
    - **Length**: Keep the comment length medium to short
    
    QUALITY STANDARDS:
    - Only select posts where you can provide genuine value
    - Skip posts that are too generic, off-topic, or don't need your solution
    - If no posts meet criteria, return empty array
    - Select at least 5 posts

    RETURN JSON FORMAT:
    {{"comments": [
        {{"[postnumber]": "Your comment for postnumber"}},
        {{"[postnumber]": "Your comment for postnumber"}},
        ...
    ]}}
    - Use the EXACT post number from ===== POST [postnumber] ===== as the key for JSONs
    
    IMPORTANT:
    - Use sequential post numbers (1, 2, 3, etc.)
    - Only include posts where you can provide genuine value
    - Quality over quantity
    """
    
    formatted_posts_string = "\n\n".join(posts)

    user_prompt = f"""
    Analyze these Reddit posts for lead generation opportunities:
    {formatted_posts_string}
    
    EVALUATION PROCESS:
    1. Read each post carefully
    2. Assess if it matches your lead generation criteria
    3. Consider if you can provide genuine value (80%) + subtle promotion (20%)
    4. Only select posts where you can make a meaningful contribution
    """

    messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]

    return messages


    