"use client";

import { CommentData, PostData } from "@/lib/types";
import React, { useState } from "react";
import Avatar from "../profile/Avatar";
import { formatTimeDifference } from "@/lib/utils";
import { BadgeCheck, Copy, Dot, Ellipsis, Flag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import useFetcher from "@/hooks/useFetcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import VirtualPopup from "../VirtualPopup";
import DeletePost from "../post/DeletePost";
import { usePostsContext } from "@/context/PostsContext";
import Tooltip from "../Tooltip";
import PostInteraction from "../post/PostInteraction";

interface CommentProps extends CommentData {
  onUpdateItem: (item: CommentData) => void;
  onReplyClick: () => void;
  onRepliesClick: (data: CommentData[], open: boolean) => void;
  onRepliesLoading: (loading: boolean) => void;
  setComments: React.Dispatch<React.SetStateAction<CommentData[]>>;
  comments: CommentData[];
  currentPost: PostData;
  setCurrentPost: React.Dispatch<React.SetStateAction<PostData>>;
}

export interface CommentCache extends CommentData {
  repliesData?: Set<string>;
  pageNumber?: number;
}

export const commentCache = new Map<string, CommentCache>();

const Comment = ({
  onUpdateItem,
  onReplyClick,
  onRepliesClick,
  onRepliesLoading,
  setComments,
  comments,
  currentPost,
  setCurrentPost,
  ...comment
}: CommentProps) => {
  const [repliesOpen, setRepliesOpen] = useState(
    (commentCache.get(comment.id)?.repliesData?.size || 0) > 0
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { setPosts, setFollowingPosts, setProfilePosts } = usePostsContext();
  const { accessToken, userId } = useAuthContext();
  const fetcher = useFetcher();

  const handleLike = async () => {
    try {
      const res = await fetcher("/api/v1/comments/like/" + comment.id, {
        method: comment.liked ? "DELETE" : "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        onUpdateItem({
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
        });
        commentCache.set(comment.id, {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const currentComments = comments;
    setComments((prev: CommentData[]) => {
      // Filter out comment and any replies in one pass
      return prev.filter(
        (c) =>
          c.id !== comment.id &&
          c.rootId !== comment.id &&
          (!c.repliesTo || c.repliesTo.id !== comment.id)
      );
    });
    if (!comment.repliesTo) {
      setCurrentPost((prev: PostData) => {
        return { ...prev, comments: prev.comments - 1 };
      });
      setPosts((prev: PostData[]) =>
        prev.map((p) => {
          if (p.id === currentPost.id) {
            return { ...p, comments: p.comments - 1 };
          }
          return p;
        })
      );
      setFollowingPosts((prev: PostData[]) =>
        prev.map((p) => {
          if (p.id === currentPost.id) {
            return { ...p, comments: p.comments - 1 };
          }
          return p;
        })
      );
      setProfilePosts((prev: PostData[]) =>
        prev.map((p) => {
          if (p.id === currentPost.id) {
            return { ...p, comments: p.comments - 1 };
          }
          return p;
        })
      );
    } else {
      if (comment.replies <= 1) {
        setRepliesOpen(false);
        commentCache.set(comment.id, {
          ...comment,
          repliesData: new Set(),
          pageNumber: 0,
        });
      }
      setComments((prev: CommentData[]) =>
        prev.map((c) => {
          if (c.id === comment.repliesTo?.id) {
            return { ...c, replies: c.replies - 1 };
          }
          return c;
        })
      );
    }
    setShowDeleteDialog(false);
    const url = `/api/v1/comments/${comment.repliesTo ? "reply/" : ""}`;

    try {
      const res = await fetcher(url + comment.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        toast.success(
          comment.repliesTo
            ? "Reply deleted successfully"
            : "Comment deleted successfully",
          {
            action: {
              label: "Close",
              onClick: () => null,
            },
            closeButton: false,
          }
        );
      } else {
        throw new Error(
          comment.repliesTo
            ? "Failed to delete reply"
            : "Failed to delete comment"
        );
      }
    } catch (error) {
      setComments(currentComments);
      toast.error(
        comment.repliesTo
          ? "Failed to delete reply"
          : "Failed to delete comment",
        {
          action: {
            label: "Close",
            onClick: () => null,
          },
          closeButton: false,
        }
      );
      console.error(error);
    }
  };

  const handleGetReplies = async () => {
    if (comment.replies === 0) return;
    if (repliesOpen) {
      onRepliesClick([], !repliesOpen);
      setRepliesOpen(!repliesOpen);
      commentCache.set(comment.id, {
        ...comment,
        repliesData: new Set(),
        pageNumber: 0,
      });
      return;
    }
    onRepliesLoading(true);
    const res = await fetcher("/api/v1/comments/reply/batch/" + comment.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        pageNumber: commentCache.get(comment.id)?.pageNumber || 0,
      }),
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        onRepliesClick(data, true);
        setRepliesOpen(true);
        commentCache.set(comment.id, {
          ...comment,
          repliesData: new Set([
            ...(commentCache.get(comment.id)?.repliesData || []),
            ...data.map((c) => c.id),
          ]),
          pageNumber: commentCache.get(comment.id)?.pageNumber || 0,
        });
      }
    }
    onRepliesLoading(false);
  };

  return (
    <>
      {showDeleteDialog && (
        <VirtualPopup onOverlayClick={() => setShowDeleteDialog(false)}>
          <DeletePost
            description={
              comment.repliesTo ? (
                <span className="text-neutral-400 text-sm">
                  This action{" "}
                  <span className="font-bold uppercase">cannot</span> be undone.
                  This will permanently delete your reply.
                </span>
              ) : (
                <span className="text-neutral-400 text-sm">
                  This action{" "}
                  <span className="font-bold uppercase">cannot</span> be undone.
                  This will permanently delete your comment.
                </span>
              )
            }
            buttonText={comment.repliesTo ? "Delete Reply" : "Delete Comment"}
            setShowDeleteDialog={setShowDeleteDialog}
            handleDelete={handleDelete}
          />
        </VirtualPopup>
      )}
      <div
        style={{
          marginLeft: comment.repliesTo ? "1rem" : "0px",
          marginTop: comment.repliesTo ? "-0.2rem" : "0px",
        }}
        className="flex flex-col gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-3"
      >
        <div className="flex justify-between items-start">
          <Link
            href={`/@${comment.author.username}`}
            className={
              "flex select-none h-full justify-start gap-2 items-center w-fit"
            }
          >
            <Avatar name={comment.author.name} />
            <div className={"flex h-fit"}>
              <div
                className={
                  "flex flex-col relative justify-start items-start text-[15px] font-semibold"
                }
              >
                <div className="flex break-all w-full items-center gap-1">
                  <span className="flex flex-wrap items-center h-fit">
                    {comment.author.name}
                  </span>
                  {comment.author.verified && (
                    <BadgeCheck className="w-4 h-4 fill-blue-500" />
                  )}
                </div>
                <span
                  className={
                    "flex font-normal text-neutral-500 items-center h-full text-[12px]"
                  }
                >
                  @{comment.author.username}
                  <Dot className="w-[16px] h-full font-light text-neutral-600" />
                  <Tooltip
                    tooltipTrigger={
                      <span className="hover:underline font-extralight text-neutral-600">
                        {formatTimeDifference(new Date(comment.createdAt))}
                      </span>
                    }
                    tooltipContent={
                      <>
                        <p>
                          {new Date(comment.createdAt).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}{" "}
                        </p>
                        <Dot className="w-[16px] h-full font-light text-neutral-600" />
                        <p>
                          {new Date(comment.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </>
                    }
                  />
                </span>
              </div>
            </div>
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              disabled={showDeleteDialog}
              className="rounded-full"
            >
              <Ellipsis className="w-7 h-7 cursor-pointer p-1 rounded-full hover:bg-neutral-800 text-neutral-600 transition-all duration-150 hover:text-neutral-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 flex flex-col gap-1 border border-[#272629] text-white shadow-lg shadow-black/20">
              {comment.author.id === userId && (
                <DropdownMenuItem
                  className="focus:bg-red-500 focus:text-white"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-0" />
                  Delete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="focus:bg-yellow-500 focus:text-white">
                <Flag className="w-4 h-4 mr-0" />
                Report
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(comment.text);
                  toast.success("Copied to clipboard", {
                    action: {
                      label: "Close",
                      onClick: () => null,
                    },
                    closeButton: false,
                  });
                }}
              >
                <Copy className="w-4 h-4 mr-0" />
                Copy
              </DropdownMenuItem>
              {/* {comment.author.id === userId && (
                <DropdownMenuItem>
                  <PencilLine className="w-4 h-4 mr-0" />
                  Edit
                </DropdownMenuItem>
              )} */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span className="text-white text-sm break-words whitespace-pre-line">
          {comment.repliesTo && (
            <span className="text-blue-300 bg-blue-900 rounded-md mr-[5px] p-[4px]">
              {`@${comment.repliesTo.username}`}
            </span>
          )}
          {comment.text}
        </span>
        <PostInteraction
          repliesOpen={repliesOpen}
          repliesTo={
            comment.repliesTo !== undefined && comment.repliesTo !== null
          }
          onCommentsClick={handleGetReplies}
          handleLike={handleLike}
          liked={comment.liked}
          likes={comment.likes}
          replies={comment.replies}
          showReply={true}
          onReplyClick={onReplyClick}
        />
      </div>
    </>
  );
};

export default Comment;
