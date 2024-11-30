"use client";

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

export default function FollowingPage() {
  const {
    followingPosts,
    setFollowingPosts,
    followingPageNumber,
    setFollowingPageNumber,
  } = usePostsContext();
  const { loggedIn } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(0);

  const handleUpdatePost = (post: PostData) => {
    setFollowingPosts((prevPosts) =>
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
      const response = await fetcher(`/api/v1/posts/batch/following`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        body: JSON.stringify({
          pageNumber: followingPageNumber + 1,
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
    console.log("Following posts len", followingPosts.length);
    if (followingPosts.length === 0) {
      getPosts(getCookie("a_t") as string).then((fetchedPosts) => {
        console.log("lol", fetchedPosts);
        setFollowingPosts(fetchedPosts);
        setFollowingPageNumber((prev) => prev + 1);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    setSkeletonCount(Math.floor(window.innerHeight / (16 * 16)));
  }, [followingPosts.length, setFollowingPosts]);

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
        totalCount={loading ? skeletonCount : followingPosts.length}
        endReached={async () => {
          if (!loading && followingPosts.length > 0) {
            try {
              const response = await fetcher(`/api/v1/posts/batch/following`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getCookie("a_t")}`,
                },
                body: JSON.stringify({
                  pageNumber: followingPageNumber + 1,
                }),
                credentials: "include",
              });
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const text = await response.text();
              try {
                const data = JSON.parse(text);
                if (data && data.length > 0) {
                  setFollowingPageNumber((prev) => prev + 1);
                  console.log(data);
                  setFollowingPosts((prev) => [...prev, ...data]);
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
          if (loading) {
            return (
              <Skeleton
                key={index}
                className="w-full bg-zinc-900/70 h-[16rem] rounded-xl mb-2"
              />
            );
          }

          if (!followingPosts[index]) {
            console.log("No post found at index", index);
            return null;
          }

          return (
            <Post
              setPosts={setFollowingPosts}
              onUpdatePost={handleUpdatePost}
              key={followingPosts[index].id}
              post={followingPosts[index]}
            />
          );
        }}
      />
    </>
  );
}

FollowingPage.displayName = "FollowingPage";
