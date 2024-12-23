"use client";

import { CommentData } from "@/lib/types";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { formatTimeDifference } from "@/lib/utils";
import { BadgeCheck, Dot } from "lucide-react";
import Link from "next/link";
import PostInteraction from "./PostInteraction";
import { useAuthContext } from "@/context/AuthContext";
import useFetcher from "@/hooks/useFetcher";

interface CommentProps extends CommentData {
  onUpdateItem: (item: CommentData) => void;
  onReplyClick: () => void;
  onRepliesClick: (data: CommentData[], open: boolean) => void;
  onRepliesLoading: (loading: boolean) => void;
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
  ...comment
}: CommentProps) => {
  const [repliesOpen, setRepliesOpen] = useState(
    (commentCache.get(comment.id)?.repliesData?.size || 0) > 0
  );
  const { accessToken } = useAuthContext();
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

  // const handleDelete = async () => {
  //   try {
  //     const res = await fetcher("/api/v1/comments/like/" + comment.id, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       credentials: "include",
  //     });
  //     if (res.ok) {
  //       toast.success("Comment deleted successfully", {
  //         action: {
  //           label: "Close",
  //           onClick: () => null,
  //         },
  //         closeButton: false,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
    <div
      style={{
        marginLeft: comment.repliesTo ? "1rem" : "0px",
        marginTop: comment.repliesTo ? "-0.2rem" : "0px",
      }}
      className="flex flex-col gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-3"
    >
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
            <div className="flex items-center gap-1">
              <span className="flex items-center h-[19px]">
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
              <span className="font-extralight text-neutral-600">
                {formatTimeDifference(new Date(comment.createdAt))}
              </span>
            </span>
          </div>
        </div>
      </Link>
      <span className="text-white text-sm break-all whitespace-pre-line">
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
  );
};

export default Comment;
