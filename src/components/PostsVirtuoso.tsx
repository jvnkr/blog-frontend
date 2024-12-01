import React from "react";
import { Virtuoso } from "react-virtuoso";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/components/Post";
import { PostData } from "@/lib/types";
import CreatePost from "@/components/CreatePost";

interface PostsVirtuosoProps {
  posts: PostData[];
  loading: boolean;
  skeletonCount: number;
  onEndReached: () => void;
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
  onUpdatePost: (post: PostData) => void;
  showCreatePost?: boolean;
}

export function PostsVirtuoso({
  posts,
  loading,
  skeletonCount,
  onEndReached,
  onUpdatePost,
  setPosts,
  showCreatePost = false,
}: PostsVirtuosoProps) {
  return (
    <Virtuoso
      useWindowScroll
      style={{
        zIndex: 9,
        height: "100%",
        overflow: "hidden",
      }}
      className="flex justify-start items-center flex-col w-full"
      totalCount={
        loading ? skeletonCount : posts.length + (showCreatePost ? 1 : 0)
      }
      endReached={onEndReached}
      components={{
        Header: () => <div className="h-[1rem]" />,
        List: React.forwardRef(function VirtuosoList(props, ref) {
          return (
            <div
              {...props}
              ref={ref}
              className="px-4 w-full flex flex-col gap-[1rem]"
            />
          );
        }),
        Footer: () => <div className="h-[1rem]" />,
      }}
      itemContent={(index: number) => {
        if (!loading && showCreatePost && index === 0) {
          return <CreatePost key="create-post" setPosts={setPosts} />;
        }

        const adjustedIndex = showCreatePost ? index - 1 : index;

        if (loading) {
          return (
            <Skeleton
              key={index}
              className="w-full bg-zinc-900/70 h-[16rem] rounded-xl mb-2"
            />
          );
        }

        if (!posts[adjustedIndex]) {
          return null;
        }

        return (
          <Post
            setPosts={setPosts}
            onUpdatePost={onUpdatePost}
            key={posts[adjustedIndex].id}
            post={posts[adjustedIndex]}
          />
        );
      }}
    />
  );
}
