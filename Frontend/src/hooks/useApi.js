import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "../services/api";
import { useState } from "react";

// Query Keys
export const queryKeys = {
  viralPosts: ["viralPosts"],
  productAnalysis: (url) => ["productAnalysis", url],
  health: ["health"],
};

// Viral Posts Query
export const useViralPosts = () => {
  return useQuery({
    queryKey: queryKeys.viralPosts,
    queryFn: () => apiService.getViralPosts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Product Analysis Query
export const useProductAnalysis = (websiteUrl, enabled = false) => {
  return useQuery({
    queryKey: queryKeys.productAnalysis(websiteUrl),
    queryFn: () => apiService.generateProductDetails(websiteUrl),
    enabled: enabled && !!websiteUrl,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Health Check Query
export const useHealthCheck = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiService.healthCheck(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Generate Reddit Post Mutation
export const useGenerateRedditPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData) => apiService.generateRedditPost(productData),
    onSuccess: (data, variables) => {
      // Invalidate viral posts to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.viralPosts });

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

// Product Analysis Mutation (for manual triggering)
export const useAnalyzeProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (websiteUrl) => apiService.generateProductDetails(websiteUrl),
    onSuccess: (data, websiteUrl) => {
      // Update the cache with the new analysis
      queryClient.setQueryData(queryKeys.productAnalysis(websiteUrl), data);
    },
    onError: (error, websiteUrl, context) => {
      console.error("Failed to analyze product:", error);
    },
  });
};

// Optimistic Updates for Viral Posts
export const useOptimisticViralPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData) => apiService.generateRedditPost(productData),
    onMutate: async (productData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.viralPosts });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(queryKeys.viralPosts);

      // Optimistically update to the new value
      const optimisticPost = {
        id: Date.now(),
        title: `Generated Post for ${productData.productName}`,
        content: "Generating...",
        subreddit: "r/entrepreneur",
        upvotes: 0,
        isOptimistic: true,
      };

      queryClient.setQueryData(queryKeys.viralPosts, (old) => {
        return old ? [optimisticPost, ...old] : [optimisticPost];
      });

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, productData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData(queryKeys.viralPosts, context.previousPosts);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.viralPosts });
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
