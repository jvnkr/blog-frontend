"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface HeaderElementProps {
  selectedPath: string;
  text: string;
  className?: string;
}

const HeaderElement = ({
  text,
  selectedPath,
  className,
}: HeaderElementProps) => {
  const pathname = usePathname();
  return (
    <Link
      href={selectedPath}
      className={
        "flex focus-within:ring-2 ring-[#888] outline-none w-full flex-grow px-2 transition-all ease-in-out duration-300 h-full hover:bg-neutral-500 hover:bg-opacity-[0.5] justify-center items-center" +
        (className ? " " + className : "")
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
            className={"absolute w-full bottom-0 bg-white h-[4px] rounded-full"}
          ></div>
        )}
      </span>
    </Link>
  );
};

export default HeaderElement;
