import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/supabase";
import karmaService from "../services/karmaService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error getting initial user:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Generate karma content when user signs in (only if no content exists)
      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in, checking for karma content...");
        // Start karma generation in the background only if no content exists
        setTimeout(() => {
          karmaService.generateKarmaContent(false); // false = don't force refresh
        }, 1000); // Small delay to ensure user is fully loaded
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await authService.signUp(email, password);
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await authService.signIn(email, password);
    if (error) throw error;

    // Start karma generation after successful sign in (only if no content exists)
    setTimeout(() => {
      karmaService.generateKarmaContent(false); // false = don't force refresh
    }, 1000);

    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await authService.signInWithGoogle();
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    const { data, error } = await authService.resetPassword(email);
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
