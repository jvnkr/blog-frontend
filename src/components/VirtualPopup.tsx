"use client";

import { usePostsContext } from "@/context/PostsContext";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface PopupProps {
  onOverlayClick: () => void;
  className?: string;
  children?: React.ReactNode;
}
/**
 * Used to properly trigger the popup context state update when its needed.
 * Mainly used for virtualized list to restore scroll position.
 * @param onOverlayClick Function to be called when the overlay is clicked
 * @param className Class name to be applied to the popup
 * @param children Children to be rendered inside the popup
 */
const VirtualPopup = ({ onOverlayClick, className, children }: PopupProps) => {
  const { setIsPopup } = usePostsContext();

  useEffect(() => {
    setIsPopup(true);

    return () => {
      setIsPopup(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      onClick={() => {
        setIsPopup(false);
        onOverlayClick();
      }}
      className={`fixed z-[99999] flex justify-center items-center inset-0 bg-black/50 ${className}`}
    >
      {children}
    </div>,
    document.body
  );
};

export default VirtualPopup;
