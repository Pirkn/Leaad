import { createContext, useContext, useState } from "react";

const PostsContext = createContext();

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used within a PostsProvider");
  }
  return context;
};

export const PostsProvider = ({ children }) => {
  const [newlyGeneratedPosts, setNewlyGeneratedPosts] = useState([]);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);

  const addNewlyGeneratedPosts = (posts) => {
    setNewlyGeneratedPosts((prev) => [...posts, ...prev]);
  };

  const clearNewlyGeneratedPosts = () => {
    setNewlyGeneratedPosts([]);
  };

  const setGeneratingPosts = (isGenerating) => {
    setIsGeneratingPosts(isGenerating);
  };

  return (
    <PostsContext.Provider
      value={{
        newlyGeneratedPosts,
        addNewlyGeneratedPosts,
        clearNewlyGeneratedPosts,
        isGeneratingPosts,
        setGeneratingPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
