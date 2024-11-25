"use client";

import Avatar from "@/components/Avatar";
import { Header } from "@/components/Header";
import Logo from "@/components/Logo";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { Ellipsis, Search } from "lucide-react";
import Link from "next/link";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loggedIn, clearAll, username, name } = useAuthContext();
  const handleLogout = async () => {
    clearAll();
    window.location.reload();
  };

  return (
    <>
      {/* 60px is the desired distance from the left edge of the main content
              22.5rem is half of the main content width (45rem/2)
              So this positions the button 90px to the left of the main content
      */}
      <div
        style={{
          zIndex: 99999,
        }}
        className="flex bg-zinc-900 bg-opacity-[0.45] border p-4 border-y-0 border-[#272629] min-h-screen overflow-x-hidden justify-start items-center flex-col w-[45rem] mx-auto"
      >
        <div className={"flex pt-[60px] gap-2 relative h-fit flex-col w-full"}>
          <Header />
          {children}
        </div>
      </div>
      {loggedIn && (
        <div
          style={{ left: "calc(50% - 22.5rem - 24px)" }}
          className="fixed flex flex-col h-full justify-between top-0 py-[10px] translate-x-[-100%]"
        >
          <Logo />
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
        </div>
      )}
      <div
        style={{ left: "calc(50% + 22.5rem + 24px)" }}
        className="fixed flex flex-col h-full justify-between top-0 py-[10px]"
      >
        <div
          className={"flex select-none cursor-pointer rounded-xl h-fit w-fit"}
        >
          <div className="flex search-input cursor-default border border-[#272629] focus-within:ring-2 ring-[#999] bg-zinc-900 transition-all duration-150 ease-in-out p-2 py-0 rounded-lg items-center">
            <Search className="search-icon text-zinc-500 ml-[0.2rem] w-5 h-5 transition-colors duration-150 ease-in-out" />
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
      {!loggedIn && (
        <div
          style={{ left: "calc(50% - 22.5rem - 24px)" }}
          className="fixed top-[10px] translate-x-[-100%] flex flex-col gap-2 h-fit"
        >
          <Logo />
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
        </div>
      )}
    </>
  );
}
