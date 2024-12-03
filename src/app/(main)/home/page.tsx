"use client";

import React, { useState } from "react";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { usePostsContext } from "@/context/PostsContext";
import { useAuthContext } from "@/context/AuthContext";
import { VirtualizedPosts } from "@/components/VirtualizedPosts";
import { PostData } from "@/lib/types";

export default function HomePage() {
  const {
    posts,
    setPosts,
    profilePosts,
    setProfilePosts,
    followingPosts,
    setFollowingPosts,
    pageNumber,
    setPageNumber,
    hasMorePosts,
    setHasMorePosts,
    cachedProfilePath,
  } = usePostsContext();
  const { loggedIn } = useAuthContext();
  const [updateKey, setUpdateKey] = useState(0);

  const {
    loading,
    initialLoading,
    skeletonCount,
    fetchPosts,
    handleUpdatePost,
  } = useFetchPosts(
    posts,
    setPosts,
    "/api/v1/posts/batch",
    pageNumber,
    setPageNumber,
    hasMorePosts,
    setHasMorePosts
  );

  const handleCreatePost = (newPost: PostData) => {
    setPosts([newPost, ...posts]);
    setUpdateKey((prevKey) => prevKey + 1);
  };

  const handleDeletePost = (newPosts: PostData[], deletedPostId: string) => {
    setPosts(newPosts);
    setProfilePosts(profilePosts.filter((p) => p.id !== deletedPostId));
    setFollowingPosts(followingPosts.filter((p) => p.id !== deletedPostId));
    setUpdateKey((prevKey) => prevKey + 1);
  };

  const onUpdatePost = (post: PostData) => {
    handleUpdatePost(post);
    if (cachedProfilePath.endsWith(post.author.username)) {
      setProfilePosts(profilePosts.map((p) => (p.id === post.id ? post : p)));
    }
  };

  return (
    <VirtualizedPosts
      id="home"
      key={updateKey}
      initialLoading={initialLoading}
      handleCreatePost={handleCreatePost}
      posts={posts}
      loading={loading}
      hasMorePosts={hasMorePosts}
      skeletonCount={skeletonCount}
      showCreatePost={loggedIn ?? false}
      onEndReached={fetchPosts}
      onUpdatePost={onUpdatePost}
      handleDeletePost={handleDeletePost}
    />
  );
}
