# Marketing Agent API Documentation

## Overview

The Marketing Agent API is a Flask-based REST API that provides AI-powered marketing tools for product analysis and content generation. The API uses Supabase for authentication and integrates with Gemini AI for content generation, Reddit API for karma optimization, and image generation capabilities.

**Base URL:** `http://localhost:5000`  
**API Version:** v1  
**Authentication:** Supabase JWT Tokens  
**Framework:** Flask with Flask-Smorest for OpenAPI documentation

## Authentication

The API uses Supabase JWT tokens for authentication. Protected endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer <your-supabase-jwt-token>
```

## Health Check

### GET /health

Check if the API is running.

**Response:**

```json
{
  "status": "healthy"
}
```

## Protected Routes

### GET /protected

Test endpoint for authenticated users.

**Headers:**

- `Authorization: Bearer <jwt-token>` (Required)

**Response:**

```json
{
  "message": "This is a protected route",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  }
}
```

## Product Operations

### POST /generate-product-details

Generate product details by analyzing a website URL using AI. This endpoint scrapes the website content and uses Gemini AI to extract key product information.

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <jwt-token>` (Required)

**Request Body:**

```json
{
  "product_website_link": "https://example.com"
}
```

**Response:**

```json
{
  "target_audience": "Entrepreneurs and SaaS founders",
  "description": "A no-code waitlist builder that helps entrepreneurs validate ideas and build early audiences...",
  "problem_solved": "Difficulty in launching new concepts without wasting time on unvalidated MVPs"
}
```

**Process:**
1. Scrapes website content using BeautifulSoup
2. Converts HTML to markdown format for better AI processing
3. Uses Gemini AI to analyze content and extract product details
4. Returns structured JSON with target audience, description, and problem solved

**Example Usage:**

```bash
curl -X POST http://localhost:5000/generate-product-details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "product_website_link": "https://www.waitlistsnow.com"
  }'
```

### POST /create_product

