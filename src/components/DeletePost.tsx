import { CircleX } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { usePostsContext } from "@/context/PostsContext";
import { useAuthContext } from "@/context/AuthContext";
import useFetcher from "@/hooks/useFetcher";
import { toast } from "sonner";
import { PostData } from "@/lib/types";

interface DeletePostProps {
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostData;
}

const DeletePost = ({ setShowDeleteDialog, post }: DeletePostProps) => {
  const { accessToken } = useAuthContext();
  const {
    posts,
    profilePosts,
    followingPosts,
    setPosts,
    setIsPopup,
    setProfilePosts,
    setFollowingPosts,
  } = usePostsContext();
  const fetcher = useFetcher();

  const handleDelete = async () => {
    const previousPosts = posts;
    const previousProfilePosts = profilePosts;
    const previousFollowingPosts = followingPosts;
    try {
      setPosts(posts.filter((p) => p.id !== post.id));
      setProfilePosts(profilePosts.filter((p) => p.id !== post.id));
      setFollowingPosts(followingPosts.filter((p) => p.id !== post.id));
      setShowDeleteDialog(false);
      setIsPopup(false);
      await fetcher(`/api/v1/posts/${post.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Post deleted");
    } catch (error) {
      setPosts(previousPosts);
      setProfilePosts(previousProfilePosts);
      setFollowingPosts(previousFollowingPosts);
      toast.error("Failed to delete post");
      console.log(error);
    }
  };
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
          <span className="text-white font-semibold text-xl">
            Are you sure?
          </span>
        </div>
        <span className="text-neutral-400 text-sm">
          This action <span className="font-bold uppercase">cannot</span> be
          undone. This will permanently delete your post.
        </span>
        <div className="flex pt-2 justify-end w-full gap-2">
          <Button onClick={() => setShowDeleteDialog(false)} variant="default">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
