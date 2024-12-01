import { useState, useEffect } from "react";
import { fetcher } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { PostData } from "@/lib/types";

export function useFetchPosts(
  posts: PostData[],
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>,
  endpoint: string,
  pageNumber: number,
  setPageNumber: React.Dispatch<React.SetStateAction<number>>,
  hasMorePosts: boolean,
  setHasMorePosts: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [loading, setLoading] = useState(posts.length === 0);
  const [skeletonCount, setSkeletonCount] = useState(0);

  useEffect(() => {
    console.log(posts);
    if (posts.length === 0)
      setSkeletonCount(Math.floor(window.innerHeight / (16 * 16)));
  }, []);

  const fetchPosts = async () => {
    if (!hasMorePosts) return;
    try {
      const accessToken = getCookie("a_t") as string;
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        cache: "force-cache",
        body: JSON.stringify({ pageNumber }),
        credentials: "include",
      });

      if (!response.ok) {
        setHasMorePosts(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts((prev) => [...prev, ...data]);
      setPageNumber((prev) => prev + 1);
      setHasMorePosts(data.length > 0);
      setLoading(false);
      toast.success("Successfully fetched posts");
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setLoading(false);
      setHasMorePosts(false);
      toast.error("Failed to fetch posts");
    }
  };

  const handleUpdatePost = (post: PostData) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? post : p))
    );
  };

  return { loading, skeletonCount, fetchPosts, handleUpdatePost };
}
