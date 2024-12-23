"use client";

import { SmilePlus } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { createPortal } from "react-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface PostFooterProps {
  disabled: boolean;
  buttonValue: string;
  onEmojiClick: (newValue: string) => void;
  handleCreate: () => void;
  handleCancel?: () => void;
  showCancel?: boolean;
}

const PostFooter = ({
  disabled,
  buttonValue,
  onEmojiClick,
  handleCreate,
  handleCancel,
  showCancel = false,
}: PostFooterProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerPosition = useRef({ top: 0, left: 0 });
  const pickerHeight = 450; // Fixed height
  const emojiButtonRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const updatePickerPosition = (top: number, left: number, resize = false) => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const scrollY = window.scrollY;
    const bottomBuffer = 10;
    const sideBuffer = 10;
    let newTop = top;
    let newLeft = left;

    // Check if picker would extend beyond viewport vertically
    const viewportBottom = windowHeight + scrollY;
    const pickerBottom = newTop + pickerHeight + bottomBuffer;

    if (pickerBottom > viewportBottom) {
      newTop = viewportBottom - pickerHeight - bottomBuffer;
    }

    // Check if picker would extend beyond viewport horizontally
    if (newLeft + 350 > windowWidth - sideBuffer) {
      // 350 is approximate picker width
      newLeft = windowWidth - 350 - sideBuffer;
    }

    // Ensure picker doesn't go above viewport or too far left
    const minTop = scrollY + bottomBuffer;
    pickerPosition.current = {
      top: Math.max(minTop, newTop),
      left: Math.max(sideBuffer, newLeft),
    };
    if (resize && pickerRef.current) {
      pickerRef.current.style.top = `${pickerPosition.current.top}px`;
      pickerRef.current.style.left = `${pickerPosition.current.left}px`;
    }
  };

  const updatePickerOnResize = () => {
    if (!emojiButtonRef.current || !showEmojiPicker || !pickerRef.current)
      return;

    const rect = emojiButtonRef.current.getBoundingClientRect();
    const initialTop = rect.top + window.scrollY;
    const initialLeft = rect.right + 8;

    updatePickerPosition(initialTop, initialLeft, true);
  };

  useEffect(() => {
    window.addEventListener("resize", updatePickerOnResize);

    return () => {
      window.removeEventListener("resize", updatePickerOnResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        zIndex: 999,
      }}
      className={
        "flex relative select-none bg-zinc-900 border border-t-[#272629] border-x-0 border-b-0 px-4 pl-2 min-h-[60px] rounded-b-xl justify-between items-center"
      }
    >
      <div
        className="cursor-pointer transition-all duration-150 hover:bg-zinc-800 p-2 rounded-full"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const initialTop = rect.top + window.scrollY;
          const initialLeft = rect.right + 8;
          updatePickerPosition(initialTop, initialLeft);
          setShowEmojiPicker(!showEmojiPicker);
        }}
        ref={emojiButtonRef}
      >
        <SmilePlus
          className={`transition-all duration-150 ${
            !showEmojiPicker ? "text-neutral-400" : "text-white"
          }`}
        />
      </div>
      {showEmojiPicker &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: pickerPosition.current.top,
              left: pickerPosition.current.left,
              zIndex: 999,
            }}
            ref={pickerRef}
          >
            <Picker
              data={data}
              onEmojiSelect={(emoji: { native: string }) =>
                onEmojiClick(emoji.native)
              }
            />
          </div>,
          document.body
        )}
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
          onClick={handleCreate}
          className="select-none"
        >
          {buttonValue}
        </Button>
      )}
    </div>
  );
};

export default PostFooter;
