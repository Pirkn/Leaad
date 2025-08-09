import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "../services/api";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// Query Keys
export const queryKeys = {
  productAnalysis: (url) => ["productAnalysis", url],
  health: ["health"],
  products: ["products"],
  leads: ["leads"],
};

// Viral posts are now loaded as static data - no need for TanStack Query
// Use staticDataService directly in components

// Product Analysis Query
export const useProductAnalysis = (websiteUrl, enabled = false) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.productAnalysis(websiteUrl),
    queryFn: () => apiService.generateProductDetails(websiteUrl),
    enabled: enabled && !!websiteUrl && !!user, // Only run if user is authenticated and URL is provided
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Health Check Query
export const useHealthCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiService.healthCheck(),
    enabled: !!user, // Only run if user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Generate Reddit Post Mutation
export const useGenerateRedditPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (productData) => {
      if (!user) {
        throw new Error("User must be authenticated to generate posts");
      }
      return apiService.generateRedditPost(productData);
    },
    retry: false, // Disable retries to prevent multiple requests
    onSuccess: (data, variables) => {
      // Posts are now handled locally in the component
      // No need to invalidate queries
    },
    onError: (error, variables, context) => {
      console.error("Failed to generate Reddit post:", error);
    },
  });
};

// Generate Karma Comment Mutation
export const useGenerateKarmaComment = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => {
      if (!user) {
        throw new Error(
          "User must be authenticated to generate karma comments"
        );
      }
      return apiService.generateKarmaComment();
    },
    retry: false,
    onError: (error) => {
      console.error("Failed to generate karma comment:", error);
    },
  });
};

// Generate Karma Post Mutation
export const useGenerateKarmaPost = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => {
      if (!user) {
        throw new Error("User must be authenticated to generate karma posts");
      }
      return apiService.generateKarmaPost();
    },
    retry: false,
    onError: (error) => {
      console.error("Failed to generate karma post:", error);
    },
  });
};

// Product Analysis Mutation (for manual triggering)
export const useAnalyzeProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (websiteUrl) => {
      if (!user) {
        throw new Error("User must be authenticated to analyze products");
      }
      return apiService.generateProductDetails(websiteUrl);
    },
    onSuccess: (data, websiteUrl) => {
      // Update the cache with the new analysis
      queryClient.setQueryData(queryKeys.productAnalysis(websiteUrl), data);
    },
    onError: (error, websiteUrl, context) => {
      console.error("Failed to analyze product:", error);
    },
  });
};

// Optimistic Updates for Viral Posts - Simplified since viral posts are now static
export const useOptimisticViralPost = () => {
  return useMutation({
    mutationFn: (productData) => apiService.generateRedditPost(productData),
    onError: (err, productData, context) => {
      console.error("Failed to generate optimistic post:", err);
    },
  });
};

// Custom hook for managing product analysis state
export const useProductAnalysisState = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMutation = useAnalyzeProduct();

  const handleAnalyze = async (url) => {
    if (!url.trim()) return;

    setIsAnalyzing(true);
    try {
      await analyzeMutation.mutateAsync(url);
      setWebsiteUrl(url);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    websiteUrl,
    setWebsiteUrl,
    isAnalyzing,
    handleAnalyze,
    analysisData: analyzeMutation.data,
    isError: analyzeMutation.isError,
    error: analyzeMutation.error,
  };
};

// Custom hook for managing Reddit post generation
export const useRedditPostGeneration = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productTargetAudience: "",
    productMainBenefit: "",
    productWebsiteLink: "",
  });

  const generateMutation = useGenerateRedditPost();
  const optimisticMutation = useOptimisticViralPost();

  const handleGeneratePost = async (data) => {
    try {
      const result = await generateMutation.mutateAsync(data);
      return result;
    } catch (error) {
      console.error("Failed to generate post:", error);
      throw error;
    }
  };

  const handleOptimisticGenerate = async (data) => {
    try {
      const result = await optimisticMutation.mutateAsync(data);
      return result;
    } catch (error) {
      console.error("Failed to generate post:", error);
      throw error;
    }
  };

  return {
    formData,
    setFormData,
    generatePost: handleGeneratePost,
    generateOptimisticPost: handleOptimisticGenerate,
    isGenerating: generateMutation.isPending,
    isOptimisticGenerating: optimisticMutation.isPending,
    error: generateMutation.error || optimisticMutation.error,
  };
};

