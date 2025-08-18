import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.jsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
// Simple environment validation
const validateEnv = () => {
  const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn("Missing required environment variables:", missing);
  }

  return missing.length === 0;
};

validateEnv();

// Create a client
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <App />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
