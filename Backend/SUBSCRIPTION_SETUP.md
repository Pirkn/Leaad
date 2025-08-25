# Subscription System Setup Guide

This guide explains how to set up and use the subscription system with Paddle payment processor.

## Database Setup

### 1. Run the Database Schema

Execute the SQL commands in `subscription_schema.sql` in your Supabase SQL editor:

```sql
-- Copy and paste the contents of subscription_schema.sql
-- This will create the necessary tables and insert the default Pro Plan
```

### 2. Update the Paddle Product ID

After creating your product in Paddle, update the product ID in the database:

```sql
UPDATE subscription_plans 
SET paddle_product_id = 'your_actual_paddle_product_id' 
WHERE name = 'Pro Plan';
```

## Paddle Configuration

### 1. Create a Paddle Account

1. Go to [paddle.com](https://paddle.com) and create an account
2. Complete the verification process
3. Set up your business information

### 2. Create a Product

1. In Paddle Dashboard, go to **Catalog** > **Products**
2. Create a new product:
   - Name: "Pro Plan"
   - Price: $19.00
   - Billing cycle: Monthly
   - Trial period: 3 days
3. Copy the Product ID (you'll need this for the database)

### 3. Get API Credentials

1. In Paddle Dashboard, go to **Developer Tools** > **Authentication**
2. Copy your **Vendor ID** and **Vendor Auth Code**
3. These will be used by the Paddle SDK for API calls

### 4. Configure Webhooks

1. In Paddle Dashboard, go to **Developer Tools** > **Webhooks**
2. Add a new webhook endpoint:
   - URL: `https://your-domain.com/api/subscription/webhook`
   - Events to listen for:
     - `subscription.created`
     - `subscription.updated`
     - `subscription.cancelled`
     - `subscription.paused`
     - `subscription.resumed`
     - `transaction.completed`
3. Copy the webhook secret (you'll need this for environment variables)

### 4. Environment Variables

Add these to your `.env` file:

```env
# Paddle Configuration
PADDLE_VENDOR_ID=your_vendor_id
PADDLE_VENDOR_AUTH_CODE=your_auth_code
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_ENVIRONMENT=sandbox  # or production

# Supabase Configuration (if not already set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

## Backend Integration

### 1. Available Routes

The subscription system provides these endpoints:

#### Public Routes
- `GET /api/subscription/plans` - Get available subscription plans

#### Protected Routes (require authentication)
- `POST /api/subscription/create-checkout` - Create Paddle checkout session
- `GET /api/subscription/current` - Get current user's subscription
- `POST /api/subscription/cancel` - Cancel user's subscription
- `POST /api/subscription/check-access` - Check access to specific feature
- `GET /api/subscription/usage` - Get usage statistics
- `POST /api/subscription/increment-usage` - Increment usage for a feature

#### Webhook Route
- `POST /api/subscription/webhook` - Handle Paddle webhook events (using SDK)

### 2. Using Subscription Decorators

To protect a route with subscription requirements:

```python
from src.utils.subscription_utils import require_subscription

@blp.route('/your-protected-route')
class YourProtectedRoute(MethodView):
    @verify_supabase_token
    @require_subscription('unlimited_leads')  # Feature name from plan
    def post(self):
        # Your route logic here
        pass
```

### 3. Manual Subscription Checks

For more complex scenarios, use manual checks:

```python
from src.utils.subscription_utils import check_subscription_access, increment_usage

@blp.route('/manual-check')
class ManualCheck(MethodView):
    @verify_supabase_token
    def post(self):
        user_id = g.current_user['id']
        
        # Check access
        access_check = check_subscription_access(user_id, 'unlimited_leads')
        if not access_check['has_access']:
            return jsonify({'error': access_check['reason']}), 403
        
        # Your logic here...
        
        # Increment usage
        increment_usage(user_id, 'leads_generated')
```

## Subscription Plan Features

The default Pro Plan includes these features:

- `unlimited_leads` - Access to lead generation
- `unlimited_posts` - Access to post creation
- `karma_content` - Access to karma content generation
- `advanced_templates` - Access to advanced templates

## Testing the System

### 1. Test Database Setup

```bash
# Check if tables were created
curl -X GET "https://your-api.com/api/subscription/plans"
```

### 2. Test Subscription Check

```bash
# Check current subscription (requires auth token)
curl -X GET "https://your-api.com/api/subscription/current" \
  -H "Authorization: Bearer your_jwt_token"
```

### 3. Test Feature Access

```bash
# Check access to a feature (requires auth token)
curl -X POST "https://your-api.com/api/subscription/check-access" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"feature": "unlimited_leads"}'
```

## Webhook Testing

### 1. Using Paddle's Test Events

Paddle provides test webhook events. You can trigger them from the Paddle dashboard to test your webhook handler.

### 2. Local Testing

For local development, use tools like ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 5000

# Use the ngrok URL in Paddle webhook configuration
```

## Frontend Integration

### 1. Create Checkout Session

```javascript
// Create a checkout session for subscription
const response = await fetch('/api/subscription/create-checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const { checkout_url, transaction_id } = await response.json();

// Redirect user to Paddle checkout
window.location.href = checkout_url;
```

### 2. Check Subscription Status

```javascript
// Get current subscription
const response = await fetch('/api/subscription/current', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { has_subscription, subscription } = await response.json();
```

### 3. Cancel Subscription

```javascript
// Cancel user's subscription
const response = await fetch('/api/subscription/cancel', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const { success, message } = await response.json();
```

### 4. Check Feature Access

```javascript
// Check if user can access a feature
const response = await fetch('/api/subscription/check-access', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ feature: 'unlimited_leads' })
});
const { has_access, reason } = await response.json();
```

### 5. Handle Subscription Required Errors

```javascript
try {
  const response = await fetch('/api/protected-feature', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.status === 403) {
    const error = await response.json();
    if (error.error === 'Subscription required') {
      // Redirect to pricing page
      window.location.href = '/pricing';
    }
  }
} catch (error) {
  console.error('Error:', error);
}
```

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is accessible
   - Verify webhook secret is correct
   - Check server logs for errors

2. **Subscription status not updating**
   - Verify webhook is properly configured
   - Check database connection
   - Review webhook handler logs

3. **Feature access denied**
   - Check if user has active subscription
   - Verify feature is included in plan
   - Check trial period hasn't expired

### Debugging

Enable detailed logging by setting the log level:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Security Considerations

1. **Webhook Verification**: Always verify webhook signatures
2. **Database Security**: Use Row Level Security (RLS) policies
3. **API Security**: Validate all inputs and use proper authentication
4. **Environment Variables**: Keep sensitive data in environment variables

## Next Steps

1. Set up Paddle account and create product
2. Run database schema
3. Configure environment variables
4. Test webhook integration
5. Integrate subscription checks into existing routes
6. Update frontend to handle subscription requirements
