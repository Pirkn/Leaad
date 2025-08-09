import { createContext, useContext, useState, useMemo } from "react";

const KarmaContext = createContext(undefined);

export const useKarmaContext = () => {
  const ctx = useContext(KarmaContext);
  if (!ctx)
    throw new Error("useKarmaContext must be used within a KarmaProvider");
  return ctx;
};

export const KarmaProvider = ({ children }) => {
  const [isKarmaGenerating, setIsKarmaGenerating] = useState(false);
  const [karmaGeneratingMode, setKarmaGeneratingMode] = useState(null); // "comments" | "posts" | null

  const startKarmaGeneration = (mode) => {
    setKarmaGeneratingMode(mode || null);
    setIsKarmaGenerating(true);
  };

  const stopKarmaGeneration = () => {
    setIsKarmaGenerating(false);
    setKarmaGeneratingMode(null);
  };

  const value = useMemo(
    () => ({
      isKarmaGenerating,
      karmaGeneratingMode,
      startKarmaGeneration,
      stopKarmaGeneration,
    }),
    [isKarmaGenerating, karmaGeneratingMode]
  );

  return (
    <KarmaContext.Provider value={value}>{children}</KarmaContext.Provider>
  );
};
