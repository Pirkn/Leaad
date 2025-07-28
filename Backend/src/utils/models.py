import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv() 


class Model:
    def __init__(self):
        self.groq_api_key = os.getenv('GROQ_API_KEY', '')
        self.groq_client = self.get_groq_client()

    def get_groq_client(self):
        return OpenAI(
            api_key=self.groq_api_key,
            base_url="https://api.groq.com/openai/v1"
        )
    
    def groq_chat_completion(self, messages):
        response = self.groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.0,
            stream=False,
        )

        return response.choices[0].message.content

    