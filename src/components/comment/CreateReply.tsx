import React, { useRef, useState, useEffect } from "react";
import { Card } from "../ui/card";
import { CommentData } from "@/lib/types";
import { toast } from "sonner";
import PostFooter from "../post/PostFooter";
import useFetcher from "@/hooks/useFetcher";
import { useAuthContext } from "@/context/AuthContext";

interface CreateReplyProps {
  handleCreateReply: (newReply: CommentData) => void;
  handleCancel: () => void;
  commentId: string;
  rootId: string | undefined;
}

export const replyCache = new Map<string, string>();

const CreateReply = ({
  handleCreateReply,
  handleCancel,
  commentId,
  rootId,
}: CreateReplyProps) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(replyCache.get(commentId) || "");
  const fetcher = useFetcher();
  const { accessToken } = useAuthContext();

  useEffect(() => {
    if (textRef.current) {
      textRef.current.value = replyCache.get(commentId) || "";
      textRef.current.style.height = "auto";
      textRef.current.style.height =
        Math.min(textRef.current.scrollHeight, 200) + "px";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!textRef.current?.value) {
      toast.error("Please fill in the comment", {
        action: {
          label: "Close",
          onClick: () => null,
        },
        closeButton: false,
      });
      return;
    }
    try {
      const res = await fetcher("/api/v1/comments/reply/" + commentId, {
        method: "POST",
        body: JSON.stringify({
          rootId,
          text: textRef.current?.value,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        try {
          const data = (await res.json()) as CommentData;
          textRef.current!.value = "";
          setValue("");
          handleCreateReply(data);
          toast.success("Reply created successfully", {
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

  return (
    <div className="ml-[1rem] mt-[-0.2rem]">
      <Card
        style={{
          zIndex: 999,
        }}
        className={
          "flex relative rounded-xl border-[#272629] bg-transparent text-white flex-col w-full h-full max-h-[22rem]"
        }
      >
        <div className="flex rounded-t-xl relative overflow-auto pt-0 max-h-[500px] w-full h-full bg-zinc-900 flex-col">
          <div className="sticky top-0 p-3 bg-zinc-900 z-10">
            <textarea
              value={value}
              onChange={(e) => {
                const newValue = e.target.value;
                setValue(newValue);
                replyCache.set(commentId, newValue);
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 200) + "px";
              }}
              ref={textRef}
              className="flex relative backdrop-blur-sm mb-0 bg-transparent outline-none w-full cursor-text tracking-tight text-lg resize-none overflow-y-auto caret-white"
              style={{
                minHeight: "24px",
                maxHeight: "200px",
              }}
              maxLength={255}
              rows={1}
              placeholder="Write a reply..."
            />
          </div>
        </div>
        <PostFooter
          disabled={value.length <= 0}
          buttonValue="Reply"
          handleCreate={handleCreate}
          showCancel={true}
          handleCancel={handleCancel}
          onEmojiClick={(newValue) => {
            if (!textRef || !textRef.current) return;
            if (textRef.current.value.length >= 255) {
              toast.error("Reply cannot be longer than 255 characters", {
                action: {
                  label: "Close",
                  onClick: () => null,
                },
                closeButton: false,
              });
              return;
            }
            replyCache.set(commentId, textRef.current.value + newValue);
            setValue(textRef.current.value + newValue);
            textRef.current.style.height = "auto";
            textRef.current.style.height =
              Math.min(textRef.current.scrollHeight, 200) + "px";
          }}
        />
      </Card>
    </div>
  );
};

export default CreateReply;
