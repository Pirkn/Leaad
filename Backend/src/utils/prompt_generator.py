import base64
import io

class PromptGenerator:
    def __init__(self):
        pass    

    def chat_prompt(self, user_prompt):
        # ===== Create User Prompt =====
        current_user_prompt = user_prompt
        
        # ===== Create System Prompt =====
        with open('Backend/src/config/prompt2.txt', 'r') as file:
            system_prompt = file.read()

        # ===== Create Messages =====
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": current_user_prompt}
        ]

        return messages
    
    
