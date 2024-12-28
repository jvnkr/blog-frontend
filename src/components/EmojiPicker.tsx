import { createPortal } from "react-dom";

import React, { useEffect, useRef, useState } from "react";
import { SmilePlus } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  zIndex?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  isVisible?: boolean;
  isPortal?: boolean;
  top?: number;
  left?: number;
  size?: number;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  showEmojiPicker: boolean;
}

const EmojiPicker = ({
  onEmojiClick,
  zIndex = 999,
  onClick,
  className,
  setShowEmojiPicker,
  showEmojiPicker,
  isVisible = true,
  isPortal = true,
  top = 0,
  left = !isPortal ? 50 : 0,
  size = 20,
}: EmojiPickerProps) => {
  const [pickerPosition, setPickerPosition] = useState({
    top: top,
    left: left,
  });
  const pickerHeight = 450; // Fixed height
  const emojiButtonRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const updatePickerPosition = () => {
    if (!emojiButtonRef.current) return;

    const buttonRect = emojiButtonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const bottomBuffer = 8;

    if (isPortal) {
      // Initial position below the button
      let newTop = buttonRect.top + scrollY;
      const newLeft = buttonRect.right + 8; // 8px gap from button

      // Check if picker would extend beyond viewport vertically
      const viewportBottom = windowHeight + scrollY;
      const pickerBottom = newTop + pickerHeight;

      if (pickerBottom > viewportBottom) {
        // If it extends beyond bottom, position above the button
        newTop = viewportBottom - pickerHeight - bottomBuffer;
      }

      // Ensure picker doesn't go above viewport
      const minTop = scrollY + bottomBuffer;
      const maxTop = buttonRect.top;

      // Allow overflow at the bottom if picker bottom goes over button's top
      let adjustedTop = newTop;
      if (pickerBottom > maxTop) {
        // Allow overflow by setting adjustedTop to newTop
        adjustedTop = newTop;
      }

      setPickerPosition({
        top: Math.max(minTop, adjustedTop),
        left: newLeft,
      });
    } else {
      // Initial position below the button
      let newTop = buttonRect.top;

      // Check if picker would extend beyond viewport vertically
      const viewportBottom = windowHeight;
      const pickerBottom = newTop + pickerHeight;

      if (pickerBottom > viewportBottom) {
        // If it extends beyond bottom, position above the button
        newTop = viewportBottom - pickerBottom - bottomBuffer;
      }

      setPickerPosition({
        top: Math.min(0, newTop),
        left: left,
      });
    }
  };
  const handleResize = () => {
    updatePickerPosition();
  };

  useEffect(() => {
    updatePickerPosition();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickerContent = (
    <div
      onClick={onClick}
      style={{
        pointerEvents: "auto",
        position: "absolute",
        top: pickerPosition.top,
        left: pickerPosition.left,
        zIndex,
      }}
      ref={pickerRef}
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji: { native: string }) =>
          onEmojiClick(emoji.native)
        }
      />
    </div>
  );

  return (
    <>
      <div
        className={`cursor-pointer select-none w-fit h-fit transition-all duration-150 hover:bg-zinc-800 rounded-full ${className}`}
        style={{
          padding: `${size / 3}px`,
        }}
        onClick={() => {
          updatePickerPosition();
          setShowEmojiPicker(!showEmojiPicker);
          // Position will be updated in useEffect when showEmojiPicker changes
        }}
        ref={emojiButtonRef}
      >
        <SmilePlus
          size={size}
          className={`transition-all duration-150 ${
            !showEmojiPicker ? "text-neutral-400" : "text-white"
          }`}
        />
      </div>
      {showEmojiPicker &&
        isVisible &&
        (isPortal ? createPortal(pickerContent, document.body) : pickerContent)}
    </>
  );
};

export default EmojiPicker;
