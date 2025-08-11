import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from src.utils.cost_calculator import GeminiCostCalculator
import openai
import os
import httpx

load_dotenv() 
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

class Model:
    def __init__(self):
        self.gemini_api_key = GEMINI_API_KEY
        self.gemini_client = genai.Client(api_key=GEMINI_API_KEY)

        # Initialize OpenAI client for Groq
        try:
            self.openai_client = openai.OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=GROQ_API_KEY
            )
        except TypeError:
            # Fallback if httpx removed the proxies kwarg in current environment
            http_client = httpx.Client()
            self.openai_client = openai.OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=GROQ_API_KEY,
                http_client=http_client
            )
        
        self.cost_calculator = GeminiCostCalculator("gemini-2.5-flash")


    def _format_messages_for_gemini(self, messages):
        """Convert messages from OpenAI format to Gemini format"""
        formatted_contents = []
        system_message = ""
        
        for message in messages:
            role = message.get('role', 'user')
            content = message.get('content', '')
            
            # Collect system message to prepend to first user message
            if role == 'system':
                system_message = content
                continue
            elif role == 'user':
                # Prepend system message to first user message if exists
                if system_message and not formatted_contents:
                    content = f"{system_message}\n\n{content}"
                formatted_contents.append({
                    "role": "user",
                    "parts": [{"text": content}]
                })
            elif role == 'assistant':
                formatted_contents.append({
                    "role": "model",
                    "parts": [{"text": content}]
                })
        
        return formatted_contents

    def gemini_chat_completion(self, messages): 

        formatted_contents = self._format_messages_for_gemini(messages)
        # Format messages for Gemini API
        delay = [0, 5, 10, 15, 20]
        # ===== Generate Response with Retry Logic =====
        for i in delay:
            try: 
                response = self.gemini_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=formatted_contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
                    )
                )
                try:
                    print("Thoughts tokens:",response.usage_metadata.thoughts_token_count)
                except:
                    pass

                return response.text
            except Exception as e:
                print(f"Error generating response: {e}")
                time.sleep(i)
                continue

        return "{}"
    
    def gemini_lead_checking(self, messages):
        # Format messages for Gemini API
        delay = [0, 5, 10, 15, 20]

        for i in delay:
            try:
                response = self.openai_client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=messages,
                    temperature=0.0,
                    stream=False,
                    response_format={"type": "json_object"}
                )

                return response.choices[0].message.content
            except Exception as e:
                print(f"Error generating response: {e}")
                time.sleep(i)
                continue

        return "{}"