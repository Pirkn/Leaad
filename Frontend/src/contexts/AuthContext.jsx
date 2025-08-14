import { createContext, useContext, useEffect, useState, useRef } from "react";
import { authService } from "../services/supabase";
import apiService from "../services/api";
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
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingStatusLoading, setOnboardingStatusLoading] = useState(true);

  // Use refs to prevent multiple API calls
  const hasCheckedOnboarding = useRef(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Get initial user
    const getInitialUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        // Only check onboarding status if user is authenticated and we haven't checked yet
        if (currentUser && !hasCheckedOnboarding.current) {
          hasCheckedOnboarding.current = true;
          console.log("Checking onboarding status (first time only)");
          await checkOnboardingStatus();
        } else if (!currentUser) {
          // If no user, set onboarding status to false and stop loading
          setOnboardingComplete(false);
          setOnboardingStatusLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial user:", error);
        // If there's an error, assume no user and stop loading
        setUser(null);
        setOnboardingComplete(false);
        setOnboardingStatusLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      console.log("Auth state change:", {
        event,
        newUser: !!newUser,
        session: !!session,
      });
      setUser(newUser);

      // Don't check onboarding status here - only on initial load
      if (newUser && event === "SIGNED_IN") {
        // Generate karma content when user signs in (only if no content exists)
        setTimeout(() => {
          karmaService.generateKarmaContent(false); // false = don't force refresh
        }, 1000); // Small delay to ensure user is fully loaded
      } else if (event === "SIGNED_OUT") {
        // User signed out, reset onboarding status only when we're sure they're signed out
        console.log("User signed out, resetting onboarding status");
        setOnboardingComplete(false);
        setOnboardingStatusLoading(false);
        hasCheckedOnboarding.current = false; // Reset for next sign-in
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      setOnboardingStatusLoading(true);
      const data = await apiService.getOnboardingStatus();
      // Handle null status - treat as not completed
      setOnboardingComplete(data.status === true);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // If it's a 404 or network error, assume onboarding is not complete
      setOnboardingComplete(false);
    } finally {
      setOnboardingStatusLoading(false);
    }
  };

  const markOnboardingComplete = async () => {
    try {
      // Update local state immediately for optimistic updates
      setOnboardingComplete(true);

      // Call the API in the background
      await apiService.setOnboardingComplete();
      return { success: true };
    } catch (error) {
      // Revert the optimistic update if the API call fails
      setOnboardingComplete(false);
      console.error("Error marking onboarding complete:", error);
      throw error;
    }
  };

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
    // Ensure immediate local sign-out state to prevent bounce-backs
    setUser(null);
    setOnboardingComplete(false);
    setOnboardingStatusLoading(false);
    hasCheckedOnboarding.current = false;
    setLoading(false);
  };

  const resetPassword = async (email) => {
    const { data, error } = await authService.resetPassword(email);
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    loading,
    onboardingComplete,
    onboardingStatusLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    markOnboardingComplete,
    checkOnboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
