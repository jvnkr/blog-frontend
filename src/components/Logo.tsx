import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
  text?: boolean;
  vertical?: boolean;
  size?: number;
}

const Logo = ({
  className,
  text = false,
  vertical = false,
  size = 40,
}: LogoProps) => {
  return (
    <Link
      href={"/"}
      className={`flex focus-visible:ring-2 ring-[#777] transition-all duration-150 ease-in-out outline-none select-none rounded-lg w-fit gap-2 justify-center items-center ${
        vertical ? "flex-col" : ""
      }`}
    >
      <div
        style={{
          width: size,
          height: size,
        }}
        className={`flex justify-center items-center font-bold bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 rounded-lg border border-[#333333]${
          className ? " " + className : ""
        }`}
      >
        <span
          style={{
            fontSize: `${size / 34}rem`,
          }}
          className="flex mb-[-1px] justify-center items-center min-w-[20px]"
        >
          B
        </span>
      </div>
      {text && (
        <span
          style={{
            fontSize: `${size / 32}rem`,
          }}
          className="flex justify-center items-center h-full"
        >
          Blogify
        </span>
      )}
    </Link>
  );
};

export default Logo;
