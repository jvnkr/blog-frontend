"use client";

import { Header } from "@/components/Header";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loggedIn, clearAll } = useAuthContext();
  const router = useRouter();
  const handleLogout = async () => {
    clearAll();
    router.refresh();
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
        className="flex bg-zinc-900 bg-opacity-[0.45] border p-4 border-y-0 border-zinc-600 min-h-screen overflow-x-hidden justify-start items-center overflow-y-auto flex-col w-[45rem] mx-auto"
      >
        <div className={"flex pt-[60px] gap-2 relative h-fit flex-col w-full"}>
          <Header />
          {children}
        </div>
      </div>
      {loggedIn && (
        <Button
          onClick={handleLogout}
          variant={"outline"}
          className="fixed hover:bg-red-700 hover:text-white bg-red-600 text-white border-red-700 top-[10px] w-fit right-[calc(50%-22.5rem-90px)]"
        >
          Log out
        </Button>
      )}
      {!loggedIn && (
        <Button
          variant={"outline"}
          asChild
          className="fixed hover:bg-blue-700 hover:text-white bg-blue-600 text-white border-blue-700 top-[10px] w-fit right-[calc(50%-22.5rem-80px)]"
        >
          <Link href="/login">Login</Link>
        </Button>
      )}
      {!loggedIn && (
        <Button
          variant={"outline"}
          asChild
          className="fixed top-[10px] w-fit right-[calc(50%-22.5rem-175px)]"
        >
          <Link href="/register">Register</Link>
        </Button>
      )}
    </>
  );
}
