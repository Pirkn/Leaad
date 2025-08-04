# Marketing Agent Application Overview

## What is Marketing Agent?

Marketing Agent is an AI-powered marketing automation platform that helps users create and manage marketing content, particularly focused on Reddit marketing and product analysis. The application combines web scraping, AI content generation, and Reddit API integration to provide a comprehensive marketing toolkit.

## Core Architecture

### Technology Stack
- **Backend**: Flask (Python) with Flask-Smorest for API documentation
- **Authentication**: Supabase JWT tokens
- **AI Integration**: Google Gemini AI (via OpenAI-compatible API)
- **Database**: Supabase (PostgreSQL)
- **External APIs**: Reddit API (PRAW), Image generation APIs
- **Image Processing**: Pillow for WebP conversion and optimization

### Application Structure
```
Backend/
├── app.py                 # Main Flask application entry point
├── requirements.txt       # Python dependencies
├── src/
│   ├── config/           # AI prompt configurations
│   ├── routes/           # API endpoint blueprints
│   └── utils/            # Core business logic modules
```

## Core Functionality

### 1. Product Analysis & Management

**Purpose**: Analyze product websites and create detailed product profiles for marketing campaigns.

**Key Features**:
- **Website Scraping**: Extracts structured content from product websites using BeautifulSoup
- **AI Analysis**: Uses Gemini AI to analyze website content and generate product descriptions
- **Product Storage**: Stores product information in Supabase database with user isolation
- **Content Extraction**: Converts HTML to markdown format for better AI processing

**Workflow**:
1. User provides a product website URL
2. System scrapes the website and extracts headings, content, and metadata
3. AI analyzes the content to identify target audience, problem solved, and description
4. Product information is stored in the database for future marketing campaigns

### 2. Reddit Marketing Automation

**Purpose**: Generate high-quality Reddit posts and comments for product promotion and karma building.

**Key Features**:
- **Organic Post Generation**: Creates Reddit posts that feel authentic, not promotional
- **Karma Optimization**: Generates comments for trending posts to build account karma
- **Image Generation**: Creates and optimizes images for Reddit posts
- **Subreddit Analysis**: Analyzes trending posts to understand community dynamics

**Workflow**:
1. **Product Posts**: Uses stored product information to generate marketing posts for relevant subreddits
2. **Karma Comments**: Analyzes rising posts from popular subreddits and generates engaging comments
3. **Karma Posts**: Creates complete posts with images for karma-building purposes

### 3. AI Content Generation

**Purpose**: Leverage Gemini AI to create high-quality, contextually appropriate content.

**Key Features**:
- **Prompt Engineering**: Sophisticated prompt templates for different content types
- **Cost Tracking**: Real-time cost calculation for AI API calls
- **Response Formatting**: Structured JSON responses for consistent data handling
- **Multi-modal Support**: Handles both text and image inputs

**Content Types**:
- Product descriptions and analysis
- Reddit marketing posts
- Engaging Reddit comments
- Image-based post titles

### 4. Authentication & Security

**Purpose**: Secure user authentication and data isolation.

**Implementation**:
- **JWT Verification**: Validates Supabase JWT tokens for all protected endpoints
- **User Isolation**: All data is scoped to the authenticated user
- **CORS Protection**: Configured to allow specific frontend origins only
- **Input Validation**: Comprehensive validation for all user inputs

## Detailed Module Breakdown

### Authentication (`src/utils/auth.py`)
- JWT token verification using Supabase secrets
- User context storage in Flask's `g` object
- Comprehensive error handling for expired/invalid tokens

### AI Integration (`src/utils/models.py`)
- Gemini AI client configuration
- Cost calculation and tracking
- Structured response handling with JSON formatting

### Content Generation (`src/utils/prompt_generator.py`)
- Dynamic prompt assembly from configuration files
- Context-aware message formatting
- Multi-modal content support (text + images)

### Web Scraping (`src/utils/website_scraper.py`)
- BeautifulSoup-based HTML parsing
- Markdown conversion for better AI processing
- Content structure preservation (headings, sections)

