"use client";

import React, { useEffect } from "react";
import { VirtualizedItems } from "./VirtualizedItems";
import { usePostsContext } from "@/context/PostsContext";
import { useFetchItems } from "@/hooks/useFetchItems";
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
  postsCount: number;
  createdAt: string;
  isNotFound: boolean;
}

const Profile = ({
  username,
  name,
  bio,
  verified,
  followers,
  following,
  createdAt,
  isNotFound,
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
    if (cachedProfilePath && cachedProfilePath !== pathname) {
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
        isNotFound={isNotFound}
        username={username}
        name={name}
        bio={bio}
        verified={verified}
        followers={followers}
        following={following}
        createdAt={createdAt}
        postsCount={posts.length}
      />
      {!isNotFound && (
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
      )}
      {isNotFound && (
        <div className="flex relative flex-col w-full">
          <div className="flex pt-[60px] flex-col text-center w-full">
            <span className="text-white text-lg font-semibold">
              Seems like this user doesn&apos;t exist
            </span>
            <span className="text-neutral-500 text-sm">
              Please check the username and try again
            </span>
          </div>
        </div>
      )}
      {!isNotFound &&
        authUsername !== username &&
        !initialLoading &&
        !loading &&
        !hasMoreProfilePosts &&
        profilePosts.length === 0 && (
          <div className="flex flex-col text-center w-full py-[4rem]">
            <span className="text-white text-lg font-semibold">
              Seems like this user doesn&apos;t have any posts yet
            </span>
            <span className="text-neutral-500 text-sm">
              Their posts will appear here once they start creating them
            </span>
          </div>
        )}
      {!isNotFound &&
        authUsername === username &&
        !initialLoading &&
        !loading &&
        !hasMoreProfilePosts &&
        profilePosts.length === 0 && (
          <div className="flex pt-[60px] flex-col text-center w-full">
            <span className="text-white text-lg font-semibold">
              Seems like you don&apos;t have any posts yet
            </span>
            <span className="text-neutral-500 text-sm">
              Your posts will appear here once you start creating them
            </span>
          </div>
        )}
    </div>
  );
};

export default Profile;
