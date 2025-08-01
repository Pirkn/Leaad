# TanStack Query Setup Documentation

## Overview

This application now uses TanStack Query (React Query) for efficient data fetching, caching, and state management. The setup provides:

- **Automatic Caching**: Data is cached and reused across components
- **Background Updates**: Data stays fresh with automatic refetching
- **Optimistic Updates**: UI updates immediately while requests are pending
- **Error Handling**: Comprehensive error states and retry logic
- **Loading States**: Built-in loading indicators
- **DevTools**: Development tools for debugging queries and mutations

## Installation

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## Configuration

### Query Client Setup (`main.jsx`)

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

## API Hooks (`hooks/useApi.js`)

### Query Keys

```javascript
export const queryKeys = {
  viralPosts: ["viralPosts"],
  productAnalysis: (url) => ["productAnalysis", url],
  health: ["health"],
};
```

### Available Hooks

#### 1. `useViralPosts()`

- **Purpose**: Fetch viral posts from Reddit
- **Caching**: 10 minutes stale time, 30 minutes garbage collection
- **Usage**:

```javascript
const { data: viralPosts, isLoading, error } = useViralPosts();
```

#### 2. `useProductAnalysis(websiteUrl, enabled)`

- **Purpose**: Analyze product websites
- **Caching**: 1 hour stale time, 24 hours garbage collection
- **Usage**:

```javascript
const { data, isLoading, error } = useProductAnalysis(url, true);
```

#### 3. `useHealthCheck()`

- **Purpose**: Check API health status
- **Caching**: 5 minutes stale time
- **Usage**:

```javascript
const { data: healthData } = useHealthCheck();
```

#### 4. `useGenerateRedditPost()`

- **Purpose**: Generate Reddit posts
- **Features**: Automatic cache invalidation
- **Usage**:

```javascript
const mutation = useGenerateRedditPost();
await mutation.mutateAsync(productData);
```

#### 5. `useAnalyzeProduct()`

- **Purpose**: Analyze products with cache updates
- **Features**: Updates cache with new analysis data
- **Usage**:

```javascript
const mutation = useAnalyzeProduct();
await mutation.mutateAsync(websiteUrl);
```

#### 6. `useOptimisticViralPost()`

- **Purpose**: Generate posts with optimistic updates
- **Features**: Immediate UI updates with rollback on error
- **Usage**:

```javascript
const mutation = useOptimisticViralPost();
await mutation.mutateAsync(productData);
```

### Custom State Management Hooks

#### `useProductAnalysisState()`

Manages product analysis form state and mutations:

```javascript
const {
  websiteUrl,
  setWebsiteUrl,
  isAnalyzing,
  handleAnalyze,
  analysisData,
  isError,
  error,
} = useProductAnalysisState();
```

#### `useRedditPostGeneration()`

Manages Reddit post generation with form state:

```javascript
const {
  formData,
  setFormData,
  generatePost,
  generateOptimisticPost,
  isGenerating,
  error,
} = useRedditPostGeneration();
```

## Usage Examples

### Basic Query Usage

```javascript
import { useViralPosts } from "../hooks/useApi";

function ViralTemplates() {
  const { data: viralPosts = [], isLoading, error } = useViralPosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {viralPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Mutation Usage

```javascript
import { useGenerateRedditPost } from "../hooks/useApi";

function GeneratePost() {
  const mutation = useGenerateRedditPost();

  const handleSubmit = async (formData) => {
    try {
      const result = await mutation.mutateAsync(formData);
      console.log("Generated post:", result);
    } catch (error) {
      console.error("Failed to generate post:", error);
    }
  };

  return (
    <button onClick={() => handleSubmit(data)} disabled={mutation.isPending}>
      {mutation.isPending ? "Generating..." : "Generate Post"}
    </button>
  );
}
```

### Optimistic Updates

```javascript
import { useOptimisticViralPost } from "../hooks/useApi";

function OptimisticPost() {
  const mutation = useOptimisticViralPost();

  const handleSubmit = async (formData) => {
    try {
      await mutation.mutateAsync(formData);
      // UI updates immediately, then syncs with server
    } catch (error) {
      // UI rolls back to previous state
      console.error("Failed:", error);
    }
  };

  return (
    <button onClick={() => handleSubmit(data)}>
      Generate with Optimistic Update
    </button>
  );
}
```

## Cache Management

### Manual Cache Invalidation

```javascript
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  const invalidateViralPosts = () => {
    queryClient.invalidateQueries({ queryKey: ["viralPosts"] });
  };

  const clearAllCache = () => {
    queryClient.clear();
  };
}
```

### Cache Updates

```javascript
// Update cache directly
queryClient.setQueryData(["viralPosts"], (old) => {
  return old ? [...old, newPost] : [newPost];
});
```

## Error Handling

### Global Error Handling

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});
```

### Component-Level Error Handling

```javascript
const { data, error, isError } = useViralPosts();

if (isError) {
  return (
    <div className="error">
      <h3>Failed to load viral posts</h3>
      <p>{error.message}</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

## DevTools

The React Query DevTools are automatically included in development mode:

- **Access**: Press `Ctrl+H` (or `Cmd+H` on Mac) to open
- **Features**:
  - View all queries and mutations
  - Inspect cache data
  - Manually trigger refetches
  - Clear cache
  - Export/import cache state

## Best Practices

### 1. Query Keys

- Use consistent, serializable query keys
- Include dependencies in query keys
- Use array format for complex keys

### 2. Stale Time vs Cache Time

- **Stale Time**: How long data is considered fresh
- **Cache Time**: How long data stays in cache after becoming stale

### 3. Optimistic Updates

- Use for immediate user feedback
- Always provide rollback mechanism
- Consider network conditions

### 4. Error Boundaries

- Wrap components with error boundaries
- Provide fallback UI for failed queries
- Log errors for debugging

### 5. Loading States

- Show loading indicators for better UX
- Use skeleton loaders for content
- Disable forms during mutations

## Performance Benefits

1. **Reduced API Calls**: Data is cached and reused
2. **Background Updates**: Data stays fresh automatically
3. **Optimistic Updates**: Immediate UI feedback
4. **Smart Refetching**: Only refetch when necessary
5. **Memory Management**: Automatic garbage collection

## Migration from Previous Setup

The migration from manual state management to TanStack Query provides:

- **Less Boilerplate**: No manual loading/error states
- **Better Caching**: Automatic cache management
- **Optimistic Updates**: Better user experience
- **DevTools**: Better debugging capabilities
- **Type Safety**: Better TypeScript support

## Troubleshooting

### Common Issues

1. **Queries not refetching**: Check `staleTime` and `refetchOnWindowFocus`
2. **Cache not updating**: Verify query keys and invalidation
3. **Optimistic updates not working**: Check `onMutate` and `onError` handlers
4. **DevTools not showing**: Ensure devtools are imported and enabled

### Debug Tips

1. Use DevTools to inspect cache state
2. Check network tab for API calls
3. Verify query keys are consistent
4. Test error scenarios with network throttling
