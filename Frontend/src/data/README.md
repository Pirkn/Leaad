# Data Directory

This directory contains static data files used by the application.

## Files

### `viral_posts.json`

Contains a collection of viral Reddit posts that serve as templates for users. Each post includes:

- **id**: Unique identifier for the post
- **title**: The post title
- **description**: Brief description of the post
- **postTitle**: Template version of the title with placeholders
- **postText**: Template version of the post content with placeholders like [product link]
- **originalPostTitle**: The original Reddit post title
- **originalPostText**: The original Reddit post content
- **originalPostUrl**: Link to the original Reddit post
- **purpose**: The purpose of the post (e.g., "sell", "engagement")
- **upvotes**: Number of upvotes the original post received
- **comments**: Number of comments the original post received
- **recommendedSubreddits**: List of subreddits where this template would work well

## Usage

The viral posts are loaded through the `staticDataService` in `../services/staticData.js` and used in:

- `ViralTemplates.jsx` - Main templates listing page
- `ViralTemplateEdit.jsx` - Template editing page

## Structure

```json
{
  "viral_posts": [
    {
      "id": 1,
      "title": "Post Title",
      "postText": "Template with [placeholders]",
      "originalPostText": "Original content"
      // ... other fields
    }
  ]
}
```

## Adding New Templates

To add new viral post templates:

1. Add a new object to the `viral_posts` array
2. Include all required fields
3. Use `postText` for the template version with placeholders
4. Use `originalPostText` for the actual original content
5. Ensure the `id` is unique
