import { useState, useEffect, useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(0);
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (posts.length === 0 && !initialFetchRef.current && hasMorePosts) {
      // Hide overflow when initially loading with no posts
      document.body.style.overflow = "hidden";
      setSkeletonCount(Math.floor(window.innerHeight / (16 * 16)));
      setInitialLoading(true);
      fetchPosts().then(() => {
        setInitialLoading(false);
      });
    }
    return () => {
      // Restore overflow when component unmounts
      document.body.style.overflow = "visible";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length, hasMorePosts]); // Add dependencies to prevent double fetch

  const fetchPosts = async () => {
    if (loading || !hasMorePosts || initialFetchRef.current) return;
    initialFetchRef.current = true;
    setLoading(true);
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
      toast.success("Posts fetched successfully");
      setHasMorePosts(data.length > 0);
      setLoading(false);
      initialFetchRef.current = false;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMorePosts(false);
      setLoading(false);
      initialFetchRef.current = false;
    } finally {
      setLoading(false);
      // Restore overflow after posts are loaded or on error
      document.body.style.overflow = "visible";
    }
  };

  const handleUpdatePost = (post: PostData) => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
  };

  return {
    loading,
    skeletonCount,
    initialLoading,
    fetchPosts,
    handleUpdatePost,
  };
}
