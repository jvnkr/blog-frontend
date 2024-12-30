"use client";

import { useAuthContext } from "@/context/AuthContext";
import { Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import React from "react";

const ReportsPage = () => {
  const { loggedIn, role } = useAuthContext();
  const router = useRouter();
  if (!loggedIn || role !== Role.ADMIN) {
    router.replace("/home");
  }
  return <div>ReportsPage</div>;
};

export default ReportsPage;
