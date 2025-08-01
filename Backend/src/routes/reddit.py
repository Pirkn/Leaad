from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import jsonify, request
from dotenv import load_dotenv
import json
from src.utils.auth import verify_supabase_token
from src.utils.prompt_generator import PromptGenerator
from src.utils.models import Model

load_dotenv()

blp = Blueprint('Reddit', __name__, description='Reddit Operations')

@blp.route('/generate-reddit-post')
class GenerateRedditPost(MethodView):
    def post(self):
        data = request.get_json()
        
        product_name = data.get('product_name')
        product_description = data.get('product_description')
        product_target_audience = data.get('product_target_audience')
        product_main_benefit = data.get('product_main_benefit')
        product_website_link = data.get('product_website_link')

        user_prompt = f"""
        Product/app name: {product_name}
        One-line description: {product_description}
        Target audience: {product_target_audience}
        Main benefit/problem it solves: {product_main_benefit}
        Website/app store link: {product_website_link}
        """

        print(user_prompt)

        prompt_generator = PromptGenerator()
        messages = prompt_generator.reddit_post_generator_prompt(user_prompt)

        model = Model()
        response = model.gemini_chat_completion(messages)

        return jsonify({'response': response})

@blp.route('/get-viral-posts')
class GetViralPosts(MethodView):
    def get(self):
        # Reads viral_posts.json file
        with open('Backend/src/data/viral_posts.json', 'r', encoding='utf-8') as file:
            viral_posts = json.load(file)
            return jsonify(viral_posts['viral_posts'])


# Product/app name
# One-line description (what it does)
# Target audience (who uses it)
# Main benefit/problem it solves
# Website/app store link