### Reddit Integration (`src/utils/reddit_helpers.py`)
- PRAW-based Reddit API integration
- Trending post analysis
- Comment extraction and formatting
- Image generation for karma posts

### Image Processing (`src/utils/image_handling.py`)
- WebP conversion and optimization
- Supabase storage integration
- Signed URL generation for secure access

### Cost Management (`src/utils/cost_calculator.py`)
- Real-time token counting using tiktoken
- Gemini pricing calculation
- Usage tracking and reporting

## API Endpoints

### Product Management
- `POST /generate-product-details`: Analyze website and generate product info
- `POST /create_product`: Store new product in database
- `GET /products`: Retrieve user's products

### Reddit Marketing
- `POST /generate-reddit-post`: Create marketing posts for products
- `POST /create_karma_comment`: Generate comments for trending posts
- `POST /create_karma_post`: Create complete posts with images

## Database Schema

### Products Table
- User-scoped product storage
- Comprehensive product metadata
- Timestamp tracking for analytics

### Karma Posts Table
- User-scoped karma post storage
- Image storage path tracking
- Subreddit and engagement data

## AI Prompt Strategy

The application uses sophisticated prompt engineering to ensure high-quality, contextually appropriate content:

### Product Analysis Prompt
- Focuses on factual, objective product descriptions
- Avoids marketing language and superlatives
- Extracts key information: target audience, problem solved, description

### Reddit Marketing Prompt
- Emphasizes organic, value-driven content
- Balances product mentions with genuine insights
- Uses authentic Reddit voice and culture

### Karma Optimization Prompt
- Analyzes trending posts for engagement patterns
- Generates authentic, value-adding comments
- Focuses on community fit and cultural alignment

## Security Considerations

1. **Authentication**: All sensitive endpoints require valid JWT tokens
2. **User Isolation**: Data is scoped to authenticated users only
3. **Input Validation**: Comprehensive validation for all user inputs
4. **CORS Protection**: Configured to allow specific origins only
5. **Image Security**: Generated images stored with signed URLs that expire

## Cost Management

The application includes sophisticated cost tracking:
- Real-time token counting for input/output
- Gemini pricing calculation
- Usage reporting and monitoring
- Cost optimization through efficient prompt design

## Scalability Features

1. **Modular Architecture**: Clear separation of concerns
2. **Blueprint Organization**: Route organization for easy scaling
3. **Configuration Management**: External prompt files for easy updates
4. **Error Handling**: Comprehensive error handling and logging
5. **Database Optimization**: Efficient queries with proper indexing

## Development Workflow

1. **Environment Setup**: Configure Supabase and API keys
2. **Local Development**: Flask development server with hot reload
3. **API Documentation**: Automatic OpenAPI/Swagger documentation
4. **Testing**: Comprehensive error handling and validation

## Key Business Logic

### Content Generation Strategy
The application prioritizes authenticity over promotion, ensuring that:
- Reddit posts feel like genuine user experiences
- Comments add real value to discussions
- Product mentions are contextual and natural
- Content follows community guidelines and culture

### Karma Building Approach
- Analyzes trending posts for engagement patterns
- Generates comments that encourage discussion
- Uses community-specific language and tone
- Focuses on quality over quantity

### Product Analysis Methodology
- Extracts structured content from websites
- Uses AI to identify key product attributes
- Creates factual, objective descriptions
- Enables targeted marketing campaigns

## Integration Points

### External Services
- **Supabase**: Authentication, database, and file storage
- **Google Gemini AI**: Content generation and analysis
- **Reddit API**: Post analysis and community engagement
- **Image APIs**: Content generation for visual posts

### Frontend Integration
- RESTful API design for easy frontend integration
- CORS configuration for web application support
- Structured JSON responses for consistent data handling
- Comprehensive error responses for user feedback

This Marketing Agent application represents a sophisticated approach to AI-powered marketing automation, combining web scraping, content generation, and social media optimization into a comprehensive marketing toolkit. 