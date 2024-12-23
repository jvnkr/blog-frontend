import { CornerDownRight } from "lucide-react";
import React from "react";

interface ViewMoreRepliesProps {
  onClick: () => void;
}

const ViewMoreReplies = ({ onClick }: ViewMoreRepliesProps) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      className="flex ml-4 gap-2 w-fit transition-all duration-200 py-2 select-none cursor-pointer items-center justify-center p-4 font-semibold rounded-full hover:bg-white hover:bg-opacity-15 text-[#dedede]"
    >
      <CornerDownRight className="w-5 h-5 stroke-[2.5]" />
      <span>View more replies</span>
    </div>
  );
};

export default ViewMoreReplies;
