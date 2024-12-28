"use client";
import Profile from "@/components/Profile";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePostsContext } from "@/context/PostsContext";
import useFetcher from "@/hooks/useFetcher";
import { useAuthContext } from "@/context/AuthContext";

export default function Page() {
  const router = useRouter();
  const { setProfileData, profileData, setFollowers, setFollowingUser } =
    usePostsContext();
  const [loading, setLoading] = useState(profileData ? false : true);
  const params = useParams();
  const { accessToken } = useAuthContext();
  const fetcher = useFetcher();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decodedProfile = decodeURIComponent(
          params.profile as string
        ).replace("%40", "@");

        if (!decodedProfile.startsWith("@")) {
          router.push("/");
          return;
        }

        const res = await fetcher(`/api/v1/users/${decodedProfile.slice(1)}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 404) {
          router.push("/");
          return;
        }

        const data = await res.json();

        if (!data.username) {
          router.push("/");
          return;
        }

        setProfileData(data);
        setFollowers(data.followers);
        setFollowingUser(data.followingUser);
      } catch (error) {
        console.error(error);
        router.push("/");
      } finally {
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

  if (loading || !profileData) {
    return (
      <div className="pt-[76px]">
        <LoadingSpinner />
      </div>
    );
  }

  return <Profile {...profileData} />;
}
