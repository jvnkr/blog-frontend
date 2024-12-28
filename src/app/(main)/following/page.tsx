"use client";

import { useFetchItems } from "@/hooks/useFetchPosts";
import { usePostsContext } from "@/context/PostsContext";
import { VirtualizedItems } from "@/components/VirtualizedPosts";
import { PostData } from "@/lib/types";
import { Post } from "@/components/Post";

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
    cachedProfilePath,
  } = usePostsContext();

  const {
    loading,
    initialLoading,
    skeletonCount,
    fetchItems: fetchPosts,
    handleUpdateItem: handleUpdatePost,
  } = useFetchItems(
    followingPosts,
    setFollowingPosts,
    "/api/v1/posts/batch/following",
    followingPageNumber,
    setFollowingPageNumber,
    hasMoreFollowingPosts,
    setHasMoreFollowingPosts
  );

  const onUpdatePost = (post: PostData) => {
    handleUpdatePost(post);
    if (cachedProfilePath.endsWith(post.author.username)) {
      setProfilePosts(profilePosts.map((p) => (p.id === post.id ? post : p)));
    }
    setPosts(posts.map((p) => (p.id === post.id ? post : p)));
  };

  return (
    <VirtualizedItems
      id="following"
      items={followingPosts}
      loading={loading}
      initialLoading={initialLoading}
      skeletonCount={skeletonCount}
      onEndReached={fetchPosts}
      hasMoreItems={hasMoreFollowingPosts}
      ItemComponent={(index) => (
        <Post
          key={followingPosts[index].id}
          post={followingPosts[index]}
          posts={followingPosts}
          onUpdatePost={onUpdatePost}
        />
      )}
    />
  );
}
