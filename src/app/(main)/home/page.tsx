"use client";

import React from "react";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { PostsVirtuoso } from "@/components/PostsVirtuoso";
import { usePostsContext } from "@/context/PostsContext";
import { useAuthContext } from "@/context/AuthContext";

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
    <PostsVirtuoso
      setPosts={setPosts}
      posts={posts}
      loading={loading}
      skeletonCount={skeletonCount}
      showCreatePost={loggedIn ?? false}
      onEndReached={fetchPosts}
      onUpdatePost={handleUpdatePost}
    />
  );
}