Create a new product for the authenticated user.

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <jwt-token>` (Required)

**Request Body:**

```json
{
  "name": "Product Name",
  "url": "https://example.com",
  "description": "Product description",
  "target_audience": "Target audience description",
  "problem_solved": "Problem this product solves"
}
```

**Response:**

```json
{
  "message": "Product created successfully",
  "product": {
    "id": "uuid",
    "user_id": "user-uuid",
    "name": "Product Name",
    "url": "https://example.com",
    "description": "Product description",
    "target_audience": "Target audience description",
    "problem_solved": "Problem this product solves",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Validation:**
- `name` field is required
- All other fields are optional
- User ID is automatically extracted from JWT token

**Example Usage:**

```bash
curl -X POST http://localhost:5000/create_product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "name": "My Awesome Product",
    "url": "https://myproduct.com",
    "description": "A revolutionary product that solves real problems",
    "target_audience": "Entrepreneurs and small business owners",
    "problem_solved": "Complex workflow automation"
  }'
```

### GET /products

Get all products for the authenticated user.

**Headers:**

- `Authorization: Bearer <jwt-token>` (Required)

**Response:**

```json
{
  "products": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "name": "Product Name",
      "url": "https://example.com",
      "description": "Product description",
      "target_audience": "Target audience description",
      "problem_solved": "Problem this product solves",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Features:**
- Returns products ordered by creation date (newest first)
- Only returns products belonging to the authenticated user
- Includes all product metadata

**Example Usage:**

```bash
curl -X GET http://localhost:5000/products \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Reddit Operations

### POST /generate-reddit-post

Generate Reddit marketing posts using AI based on product information stored in the database. Creates organic, value-driven posts that feel authentic rather than promotional.

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <jwt-token>` (Required)

**Request Body:**

```json
{
  "product_id": "product-uuid"
}
```

**Response:**

```json
{
  "response": [
    {
      "r/subreddit": "entrepreneur",
      "Title": "What I learned about validating startup ideas",
      "Post": "After spending 6 months building features nobody wanted, I finally figured out the right approach...",
      "Reasoning": "This subreddit focuses on entrepreneurship and startup validation"
    }
  ]
}
```

**Process:**
1. Retrieves product details from database (ensuring user ownership)
2. Uses sophisticated prompt engineering to generate authentic Reddit posts
3. Creates 5 different post variations for different subreddits
4. Focuses on value-driven content with natural product mentions

**Example Usage:**

```bash
curl -X POST http://localhost:5000/generate-reddit-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "product_id": "your-product-uuid"
  }'
```

### POST /create_karma_comment

Generate high-quality Reddit comments for karma optimization based on trending posts from popular subreddits.

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <jwt-token>` (Required)

**Request Body:**

```json
{}
```

**Response:**

```json
{
  "response": [
    {
      "post_url": "https://www.reddit.com/r/ask/comments/abc123/title/",
      "post_title": "Original post title",
      "subreddit": "ask",
      "engagement_score": "high",
      "comment": "Your authentic, value-adding comment that fits the subreddit culture",
      "reasoning": "Brief explanation of why this comment will perform well"
    }
  ]
}
```

**Process:**
1. Analyzes rising posts from popular subreddits (ask, help, askreddit, mildlyinteresting, nostupidquestions)
2. Extracts top comments and engagement patterns
3. Uses AI to generate authentic, value-adding comments
4. Focuses on community fit and cultural alignment

**Example Usage:**

```bash
curl -X POST http://localhost:5000/create_karma_comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{}'
```

### POST /create_karma_post

Create a complete Reddit post with image for karma optimization. Generates content, creates an image, and provides the complete post data.

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <jwt-token>` (Required)

**Request Body:**

```json
{}
```

**Response:**

```json
{
  "title": "Generated post title",
  "subreddit": "aww",
  "description": "Generated post description",
  "image_url": "data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Process:**
1. Fetches random cat image from external API
2. Converts image to WebP format for optimization
3. Uses AI to generate appropriate title based on image content
4. Returns complete post data with base64-encoded image

**Example Usage:**

```bash
curl -X POST http://localhost:5000/create_karma_post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{}'
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Missing required field: name"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Product not found or access denied"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite development server)
- `http://127.0.0.1:5500` (Live Server)
- `http://localhost:5500` (Live Server alternative)

## Environment Variables

Required environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
REDDIT_CLIENT=your_reddit_client_id
REDDIT_SECRET=your_reddit_client_secret
```

## Dependencies

The API uses the following main dependencies:

```
Flask==2.3.3
flask-smorest==0.42.0
flask-cors==4.0.0
python-dotenv==1.0.0
openai==1.3.0
supabase==2.0.0
requests==2.31.0
beautifulsoup4==4.12.2
tiktoken==0.5.2
praw
```

## Project Structure

```
Backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── API_DOCUMENTATION.md  # This documentation
└── src/
    ├── config/           # AI prompt configurations
    │   ├── karma_helper_prompt.txt
    │   ├── product_details_prompt.txt
    │   └── reddit_post_generator_prompt.txt
    ├── routes/          # API route blueprints
    │   ├── product.py   # Product-related endpoints
    │   └── reddit.py    # Reddit-related endpoints
    └── utils/           # Utility modules
        ├── auth.py      # Authentication utilities
        ├── cost_calculator.py  # Cost calculation utilities
        ├── image_handling.py   # Image processing and storage
        ├── models.py    # AI model integration
        ├── prompt_generator.py  # Prompt generation
        ├── reddit_helpers.py    # Reddit API helpers
        └── website_scraper.py   # Web scraping utilities
```

## Database Schema

### Products Table

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `name` (Text, Required)
- `url` (Text, Optional)
- `description` (Text, Optional)
- `target_audience` (Text, Optional)
- `problem_solved` (Text, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Karma Posts Table

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `subreddit` (Text)
- `title` (Text)
- `description` (Text, Optional)
- `storage_path` (Text, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## AI Integration Details

### Gemini AI Configuration
- Uses OpenAI-compatible API endpoint for Gemini 2.5 Flash
- Structured JSON responses for consistent data handling
- Real-time cost calculation and tracking
- Temperature set to 0.0 for consistent outputs

### Prompt Engineering
- External prompt files for easy updates and version control
- Context-aware message formatting
- Multi-modal support (text + images)
- Sophisticated prompt strategies for different content types

### Cost Management
- Real-time token counting using tiktoken
- Gemini pricing calculation ($0.3 per 1M input tokens, $2.5 per 1M output tokens)
- Usage tracking and reporting
- Cost optimization through efficient prompt design

## Security Considerations

1. **Authentication**: All sensitive endpoints require valid Supabase JWT tokens
2. **CORS**: Configured to allow specific origins only
3. **Input Validation**: Comprehensive validation for all endpoints
4. **HTTPS**: Use HTTPS in production environments
5. **User Isolation**: Products and karma posts are isolated by user_id to prevent unauthorized access
6. **Image Security**: Generated images are stored securely with signed URLs that expire
7. **JWT Verification**: Proper audience validation and token expiration checks

## Development

### Running the API

```bash
cd Backend
python app.py
```

The API will be available at `http://localhost:5000`

### API Documentation

The API uses Flask-Smorest for automatic OpenAPI documentation. Access the interactive documentation at:

- Swagger UI: `http://localhost:5000/swagger`
- ReDoc: `http://localhost:5000/redoc`

### Development Features
- Hot reload for development
- Comprehensive error handling and logging
- Automatic API documentation generation
- CORS support for frontend integration

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use, especially for AI-powered endpoints.

## Performance Considerations

1. **AI API Calls**: Monitor and optimize Gemini API usage
2. **Database Queries**: Efficient queries with proper indexing
3. **Image Processing**: WebP optimization for faster loading
4. **Caching**: Consider implementing caching for frequently accessed data

## Support

For API support or questions, please refer to the project documentation or create an issue in the repository.
