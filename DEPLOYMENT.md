# Railway Deployment Guide

This guide will help you deploy both the Backend and Frontend services to Railway.

## Prerequisites

1. Railway account (https://railway.app)
2. GitHub repository with the `prod` branch
3. Supabase project configured
4. OpenAI API key
5. Reddit API credentials

## Backend Deployment

### 1. Create Backend Service on Railway

1. Go to Railway Dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and the `prod` branch
4. Choose the `Backend` directory as the source
5. Railway will automatically detect it as a Python project

### 2. Configure Environment Variables

Add the following environment variables in Railway:

```
SUPABASE_URL=your_supabase_url
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
OPENAI_API_KEY=your_openai_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=your_reddit_user_agent
FRONTEND_URL=https://your-frontend-domain.railway.app
FLASK_ENV=production
PORT=5000
```

### 3. Deploy Backend

1. Railway will automatically build and deploy your backend
2. Note the generated domain (e.g., `https://your-backend-name.railway.app`)

## Frontend Deployment

### 1. Create Frontend Service on Railway

1. In the same Railway project, click "New Service" → "GitHub Repo"
2. Select the same repository and `prod` branch
3. Choose the `Frontend` directory as the source
4. Railway will detect it as a Node.js project

### 2. Configure Environment Variables

Add the following environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=https://your-backend-domain.railway.app
```

### 3. Deploy Frontend

1. Railway will automatically build and deploy your frontend
2. Note the generated domain (e.g., `https://your-frontend-name.railway.app`)

## Update CORS Configuration

After both services are deployed:

1. Go to your Backend service in Railway
2. Update the `FRONTEND_URL` environment variable with your actual frontend domain
3. Redeploy the backend service

## Environment Variables Reference

### Backend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `REDDIT_CLIENT_ID` | Reddit API client ID | Yes |
| `REDDIT_CLIENT_SECRET` | Reddit API client secret | Yes |
| `REDDIT_USER_AGENT` | Reddit API user agent | Yes |
| `FRONTEND_URL` | Frontend domain for CORS | Yes |
| `FLASK_ENV` | Flask environment (production) | Yes |
| `PORT` | Port for the application | No (default: 5000) |

### Frontend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_API_BASE_URL` | Backend API URL | Yes |

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` is correctly set in backend environment variables
2. **Build Failures**: Check that all dependencies are in `requirements.txt` (backend) and `package.json` (frontend)
3. **Environment Variables**: Ensure all required environment variables are set in Railway
4. **Port Issues**: Railway automatically sets the `PORT` environment variable

### Health Checks

- Backend health check: `https://your-backend-domain.railway.app/health`
- Frontend health check: `https://your-frontend-domain.railway.app/`

## Monitoring

1. Use Railway's built-in logging to monitor your applications
2. Set up alerts for service failures
3. Monitor resource usage in Railway dashboard

## Scaling

Railway automatically scales your services based on traffic. You can also manually adjust resources in the Railway dashboard.
