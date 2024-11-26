"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { PostData } from "@/lib/types";

interface PostsContextType {
  posts: PostData[];
  pageNumber: number;
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    const savedPosts =
      typeof window !== "undefined"
        ? JSON.parse(sessionStorage.getItem("cachedPosts") || "null")
        : undefined;
    if (savedPosts) {
      setPosts(savedPosts);
    }
    return () => {
      sessionStorage.removeItem("cachedPosts");
    };
  }, []);
  return (
    <PostsContext.Provider
      value={{ posts, setPosts, pageNumber, setPageNumber }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used within a PostsProvider");
  }
  return context;
};
