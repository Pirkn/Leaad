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
    
def karma_helper_prompt(posts):
    # ===== Create System Prompt =====
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'karma_helper_prompt.txt')
    with open(config_path, 'r') as file:
        system_prompt = file.read()
    
    # ===== Create Messages =====
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": posts}
    ]

    return messages