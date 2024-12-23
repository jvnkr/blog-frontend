"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

interface HeaderElementProps {
  selectedPath: string;
  text: string;
  isClickable?: boolean;
  className?: string;
}

const HeaderElement = ({
  text,
  selectedPath,
  className,
  isClickable = true,
}: HeaderElementProps) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      onClick={() => {
        if (isClickable) {
          router.push(selectedPath);
        }
      }}
      className={
        `flex outline-2 outline-[#888] w-full flex-grow px-2 transition-all ease-in-out duration-300 h-full justify-center items-center${
          isClickable
            ? " hover:bg-neutral-500 hover:bg-opacity-[0.5] cursor-pointer"
            : ""
        }` + (className ? " " + className : "")
      }
    >
      <span
        className={
          "flex flex-wrap truncate justify-center items-center relative h-full"
        }
      >
        {text}
        {pathname === selectedPath && (
          <div
            className={
              "absolute w-full bottom-[-2px] bg-white h-[4.5px] rounded-full"
            }
          ></div>
        )}
      </span>
    </div>
  );
};

export default HeaderElement;
