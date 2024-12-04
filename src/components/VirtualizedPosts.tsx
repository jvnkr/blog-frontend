"use client";

import React, { useEffect, useRef, useState } from "react";
import { Post } from "@/components/Post";
import { PostData } from "@/lib/types";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import CreatePost from "./CreatePost";
import { useWindowScroll, useDebounce } from "@uidotdev/usehooks";
import { Skeleton } from "@/components/ui/skeleton";

interface VirtualizedPostsProps {
  id: string;
  posts: PostData[];
  loading: boolean;
  initialLoading: boolean;
  skeletonCount: number;
  hasMorePosts: boolean;
  onEndReached: () => void;
  handleCreatePost: (newPost: PostData) => void;
  handleDeletePost: (newPosts: PostData[], deletedPostUsername: string) => void;
  onUpdatePost: (post: PostData) => void;
  showCreatePost?: boolean;
  paddingStart?: number;
}

export function VirtualizedPosts({
  id,
  posts,
  loading,
  initialLoading,
  skeletonCount,
  hasMorePosts,
  onEndReached,
  onUpdatePost,
  handleCreatePost,
  handleDeletePost,
  showCreatePost = false,
  paddingStart = 60 + 16,
}: VirtualizedPostsProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const initialFetchPreventedRef = useRef(false);

  // Retrieve scroll position and virtualization state from browser history
  const {
    [`vtableItemCount_${id}`]: restoreItemCount,
    [`vtableOffset_${id}`]: restoreOffset,
    [`vtableMeasureCache_${id}`]: restoreMeasurementsCache,
  } = typeof window !== "undefined" ? window.history.state || {} : {};

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize TanStack virtual window scroller
  const virtualizer = useWindowVirtualizer({
    estimateSize: () => 256, // Estimated height of each post
    overscan: 5, // Number of items to render outside of viewport
    paddingStart,
    count:
      posts.length === undefined
        ? restoreItemCount
        : posts.length + (showCreatePost ? 1 : 0),
    initialOffset: restoreOffset,
    initialMeasurementsCache: restoreMeasurementsCache,
  });

  // Track scroll position with debounce to avoid too frequent updates
  const scrollPos = useDebounce(useWindowScroll()[0]?.y || 0, 500);

  // Save virtualization state to browser history
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.history.replaceState(
      {
        ...window.history.state,
        [`vtableItemCount_${id}`]: posts.length + (showCreatePost ? 1 : 0),
        [`vtableOffset_${id}`]: scrollPos,
        [`vtableMeasureCache_${id}`]: virtualizer.measurementsCache,
      },
      document.title,
      window.location.href
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length, scrollPos, virtualizer.measurementsCache]);

  // Handle infinite scroll loading
  useEffect(() => {
    if (!mounted) return;

    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;

    // useFetchPosts will handle the initial fetch
    if (!initialFetchPreventedRef.current) {
      initialFetchPreventedRef.current = true;
      return;
    }

    if (lastItem.index >= posts.length - 1 && !loading && hasMorePosts) {
      onEndReached();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    virtualizer.getVirtualItems(),
    loading,
    posts.length,
    hasMorePosts,
    mounted,
    onEndReached,
  ]);

  if (!mounted) {
    return null;
  }

  if (initialLoading && posts.length === 0) {
    return (
      <div
        style={{
          paddingTop: `${paddingStart}px`,
        }}
        className="flex flex-col gap-4 px-4 w-full"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full bg-zinc-900/70 h-[16rem] rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex overflow-hidden px-4 justify-start items-center flex-col w-full"
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${
              virtualizer.getVirtualItems()[0]?.start ?? 0
            }px)`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            if (!initialLoading && showCreatePost && virtualRow.index === 0) {
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="pb-4"
                >
                  <CreatePost setPosts={handleCreatePost} />
                </div>
              );
            }

            if (loading && virtualRow.index >= posts.length - 1) {
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="pb-4"
                >
                  <div className="flex justify-center items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-zinc-700 border-t-zinc-300 animate-spin" />
                  </div>
                </div>
              );
            }

            const postIndex = showCreatePost
              ? virtualRow.index - 1
              : virtualRow.index;

            if (initialLoading) return null;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="pb-4"
              >
                <Post
                  posts={posts}
                  post={posts[postIndex]}
                  onUpdatePost={onUpdatePost}
                  handleDeletePost={handleDeletePost}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
