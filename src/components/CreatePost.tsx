import React, { useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getCookie } from "cookies-next";
import { PostData } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { toast } from "sonner";

interface CreatePostProps {
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
}

const CreatePost = ({ setPosts }: CreatePostProps) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handlePost = async () => {
    console.log("Posting...");
    try {
      const res = await fetcher("/api/v1/posts", {
        method: "POST",
        body: JSON.stringify({
          title: titleRef.current?.value,
          description: contentRef.current?.value,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("a_t")}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        try {
          const data = (await res.json()) as PostData;
          titleRef.current!.value = "";
          contentRef.current!.value = "";
          setPosts((prevPosts) => [data, ...prevPosts]);
          toast.success("Post created successfully");
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      style={{
        zIndex: 99,
      }}
      className={
        "flex relative overflow-hidden flex-col w-full h-full mb-2 max-h-[22rem]"
      }
    >
      <div className="flex relative overflow-auto pt-0 max-h-[500px] w-full h-full bg-zinc-900 flex-col">
        <div className="sticky top-0 p-3 pb-2 bg-zinc-900 z-10">
          <textarea
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
          placeholder="Share your thoughts, ideas, or story..."
          ref={contentRef}
          className="bg-transparent px-3 mb-3 outline-none resize-none w-full min-h-[100px] text-base"
          style={{
            height: "auto",
          }}
          onChange={(e) => {
            e.target.style.height = "auto"; // Reset height first
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onInput={(e) => {
            (e.target as HTMLTextAreaElement).style.height = "auto"; // Reset height first
            (e.target as HTMLTextAreaElement).style.height =
              (e.target as HTMLTextAreaElement).scrollHeight + "px";
          }}
        />
      </div>
      <div
        style={{
          zIndex: 999,
        }}
        className={
          "flex bg-zinc-900 border border-t-[#272629] border-x-0 border-b-0 px-4 min-h-[60px] rounded-b-xl justify-end items-center"
        }
      >
        <Button type="button" onClick={() => handlePost()} className="ml-auto">
          Post
        </Button>
      </div>
    </Card>
  );
};

export default CreatePost;
