"use client";

import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";
import { CalendarDays, BadgeCheck } from "lucide-react";
import { VirtualizedPosts } from "./VirtualizedPosts";
import { usePostsContext } from "@/context/PostsContext";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { PostData } from "@/lib/types";
import { usePathname } from "next/navigation";

interface ProfileProps {
  username: string;
  name: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  createdAt: string;
}

const Profile = ({
  username,
  name,
  bio,
  verified,
  followers,
  following,
  createdAt,
}: ProfileProps) => {
  const {
    profilePosts,
    posts,
    setPosts,
    followingPosts,
    setFollowingPosts,
    setProfilePosts,
    profilePageNumber,
    setProfilePageNumber,
    hasMoreProfilePosts,
    setHasMoreProfilePosts,
    cachedProfilePath,
    setCachedProfilePath,
  } = usePostsContext();
  const [updateKey, setUpdateKey] = useState(0);
  const {
    loading,
    initialLoading,
    skeletonCount,
    fetchPosts,
    handleUpdatePost,
  } = useFetchPosts(
    profilePosts,
    setProfilePosts,
    `/api/v1/posts/batch/${username}`,
    profilePageNumber,
    setProfilePageNumber,
    hasMoreProfilePosts,
    setHasMoreProfilePosts
  );

  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/@") && pathname !== cachedProfilePath) {
      setProfilePosts([]);
      setProfilePageNumber(0);
      setHasMoreProfilePosts(true);
      fetchPosts();
    }
    setCachedProfilePath(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, cachedProfilePath]);

  const handleCreatePost = (newPost: PostData) => {
    setProfilePosts([newPost, ...profilePosts]);
    setUpdateKey((prevKey) => prevKey + 1);
  };

  const handleDeletePost = (newPosts: PostData[], deletedPostId: string) => {
    setProfilePosts(newPosts);
    setPosts(posts.filter((p) => p.id !== deletedPostId));
    setFollowingPosts(followingPosts.filter((p) => p.id !== deletedPostId));
    setUpdateKey((prevKey) => prevKey + 1);
  };

  const onUpdatePost = (post: PostData) => {
    handleUpdatePost(post);
    setPosts(posts.map((p) => (p.id === post.id ? post : p)));
  };

  return (
    <div className="flex relative flex-col w-full">
      <div className="w-full h-[12rem] overflow-hidden relative">
        <div className="absolute inset-0 bg-zinc-900">
          <svg width="100%" height="100%" className="block">
            <defs>
              <path
                id="curve"
                d="M -100 50 Q 200 -30, 500 50 Q 800 130, 3000 50"
              />
            </defs>
            <pattern
              id="curve-pattern"
              patternUnits="userSpaceOnUse"
              width="1000"
              height="80"
            >
              <use href="#curve" stroke="#252525" strokeWidth="1" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#curve-pattern)" />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 40)"
            />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 80)"
            />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 120)"
            />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 160)"
            />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 200)"
            />
          </svg>
        </div>
        <div
          style={{
            width: "143.2px",
            height: "144px",
          }}
          className="absolute rounded-full left-[0.9rem] bottom-[-1.5px] translate-y-1/2 border-2 border-zinc-800"
        ></div>
      </div>
      <div className="flex relative rounded-b-3xl border ml-[-1px] mr-[-1px] border-zinc-800 pt-[65px] flex-col gap-2 bg-zinc-900">
        <Avatar
          size={140}
          name={name}
          className="absolute left-[1rem] top-0 -translate-y-1/2 border-4 border-zinc-900"
        />
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-col text-[15px]">
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-bold">{name}</h1>
              {verified && <BadgeCheck className="w-4 h-4 fill-blue-500" />}
            </div>
            <p className="text-sm text-gray-500">@{username}</p>
          </div>
          <p className="text-sm text-gray-500">{bio}</p>
          <div className="flex items-start gap-1 text-sm text-gray-500">
            <CalendarDays className="w-4 h-4" />
            <span className="font-semibold">
              Joined{" "}
              {new Date(createdAt).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex text-sm items-center gap-3">
            <span className="font-semibold">
              {followers}{" "}
              <span className="text-gray-500 ml-[-2px]">Followers</span>
            </span>
            <span className="font-semibold">
              {following}{" "}
              <span className="text-gray-500 ml-[-2px]">Following</span>
            </span>
          </div>
        </div>
      </div>
      <VirtualizedPosts
        key={updateKey}
        id={username}
        posts={profilePosts}
        loading={loading}
        initialLoading={initialLoading}
        skeletonCount={skeletonCount}
        hasMorePosts={hasMoreProfilePosts}
        handleCreatePost={handleCreatePost}
        handleDeletePost={handleDeletePost}
        onUpdatePost={onUpdatePost}
        onEndReached={fetchPosts}
        paddingStart={16}
      />
    </div>
  );
};

export default Profile;
