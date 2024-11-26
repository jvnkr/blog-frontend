import React from "react";

interface PostInteractionProps {
  children: React.ReactNode;
}

const PostInteraction = ({ children }: PostInteractionProps) => {
  return (
    <div className="flex relative w-fit gap-1 items-center text-neutral-400 group">
      {children}
      <div className="absolute rounded-md w-[calc(100%+15px)] h-[calc(100%+6px)] -left-[7.5px] -top-[3px] group-hover:bg-neutral-500/15 transition-colors duration-200"></div>
    </div>
  );
};

export default PostInteraction;
