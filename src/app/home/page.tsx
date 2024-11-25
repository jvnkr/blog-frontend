"use client";

import CreatePost from "@/components/CreatePost";
import { Post } from "@/components/Post";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import { PostData } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { loggedIn } = useAuthContext();
  const handleUpdatePost = (post: PostData) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? post : p))
    );
  };

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
        cache: "force-cache",
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log(data);
        setLoading(false);
        return data;
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.log("Raw response:", text);
        setLoading(false);
        return [];
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      return [];
    }
  }

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [loading]);

  useEffect(() => {
    getPosts(getCookie("a_t") as string).then((posts) => setPosts(posts));
  }, []);

  return (
    <>
      {loggedIn && !loading && <CreatePost setPosts={setPosts} />}
      {posts &&
        posts.length > 0 &&
        posts.map((post: PostData) => (
          <Post
            setPosts={setPosts}
            onUpdatePost={handleUpdatePost}
            key={post.id}
            post={post}
          />
        ))}
      {loading &&
        // 16rem is the height of a post, calculating how many skeletons fit in the viewport
        Array.from({ length: Math.floor(window.innerHeight / (16 * 16)) }).map(
          (_, index) => (
            <Skeleton key={index} className="w-full h-[16rem] rounded-xl" />
          )
        )}
    </>
  );
}