// Products Query
export const useProducts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const response = await apiService.getProducts();
      return response; // Backend returns {products: [...]}
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Create Product Mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productData) => {
      if (!user) {
        throw new Error("User must be authenticated to create products");
      }
      const response = await apiService.createProduct(productData);
      return response; // Backend returns {message: "...", product: {...}}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
    onError: (error) => {
      console.error("Failed to create product:", error);
    },
  });
};

// Update Product Mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, productData }) => {
      if (!user) {
        throw new Error("User must be authenticated to update products");
      }
      const response = await apiService.updateProduct(productId, productData);
      return response; // Backend returns {message: "...", product: {...}}
    },
    onMutate: async ({ productId, productData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(queryKeys.products);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.products, (old) => {
        if (!old || !old.products) return old;

        return {
          ...old,
          products: old.products.map((product) =>
            product.id === productId ? { ...product, ...productData } : product
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products, context.previousProducts);
      }
      console.error("Failed to update product:", err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
};

// Delete Product Mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId) => {
      if (!user) {
        throw new Error("User must be authenticated to delete products");
      }
      const response = await apiService.deleteProduct(productId);
      return response; // Backend returns {message: "..."}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
    },
  });
};

// Leads Query
export const useLeads = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.leads,
    queryFn: async () => {
      const response = await apiService.getLeads();
      return response; // Backend returns array of leads
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Generate Leads Mutation
export const useGenerateLeads = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId) => {
      if (!user) {
        throw new Error("User must be authenticated to generate leads");
      }
      const response = await apiService.generateLeads(productId);
      return response; // Backend returns array of generated leads
    },
    onSuccess: (data, variables) => {
      // Leads are now handled locally in the component
      // No need to invalidate queries
    },
    onError: (error) => {
      console.error("Failed to generate leads:", error);
    },
  });
};

// Mark Lead as Read Mutation
export const useMarkLeadAsRead = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (leadId) => {
      if (!user) {
        throw new Error("User must be authenticated to mark leads as read");
      }
      const response = await apiService.markLeadAsRead(leadId);
      return response; // Backend returns updated lead
    },
    onError: (error) => {
      console.error("Failed to mark lead as read:", error);
    },
  });
};

// Mark Lead as Unread Mutation
export const useMarkLeadAsUnread = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (leadId) => {
      if (!user) {
        throw new Error("User must be authenticated to mark leads as unread");
      }
      const response = await apiService.markLeadAsUnread(leadId);
      return response; // Backend returns updated lead
    },
    onError: (error) => {
      console.error("Failed to mark lead as unread:", error);
    },
  });
};

// Reddit Posts Query
export const useRedditPosts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["redditPosts"],
    queryFn: async () => {
      const response = await apiService.getRedditPosts();
      return response; // Backend returns array of posts
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Mark Reddit Post as Saved Mutation
export const useMarkRedditPostAsSaved = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId) => {
      if (!user) {
        throw new Error("User must be authenticated to save posts");
      }
      const response = await apiService.markRedditPostAsSaved(postId);
      return response; // Backend returns updated post
    },
    onError: (error) => {
      console.error("Failed to save Reddit post:", error);
    },
  });
};

// Mark Reddit Post as Unsaved Mutation
export const useMarkRedditPostAsUnsaved = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId) => {
      if (!user) {
        throw new Error("User must be authenticated to unsave posts");
      }
      const response = await apiService.markRedditPostAsUnsaved(postId);
      return response; // Backend returns updated post
    },
    onError: (error) => {
      console.error("Failed to unsave Reddit post:", error);
    },
  });
};
