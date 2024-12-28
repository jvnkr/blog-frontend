"use client";

import { PostData } from "@/lib/types";
import {
  BadgeCheck,
  Dot,
  EllipsisVertical,
  Flag,
  Share,
  Trash2,
  UserRoundMinus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useRef } from "react";
import useResponsiveClass from "@/hooks/useResponsiveClass";
import Avatar from "./Avatar";
import { formatTimeDifference } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PostInteraction from "./PostInteraction";
import useFetcher from "@/hooks/useFetcher";
import VirtualPopup from "./VirtualPopup";
import DeletePost from "./DeletePost";

interface PostProps {
  post: PostData;
  posts: PostData[];
  onUpdatePost: (post: PostData) => void;
}

export const Post = ({ post: initialPost, onUpdatePost }: PostProps) => {
  const [post, setPost] = useState(initialPost);
  const postRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [options, setOptions] = useState(false);
  const [hoverShare, setHoverShare] = useState(false);
  const [hoverReport, setHoverReport] = useState(false);
  const [hoverMinus, setHoverMinus] = useState(false);
  const responsiveClass = useResponsiveClass();
  const { accessToken, loggedIn, setUnauthWall, userId } = useAuthContext();

  const fetcher = useFetcher();

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
        setPost((prev) => ({
          ...prev,
          liked: !prev.liked,
          likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
        }));
        onUpdatePost({
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const triggerAuthWall = (url = "") => {
    if (!loggedIn) {
      setUnauthWall(url);
      return true;
    }
    router.push(url);
    return false;
  };

  const handlePostClick = () => {
    triggerAuthWall(`/post/${post.id}`);
  };

  return (
    <>
      {showDeleteDialog && (
        <VirtualPopup onOverlayClick={() => setShowDeleteDialog(false)}>
          <DeletePost setShowDeleteDialog={setShowDeleteDialog} post={post} />
        </VirtualPopup>
      )}
      <Card
        ref={postRef}
        style={{
          zIndex: 99,
        }}
        className={
          "flex relative bg-transparent border-[#272629] text-white overflow-hidden flex-col w-full h-full max-h-[30rem]"
        }
      >
        <div
          className={
            "flex absolute bg-[#202023] overflow-hidden top-0 w-[calc(100%+2px)] pl-2 h-[60px] left-[-1px] border border-t-0 rounded-b-xl dark:border-[#272629] justify-between items-center"
          }
        >
          <div
            onClick={() => {
              triggerAuthWall(`/@${post.author.username}`);
            }}
            className={
              "flex cursor-pointer select-none h-full justify-start gap-2 items-center w-fit"
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
                      onClick={() => setShowDeleteDialog(true)}
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
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/post/${post.id}`
                      );
                      toast.success("Link copied to clipboard");
                    }}
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
            handlePostClick();
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
          <div className="p-3 pt-0">
            <PostInteraction
              handleLike={handleLike}
              liked={post.liked}
              likes={post.likes}
              replies={post.comments}
            />
          </div>
        </div>
      </Card>
    </>
  );
};
