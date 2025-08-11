# Marketing Agent API - Onboarding Documentation

## Overview
This document outlines the onboarding flow for the Marketing Agent API, which helps generate product details and find relevant leads from Reddit communities.

## API Endpoints

### 1. Generate Product Details
**Endpoint:** `POST /generate-product-details`  
**Authentication:** Not required  
**Purpose:** Analyzes a product website and extracts key information

#### Request
```json
{
  "product_website_link": "https://example.com/product"
}
```

#### Response
```json
{
  "name": "Dashify",
  "target_audience": "Businesses and individuals who need to analyze and visualize data for decision-making.",
  "description": "Dashify is a data visualization platform that enables users to create interactive dashboards. It processes various data file types, including CSV, JSON, and Excel. The platform offers AI-powered features to simplify dashboard creation, allowing users to upload data and select from multiple visualization options such as bar, line, pie, scatter, and heatmap charts. It provides tools for tracking key metrics and generating actionable insights, with capabilities like chart expansion and high-quality image downloads.",
  "problem_solved": "The product solves the problem of transforming raw data into understandable, actionable insights through interactive visualizations, facilitating data-driven decision-making."
}
```

### 2. Generate Leads from Reddit
**Endpoint:** `POST /onboarding-lead-generation`  
**Authentication:** Not required  
**Purpose:** Finds relevant Reddit posts and comments based on product information

#### Request
```json
{
  "target_audience": "Businesses and individuals who need to analyze and visualize data for decision-making.",
  "description": "Dashify is a data visualization platform that enables users to create interactive dashboards...",
  "problem_solved": "The product solves the problem of transforming raw data into understandable, actionable insights...",
  "name": "Dashify"
}
```

#### Response
```json
{
  "generated_leads": [
    {
      "author": "IndividualDress2440",
      "comment": "It sounds like you're facing a common challenge where the presentation of data often requires more effort than the analysis itself, especially when stakeholders aren't 'data-native'. Focusing on the 'so-what' is crucial. One approach is to really hone in on the narrative within the dashboard, rather than just presenting numbers. Interactive elements that allow users to drill down or expand on specific metrics can also reduce the need for constant interpretation. We've found that a tool like Dashify, which focuses on creating intuitive, interactive dashboards with AI-powered insights, can significantly bridge this gap and reduce the 'translation' overhead.",
      "created_at": "2025-08-11T10:15:16",
      "date": "2025-08-08T19:33:10+00:00",
      "id": "8bb94a53-69c0-4333-8035-9f600625546b",
      "num_comments": 23,
      "read": false,
      "score": 8,
      "selftext": "*(I've used ChatGPT a little just to make the context clear)*\n\nI hit this wall every week and I'm kinda over it. The dashboard is \"done\" (clean, tested, looks decent). Then Monday happens and I'm stuck doing the same loop:\n\n* Screenshots into PowerPoint\n* Rewrite the same plain-English bullets (\"north up 12%, APAC flat, churn weird in June…\")\n* Answer \"what does this line mean?\" for the 7th time\n* Paste into Slack/email with a little context blob so it doesn't get misread\n\nIt's not analysis anymore, it's translating. Half my job title might as well be \"dashboard interpreter.\"\n\n# The Root Problem\n\nAt least for us: most folks don't speak dashboard. They want the so-what in their words, not mine. Plus everyone has their own definition for the same metric (marketing \"conversion\" ≠ product \"conversion\" ≠ sales \"conversion\"). Cue chaos.\n\n# My Idea\n\nSo… I've been noodling on a tiny layer that sits on top of the BI stuff we already use (Power BI + Tableau). Not a new BI tool, not another place",
      "subreddit": "businessintelligence",
      "title": "The dashboard is fine. The meeting is not. (honest verdict wanted)",
      "url": "https://www.reddit.com/r/businessintelligence/comments/1ml4qdw/"
    }
  ],
  "subreddits": [
    "dataisbeautiful",
    "businessintelligence",
    "datascience",
    "excel",
    "tableau",
    "powerbi",
    "consulting",
    "smallbusiness",
    "analytics",
    "dataanalysis"
  ]
}
```

