"use client";

import CreatePost from "@/components/CreatePost";
import { Post } from "@/components/Post";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import { usePostsContext } from "@/context/PostsContext";
import { PostData } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { toast } from "sonner";

export default function HomePage() {
  const { posts, setPosts, pageNumber, setPageNumber } = usePostsContext();
  const { loggedIn } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(0);

  const handleUpdatePost = (post: PostData) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? post : p))
    );
  };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [loading]);

  async function getPosts(accessToken: string) {
    try {
      const response = await fetcher(`/api/v1/posts/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        body: JSON.stringify({
          pageNumber: 0,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        setLoading(false);
        toast.error(`Failed to fetch posts: ${response.status}`);
        return [];
      }
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setLoading(false);
      toast.error("Failed to fetch posts");
      return [];
    }
  }
  useEffect(() => {
    if (posts.length === 0) {
      getPosts(getCookie("a_t") as string).then((fetchedPosts) => {
        setPosts(fetchedPosts);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    setSkeletonCount(Math.floor(window.innerHeight / (16 * 16)));
  }, [posts.length, setPosts]);

  return (
    <>
      <Virtuoso
        useWindowScroll
        style={{
          zIndex: 9,
          height: "100%",
          overflow: "hidden",
        }}
        className="flex bg-zinc-900 bg-opacity-[0.45] border border-y-0 border-[#272629] min-h-screen overflow-x-hidden justify-start items-center flex-col w-[45rem] mx-auto"
        totalCount={
          (loading ? skeletonCount : posts.length) +
          (loggedIn && !loading ? 1 : 0)
        }
        endReached={async () => {
          if (!loading && posts.length > 0) {
            try {
              const accessToken = getCookie("a_t") as string;
              const response = await fetcher(`/api/v1/posts/batch`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: accessToken
                    ? `Bearer ${getCookie("a_t")}`
                    : "",
                },
                body: JSON.stringify({
                  pageNumber: pageNumber + 1,
                }),
              });
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const text = await response.text();
              try {
                const data = JSON.parse(text);
                if (data && data.length > 0) {
                  setPageNumber((prev) => prev + 1);
                  const newPosts = [...posts, ...data];
                  console.log(newPosts);
                  setPosts(newPosts);
                  toast.success("Successfully fetched next posts");
                }
              } catch (parseError) {
                console.error("JSON parse error:", parseError);
                console.log("Raw response:", text);
              }
            } catch (error) {
              console.log(error);
            }
          }
        }}
        components={{
          Header: () => (
            <div className="h-[calc(60px+1rem)]" /> // 60px + gap (1rem)
          ),
          List: React.forwardRef(function VirtuosoList(props, ref) {
            return (
              <div
                {...props}
                ref={ref}
                className="px-4 w-full flex flex-col gap-[1rem]"
              />
            );
          }),
          Footer: () => (
            <div className="h-[1rem]" /> // Fixed height footer spacer
          ),
        }}
        itemContent={(index: number) => {
          if (loggedIn && !loading && index === 0) {
            return <CreatePost key="create-post" setPosts={setPosts} />;
          }

          const adjustedIndex = loggedIn && !loading ? index - 1 : index;

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
              onUpdatePost={handleUpdatePost}
              key={posts[adjustedIndex].id}
              post={posts[adjustedIndex]}
            />
          );
        }}
      />
    </>
  );
}

HomePage.displayName = "HomePage";
