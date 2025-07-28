from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import jsonify, request
from dotenv import load_dotenv
import json
from src.utils.auth import verify_supabase_token

load_dotenv()

blp = Blueprint('routes', __name__, description='Routes Operations')

@blp.route('/')
def index():
    return jsonify({'message': 'Hello, World!'})




