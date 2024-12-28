"use client";

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
          key={posts[index].id}
          posts={posts}
          post={posts[index]}
          onUpdatePost={onUpdatePost}
        />
      )}
      id="home"
      initialLoading={initialLoading}
      CreateItemComponent={loggedIn ? <CreatePost /> : null}
      items={posts}
      loading={loading}
      hasMoreItems={hasMorePosts}
      skeletonCount={skeletonCount}
      onEndReached={fetchPosts}
    />
  );
}
