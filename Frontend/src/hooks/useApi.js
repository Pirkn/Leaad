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
      // Viral posts are now static data, no need to invalidate
      // You could also add the generated post to a local cache
      // queryClient.setQueryData(['generatedPosts'], (old) => {
      //   return old ? [...old, data] : [data];
      // });
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

// Update Product Mutation - TODO: Implement functionality
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, productData }) => {
      if (!user) {
        throw new Error("User must be authenticated to update products");
      }
      throw new Error("Update product functionality not implemented yet");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
    onError: (error) => {
      console.error("Failed to update product:", error);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
    },
    onError: (error) => {
      console.error("Failed to generate leads:", error);
    },
  });
};

// Mark Lead as Read Mutation
export const useMarkLeadAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (leadId) => {
      if (!user) {
        throw new Error("User must be authenticated to mark leads as read");
      }
      const response = await apiService.markLeadAsRead(leadId);
      return response; // Backend returns updated lead
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
    },
    onError: (error) => {
      console.error("Failed to mark lead as read:", error);
    },
  });
};
