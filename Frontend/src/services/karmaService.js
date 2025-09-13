import apiService from "./api";

class KarmaService {
  constructor() {
    this.isGenerating = false;
  }

  // Generate karma content in the background
  async generateKarmaContent(forceRefresh = false) {
    if (this.isGenerating) {
      return;
    }

    // Check if content already exists and we're not forcing refresh
    if (!forceRefresh && this.hasKarmaContent()) {
      return;
    }

    this.isGenerating = true;

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
      } else {
        console.error(commentResult.reason);
      }

      if (postResult.status === "fulfilled") {
        localStorage.setItem("karma_post", JSON.stringify(postResult.value));
      } else {
        console.error(postResult.reason);
      }
    } catch (error) {
      console.error(error);
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
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Generate a single post
  async generatePost() {
    try {
      const result = await apiService.generateKarmaPost();
      // Store the result in localStorage
      localStorage.setItem("karma_post", JSON.stringify(result));
      return result;
    } catch (error) {
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
    } else if (type === "post") {
      localStorage.setItem("karma_post", JSON.stringify(content));
    }
  }
}

export default new KarmaService();
