"""
Rate Limiting Configuration for API Endpoints

This module provides rate limiting functionality using Flask-Limiter.
Different endpoints have different rate limits based on their resource intensity.
"""

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import g
from dotenv import load_dotenv

load_dotenv()

def get_user_id():
    """
    Get user ID for rate limiting key.
    Falls back to IP address if user is not authenticated.
    """
    if hasattr(g, 'current_user') and g.current_user:
        return f"user:{g.current_user['id']}"
    return f"ip:{get_remote_address()}"


limiter = Limiter(
    key_func=get_user_id,
    headers_enabled=True,  
)


RATE_LIMITS = {
    'POST_GENERATION': '50 per hour', 
    'KARMA_COMMENT_GENERATION': '50 per hour',
    'KARMA_POST_GENERATION': '50 per hour',

    'ONBOARDING_LEAD_GENERATION': '10 per hour',

    'PRODUCT_ANALYSIS': '20 per hour',

    'DB_WRITE': '200 per hour', 
    'DB_READ': '500 per hour', 
} 