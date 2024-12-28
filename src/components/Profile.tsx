"use client";

import React, { useEffect } from "react";
import { VirtualizedItems } from "./VirtualizedPosts";
import { usePostsContext } from "@/context/PostsContext";
import { useFetchItems } from "@/hooks/useFetchPosts";
import { PostData } from "@/lib/types";
import { usePathname } from "next/navigation";
import { Post } from "./Post";
import { useAuthContext } from "@/context/AuthContext";
import ProfileInfo from "./ProfileInfo";
import CreatePost from "./CreatePost";

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
    setFollowers,
    setFollowingUser,
  } = usePostsContext();
  const { username: authUsername, loggedIn } = useAuthContext();
  const pathname = usePathname();
  const pathUsername = pathname.split("/")[1].replace("@", "");

  const {
    loading,
    initialLoading,
    skeletonCount,
    fetchItems: fetchPosts,
    handleUpdateItem: handleUpdatePost,
  } = useFetchItems(
    profilePosts,
    setProfilePosts,
    `/api/v1/posts/batch/${pathUsername}`,
    profilePageNumber,
    setProfilePageNumber,
    hasMoreProfilePosts,
    setHasMoreProfilePosts
  );

  useEffect(() => {
    if (loggedIn && !cachedProfilePath.endsWith(pathUsername)) {
      setProfilePosts([]);
      setProfilePageNumber(0);
      setProfileData(null);
      setFollowers(null);
      setFollowingUser(null);

      setHasMoreProfilePosts(true);
    }
    setCachedProfilePath(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const onUpdatePost = (post: PostData) => {
    handleUpdatePost(post);
    setPosts(posts.map((p) => (p.id === post.id ? post : p)));
    setFollowingPosts(followingPosts.map((p) => (p.id === post.id ? post : p)));
  };

  return (
    <div className="flex relative flex-col w-full">
      <ProfileInfo
        username={username}
        name={name}
        bio={bio}
        verified={verified}
        followers={followers}
        following={following}
        createdAt={createdAt}
      />
      <VirtualizedItems
        ItemComponent={(index) => (
          <Post
            key={profilePosts[index].id}
            posts={profilePosts}
            post={profilePosts[index]}
            onUpdatePost={onUpdatePost}
          />
        )}
        id={authUsername}
        items={profilePosts}
        loading={loading}
        CreateItemComponent={
          loggedIn && authUsername === username ? <CreatePost /> : null
        }
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
