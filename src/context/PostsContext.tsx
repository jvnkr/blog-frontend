"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { PostData } from "@/lib/types";
import { ProfileProps } from "@/components/Profile";

interface PostsContextType {
  posts: PostData[];
  pageNumber: number;
  followingPosts: PostData[];
  followingPageNumber: number;
  profilePosts: PostData[];
  profilePageNumber: number;
  hasMoreFollowingPosts: boolean;
  hasMorePosts: boolean;
  hasMoreProfilePosts: boolean;
  cachedProfilePath: string;
  profileData: ProfileProps | null;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileProps | null>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  setHasMorePosts: React.Dispatch<React.SetStateAction<boolean>>;
  setHasMoreFollowingPosts: React.Dispatch<React.SetStateAction<boolean>>;
  setHasMoreProfilePosts: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
  setFollowingPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
  setProfilePosts: React.Dispatch<React.SetStateAction<PostData[]>>;
  setFollowingPageNumber: React.Dispatch<React.SetStateAction<number>>;
  setProfilePageNumber: React.Dispatch<React.SetStateAction<number>>;
  setCachedProfilePath: React.Dispatch<React.SetStateAction<string>>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostData[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [followingPageNumber, setFollowingPageNumber] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreFollowingPosts, setHasMoreFollowingPosts] = useState(true);
  const [profilePosts, setProfilePosts] = useState<PostData[]>([]);
  const [profilePageNumber, setProfilePageNumber] = useState(0);
  const [hasMoreProfilePosts, setHasMoreProfilePosts] = useState(true);
  const [cachedProfilePath, setCachedProfilePath] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileProps | null>(null);

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
        profilePosts,
        setProfilePosts,
        profilePageNumber,
        setProfilePageNumber,
        hasMoreProfilePosts,
        setHasMoreProfilePosts,
        cachedProfilePath,
        setCachedProfilePath,
        profileData,
        setProfileData,
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
