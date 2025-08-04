import apiService from "./api";

class KarmaService {
  constructor() {
    this.isGenerating = false;
  }

  // Generate karma content in the background
  async generateKarmaContent(forceRefresh = false) {
    if (this.isGenerating) {
      console.log("Karma content generation already in progress");
      return;
    }

    // Check if content already exists and we're not forcing refresh
    if (!forceRefresh && this.hasKarmaContent()) {
      console.log("Karma content already exists, skipping generation");
      return;
    }

    this.isGenerating = true;
    console.log("Starting karma content generation...");

    try {
      // Generate both comment and post in parallel
      const [commentResult, postResult] = await Promise.allSettled([
        this.generateComment(),
        this.generatePost(),
      ]);

      // Store results in localStorage
      if (commentResult.status === "fulfilled") {
        localStorage.setItem(
          "karma_comment",
          JSON.stringify(commentResult.value)
        );
        console.log("Karma comment generated and stored in bulk generation");
      } else {
        console.error(
          "Failed to generate karma comment:",
          commentResult.reason
        );
      }

      if (postResult.status === "fulfilled") {
        localStorage.setItem("karma_post", JSON.stringify(postResult.value));
        console.log("Karma post generated and stored in bulk generation");
      } else {
        console.error("Failed to generate karma post:", postResult.reason);
      }
    } catch (error) {
      console.error("Error in karma generation:", error);
    } finally {
      this.isGenerating = false;
    }
  }

  // Generate a single comment
  async generateComment() {
    try {
      const result = await apiService.generateKarmaComment();
      // Store the result in localStorage
      localStorage.setItem("karma_comment", JSON.stringify(result));
      console.log("Comment generated and stored in karmaService");
      return result;
    } catch (error) {
      console.error("Failed to generate comment:", error);
      throw error;
    }
  }

  // Generate a single post
  async generatePost() {
    try {
      const result = await apiService.generateKarmaPost();
      // Store the result in localStorage
      localStorage.setItem("karma_post", JSON.stringify(result));
      console.log("Post generated and stored in karmaService");
      return result;
    } catch (error) {
      console.error("Failed to generate post:", error);
      throw error;
    }
  }

  // Check if karma content exists
  hasKarmaContent() {
    const comment = localStorage.getItem("karma_comment");
    const post = localStorage.getItem("karma_post");
    return !!(comment || post);
  }

  // Get stored karma content
  getStoredKarmaContent() {
    const comment = localStorage.getItem("karma_comment");
    const post = localStorage.getItem("karma_post");

    return {
      comment: comment ? JSON.parse(comment) : null,
      post: post ? JSON.parse(post) : null,
    };
  }

  // Clear stored karma content
  clearKarmaContent() {
    localStorage.removeItem("karma_comment");
    localStorage.removeItem("karma_post");
  }

  // Update stored karma content manually
  updateStoredKarmaContent(type, content) {
    if (type === "comment") {
      localStorage.setItem("karma_comment", JSON.stringify(content));
      console.log("Comment manually updated in localStorage");
    } else if (type === "post") {
      localStorage.setItem("karma_post", JSON.stringify(content));
      console.log("Post manually updated in localStorage");
    }
  }
}

export default new KarmaService();
