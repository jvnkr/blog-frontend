"use client";

import React from "react";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { usePostsContext } from "@/context/PostsContext";
import { VirtualizedPosts } from "@/components/VirtualizedPosts";

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
    <VirtualizedPosts
      key={followingPosts.length} // Ensures page re-render when updating posts
      id="following"
      setPosts={setFollowingPosts}
      hasMorePosts={hasMoreFollowingPosts}
      posts={followingPosts}
      loading={loading}
      skeletonCount={skeletonCount}
      onEndReached={fetchPosts}
      onUpdatePost={handleUpdatePost}
    />
  );
}
