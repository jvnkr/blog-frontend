"use client";

import { Post } from "@/components/Post";
import { PostData } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { Key, useEffect, useState } from "react";

async function getPosts(accessToken: string) {
  try {
    const response = await fetcher(`/api/v1/posts/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        pageNumber: 0,
      }),
      credentials: "include",
      cache: "force-cache",
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const handleUpdatePost = (post: PostData) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? post : p))
    );
  };

  useEffect(() => {
    getPosts(getCookie("a_t") as string).then((posts) => setPosts(posts));
  }, []);

  return (
    <>
      {posts &&
        posts.length > 0 &&
        posts.map((post: PostData, index: Key | null | undefined) => (
          <Post onUpdatePost={handleUpdatePost} key={index} post={post} />
        ))}
    </>
  );
}
