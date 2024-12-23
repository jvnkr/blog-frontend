"use client";

import { CommentData, PostData } from "@/lib/types";
import { BadgeCheck, Dot } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useAuthContext } from "@/context/AuthContext";
import Comment, { CommentCache, commentCache } from "./Comment";
import { VirtualizedItems } from "./VirtualizedPosts";
import { useFetchItems } from "@/hooks/useFetchPosts";
import CreateComment from "./CreateComment";
import { usePostsContext } from "@/context/PostsContext";
import PostInteraction from "./PostInteraction";
import CreateReply, { replyCache } from "./CreateReply";
import LoadingSpinner from "./LoadingSpinner";
import ViewMoreReplies from "./ViewMoreReplies";
import { toast } from "sonner";
import useFetcher from "@/hooks/useFetcher";

const PostPage = (initialPost: PostData) => {
  const { accessToken, loggedIn, verified, userId, username, name } =
    useAuthContext();
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentsPageNumber, setCommentsPageNumber] = useState(0);
  const [updateKey, setUpdateKey] = useState(0);
  const fetcher = useFetcher();
  const {
    setPosts,
    posts,
    setFollowingPosts,
    followingPosts,
    setProfilePosts,
    profilePosts,
    cachedProfilePath,
  } = usePostsContext();

  const {
    loading,
    initialLoading,
    skeletonCount,
    fetchItems,
    handleUpdateItem,
  } = useFetchItems(
    comments,
    setComments,
    `/api/v1/comments/batch/${post.id}`,
    commentsPageNumber,
    setCommentsPageNumber,
    hasMoreComments,
    setHasMoreComments
  );

  const handleLike = async () => {
    try {
      const res = await fetcher("/api/v1/posts/like/" + post.id, {
        method: post.liked ? "DELETE" : "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        setPosts(
          posts.map((p) => {
            if (p.id === post.id) {
              return {
                ...p,
                liked: !p.liked,
                likes: p.liked ? p.likes - 1 : p.likes + 1,
              };
            }
            return p;
          })
        );
        setFollowingPosts(
          followingPosts.map((p) => {
            if (p.id === post.id) {
              return {
                ...p,
                liked: !p.liked,
                likes: p.liked ? p.likes - 1 : p.likes + 1,
              };
            }
            return p;
          })
        );
        if (cachedProfilePath.includes(post.author.username)) {
          setProfilePosts(
            profilePosts.map((p) => {
              if (p.id === post.id) {
                return {
                  ...p,
                  liked: !p.liked,
                  likes: p.liked ? p.likes - 1 : p.likes + 1,
                };
              }
              return p;
            })
          );
        }
        setPost((p) => ({
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateComment = async (newComment: CommentData) => {
    setComments([newComment, ...comments]);
    setPost({
      ...post,
      comments: post.comments + 1,
    });
    setPosts(
      posts.map((p) => {
        if (p.id === post.id) {
          return { ...p, comments: p.comments + 1 };
        }
        return p;
      })
    );
    setUpdateKey((prev) => prev + 1);
  };

  useEffect(() => {
    return () => {
      commentCache.clear();
      replyCache.clear();
    };
  }, []);

  return (
    <div className="flex relative flex-col w-full">
      <div className="flex relative rounded-b-3xl border ml-[-1px] mr-[-1px] border-zinc-800 pt-[76px] p-6 flex-col gap-2 bg-zinc-900">
        <Link
          href={`/@${post.author.username}`}
          className={
            "flex select-none h-fit justify-start gap-2 items-center w-fit"
          }
        >
          <Avatar name={post.author.name} />
          <div className={"flex h-fit"}>
            <div
              className={
                "flex flex-col relative justify-start items-start text-[15px] font-semibold"
              }
            >
              <div className="flex items-center gap-1">
                <span className="flex items-center h-[19px]">
                  {post.author.name}
                </span>
                {post.author.verified && (
                  <BadgeCheck className="w-4 h-4 fill-blue-500" />
                )}
              </div>
              <span
                className={
                  "flex font-normal text-neutral-500 items-center h-full text-[12px]"
                }
              >
                @{post.author.username}
              </span>
            </div>
          </div>
        </Link>
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <span className="break-all whitespace-pre-line">
          {post.description}
        </span>
        <div className="flex mt-2 flex-col gap-2">
          <p className="flex items-center text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}{" "}
            <Dot className="w-4 h-4 text-gray-500" />
            {new Date(post.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <PostInteraction
          handleLike={handleLike}
          liked={post.liked}
          likes={post.likes}
          replies={post.comments}
        />
      </div>
      <VirtualizedItems
        id="comments"
        key={updateKey}
        onEndReached={fetchItems}
        hasMoreItems={hasMoreComments}
        showCreateItem={loggedIn ?? false}
        CreateItemComponent={
          <CreateComment
            handleCreateComment={handleCreateComment}
            postId={post.id}
          />
        }
        skeletonCount={skeletonCount}
        paddingStart={16}
        loading={loading}
        initialLoading={initialLoading}
        items={comments}
        ItemComponent={(index) => {
          const item = comments[index];

          if (item.id.startsWith("loading-")) {
            return <LoadingSpinner />;
          }

          if (item.id === "view-more") {
            return (
              <ViewMoreReplies
                onClick={async () => {
                  const pageNum =
                    (commentCache.get(item.rootId || item.id)?.pageNumber ??
                      0) + 1;
                  const res = await fetcher(
                    "/api/v1/comments/reply/batch/" + item.rootId || item.id,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                      },
                      body: JSON.stringify({
                        pageNumber: pageNum,
                      }),
                      credentials: "include",
                    }
                  );
                  if (res.ok) {
                    let data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                      const rootId = item.rootId || item.id;
                      const existingComment = commentCache.get(rootId);
                      if (!existingComment) return;

                      data = data.filter(
                        (comment) =>
                          !existingComment.repliesData?.has(comment.id)
                      );

                      if (data.length === 0) return;

                      const newComments = [...comments];
                      const currentRepliesCount = newComments.filter(
                        (comment) =>
                          comment.rootId &&
                          !comment.id.startsWith("reply-") &&
                          !comment.id.startsWith("loading-") &&
                          !comment.id.startsWith("view-more") &&
                          comment.rootId === rootId
                      ).length;

                      const loadedReplies = newComments
                        .slice(index)
                        .findIndex(
                          (comment) =>
                            !comment.rootId || comment.rootId !== rootId
                        );

                      // Find index where replies section ends
                      const repliesEndIndex =
                        loadedReplies === -1
                          ? index +
                            newComments
                              .slice(index)
                              .filter(
                                (comment) =>
                                  comment.rootId === rootId ||
                                  comment.id.startsWith("view-more")
                              ).length
                          : index + loadedReplies;

                      const root = commentCache.get(rootId);
                      const totalReplies = root?.replies ?? item.replies;

                      // Insert new replies before the view more button
                      newComments.splice(repliesEndIndex - 1, 0, ...data);

                      // Remove view more button if we've loaded all replies
                      if (currentRepliesCount + data.length >= totalReplies) {
                        newComments.splice(
                          repliesEndIndex + data.length - 1,
                          1
                        );
                      }

                      setComments(newComments);

                      commentCache.set(rootId, {
                        ...existingComment,
                        repliesData: new Set([
                          ...(existingComment.repliesData || []),
                          ...data.map((c: CommentData) => c.id),
                        ]),
                        pageNumber: pageNum,
                      });
                    }
                  } else {
                    toast.error("Failed to load more replies");
                  }
                }}
              />
            );
          }

          if (item.id.startsWith("reply-")) {
            return (
              <CreateReply
                rootId={item.rootId || item.id.replace("reply-", "")}
                handleCreateReply={(newReply) => {
                  const newComments = [...comments];
                  // Temp solution to find root comment by doing O(n) traversal
                  let idx = index - 1;
                  while (newComments[idx].id !== newComments[index].rootId) {
                    idx--;
                  }

                  // Root item
                  const commentId = newComments[idx].id;
                  if (!commentId) return;
                  const existingComment =
                    commentCache.get(commentId) || ({} as CommentCache);
                  commentCache.set(commentId, {
                    ...existingComment,
                    id: commentId,
                    replies: newComments[idx].replies + 1,
                    repliesData: new Set([
                      ...(commentCache.get(commentId)?.repliesData || []),
                      newReply.id,
                    ]),
                    pageNumber: 0,
                  });
                  newComments[idx] = {
                    ...newComments[idx],
                    replies: newComments[idx].replies + 1,
                  };
                  replyCache.delete(item.id.replace("reply-", ""));
                  newComments.splice(index, 1, newReply);
                  setComments(newComments);
                }}
                handleCancel={() => {
                  const newComments = [...comments];
                  newComments.splice(index, 1);
                  setComments(newComments);
                  replyCache.delete(item.id.replace("reply-", ""));
                }}
                commentId={item.id.replace("reply-", "")}
              />
            );
          }

          // Regular comment display
          return (
            <Comment
              onRepliesLoading={(loading: boolean) => {
                if (loading) {
                  const newComments = [...comments];

                  let startIndex = index + 1;
                  if (
                    index + 1 < comments.length &&
                    comments[index + 1].id.startsWith("reply-")
                  ) {
                    startIndex++;
                  }
                  if (
                    index + 2 < comments.length &&
                    comments[index + 2].id.startsWith("reply-")
                  ) {
                    startIndex++;
                  }
                  if (
                    index + 3 < comments.length &&
                    comments[index + 3].id.startsWith("reply-")
                  ) {
                    startIndex++;
                  }
                  if (
                    (commentCache.get(item.rootId || item.id)?.repliesData
                      ?.size ?? 0) === 1
                  ) {
                    startIndex++;
                  }

                  newComments.splice(startIndex, 0, {
                    id: `loading-${item.id}`,
                    rootId: item.rootId || item.id,
                    text: "",
                    createdAt: "",
                    liked: false,
                    likes: 0,
                    replies: 0,
                    author: {
                      id: "",
                      username: "",
                      name: "",
                      verified: false,
                    },
                  });
                  setComments(newComments);
                } else {
                  // const newComments = [...comments];
                  // newComments.splice(index, 1);
                  // setComments(newComments);
                }
              }}
              onRepliesClick={(data: CommentData[], open: boolean | null) => {
                const newComments = [...comments];
                let startIndex = index + 1;

                // Adjust start index based on existing reply items
                if (comments[index + 1]?.id.startsWith("reply-")) {
                  startIndex++;
                }
                if (comments[index + 2]?.id.startsWith("reply-")) {
                  startIndex++;
                }
                if (comments[index + 3]?.id.startsWith("reply-")) {
                  startIndex++;
                }

                // Handle closing replies
                if (open !== null && !open) {
                  let i = index + 1;
                  if (comments[index + 1]?.id.startsWith("reply-")) {
                    i++;
                  }

                  commentCache.set(item.id, {
                    ...item,
                    repliesData: new Set(),
                    pageNumber: 0,
                  });

                  // Remove all replies for this item
                  while (
                    i < newComments.length &&
                    newComments[i].rootId === item.id
                  ) {
                    newComments.splice(i, 1);
                  }
                  setComments(newComments);
                  return;
                }

                // Get root comment and reply counts
                const root = commentCache.get(item.rootId || item.id) || item;
                const totalReplies = root.replies ?? item.replies;
                const existingReplies =
                  commentCache.get(item.rootId || item.id)?.repliesData?.size ??
                  0;
                const loadedReplies = existingReplies
                  ? existingReplies + data.length
                  : data.length;

                // Adjust insert index if needed
                const insertIndex =
                  startIndex + (existingReplies === 1 ? 1 : 0);

                const uniqueNewReplies = data.filter(
                  (comment) =>
                    !commentCache
                      .get(item.rootId || item.id)
                      ?.repliesData?.has(comment.id)
                );
                newComments.splice(insertIndex, 0, ...uniqueNewReplies);

                // Add view more button if needed
                if (loadedReplies < totalReplies) {
                  newComments.splice(startIndex + loadedReplies, 0, {
                    id: "view-more",
                    text: "",
                    rootId: item.rootId || item.id,
                    createdAt: "",
                    liked: false,
                    likes: 0,
                    replies: 0,
                    author: {
                      id: "",
                      username: "",
                      name: "",
                      verified: false,
                    },
                  });
                }

                setComments(newComments);
              }}
              onReplyClick={() => {
                const replyExists =
                  comments[index + 1]?.id === `reply-${item.id}`;
                if (replyExists) return;

                const replyItem = {
                  id: `reply-${item.id}`,
                  text: "",
                  rootId: item.rootId || item.id,
                  author: {
                    id: userId,
                    username: username,
                    name: name,
                    verified: verified,
                  },
                  createdAt: new Date().toISOString(),
                  likes: 0,
                  replies: 0,
                  liked: false,
                };

                const newComments = [...comments];
                newComments.splice(index + 1, 0, replyItem);
                setComments(newComments);
              }}
              onUpdateItem={handleUpdateItem}
              {...item}
            />
          );
        }}
      />
    </div>
  );
};

export default PostPage;
