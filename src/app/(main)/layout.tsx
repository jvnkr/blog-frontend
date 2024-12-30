"use client";

import Avatar from "@/components/Avatar";
import { Header } from "@/components/Header";
import Logo from "@/components/Logo";
import { PiHouse, PiHouseFill } from "react-icons/pi";
import { TbSettings, TbSettingsFilled } from "react-icons/tb";
import { HiOutlineUser } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { Ellipsis, LayoutDashboard, PencilLine, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useFetcher from "@/hooks/useFetcher";
import CreatePost from "@/components/CreatePost";
import { usePostsContext } from "@/context/PostsContext";
import CreateComment from "@/components/CreateComment";
import { CommentData, Role } from "@/lib/types";
import VirtualPopup from "@/components/VirtualPopup";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loggedIn, clearAll, username, role, name } = useAuthContext();
  const { setCommentCreated } = usePostsContext();
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const fetcher = useFetcher();
  const handleLogout = async () => {
    try {
      const res = await fetcher("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        clearAll();
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (pathname === "/following" && !loggedIn) {
      router.replace("/home");
    }
  }, [loggedIn, pathname, router]);

  return (
    <>
      {loggedIn && showCreatePostDialog && (
        <VirtualPopup onOverlayClick={() => setShowCreatePostDialog(false)}>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex bg-zinc-900 rounded-xl pt-2 border border-[#272629] flex-col w-[calc(45rem-34px)]"
          >
            <div className="flex pb-2 border border-[#272629] border-t-0 border-x-0 justify-between items-center w-full px-2">
              <div className="flex select-none gap-2 items-center w-fit">
                <PencilLine className="w-5 h-5 text-white" />
                <span className="text-white text-lg">
                  {pathname.startsWith("/post")
                    ? "Create a comment"
                    : "Create a post"}
                </span>
              </div>
              <X
                onClick={() => setShowCreatePostDialog(false)}
                className="p-1 cursor-pointer rounded-full hover:bg-zinc-800 min-w-7 min-h-7 text-white"
              />
            </div>
            {pathname.startsWith("/post") ? (
              <CreateComment
                isPortal={false}
                postId={pathname.split("/")[2]}
                handleCreateComment={(newComment: CommentData) => {
                  setShowCreatePostDialog(false);
                  setCommentCreated(newComment);
                }}
                className="border-none pt-0"
                emojiZIndex={99999}
              />
            ) : (
              <CreatePost
                setShowCreatePostDialog={setShowCreatePostDialog}
                className="border-none"
                isPortal={false}
                emojiZIndex={99999}
              />
            )}
          </div>
        </VirtualPopup>
      )}
      <div className="flex bg-zinc-900/30 bg-opacity-[0.45] border border-y-0 border-[#272629] min-h-screen overflow-x-hidden justify-start items-center flex-col w-[45rem] mx-auto">
        <Header />
        {children}
      </div>
      <div
        style={{ left: "calc(50% - 22.5rem - 24px)" }}
        className="fixed flex flex-col h-full justify-between top-0 py-[10px] translate-x-[-100%]"
      >
        <div className="flex text-white flex-col gap-2">
          <Logo text />
          {!loggedIn && (
            <>
              <div className="flex text-2xl font-bold flex-col">
                <span>Join the</span>
                <span>community</span>
              </div>
              <div className="flex gap-2">
                <Button
                  className="font-medium h-[34px]"
                  variant={"default"}
                  asChild
                >
                  <Link href="/register">Sign up</Link>
                </Button>
                <Button
                  className="font-medium h-[34px]"
                  variant={"secondary"}
                  asChild
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </>
          )}
          {loggedIn && (
            <>
              <Link
                href="/home"
                className={`flex outline-[#888] outline-2 mt-2 text-xl text-white gap-2 items-center transition-all duration-150 ease-in-out hover:bg-zinc-900 border border-transparent hover:border-[#272629] cursor-pointer p-2 rounded-lg${
                  pathname === "/home" ? " font-bold" : ""
                }`}
              >
                {pathname === "/home" ? (
                  <PiHouseFill className="w-6 h-6 fill-white" />
                ) : (
                  <PiHouse className="w-6 h-6" />
                )}
                <span>Home</span>
              </Link>
              <Link
                href={`/@${username}`}
                className={`flex outline-[#888] outline-2 text-xl text-white gap-2 items-center transition-all duration-150 ease-in-out hover:bg-zinc-900 border border-transparent hover:border-[#272629] cursor-pointer p-2 rounded-lg${
                  pathname.endsWith(`/@${username}`) ? " font-bold" : ""
                }`}
              >
                {pathname.endsWith(`/@${username}`) ? (
                  <HiOutlineUser className="w-6 h-6 fill-white" />
                ) : (
                  <HiOutlineUser className="w-6 h-6" />
                )}
                <span>Profile</span>
              </Link>
              <Link
                href={"/settings/profile"}
                className={`flex outline-[#888] outline-2 text-xl text-white gap-2 items-center transition-all duration-150 ease-in-out hover:bg-zinc-900 border border-transparent hover:border-[#272629] cursor-pointer p-2 rounded-lg${
                  pathname === "/settings" ? " font-bold" : ""
                }`}
              >
                {pathname === "/settings" ? (
                  <TbSettingsFilled className="w-6 h-6 fill-white" />
                ) : (
                  <TbSettings className="w-6 h-6" />
                )}
                <span>Settings</span>
              </Link>
              {loggedIn && role === Role.ADMIN && (
                <Link
                  href={"/dashboard"}
                  className={`flex outline-[#888] outline-2 text-xl text-white gap-2 items-center transition-all duration-150 ease-in-out hover:bg-zinc-900 border border-transparent hover:border-[#272629] cursor-pointer p-2 rounded-lg${
                    pathname === "/dashboard" ? " font-bold" : ""
                  }`}
                >
                  {pathname === "/dashboard" ? (
                    <LayoutDashboard className="w-6 h-6 fill-white" />
                  ) : (
                    <LayoutDashboard className="w-6 h-6" />
                  )}
                  <span>Dashboard</span>
                </Link>
              )}
              {(pathname.split("/")[1].replace("@", "") === username ||
                pathname.split("/")[1] === "post" ||
                pathname.split("/")[1] === "home") && (
                <Button
                  className="w-full font-bold mt-2 hover:bg-[#e1e1e1]/70 bg-[#e1e1e1] text-lg rounded-full p-6"
                  onClick={() => setShowCreatePostDialog(true)}
                >
                  <span>
                    {pathname.startsWith("/post") ? "Comment" : "Post"}
                  </span>
                </Button>
              )}
            </>
          )}
        </div>
        {loggedIn && (
          <div
            onClick={handleLogout}
            className={
              "flex justify-between items-center select-none cursor-pointer hover:bg-zinc-900 border border-transparent hover:border-[#272629] rounded-xl transition-all duration-150 ease-in-out p-2  gap-8"
            }
          >
            <div className="flex gap-2">
              <Avatar name={name} />
              <div
                className={
                  "flex flex-col relative justify-start items-start text-[15px] font-semibold"
                }
              >
                <span className="flex items-center h-[19px]">{name}</span>
                <span
                  className={
                    "flex font-normal text-neutral-500 items-center h-full text-[12px]"
                  }
                >
                  @{username}
                </span>
              </div>
            </div>
            <Ellipsis className="text-[#555] w-5 h-5" />
          </div>
        )}
      </div>
      <div
        style={{ left: "calc(50% + 22.5rem + 24px)" }}
        className="fixed flex flex-col h-full justify-between top-0 py-[10px]"
      >
        <div
          className={"flex select-none cursor-pointer rounded-xl h-fit w-fit"}
        >
          <div className="flex search-input cursor-default border border-[#272629] focus-within:outline focus-within:outline-2 focus-within:outline-[#999] bg-zinc-900 p-2 py-0 rounded-lg items-center">
            <Search className="search-icon text-zinc-500 ml-[0.2rem] w-5 h-5" />
            <input
              spellCheck={false}
              className="pl-2 bg-transparent py-1 outline-none ring-0 text-lg text-white/75 border-none"
              style={{
                boxShadow: "none",
                fontSize: "1rem",
              }}
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
    </>
  );
}
