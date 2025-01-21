"use client";
import Profile from "@/components/profile/Profile";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePostsContext } from "@/context/PostsContext";
import useFetcher from "@/hooks/useFetcher";
import { useAuthContext } from "@/context/AuthContext";
import { notFound } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { setProfileData, profileData, setFollowers, setFollowingUser } =
    usePostsContext();
  const [loading, setLoading] = useState(profileData ? false : true);
  const params = useParams();
  const { accessToken, loggedIn } = useAuthContext();
  const [isNotFound, setIsNotFound] = useState(false);
  const fetcher = useFetcher();

  if (!decodeURIComponent(params.profile as string).startsWith("@")) {
    notFound();
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decodedProfile = decodeURIComponent(params.profile as string);

        const res = await fetcher(`/api/v1/users/${decodedProfile.slice(1)}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error, { cause: res.status });
        }

        setLoading(false);
        setProfileData(data);
        setFollowers(data.followers);
        setFollowingUser(data.followingUser);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          if (error.cause === 404) {
            setProfileData({
              username: decodeURIComponent(params.profile as string).slice(1),
              name: decodeURIComponent(params.profile as string).slice(1),
              bio: "",
              verified: false,
              followers: 0,
              following: 0,
              createdAt: "",
              postsCount: 0,
              isNotFound: true,
            });
            setIsNotFound(true);
          }
        }
        setLoading(false);
      }
    };

    if (!profileData) fetchUser();
  }, [
    accessToken,
    fetcher,
    params.profile,
    profileData,
    router,
    setFollowers,
    setFollowingUser,
    setProfileData,
  ]);

  useEffect(() => {
    if (!loggedIn) {
      router.back();
    }
  }, [loggedIn, router]);

  if (loading || !profileData) {
    return (
      <div className="pt-[76px]">
        <LoadingSpinner />
      </div>
    );
  }

  return <Profile {...profileData} isNotFound={isNotFound} />;
}
