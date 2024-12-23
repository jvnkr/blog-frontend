"use client";

import React, { useEffect } from "react";
import LoginCard from "./LoginCard";
import { useAuthContext } from "@/context/AuthContext";

const AuthWall = ({ next = "/home" }: { next: string }) => {
  const { setUnauthWall } = useAuthContext();

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
      onClick={() => setUnauthWall("")}
      className="flex truncate fixed top-0 left-0 bottom-0 right-0 bg-black/90 w-full justify-center items-center"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LoginCard next={next} />
      </div>
    </div>
  );
};

export default AuthWall;
