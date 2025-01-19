"use client";

import { useFetchItems } from "@/hooks/useFetchItems";
import { usePostsContext } from "@/context/PostsContext";
import { VirtualizedItems } from "@/components/VirtualizedItems";
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

  if (!initialLoading && !loading && !hasMoreFollowingPosts && followingPosts.length === 0) {
    return (
      <div className="flex pt-[60px] flex-col text-center w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="text-white text-lg font-semibold">
          Seems like you are not following anyone yet
        </span>
        <span className="text-neutral-500 text-sm">
          Follow people to see their posts here
        </span>
      </div>
    );
  }

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
