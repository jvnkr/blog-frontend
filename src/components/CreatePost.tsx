import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { PostData } from "@/lib/types";
import { toast } from "sonner";
import PostFooter from "./PostFooter";
import useFetcher from "@/hooks/useFetcher";
import { useAuthContext } from "@/context/AuthContext";
import { usePostsContext } from "@/context/PostsContext";

interface CreatePostProps {
  emojiZIndex?: number;
  isPortal?: boolean;
  className?: string;
  setShowCreatePostDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

let postTitleCache: string = "";
let postDescCache: string = "";

const CreatePost = ({
  isPortal = true,
  emojiZIndex = 999,
  className,
  setShowCreatePostDialog,
}: CreatePostProps) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [descValue, setDescValue] = useState(postDescCache);
  const [titleValue, setTitleValue] = useState(postTitleCache);
  const lastActiveInputRef = useRef<"title" | "content">("content");
  const fetcher = useFetcher();
  const {
    setProfilePosts,
    setIsPopup,
    setFollowingPosts,
    setPosts: setHomePosts,
    cachedProfilePath,
  } = usePostsContext();
  const { accessToken, username } = useAuthContext();

  const handlePost = async () => {
    if (!titleRef.current?.value || !contentRef.current?.value) {
      toast.error("Please fill in all fields", {
        action: {
          label: "Close",
          onClick: () => null,
        },
        closeButton: false,
      });
      return;
    }
    try {
      const res = await fetcher("/api/v1/posts", {
        method: "POST",
        body: JSON.stringify({
          title: titleRef.current?.value,
          description: contentRef.current?.value,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        try {
          const data = (await res.json()) as PostData;
          titleRef.current!.value = "";
          contentRef.current!.value = "";
          postTitleCache = "";
          postDescCache = "";
          setTitleValue("");
          setDescValue("");

          setHomePosts((prev) => [data, ...prev]);
          if (data.author.username !== username) {
            setFollowingPosts((prev) => [data, ...prev]);
          }
          if (cachedProfilePath.endsWith(data.author.username)) {
            setProfilePosts((prev) => [data, ...prev]);
          }
          setIsPopup(false);
          if (setShowCreatePostDialog) setShowCreatePostDialog(false);

          toast.success("Post created successfully", {
            action: {
              label: "Close",
              onClick: () => null,
            },
            closeButton: false,
          });
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.value = postTitleCache;
      setTitleValue(postTitleCache);
    }
    if (contentRef.current) {
      contentRef.current.value = postDescCache;
      setDescValue(postDescCache);
    }
  }, []);

  return (
    <Card
      style={{
        zIndex: 999,
      }}
      className={`flex relative border-[#272629] bg-transparent text-white flex-col w-full h-full max-h-[22rem] ${className}`}
    >
      <div className="flex relative rounded-t-[11px] overflow-auto pt-0 max-h-[500px] w-full h-full bg-zinc-900 flex-col">
        <div className="sticky top-0 p-3 pb-2 bg-zinc-900 z-10">
          <textarea
            spellCheck={false}
            value={titleValue}
            onFocus={() => (lastActiveInputRef.current = "title")}
            onClick={() => (lastActiveInputRef.current = "title")}
            onInput={(e) => {
              const newValue = (e.target as HTMLTextAreaElement).value;
              setTitleValue(newValue);
              postTitleCache = newValue;
              if (titleRef.current) {
                titleRef.current.value = newValue;
              }
            }}
            ref={titleRef}
            className="flex relative backdrop-blur-sm mb-0 bg-transparent outline-none w-full font-semibold cursor-text tracking-tight text-2xl resize-none overflow-y-auto caret-white"
            style={{
              minHeight: "40px",
            }}
            maxLength={50}
            rows={1}
            placeholder="Write a title..."
          />
        </div>
        <textarea
          spellCheck={false}
          placeholder="Share your thoughts, ideas, or story..."
          ref={contentRef}
          value={descValue}
          onFocus={() => (lastActiveInputRef.current = "content")}
          onClick={() => (lastActiveInputRef.current = "content")}
          className="bg-transparent px-3 mb-3 outline-none resize-none w-full min-h-[100px] text-base"
          style={{
            height: "auto",
          }}
          maxLength={255}
          onChange={(e) => {
            e.target.style.height = "auto"; // Reset height first
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onInput={(e) => {
            const newValue = (e.target as HTMLTextAreaElement).value;
            setDescValue(newValue);
            postDescCache = newValue;
            if (contentRef.current) {
              contentRef.current.value = newValue;
            }
            (e.target as HTMLTextAreaElement).style.height = "auto"; // Reset height first
            (e.target as HTMLTextAreaElement).style.height =
              (e.target as HTMLTextAreaElement).scrollHeight + "px";
          }}
        />
      </div>
      <PostFooter
        isPortal={isPortal}
        emojiZIndex={emojiZIndex}
        disabled={descValue.length <= 0 || titleValue.length <= 0}
        buttonValue="Post"
        onEmojiClick={(emoji) => {
          if (lastActiveInputRef.current === "title") {
            if (titleValue.length >= 50) {
              toast.error("Title cannot be longer than 50 characters", {
                action: {
                  label: "Close",
                  onClick: () => null,
                },
                closeButton: false,
              });
              return;
            }
            setTitleValue(titleValue + emoji);
            postTitleCache = titleValue + emoji;
            if (titleRef.current) {
              titleRef.current.value = titleValue + emoji;
            }
          } else {
            if (descValue.length >= 255) {
              toast.error("Description cannot be longer than 255 characters", {
                action: {
                  label: "Close",
                  onClick: () => null,
                },
                closeButton: false,
              });
              return;
            }
            setDescValue(descValue + emoji);
            postDescCache = descValue + emoji;
            if (contentRef.current) {
              contentRef.current.value = descValue + emoji;
            }
          }
        }}
        handleCreate={handlePost}
      />
    </Card>
  );
};

export default CreatePost;
