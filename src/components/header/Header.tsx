"use client";
import { useAuthContext } from "@/context/AuthContext";
import HeaderElement from "@/components/header/HeaderElement";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, Search } from "lucide-react";
import { usePostsContext } from "@/context/PostsContext";
import { useSearchContext } from "@/context/SearchContext";
import Tooltip from "../Tooltip";

export const API_URL = "http://localhost:8080";

export const Header = () => {
  const { profileData } = usePostsContext();
  const { loggedIn } = useAuthContext();
  const { setShowSearchDialog } = useSearchContext();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/home");
    }
  };
  return (
    <div
      style={{
        zIndex: 9999,
      }}
      className={
        "flex select-none items-center rounded-b-[15px] left-[50%] translate-x-[-50%] fixed top-0 border bg-zinc-900 bg-opacity-[0.7] border-[#272629] border-t-0 w-full max-w-[45rem] h-[60px] text-white text-md font-semibold backdrop-blur-[2.2px]"
      }
    >
      {(pathname === "/home" || pathname === "/following") && (
        <HeaderElement
          className={`focus-within:rounded-br-[1px] rounded-bl-[14px]${
            !loggedIn ? " rounded-br-[14px] focus-within:rounded-br-xl" : ""
          }`}
          text={"For you"}
          selectedPath={"/home"}
        />
      )}
      {loggedIn && (pathname === "/following" || pathname === "/home") && (
        <HeaderElement
          className="focus-within:rounded-bl-[1px] rounded-br-[14px]"
          text={"Following"}
          selectedPath={"/following"}
        />
      )}
      {loggedIn && pathname.startsWith("/post") && (
        <>
          <ArrowLeft
            className="absolute left-2 text-white w-9 h-9 cursor-pointer p-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-[0.5] transition-all duration-150"
            onClick={handleBack}
          />
          <HeaderElement
            className="focus-within:rounded-bl-[1px] rounded-br-[14px]"
            isClickable={false}
            text={"Post"}
            selectedPath={pathname}
          />
        </>
      )}
      {loggedIn && pathname.startsWith("/search") && (
        <>
          <ArrowLeft
            className="absolute transition-all duration-300 left-2 text-white w-9 h-9 cursor-pointer p-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-[0.5]"
            onClick={handleBack}
          />
          <div className="flex w-full justify-center items-center gap-2">
            <div
              onClick={() => setShowSearchDialog(true)}
              className="flex cursor-pointer w-fit h-fit gap-2 items-center bg-zinc-800 rounded-full p-2 px-5"
            >
              <Search className="min-w-5 min-h-5 w-5 h-5" />
              <span className="select-none truncate">{`Search for "${searchQuery}"`}</span>
            </div>
          </div>
        </>
      )}
      {loggedIn && pathname.startsWith("/@") && (
        <>
          <ArrowLeft
            className="absolute transition-all duration-300 left-2 text-white w-9 h-9 cursor-pointer p-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-[0.5]"
            onClick={handleBack}
          />
          <HeaderElement
            className="focus-within:rounded-bl-[1px] rounded-br-[14px]"
            isClickable={false}
            text={
              <div className="flex w-full justify-center items-center gap-2">
                {!profileData && <p>Profile</p>}
                {profileData && (
                  <div className="flex min-w-fit max-w-[100px] justify-center items-center w-fit flex-col">
                    <div className="flex w-full justify-center items-center gap-1 text-white font-semibold">
                      <Tooltip
                        triggerStyle={{
                          maxWidth: "100px",
                          minWidth: "0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        contentStyle={{
                          zIndex: 99999999,
                        }}
                        tooltipTrigger={
                          <span className="truncate">{profileData?.name}</span>
                        }
                        tooltipContent={
                          <span className="text-white">
                            {profileData?.name}
                          </span>
                        }
                      />
                      {profileData?.verified && (
                        <BadgeCheck className="w-4 h-4 fill-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-neutral-500 font-normal text-sm truncate">
                      {profileData?.postsCount} posts
                    </span>
                  </div>
                )}
              </div>
            }
            selectedPath={pathname}
          />
        </>
      )}
    </div>
  );
};
