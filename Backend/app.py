from flask import Flask, jsonify
from flask_smorest import Api
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv(override=True)


def create_app():
    app = Flask(__name__)

    # Basic Flask configuration
    app.config["API_TITLE"] = "API with Supabase Auth"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"

    # Supabase configuration
    app.config['SUPABASE_URL'] = os.getenv('SUPABASE_URL')
    app.config['SUPABASE_JWT_SECRET'] = os.getenv('SUPABASE_JWT_SECRET')

    # CORS configuration for frontend
    allowed_origins = [
        "http://localhost:5173", 
        "http://127.0.0.1:5500", 
        "http://localhost:5500",
        os.getenv('FRONTEND_URL')
    ]
    
    CORS(app,
         supports_credentials=True,
         resources={
             r"/*": {
                 "origins": allowed_origins,
                 "methods": ["GET", "POST", "OPTIONS", "PATCH", "DELETE", "PUT"],
                 "allow_headers": ["Content-Type", "Authorization"]
             }
         })

    api = Api(app)

    # Example public route
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy'})
    
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Welcome to the AI Lead Generator',
            'status': 'running'
        })

    # Register your blueprints here
    from src.routes.product import blp as product_blp
    from src.routes.reddit import blp as reddit_blp
    from src.routes.leads import blp as leads_blp
    from src.routes.onboarding import blp as onboarding_blp
    api.register_blueprint(product_blp)
    api.register_blueprint(reddit_blp)
    api.register_blueprint(leads_blp)
    api.register_blueprint(onboarding_blp)

    return app

app = create_app()
if __name__ == '__main__':
    app.run()
