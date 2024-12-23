"use client";

import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";
import { CalendarDays, BadgeCheck, UserRoundPen } from "lucide-react";
import { VirtualizedItems } from "./VirtualizedPosts";
import { usePostsContext } from "@/context/PostsContext";
import { useFetchItems } from "@/hooks/useFetchPosts";
import { PostData } from "@/lib/types";
import { usePathname } from "next/navigation";
import { Post } from "./Post";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useAuthContext } from "@/context/AuthContext";

export interface ProfileProps {
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
    setProfileData,
  } = usePostsContext();
  const { loggedIn, username: currentUsername } = useAuthContext();
  const [updateKey, setUpdateKey] = useState(0);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedName, setEditedName] = useState(name);
  const [editedBio, setEditedBio] = useState<string | null>(bio);

  const {
    loading,
    initialLoading,
    skeletonCount,
    fetchItems: fetchPosts,
    handleUpdateItem: handleUpdatePost,
  } = useFetchItems(
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
    if (
      pathname.startsWith("/@") &&
      cachedProfilePath &&
      pathname !== cachedProfilePath
    ) {
      setProfilePosts([]);
      setProfilePageNumber(0);
      setProfileData(null);
      setHasMoreProfilePosts(true);
      // Wait for state updates to complete before fetching
      Promise.resolve().then(() => {
        fetchPosts();
      });
    }
    setCachedProfilePath(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, cachedProfilePath]);

  const handleDeletePost = (newPosts: PostData[], deletedPostId: string) => {
    setProfilePosts(newPosts);
    setPosts(posts.filter((p) => p.id !== deletedPostId));
    setFollowingPosts(followingPosts.filter((p) => p.id !== deletedPostId));
    setUpdateKey((prevKey) => prevKey + 1);
  };

  const onUpdatePost = (post: PostData) => {
    handleUpdatePost(post);
    setPosts(posts.map((p) => (p.id === post.id ? post : p)));
    setFollowingPosts(followingPosts.map((p) => (p.id === post.id ? post : p)));
  };

  return (
    <div className="flex relative flex-col w-full">
      <div className="w-full h-[12rem] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
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
            width: "142px",
            height: "143px",
          }}
          className="absolute rounded-full left-[0.95rem] bottom-[-1.5px] translate-y-1/2 bg-zinc-800"
        ></div>
      </div>
      <div className="flex relative rounded-b-3xl border ml-[-1px] mr-[-1px] border-zinc-800 pt-[65px] flex-col gap-2 bg-zinc-900">
        {loggedIn && username === currentUsername && (
          <Dialog>
            <DialogTrigger>
              <UserRoundPen className="absolute top-2 right-2 text-zinc-300 w-10 h-10 cursor-pointer p-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-[0.5] transition-all duration-150" />
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-[#272629]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  {
                    "Make quick changes to your profile here. Click save when you're done."
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center items-center gap-2">
                <Label className="min-w-[80px]">Name</Label>
                <Input
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder={name ? "" : "Name"}
                  defaultValue={name}
                />
              </div>
              <div className="flex justify-center items-center gap-2">
                <Label className="min-w-[80px]">Username</Label>
                <Input
                  onChange={(e) => setEditedUsername(e.target.value)}
                  placeholder={username ? "" : "Username"}
                  defaultValue={username}
                />
              </div>
              <div className="flex justify-center items-center gap-2">
                <Label className="min-w-[80px]">Bio</Label>
                <Input
                  onChange={(e) =>
                    setEditedBio(
                      e.target.value.length > 0 ? e.target.value : null
                    )
                  }
                  placeholder={bio ? "" : "Bio"}
                  defaultValue={bio}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end w-full items-center">
                <Button
                  disabled={
                    editedUsername === username &&
                    editedName === name &&
                    editedBio === bio
                  }
                  className="w-fit cursor-pointer"
                >
                  Save changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
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
      <VirtualizedItems
        ItemComponent={(index) => (
          <Post
            posts={profilePosts}
            post={profilePosts[index]}
            onUpdatePost={onUpdatePost}
            handleDeletePost={handleDeletePost}
          />
        )}
        key={updateKey}
        id={username}
        items={profilePosts}
        loading={loading}
        initialLoading={initialLoading}
        skeletonCount={skeletonCount}
        hasMoreItems={hasMoreProfilePosts}
        onEndReached={fetchPosts}
        paddingStart={16}
      />
    </div>
  );
};

export default Profile;
