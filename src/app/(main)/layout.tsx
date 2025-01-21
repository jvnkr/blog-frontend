"use client";

import { Header } from "@/components/header/Header";
import Logo from "@/components/Logo";
import { PiHouse, PiHouseFill } from "react-icons/pi";
import { TbSettings, TbSettingsFilled } from "react-icons/tb";
import { HiOutlineUser } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import {
  Command,
  Ellipsis,
  Filter,
  LayoutDashboard,
  LogOut,
  NotepadText,
  PencilLine,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import useFetcher from "@/hooks/useFetcher";
import CreatePost from "@/components/post/CreatePost";
import { usePostsContext } from "@/context/PostsContext";
import CreateComment from "@/components/comment/CreateComment";
import { CommentData, Role, SearchFilter } from "@/lib/types";
import VirtualPopup from "@/components/VirtualPopup";
import AvatarInfo from "@/components/profile/AvatarInfo";
import { AnimatePresence, motion } from "motion/react";
import SearchBar from "@/components/SearchBar";
import { useSearchContext } from "@/context/SearchContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loggedIn, setUnauthWall, clearAll, username, role, name, verified } =
    useAuthContext();
  const { setCommentCreated } = usePostsContext();
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const { showSearchDialog, setShowSearchDialog, setFetched, setResults } =
    useSearchContext();
  const searchParams = useSearchParams();
  const [showMenu, setShowMenu] = useState(false);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>(
    searchParams.get("filter") as SearchFilter
  );
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
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

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setShowSearchDialog(false);
    }

    if (
      (e.key === "k" && (e.metaKey || e.altKey)) ||
      (e.key === "k" && e.ctrlKey)
    ) {
      e.preventDefault();

      if (document.activeElement === searchRef.current) {
        setShowSearchDialog(false);
      } else {
        if (!pathname.startsWith("/search")) {
          setFetched(false);
          setResults([]);
        }
        setShowSearchDialog(!showSearchDialog);
        setTimeout(() => {
          searchRef.current?.focus();
        }, 0);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleCloseMenu);
    const url = new URL(window.location.href);
    const currentQuery = url.searchParams.get("q");
    const currentFilter = url.searchParams.get("filter");

    if (currentQuery) {
      url.searchParams.set("q", currentQuery);
    }

    // Check if filter exists and is valid SearchFilter type
    if (!currentFilter || !["posts", "users"].includes(currentFilter)) {
      setSearchFilter("posts");
      url.searchParams.set("filter", "posts");
      router.push(url.pathname + url.search);
    }

    setIsWindows(navigator.userAgent.toLowerCase().includes("windows"));

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleCloseMenu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathname === "/following" && !loggedIn) {
      router.replace("/home");
    }
  }, [loggedIn, pathname, router]);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <AnimatePresence mode="wait">
        {loggedIn && showSearchDialog && (
          <VirtualPopup onOverlayClick={() => setShowSearchDialog(false)}>
            <SearchBar isWindows={isWindows} searchRef={searchRef} />
          </VirtualPopup>
        )}
      </AnimatePresence>
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
      <div className="flex bg-zinc-900/30 bg-opacity-[0.45] border border-y-0 border-[#272629] min-h-screen overflow-x-hidden justify-start items-center flex-col w-[45rem] relative mx-auto">
        <Header />
        {children}
      </div>
      <div
        style={{ left: "calc(50% - 22.5rem - 24px)" }}
        className="fixed flex w-[12rem] flex-col h-full justify-between top-0 py-[10px] translate-x-[-100%]"
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
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`flex relative justify-between items-center select-none cursor-pointer hover:bg-zinc-900 border hover:border-[#272629] rounded-xl transition-all duration-150 ease-in-out p-2 gap-8 ${
              showMenu ? "bg-zinc-900 border-[#272629]" : "border-transparent"
            }`}
          >
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute p-1 w-full left-0 rounded-md bg-zinc-900 border border-[#272629] top-[-3rem]"
                >
                  <button
                    onClick={handleLogout}
                    className="flex gap-2 items-center w-full h-fit hover:bg-zinc-800 rounded-sm text-white p-1 hover:text-red-500 transition-colors duration-150 ease-in-out"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <AvatarInfo
              name={name}
              username={username}
              verified={verified}
              onClick={() => null}
            />
            <Ellipsis className="text-[#555] min-w-5 min-h-5" />
          </div>
        )}
      </div>
      {loggedIn && !pathname.startsWith("/search") && (
        <div
          style={{ left: "calc(50% + 22.5rem + 24px)" }}
          className="fixed w-[12rem] flex flex-col h-full justify-between top-0 py-[10px]"
        >
          <button
            onClick={() => {
              if (!loggedIn) {
                setUnauthWall("search");
                return;
              }
              setShowSearchDialog(true);
              setFetched(false);
              setResults([]);
              setTimeout(() => {
                searchRef.current?.focus();
              }, 0);
            }}
            className="flex w-full justify-between search-input border border-[#272629] bg-zinc-900 p-1 gap-2 rounded-lg items-center"
          >
            <div className="flex items-center gap-1">
              <Search className="text-zinc-500 ml-[0.2rem] w-5 h-5" />
              <span className="text-white/50">Search</span>
            </div>
            <div className="flex gap-1 items-center">
              {!isWindows && (
                <Command className="bg-zinc-800 border border-[#333] p-1 rounded-md w-6 h-6 min-w-6 min-h-6 text-neutral-300" />
              )}
              {isWindows && (
                <span className="text-neutral-300 border border-[#333] font-semibold text-xs p-2 rounded-md bg-zinc-800 min-w-6 min-h-6 w-6 h-6 flex justify-center items-center">
                  {"ALT"}
                </span>
              )}
              {!isWindows && (
                <span className="text-neutral-300 border border-[#333] font-semibold p-1 text-sm rounded-md bg-zinc-800 min-w-6 min-h-6 w-6 h-6 flex justify-center items-center">
                  {"K"}
                </span>
              )}
            </div>
          </button>
        </div>
      )}
      {loggedIn && pathname.startsWith("/search") && (
        <div
          style={{ left: "calc(50% + 22.5rem + 24px)" }}
          className="fixed w-[12rem] flex flex-col h-full justify-between top-0 py-[10px]"
        >
          <div className="flex w-full flex-col h-fit justify-start border border-[#272629] bg-zinc-900 gap-2 rounded-lg items-start">
            <div className="flex h-fit border border-x-0 border-t-0 w-full border-[#272629] p-3 gap-2 items-center">
              <Filter className="text-zinc-400 ml-[0.2rem] w-5 h-5 min-w-5 min-h-5" />
              <span className="text-zinc-300">Filters</span>
            </div>
            <div className="flex flex-col w-full gap-2 p-2 pt-0">
              <button
                onClick={() => {
                  setSearchFilter("posts");
                  const url = new URL(window.location.href);
                  const currentQuery = url.searchParams.get("q");
                  url.searchParams.set("filter", "posts");
                  if (currentQuery) url.searchParams.set("q", currentQuery);
                  window.location.href = url.pathname + url.search;
                }}
                className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                  searchFilter === "posts"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50"
                }`}
              >
                <NotepadText
                  className={`w-5 h-5 min-w-5 min-h-5 ${
                    searchFilter === "posts" ? "text-white" : "text-zinc-400"
                  }`}
                />
                <span>Posts</span>
              </button>
              <button
                onClick={() => {
                  setSearchFilter("users");
                  const url = new URL(window.location.href);
                  const currentQuery = url.searchParams.get("q");
                  url.searchParams.set("filter", "users");
                  if (currentQuery) url.searchParams.set("q", currentQuery);
                  window.location.href = url.pathname + url.search;
                }}
                className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                  searchFilter === "users"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50"
                }`}
              >
                <UsersRound
                  className={`w-5 h-5 min-w-5 min-h-5 ${
                    searchFilter === "users" ? "text-white" : "text-zinc-400"
                  }`}
                />
                <span>Profiles</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
