"use client";

import React from "react";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { PostsVirtuoso } from "@/components/PostsVirtuoso";
import { usePostsContext } from "@/context/PostsContext";

export default function FollowingPage() {
  const {
    followingPosts,
    setFollowingPosts,
    followingPageNumber,
    setFollowingPageNumber,
    hasMoreFollowingPosts,
    setHasMoreFollowingPosts,
  } = usePostsContext();
  const { loading, skeletonCount, fetchPosts, handleUpdatePost } =
    useFetchPosts(
      followingPosts,
      setFollowingPosts,
      "/api/v1/posts/batch/following",
      followingPageNumber,
      setFollowingPageNumber,
      hasMoreFollowingPosts,
      setHasMoreFollowingPosts
    );

  return (
    <PostsVirtuoso
      setPosts={setFollowingPosts}
      posts={followingPosts}
      loading={loading}
      skeletonCount={skeletonCount}
      onEndReached={fetchPosts}
      onUpdatePost={handleUpdatePost}
    />
  );
}
