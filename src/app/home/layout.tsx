"use client";

import Avatar from "@/components/Avatar";
import { Header } from "@/components/Header";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loggedIn, clearAll, username, name } = useAuthContext();
  const handleLogout = async () => {
    window.location.reload();
    clearAll();
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
          onClick={handleLogout}
          className={
            "flex select-none cursor-pointer hover:bg-zinc-900 border border-transparent hover:border-[#272629] rounded-xl transition-all duration-150 ease-in-out p-2 fixed top-[5px] gap-2 h-fit w-fit right-[5px]"
          }
        >
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
      )}
      {!loggedIn && (
        <Button
          variant={"default"}
          asChild
          className="fixed top-[10px] w-fit right-[calc(50%-22.5rem-80px)]"
        >
          <Link href="/login">Login</Link>
        </Button>
      )}
      {!loggedIn && (
        <Button
          variant={"secondary"}
          asChild
          className="fixed top-[10px] w-fit right-[calc(50%-22.5rem-175px)]"
        >
          <Link href="/register">Register</Link>
        </Button>
      )}
    </>
  );
}
