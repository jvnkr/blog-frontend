"use client";
import { useAuthContext } from "@/context/AuthContext";
import HeaderElement from "@/components/HeaderElement";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { usePostsContext } from "@/context/PostsContext";

// export const NGROK_URL = "https://9624-37-122-170-44.ngrok-free.app";
export const NGROK_URL = "http://localhost:8080";

export const Header = () => {
  const { profileData } = usePostsContext();
  const { loggedIn } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
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
                  <div className="flex justify-center items-center w-fit flex-col">
                    <span className="flex w-fit items-center gap-1 text-white font-semibold">
                      {profileData?.name}
                      {profileData?.verified && (
                        <BadgeCheck className="w-4 h-4 fill-blue-500" />
                      )}
                    </span>
                    <span className="text-neutral-500 font-normal text-sm">
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
