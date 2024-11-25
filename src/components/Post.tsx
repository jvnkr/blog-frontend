"use client";

import { PostData } from "@/lib/types";
import {
  BadgeCheck,
  Dot,
  EllipsisVertical,
  Flag,
  Heart,
  MessageSquare,
  Share,
  Trash2,
  UserRoundMinus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import useResponsiveClass from "@/hooks/useResponsiveClass";
import Avatar from "./Avatar";
import { fetcher, formatTimeDifference } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import { getCookie } from "cookies-next";
import { Card } from "./ui/card";
import { toast } from "sonner";

interface PostProps {
  post: PostData;
  onUpdatePost: (post: PostData) => void;
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
}

export const Post = ({
  post: initialPost,
  onUpdatePost,
  setPosts,
}: PostProps) => {
  const [post, setPost] = useState(initialPost);

  const [options, setOptions] = useState(false);
  const [hoverShare, setHoverShare] = useState(false);
  const [hoverReport, setHoverReport] = useState(false);
  const [hoverMinus, setHoverMinus] = useState(false);
  const responsiveClass = useResponsiveClass();
  const { loggedIn, setUnauthWall, userId } = useAuthContext();

  const updatePost = async (postId: string, updatedPost: PostData) => {
    try {
      const endpoint = updatedPost.liked ? "like" : "unlike";

      await fetcher(`/api/v1/posts/${endpoint}/${postId}`, {
        method: "POST",
        credentials: "include",
        keepalive: true, // Ensures request completes even on page unload
        headers: {
          Authorization: `Bearer ${getCookie("a_t")}`,
        },
      });
    } catch (error) {
      console.log(error);
      // Revert UI state on error
      setPost((prev) => ({
        ...prev,
        liked: updatedPost.liked,
        likes: updatedPost.liked ? prev.likes + 1 : prev.likes - 1,
      }));
      onUpdatePost?.(updatedPost);
    }
  };

  const handleDelete = async () => {
    if (!loggedIn) {
      setUnauthWall(true);
      return;
    }
    try {
      await fetcher(`/api/v1/posts/${post.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("a_t")}`,
        },
      });
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
      toast.success("Post deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    if (!loggedIn) {
      setUnauthWall(true);
      return;
    }

    // Optimistic update
    const newLiked = !post.liked;
    const updatedPost = {
      ...post,
      liked: newLiked,
      likes: newLiked ? post.likes + 1 : post.likes - 1,
    };
    setPost(updatedPost);
    onUpdatePost?.(updatedPost);

    updatePost(post.id, updatedPost);
  };

  return (
    <Card
      style={{
        zIndex: 99,
      }}
      className={
        "flex relative overflow-hidden flex-col w-full h-full mb-2 max-h-[30rem]"
      }
    >
      <div
        className={
          "flex absolute bg-[#202023] overflow-hidden top-0 w-[calc(100%+2px)] pl-2 h-[60px] left-[-1px] border border-t-0 rounded-b-xl border-[#272629] justify-between items-center"
        }
      >
        <div
          className={
            "flex select-none h-full justify-start gap-2 items-center w-full"
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
                <Dot className="w-[16px] h-full font-light text-neutral-600" />
                <span className="font-extralight text-neutral-600">
                  {formatTimeDifference(new Date(post.createdAt))}
                  {/* {formatTimeDifference(new Date("2025-01-01T12:00:00Z"))} */}
                  {/* {formatTimeDifference(new Date("2024-01-01T12:00:00Z"))} */}
                </span>
              </span>
            </div>
          </div>
        </div>
        <motion.div
          animate={{
            minWidth: options
              ? "var(--width-expanded)"
              : "var(--width-collapsed)",
          }}
          transition={{
            duration: 0.03,
            ease: "easeInOut",
          }}
          className={`flex absolute right-0 bg-[#202023] w-[21px] transition-all pl-[20px] duration-300 justify-start items-center border border-y-0 border-l-[#272629] h-full border-r-0 ${responsiveClass}`}
        >
          <AnimatePresence>
            {options && (
              <motion.div
                initial={{ paddingLeft: "195px", opacity: 0 }}
                animate={{
                  paddingLeft: "10px",
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                  },
                }}
                exit={{
                  paddingLeft: "195px",
                  transition: {
                    duration: 1.2,
                    type: "spring",
                    ease: "easeInOut",
                  },
                }}
                className="flex bg-[#212123] h-full justify-center items-center w-full p-2 gap-3 overflow-hidden"
              >
                {post.author.id !== userId && (
                  <div
                    onMouseEnter={() => setHoverMinus(true)}
                    onMouseLeave={() => setHoverMinus(false)}
                    className="flex cursor-pointer hover:bg-opacity-[1] transition-all duration-300 justify-center items-center bg-neutral-700 bg-opacity-[0.5] rounded-full p-2"
                  >
                    <UserRoundMinus
                      className={`${
                        hoverMinus ? "text-yellow-500" : ""
                      } min-w-[22px] min-h-[22px] w-[22px] h-[22px]`}
                    />
                  </div>
                )}
                {post.author.id === userId && (
                  <div
                    onMouseEnter={() => setHoverMinus(true)}
                    onMouseLeave={() => setHoverMinus(false)}
                    onClick={handleDelete}
                    className="flex cursor-pointer hover:bg-opacity-[1] transition-all duration-300 justify-center items-center bg-neutral-700 bg-opacity-[0.5] rounded-full p-2"
                  >
                    <Trash2
                      className={`${
                        hoverMinus ? "text-red-500" : ""
                      } min-w-[22px] min-h-[22px] w-[22px] h-[22px]`}
                    />
                  </div>
                )}
                <div
                  onMouseEnter={() => setHoverReport(true)}
                  onMouseLeave={() => setHoverReport(false)}
                  className="flex cursor-pointer hover:bg-opacity-[1] transition-all duration-300 justify-center items-center bg-neutral-700 bg-opacity-[0.5] rounded-full p-2"
                >
                  <Flag
                    className={`${
                      hoverReport ? "text-red-500" : ""
                    } min-w-[22px] min-h-[22px] w-[22px] h-[22px]`}
                  />
                </div>
                <div
                  onMouseEnter={() => setHoverShare(true)}
                  onMouseLeave={() => setHoverShare(false)}
                  className="flex hover:text-green cursor-pointer hover:bg-opacity-[1] transition-all duration-300 justify-center items-center bg-neutral-700 bg-opacity-[0.5] rounded-full p-2"
                >
                  <Share
                    className={`${
                      hoverShare ? "text-green-500" : ""
                    } min-w-[22px] min-h-[22px] w-[22px] h-[22px]`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            style={{
              zIndex: 99,
            }}
            onClick={() => setOptions(!options)}
            className={`flex text-neutral-600 justify-center items-center absolute border border-y-0 border-l-0 border-r-[#272629] top-[-4px] h-[calc(100%+8px)] left-0 transition-all duration-300 cursor-pointer w-fit`}
          >
            <EllipsisVertical width={20} height={20} />
          </motion.div>
        </motion.div>
      </div>
      <div
        onMouseUp={(e) => {
          if (window.getSelection()?.toString()) {
            e.preventDefault();
            return;
          }
          window.location.href = "/";
        }}
        className="flex pt-[60px] bg-zinc-900 cursor-pointer flex-col"
      >
        <div className="flex flex-col gap-1 p-3 w-fit">
          <div className="flex font-semibold tracking-tight text-2xl w-full h-fit">
            <span>{post.title}</span>
          </div>
          <div className="flex flex-col w-full h-full break-all">
            <div
              className={`inline-block relative break-words whitespace-pre-wrap`}
            >
              <span className="text-sm">
                {post.description.split(/\n/).map((segment, i, arr) => (
                  <span key={i}>
                    {segment}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </span>
              {post.overDescLimit && (
                <div className="inline-block ml-[-4px] text-opacity-[0.7] hover:text-opacity-[1] transition-all duration-300 cursor-pointer text-md text-blue-600">
                  ...show more
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex p-3 gap-3 pt-0 justify-start border-0 border-t-[#272629] border-x-0 border-b-0 items-center mt-1 w-full h-fit">
          <div className="flex gap-1 items-center text-neutral-400">
            <Heart
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike();
              }}
              className={`font-semibold  w-[20px] h-[20px] ${
                loggedIn && post.liked ? "text-red-500 fill-red-500" : ""
              }`}
            />
            <span>{post.likes}</span>
          </div>
          <div className="flex gap-1 items-center text-neutral-400">
            <MessageSquare className="font-semibold w-[20px] h-[20px]" />
            <span>{post.comments}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
