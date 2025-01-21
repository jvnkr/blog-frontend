"use client";

import { useFetchItems } from "@/hooks/useFetchItems";
import { usePostsContext } from "@/context/PostsContext";
import { VirtualizedItems } from "@/components/VirtualizedItems";
import { PostData } from "@/lib/types";
import { Post } from "@/components/post/Post";
import CreatePost from "@/components/post/CreatePost";
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
    <>
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
      {!initialLoading && !loading && !hasMorePosts && posts.length === 0 && (
        <div className="flex pt-[60px] flex-col text-center w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-white text-lg font-semibold">
            Seems like there are no posts yet
          </span>
          <span className="text-neutral-500 text-sm">
            Be the first to post something
          </span>
        </div>
      )}
    </>
  );
}
