"use client";

import React, { useEffect } from "react";
import LoginCard from "./LoginCard";
import { useAuthContext } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const AuthWall = () => {
  const { setUnauthWall } = useAuthContext();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div
      style={{
        zIndex: 999999,
      }}
      onClick={() => setUnauthWall(false)}
      className="flex truncate fixed top-0 left-0 bottom-0 right-0 bg-black/90 w-full justify-center items-center"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LoginCard next={pathname} />
      </div>
    </div>
  );
};

export default AuthWall;
