// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  },

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === "test",

  // Feature flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    enableDebugMode: import.meta.env.VITE_DEBUG_MODE === "true",
  },

  // Security
  security: {
    requireHttps: import.meta.env.PROD,
    maxRetries: import.meta.env.VITE_MAX_RETRIES || 3,
  },
};

// Validate required environment variables
export const validateEnvironment = () => {
  const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn("Missing required environment variables:", missing);
  }

  return missing.length === 0;
};

export default config;
