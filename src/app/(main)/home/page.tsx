"use client";

import React from "react";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { usePostsContext } from "@/context/PostsContext";
import { useAuthContext } from "@/context/AuthContext";
import { VirtualizedPosts } from "@/components/VirtualizedPosts";

export default function HomePage() {
  const {
    posts,
    setPosts,
    pageNumber,
    setPageNumber,
    hasMorePosts,
    setHasMorePosts,
  } = usePostsContext();
  const { loggedIn } = useAuthContext();

  const { loading, skeletonCount, fetchPosts, handleUpdatePost } =
    useFetchPosts(
      posts,
      setPosts,
      "/api/v1/posts/batch",
      pageNumber,
      setPageNumber,
      hasMorePosts,
      setHasMorePosts
    );

  return (
    <VirtualizedPosts
      key={posts.length} // Ensures page re-render when updating posts
      id="home"
      setPosts={setPosts}
      posts={posts}
      loading={loading}
      hasMorePosts={hasMorePosts}
      skeletonCount={skeletonCount}
      showCreatePost={loggedIn ?? false}
      onEndReached={fetchPosts}
      onUpdatePost={handleUpdatePost}
    />
  );
}
