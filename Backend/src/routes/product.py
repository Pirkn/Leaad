from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import jsonify, request
from dotenv import load_dotenv
import json
from src.utils.auth import verify_supabase_token
from src.utils.prompt_generator import PromptGenerator
from src.utils.models import Model
import requests
from src.utils.website_scraper import get_website_content

load_dotenv()

blp = Blueprint('Product', __name__, description='Product Operations')

@blp.route('/generate-product-details')
class GenerateProductDetails(MethodView):
    @verify_supabase_token
    def post(self):
        data = request.get_json()
        product_website_link = data.get('product_website_link')
        print(product_website_link)
        # ===== Get Product Details =====
        website_content = get_website_content(product_website_link)

        prompt_generator = PromptGenerator()
        messages = prompt_generator.generate_product_details_prompt(website_content)

        model = Model()
        response = model.gemini_chat_completion(messages)
        return response