### 3. Save Generated Leads
**Endpoint:** `POST /save-generated-leads`  
**Authentication:** Required (Supabase token)  
**Purpose:** Saves generated leads to the database with scheduling information

#### Request
```json
{
  "generated_leads": [
    {
      "id": "8bb94a53-69c0-4333-8035-9f600625546b",
      "comment": "AI-generated comment suggesting the product...",
      "selftext": "Original post content...",
      "title": "Original post title",
      "url": "https://www.reddit.com/r/subreddit/comments/...",
      "score": 8,
      "read": false,
      "num_comments": 23,
      "author": "username",
      "subreddit": "businessintelligence",
      "date": "2025-08-08T19:33:10+00:00",
      "created_at": "2025-08-11T10:15:16"
    }
  ],
  "subreddits": [
    "dataisbeautiful",
    "businessintelligence",
    "datascience",
    "excel",
    "tableau",
    "powerbi",
    "consulting",
    "smallbusiness",
    "analytics",
    "dataanalysis"
  ],
  "product_data": {
    "name": "Dashify",
    "target_audience": "Businesses and individuals who need to analyze and visualize data...",
    "description": "Dashify is a data visualization platform...",
    "problem_solved": "The product solves the problem of transforming raw data..."
  }
}
```

#### Response
```json
{
  "status": 200,
  "message": "Leads saved successfully"
}
```

## Lead Object Structure

Each lead in the `generated_leads` array contains:

| Field | Type | Description |
|-------|------|-------------|
| `author` | string | Reddit username of the post/comment author |
| `comment` | string | AI-generated comment suggesting the product |
| `created_at` | string | Timestamp when the lead was generated |
| `date` | string | Original post date |
| `id` | string | Unique identifier for the lead |
| `num_comments` | number | Number of comments on the original post |
| `read` | boolean | Whether the lead has been marked as read |
| `score` | number | Reddit score (upvotes - downvotes) |
| `selftext` | string | Original post content |
| `subreddit` | string | Subreddit where the post was found |
| `title` | string | Original post title |
| `url` | string | Direct link to the Reddit post |
| `scheduled_at` | string | When the lead should be processed (for saved leads) |

## Workflow

1. **Start with Product Analysis**
   - Send product website link to `/generate-product-details`
   - Extract key product information

2. **Generate Targeted Leads**
   - Use the extracted information to call `/onboarding-lead-generation`
   - Receive relevant Reddit posts and AI-generated comments

3. **Save Leads for Processing**
   - Send leads to `/save-generated-leads` to store them in the database
   - Leads are automatically scheduled for processing with dynamic intervals

4. **Review and Engage**
   - Review the generated leads
   - Use the AI-generated comments as starting points for engagement
   - Follow up with personalized responses

## Best Practices

### For Product Analysis
- Ensure the website link is accessible and contains sufficient product information
- The more detailed the product description, the better the lead matching

### For Lead Generation
- Review generated comments before using them
- Personalize AI-generated responses for authenticity
- Focus on high-engagement posts (higher scores and comment counts)
- Consider the subreddit context when crafting responses

### For Lead Saving
- Only save leads that you plan to engage with
- The system automatically schedules leads with 5-45 minute intervals
- First two leads are scheduled immediately, others are spread out

### For Engagement
- Always provide value in your responses
- Be transparent about your affiliation with the product
- Follow each subreddit's rules and guidelines
- Monitor responses and adjust your approach based on feedback

## Error Handling

Common error scenarios and solutions:

- **Invalid website link**: Ensure the URL is accessible and contains product information
- **No leads found**: Try broadening the target audience or problem description
- **Rate limiting**: Implement appropriate delays between API calls
- **Authentication errors**: Ensure valid Supabase token is provided for protected endpoints

## Rate Limits

- `/generate-product-details`: 10 requests per minute
- `/onboarding-lead-generation`: 20 requests per minute
- `/save-generated-leads`: 30 requests per minute

## Support

For technical support or questions about the API:
- Check the API documentation
- Review error messages for specific guidance
- Contact the development team for assistance
