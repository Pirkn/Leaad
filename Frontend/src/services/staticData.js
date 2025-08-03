import viralPostsData from "../data/viral_posts.json";

class StaticDataService {
  constructor() {
    this.viralPosts = viralPostsData.viral_posts || [];
  }

  // Get all viral posts
  getViralPosts() {
    return this.viralPosts;
  }

  // Get viral posts with filtering
  getViralPostsWithFilters(filters = {}) {
    let filteredPosts = [...this.viralPosts];

    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm) ||
          post.description?.toLowerCase().includes(searchTerm) ||
          post.originalPostText?.toLowerCase().includes(searchTerm)
      );
    }

    // Engagement filter
    if (filters.engagementFilter && filters.engagementFilter !== "all") {
      filteredPosts = filteredPosts.filter((post) => {
        const upvotes = post.upvotes || 0;
        const comments = post.comments || 0;

        switch (filters.engagementFilter) {
          case "high":
            return upvotes > 1000 || comments > 100;
          case "medium":
            return (
              (upvotes >= 100 && upvotes <= 1000) ||
              (comments >= 10 && comments <= 100)
            );
          case "low":
            return upvotes < 100 && comments < 10;
          default:
            return true;
        }
      });
    }

    // Sort posts
    if (filters.sortBy) {
      filteredPosts.sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
          case "oldest":
            return new Date(a.created_at || 0) - new Date(b.created_at || 0);
          case "most-engaged":
            return (b.upvotes || 0) - (a.upvotes || 0);
          case "most-commented":
            return (b.comments || 0) - (a.comments || 0);
          default:
            return 0;
        }
      });
    }

    return filteredPosts;
  }

  // Get viral post by ID
  getViralPostById(id) {
    return this.viralPosts.find((post) => post.id === id);
  }

  // Get viral posts by purpose
  getViralPostsByPurpose(purpose) {
    return this.viralPosts.filter((post) => post.purpose === purpose);
  }

  // Get viral posts by subreddit
  getViralPostsBySubreddit(subreddit) {
    return this.viralPosts.filter((post) =>
      post.recommendedSubreddits?.includes(subreddit)
    );
  }
}

export default new StaticDataService();
