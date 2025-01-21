import React from "react";
import { Heart, MessageSquare } from "lucide-react";
import InteractionElement from "./InteractionElement";

interface PostInteractionProps {
  handleLike: () => void;
  liked: boolean;
  likes: number;
  replies: number;
  onCommentsClick?: () => void;
  onReplyClick?: () => void;
  showReply?: boolean;
  repliesTo?: boolean;
  repliesOpen?: boolean;
}

const PostInteraction = ({
  handleLike,
  liked,
  likes,
  replies,
  onReplyClick,
  onCommentsClick,
  showReply = false,
  repliesTo = false,
  repliesOpen = false,
}: PostInteractionProps) => {
  return (
    <div className="flex select-none mb-[-4px] mt-[8px] h-[24px] items-center gap-4">
      <div
        onMouseUp={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLike();
        }}
        className="flex relative h-full justify-center w-fit gap-1 items-center text-neutral-400"
      >
        <InteractionElement>
          <Heart
            style={{
              zIndex: 1,
            }}
            className={`font-semibold  w-[20px] h-[20px] ${
              liked ? "text-red-500 fill-red-500" : ""
            }`}
          />
          <span
            style={{
              zIndex: 1,
            }}
          >
            {likes}
          </span>
        </InteractionElement>
      </div>
      {!repliesTo && (
        <div
          onClick={onCommentsClick}
          className="flex relative h-full justify-center w-fit gap-1 items-center text-neutral-400"
        >
          <InteractionElement>
            <MessageSquare
              style={{
                zIndex: 1,
              }}
              className={`font-semibold w-[20px] h-[20px] ${
                repliesOpen && replies > 0 ? "fill-blue-500 text-blue-500" : ""
              }`}
            />
            <span
              style={{
                zIndex: 1,
              }}
            >
              {replies}
            </span>
          </InteractionElement>
        </div>
      )}
      {showReply && (
        <div
          onClick={onReplyClick}
          className="flex relative h-full justify-center text-sm w-fit gap-1 items-center text-neutral-400"
        >
          <InteractionElement>
            <span
              style={{
                zIndex: 1,
              }}
            >
              Reply
            </span>
          </InteractionElement>
        </div>
      )}
    </div>
  );
};

export default PostInteraction;
