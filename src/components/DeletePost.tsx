import { CircleX } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

interface DeletePostProps {
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  buttonText?: string;
  handleDelete: () => void;
  title?: string;
  description?: React.ReactNode;
}

const DeletePost = ({
  setShowDeleteDialog,
  handleDelete,
  buttonText = "Delete Post",
  title = "Are you sure?",
  description = (
    <span className="text-neutral-400 text-sm">
      This action <span className="font-bold uppercase">cannot</span> be undone.
      This will permanently delete your post.
    </span>
  ),
}: DeletePostProps) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex bg-zinc-900 w-[30rem] rounded-xl p-4 border border-[#272629] justify-between items-center"
    >
      <div className="flex flex-col select-none gap-2 items-center">
        <div className="flex justify-start w-full items-center gap-2">
          <CircleX className="w-6 h-6 fill-red-500" />
          <span className="text-white font-semibold text-xl">{title}</span>
        </div>
        <span className="text-neutral-400 text-sm">{description}</span>
        <div className="flex pt-2 justify-end w-full gap-2">
          <Button onClick={() => setShowDeleteDialog(false)} variant="default">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
