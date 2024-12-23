"use client";

import React, { useState } from "react";
import { useFetchItems } from "@/hooks/useFetchPosts";
import { usePostsContext } from "@/context/PostsContext";
import { VirtualizedItems } from "@/components/VirtualizedPosts";
import { PostData } from "@/lib/types";
import { Post } from "@/components/Post";
import CreatePost from "@/components/CreatePost";
import { useAuthContext } from "@/context/AuthContext";

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
  const [updateKey, setUpdateKey] = useState(0);
  const { loggedIn } = useAuthContext();

  const {
    loading,
    initialLoading,
    skeletonCount,
    fetchItems: fetchPosts,
    handleUpdateItem,
  } = useFetchItems(
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
    if (cachedProfilePath.endsWith(newPost.author.username)) {
      setProfilePosts([newPost, ...profilePosts]);
    }
    setUpdateKey((prevKey) => prevKey + 1);
  };

  const handleDeletePost = (newPosts: PostData[], deletedPostId: string) => {
    setPosts(newPosts);
    setProfilePosts(profilePosts.filter((p) => p.id !== deletedPostId));
    setFollowingPosts(followingPosts.filter((p) => p.id !== deletedPostId));
    setUpdateKey((prevKey) => prevKey + 1);
  };

  const onUpdatePost = (post: PostData) => {
    handleUpdateItem(post);
    if (cachedProfilePath.endsWith(post.author.username)) {
      setProfilePosts(profilePosts.map((p) => (p.id === post.id ? post : p)));
    }
    setFollowingPosts(followingPosts.map((p) => (p.id === post.id ? post : p)));
  };

  return (
    <VirtualizedItems
      ItemComponent={(index) => (
        <Post
          posts={posts}
          post={posts[index]}
          onUpdatePost={onUpdatePost}
          handleDeletePost={handleDeletePost}
        />
      )}
      id="home"
      key={updateKey}
      initialLoading={initialLoading}
      showCreateItem={loggedIn ?? false}
      CreateItemComponent={<CreatePost setPosts={handleCreatePost} />}
      items={posts}
      loading={loading}
      hasMoreItems={hasMorePosts}
      skeletonCount={skeletonCount}
      onEndReached={fetchPosts}
    />
  );
}
