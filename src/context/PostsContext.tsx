"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { PostData } from "@/lib/types";

interface PostsContextType {
  posts: PostData[];
  followingPosts: PostData[];
  followingPageNumber: number;
  pageNumber: number;
  hasMoreFollowingPosts: boolean;
  hasMorePosts: boolean;
  setHasMorePosts: React.Dispatch<React.SetStateAction<boolean>>;
  setHasMoreFollowingPosts: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
  setFollowingPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
  setFollowingPageNumber: React.Dispatch<React.SetStateAction<number>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostData[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [followingPageNumber, setFollowingPageNumber] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreFollowingPosts, setHasMoreFollowingPosts] = useState(true);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        followingPosts,
        setFollowingPosts,
        pageNumber,
        setPageNumber,
        followingPageNumber,
        setFollowingPageNumber,
        hasMorePosts,
        setHasMorePosts,
        hasMoreFollowingPosts,
        setHasMoreFollowingPosts,
      }}
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
