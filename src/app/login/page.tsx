"use client";

import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import LoginCard from "@/components/LoginCard";

const LoginPage = () => {
  const { loggedIn } = useAuthContext();

  useEffect(() => {
    if (loggedIn) redirect("/home");
  }, [loggedIn]);

  if (loggedIn) return null;

  return (
    <div className="flex justify-center items-center h-screen">
      <LoginCard />
    </div>
  );
};

export default LoginPage;
