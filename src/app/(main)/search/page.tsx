"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PostData, UserData } from "@/lib/types";
import { VirtualizedItems } from "@/components/VirtualizedItems";
import AvatarInfo from "@/components/AvatarInfo";
import { Post } from "@/components/Post";
import { useFetchItems } from "@/hooks/useFetchItems";
import { NotepadText, UsersRound } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("q");
  const filter = searchParams.get("filter");
  const [users, setUsers] = useState<UserData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [usersPageNumber, setUsersPageNumber] = useState(0);
  const [postsPageNumber, setPostsPageNumber] = useState(0);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const router = useRouter();
  const { loggedIn } = useAuthContext();

  useEffect(() => {
    if (!query) {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/home");
      }
    }
  }, [query, router]);

  // Reset page numbers when pathname changes
  useEffect(() => {
    setUsersPageNumber(0);
    setPostsPageNumber(0);
  }, [pathname]);

  const {
    loading: usersLoading,
    skeletonCount: usersSkeletonCount,
    initialLoading: usersInitialLoading,
    fetchItems: fetchUsers,
  } = useFetchItems(
    users,
    setUsers,
    "/api/v1/users/search?q=" + query + "&filter=" + filter,
    usersPageNumber,
    setUsersPageNumber,
    hasMoreUsers,
    setHasMoreUsers
  );

  const {
    loading: postsLoading,
    skeletonCount: postsSkeletonCount,
    initialLoading: postsInitialLoading,
    fetchItems: fetchPosts,
  } = useFetchItems(
    posts,
    setPosts,
    "/api/v1/posts/search?q=" + query + "&filter=" + filter,
    postsPageNumber,
    setPostsPageNumber,
    hasMorePosts,
    setHasMorePosts
  );

  if (!query) return null;

  if (!loggedIn) {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/login");
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VirtualizedItems
        id="search"
        items={filter === "posts" ? posts : users}
        loading={postsLoading || usersLoading}
        initialLoading={postsInitialLoading || usersInitialLoading}
        skeletonCount={
          filter === "posts" ? postsSkeletonCount : usersSkeletonCount
        }
        hasMoreItems={
          filter === "posts" && hasMorePosts ? hasMorePosts : hasMoreUsers
        }
        onEndReached={() => {
          if (filter === "posts" && hasMorePosts) {
            fetchPosts();
          } else if (filter === "users" && hasMoreUsers) {
            fetchUsers();
          }
        }}
        CreateItemComponent={
          filter === "posts" && users.length > 0 ? (
            <div className="flex flex-col bg-zinc-900 border rounded-lg border-[#272629] h-fit w-full">
              <div className="flex items-center gap-2 p-2 px-3 border-b border-[#272629]">
                <UsersRound className="w-5 h-5 min-w-5 min-h-5" />
                <span className="text-xl font-bold">Top profiles</span>
              </div>
              <div className="flex flex-col p-2 gap-4">
                {users.map((user) => (
                  <div
                    onClick={() => {
                      router.push(`/@${user.username}`);
                    }}
                    className="flex w-full transition-colors duration-150 hover:bg-zinc-800 p-2 rounded-lg cursor-pointer"
                    key={user.username}
                  >
                    <AvatarInfo
                      onClick={() => null}
                      username={user.username}
                      name={user.name}
                      verified={user.verified}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : filter === "users" && posts.length > 0 ? (
            <div className="flex flex-col bg-zinc-900 border rounded-lg border-[#272629] h-fit w-full">
              <div className="flex items-center gap-2 p-2 px-3 border-b border-[#272629]">
                <NotepadText className="w-5 h-5 min-w-5 min-h-5" />
                <span className="text-xl font-bold">Top posts</span>
              </div>
              <div className="flex flex-col p-2 gap-4">
                {posts.map((post) => (
                  <div
                    onClick={() => {
                      router.push(`/post/${post.id}`);
                    }}
                    className="flex w-full transition-colors duration-150 hover:bg-zinc-800 p-2 rounded-lg cursor-pointer"
                    key={post.id}
                  >
                    <Post post={post} onUpdatePost={() => {}} posts={posts} />
                  </div>
                ))}
              </div>
            </div>
          ) : null
        }
        ItemComponent={(index) => {
          const item = filter === "posts" ? posts[index] : users[index];
          if (!item) return null;
          return filter === "posts" ? (
            <Post
              post={item as PostData}
              onUpdatePost={() => {}}
              posts={posts}
            />
          ) : (
            <div
              onClick={() => {
                router.push(`/@${(item as UserData).username}`);
              }}
              className="flex w-full transition-colors duration-150 bg-zinc-900 border border-[#272629] p-2 rounded-lg cursor-pointer"
            >
              <AvatarInfo
                onClick={() => null}
                username={(item as UserData).username}
                name={(item as UserData).name}
                verified={(item as UserData).verified}
              />
            </div>
          );
        }}
      />
    </Suspense>
  );
};

export default SearchPage;
