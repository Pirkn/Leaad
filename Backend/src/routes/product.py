from flask.views import MethodView
from flask_smorest import Blueprint
from flask import jsonify, request, g, current_app
from dotenv import load_dotenv
from src.utils.auth import verify_supabase_token
from src.utils.prompt_generator import generate_product_details_prompt
from src.utils.models import Model
from supabase import create_client, Client
from src.utils.website_scraper import get_website_content
import os

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

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

        messages = generate_product_details_prompt(website_content)

        model = Model()
        response = model.gemini_chat_completion(messages)
        return response

@blp.route('/create_product')
class CreateProduct(MethodView):
    @verify_supabase_token
    def post(self):
        """Create a new product for the authenticated user"""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'Missing required field: {field}'}), 400
            
            # Get user ID from authenticated token
            user_id = g.current_user['id']
            
            # Prepare product data
            product_data = {
                'user_id': user_id,
                'name': data['name'],
                'url': data.get('url'),
                'description': data.get('description'),
                'target_audience': data.get('target_audience'),
                'problem_solved': data.get('problem_solved')
            }
            
            # Insert product into database
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            result = supabase.table('products').insert(product_data).execute()
            
            if result.data:
                return jsonify({
                    'message': 'Product created successfully',
                    'product': result.data[0]
                }), 201
            else:
                return jsonify({'error': 'Failed to create product'}), 500
                
        except Exception as e:
            print(f"Error creating product: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500

@blp.route('/products')
class GetProducts(MethodView):
    @verify_supabase_token
    def get(self):
        """Get all products for the authenticated user"""
        try:
            # Get user ID from authenticated token
            user_id = g.current_user['id']
            
            # Query products for the user
            supabase_url = current_app.config['SUPABASE_URL']
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
            supabase: Client = create_client(supabase_url, supabase_key)
            result = supabase.table('products').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
            
            if result.data is not None:
                return jsonify({
                    'products': result.data
                }), 200
            else:
                return jsonify({'error': 'Failed to fetch products'}), 500
                
        except Exception as e:
            print(f"Error fetching products: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500


