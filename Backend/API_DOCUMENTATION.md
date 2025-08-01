# Marketing Agent API Documentation

## Overview

The Marketing Agent API is a Flask-based REST API that provides AI-powered marketing tools for product analysis and content generation. The API uses Supabase for authentication and integrates with Gemini AI for content generation.

**Base URL:** `http://localhost:5000`  
**API Version:** v1  
**Authentication:** Supabase JWT Tokens

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

Generate product details by analyzing a website URL using AI.

**Headers:**
- `Content-Type: application/json`

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

**Example Usage:**
```bash
curl -X POST http://localhost:5000/generate-product-details \
  -H "Content-Type: application/json" \
  -d '{
    "product_website_link": "https://www.waitlistsnow.com"
  }'
```

## Reddit Operations

### POST /generate-reddit-post

Generate Reddit marketing posts using AI based on product information.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "product_name": "WaitlistNow",
  "product_description": "No-code waitlist builder for entrepreneurs",
  "product_target_audience": "Entrepreneurs and SaaS founders",
  "product_main_benefit": "Validate ideas quickly without coding",
  "product_website_link": "https://www.waitlistsnow.com"
}
```

**Response:**
```json
{
  "response": "Generated Reddit post content..."
}
```

**Example Usage:**
```bash
curl -X POST http://localhost:5000/generate-reddit-post \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "WaitlistNow",
    "product_description": "No-code waitlist builder for entrepreneurs",
    "product_target_audience": "Entrepreneurs and SaaS founders",
    "product_main_benefit": "Validate ideas quickly without coding",
    "product_website_link": "https://www.waitlistsnow.com"
  }'
```

### GET /get-viral-posts

Retrieve a collection of viral Reddit posts for reference and inspiration.

**Response:**
```json
[
  {
    "title": "Viral Post Title",
    "content": "Post content...",
    "subreddit": "r/entrepreneur",
    "upvotes": 1500,
    "comments": 200
  }
]
```

**Example Usage:**
```bash
curl -X GET http://localhost:5000/get-viral-posts
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request data"
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
  "message": "Endpoint not found"
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
- `http://localhost:5173`
- `http://127.0.0.1:5500`
- `http://localhost:5500`

## Environment Variables

Required environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security Considerations

1. **Authentication**: All sensitive endpoints require valid Supabase JWT tokens
2. **CORS**: Configured to allow specific origins only
3. **Input Validation**: Implement proper input validation for all endpoints
4. **HTTPS**: Use HTTPS in production environments

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

## Support

For API support or questions, please refer to the project documentation or create an issue in the repository. 