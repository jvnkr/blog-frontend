"use client";

import { PostData } from "@/lib/types";
import { EllipsisVertical, Flag, Share, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useRef } from "react";
import useResponsiveClass from "@/hooks/useResponsiveClass";
import { useAuthContext } from "@/context/AuthContext";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PostInteraction from "./PostInteraction";
import useFetcher from "@/hooks/useFetcher";
import VirtualPopup from "./VirtualPopup";
import DeletePost from "./DeletePost";
import { usePostsContext } from "@/context/PostsContext";
import Tooltip from "./Tooltip";
import AvatarInfo from "./AvatarInfo";
import ReportPost from "./ReportPost";

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
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [options, setOptions] = useState(false);
  const [hoverShare, setHoverShare] = useState(false);
  const [hoverReport, setHoverReport] = useState(false);
  const [hoverMinus, setHoverMinus] = useState(false);
  const responsiveClass = useResponsiveClass();
  const { accessToken, loggedIn, setUnauthWall, username, userId } =
    useAuthContext();
  const {
    posts,
    setPosts,
    setIsPopup,
    profileData,
    setProfileData,
    profilePosts,
    setProfilePosts,
    followingPosts,
    setFollowingPosts,
  } = usePostsContext();

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
  const handleDelete = async () => {
    const previousPosts = posts;
    const previousProfilePosts = profilePosts;
    const previousFollowingPosts = followingPosts;
    try {
      if (posts.length > 0) {
        setPosts(posts.filter((p) => p.id !== post.id));
      }
      if (profilePosts.length > 0) {
        setProfilePosts(profilePosts.filter((p) => p.id !== post.id));
      }
      if (followingPosts.length > 0) {
        setFollowingPosts(followingPosts.filter((p) => p.id !== post.id));
      }
      setShowDeleteDialog(false);
      setIsPopup(false);
      if (profileData?.username === username) {
        setProfileData({
          ...profileData,
          postsCount: profileData.postsCount - 1,
        });
      }
      await fetcher(`/api/v1/posts/${post.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Post deleted");
    } catch (error) {
      setPosts(previousPosts);
      setProfilePosts(previousProfilePosts);
      setFollowingPosts(previousFollowingPosts);
      toast.error("Failed to delete post");
      console.log(error);
    }
  };

  // Calculate number of action items

  const padding = 40;
  const ITEM_COUNT = !loggedIn ? 1 : 2;
  const expandedWidth = `${ITEM_COUNT * 50 + padding}px`; // 50px per action item

  return (
    <>
      {showDeleteDialog && (
        <VirtualPopup onOverlayClick={() => setShowDeleteDialog(false)}>
          <DeletePost
            setShowDeleteDialog={setShowDeleteDialog}
            handleDelete={handleDelete}
          />
        </VirtualPopup>
      )}
      {showReportDialog && (
        <VirtualPopup onOverlayClick={() => setShowReportDialog(false)}>
          <ReportPost
            setShowReportDialog={setShowReportDialog}
            postId={post.id}
          />
        </VirtualPopup>
      )}
      <Card
        ref={postRef}
        style={{
          zIndex: 99,
        }}
        className={
          "flex relative bg-transparent border border-[#272629] text-white overflow-hidden flex-col w-full h-fit"
        }
      >
        <div
          className={
            "flex absolute bg-[#202023] overflow-hidden top-0 w-[calc(100%+2px)] pl-2 h-[60px] left-[-1px] border border-t-0 rounded-b-xl border-[#272629]  justify-between items-center"
          }
        >
          <AvatarInfo
            style={{
              transition: "margin-right 0.3s ease-in-out",
              marginRight: options ? expandedWidth : "31px",
            }}
            name={post.author.name}
            username={post.author.username}
            verified={post.author.verified}
            createdAt={new Date(post.createdAt)}
            onClick={() => {
              triggerAuthWall(`/@${post.author.username}`);
            }}
          />
          <motion.div
            animate={{
              minWidth: options ? expandedWidth : "var(--width-collapsed)",
            }}
            transition={{
              duration: 0.03,
              ease: "easeInOut",
            }}
            className={`flex absolute right-0 bg-[#232326] w-[21px] transition-all pl-[20px] duration-300 justify-start items-center border border-y-0 border-l-[#272629] h-full border-r-0 ${responsiveClass}`}
          >
            <AnimatePresence>
              {options && (
                <motion.div
                  initial={{ paddingLeft: expandedWidth, opacity: 0 }}
                  animate={{
                    paddingLeft: "10px",
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                    },
                  }}
                  exit={{
                    paddingLeft: expandedWidth,
                    transition: {
                      duration: 1.2,
                      type: "spring",
                      ease: "easeInOut",
                    },
                  }}
                  className="flex bg-[#272629] h-full justify-center items-center w-full p-2 gap-4 overflow-hidden"
                >
                  {post.author.id === userId && (
                    <Tooltip
                      tooltipTrigger={
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
                      }
                      tooltipContent={<span>Delete post</span>}
                    />
                  )}
                  {userId !== post.author.id && loggedIn && (
                    <Tooltip
                      tooltipTrigger={
                        <div
                          onMouseEnter={() => setHoverReport(true)}
                          onMouseLeave={() => setHoverReport(false)}
                          onClick={() => setShowReportDialog(true)}
                          className="flex cursor-pointer hover:bg-opacity-[1] transition-all duration-300 justify-center items-center bg-neutral-700 bg-opacity-[0.5] rounded-full p-2"
                        >
                          <Flag
                            className={`${
                              hoverReport ? "text-yellow-500" : ""
                            } min-w-[22px] min-h-[22px] w-[22px] h-[22px]`}
                          />
                        </div>
                      }
                      tooltipContent={<span>Report post</span>}
                    />
                  )}
                  <Tooltip
                    tooltipTrigger={
                      <div
                        onMouseEnter={() => setHoverShare(true)}
                        onMouseLeave={() => setHoverShare(false)}
                        onClick={() => {
                          if (navigator?.share) {
                            navigator
                              ?.share({
                                title: post.title,
                                text: post.description,
                                url: `${window.location.origin}/post/${post.id}`,
                              })
                              .catch(() => {
                                navigator?.clipboard?.writeText(
                                  `${window.location.origin}/post/${post.id}`
                                );
                              });
                          } else {
                            navigator?.clipboard?.writeText(
                              `${window.location.origin}/post/${post.id}`
                            );
                          }
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
                    }
                    tooltipContent={<span>Share post</span>}
                  />
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
              <EllipsisVertical
                className="text-[#3d3c40]"
                width={20}
                height={20}
              />
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
            <div className="flex flex-col w-full h-full break-words">
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
                  <div className="inline-block ml-[1px] text-opacity-[0.7] hover:text-opacity-[1] transition-all duration-300 cursor-pointer text-md text-blue-500">
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
