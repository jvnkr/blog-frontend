"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import EmojiPicker from "./EmojiPicker";

interface PostFooterProps {
  disabled: boolean;
  buttonValue: string;
  onEmojiClick: (newValue: string) => void;
  handleCreate: () => void;
  handleCancel?: () => void;
  showCancel?: boolean;
  emojiZIndex?: number;
  isPortal?: boolean;
}

const PostFooter = ({
  disabled,
  buttonValue,
  onEmojiClick,
  handleCreate,
  handleCancel,
  showCancel = false,
  emojiZIndex = 999,
  isPortal = true,
}: PostFooterProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div
      style={{
        zIndex: 999,
      }}
      className={
        "flex relative select-none bg-zinc-900 border border-t-[#272629] border-x-0 border-b-0 px-4 pl-2 min-h-[60px] rounded-b-xl justify-between items-center"
      }
    >
      <EmojiPicker
        setShowEmojiPicker={setShowEmojiPicker}
        showEmojiPicker={showEmojiPicker}
        isPortal={isPortal}
        zIndex={emojiZIndex}
        onEmojiClick={onEmojiClick}
      />
      {showCancel && (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="h-full select-none"
          >
            Cancel
          </Button>
          <Button
            disabled={disabled}
            type="button"
            onClick={handleCreate}
            className="select-none"
          >
            {buttonValue}
          </Button>
        </div>
      )}
      {!showCancel && (
        <Button
          disabled={disabled}
          type="button"
          onClick={() => {
            setShowEmojiPicker(false);
            if (handleCreate) {
              handleCreate();
            }
          }}
          className="select-none"
        >
          {buttonValue}
        </Button>
      )}
    </div>
  );
};

export default PostFooter;
