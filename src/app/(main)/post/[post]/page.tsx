"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import PostPage from "@/components/PostPage";
import { useAuthContext } from "@/context/AuthContext";
import useFetcher from "@/hooks/useFetcher";
import { PostData } from "@/lib/types";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PostData | null>(null);
  const params = useParams<{ post: string }>();
  const { accessToken } = useAuthContext();
  const fetcher = useFetcher();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetcher(`/api/v1/posts/${params.post}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (res.status === 404) {
          router.push("/");
          return;
        }

        const postData = await res.json();

        if (!postData?.id || !postData?.author || !postData?.description) {
          console.log("Invalid post data received");
          router.push("/");
          return;
        }

        setData(postData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
        router.push("/");
      }
    };

    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, router]);

  if (loading || !data) {
    return (
      <div className="pt-[76px]">
        <LoadingSpinner />
      </div>
    );
  }

  return <PostPage {...data} />;
}
