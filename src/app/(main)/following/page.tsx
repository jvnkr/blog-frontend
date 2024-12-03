"use client";

import React, { useState } from "react";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { usePostsContext } from "@/context/PostsContext";
import { VirtualizedPosts } from "@/components/VirtualizedPosts";
import { PostData } from "@/lib/types";

export default function FollowingPage() {
  const {
    posts,
    setPosts,
    profilePosts,
    setProfilePosts,
    followingPosts,
    setFollowingPosts,
    followingPageNumber,
    setFollowingPageNumber,
    hasMoreFollowingPosts,
    setHasMoreFollowingPosts,
  } = usePostsContext();
  const [updateKey, setUpdateKey] = useState(0);

  const {
    loading,
    initialLoading,
    skeletonCount,
    fetchPosts,
    handleUpdatePost,
  } = useFetchPosts(
    followingPosts,
    setFollowingPosts,
    "/api/v1/posts/batch/following",
    followingPageNumber,
    setFollowingPageNumber,
    hasMoreFollowingPosts,
    setHasMoreFollowingPosts,
  );

  const handleCreatePost = (newPost: PostData) => {
    setFollowingPosts([newPost, ...followingPosts]);
    setUpdateKey((prevKey) => prevKey + 1);
  };

  const handleDeletePost = (newPosts: PostData[], deletedPostId: string) => {
    setFollowingPosts(newPosts);
    setPosts(posts.filter((p) => p.id !== deletedPostId));
    setProfilePosts(profilePosts.filter((p) => p.id !== deletedPostId));
    setUpdateKey((prevKey) => prevKey + 1);
  };

  return (
    <VirtualizedPosts
      key={updateKey}
      id="following"
      handleCreatePost={handleCreatePost}
      hasMorePosts={hasMoreFollowingPosts}
      posts={followingPosts}
      loading={loading}
      initialLoading={initialLoading}
      skeletonCount={skeletonCount}
      onEndReached={fetchPosts}
      onUpdatePost={handleUpdatePost}
      handleDeletePost={handleDeletePost}
    />
  );
}
