import base64
import io

class PromptGenerator:
    def __init__(self):
        pass    

    def reddit_post_generator_prompt(self, user_prompt):
        # ===== Create User Prompt =====
        current_user_prompt = user_prompt
        
        # ===== Create System Prompt =====
        with open('Backend/src/config/reddit_post_generator_prompt.txt', 'r') as file:
            system_prompt = file.read()

        # ===== Create Messages =====
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": current_user_prompt}
        ]

        return messages
    
    def generate_product_details_prompt(self, website_content):
        # ===== Create System Prompt =====
        with open('Backend/src/config/product_details_prompt.txt', 'r') as file:
            system_prompt = file.read()

        # ===== Create Messages =====
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": website_content}
        ]

        return messages
    
