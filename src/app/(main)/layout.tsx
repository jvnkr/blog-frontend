"use client";

import Avatar from "@/components/Avatar";
import { Header } from "@/components/Header";
import Logo from "@/components/Logo";
import { PiHouse, PiHouseFill } from "react-icons/pi";
import { TbSettings, TbSettingsFilled } from "react-icons/tb";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { Ellipsis, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loggedIn, clearAll, username, name } = useAuthContext();
  const pathname = usePathname();
  const handleLogout = async () => {
    clearAll();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (pathname === "/following" && !loggedIn) {
      window.location.href = "/home";
    }
  }, [loggedIn, pathname]);

  return (
    <>
      <div
        style={{
          zIndex: 9,
        }}
        className="flex bg-zinc-900/30 bg-opacity-[0.45] border border-y-0 border-[#272629] min-h-screen overflow-x-hidden justify-start items-center flex-col w-[45rem] mx-auto"
      >
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
                  <FaUserCircle className="w-6 h-6 fill-white" />
                ) : (
                  <FaRegUserCircle className="w-6 h-6" />
                )}
                <span>Profile</span>
              </Link>
              <Link
                href={"/settings"}
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
