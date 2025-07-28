import base64
import io

class PromptGenerator:
    def __init__(self):
        pass    

    def chat_prompt(self, user_prompt):
        # ===== Create User Prompt =====
        current_user_prompt = user_prompt
        
        # ===== Create System Prompt =====
        system_prompt = """You are a helpful assistant. You are given a user prompt and you need to respond to the user's prompt."""

        # ===== Create Messages =====
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": current_user_prompt}
        ]

        return messages
    
    
