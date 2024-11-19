"use client";

import { useAuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { loggedIn } = useAuthContext();
  if (!loggedIn) redirect("/login");
  redirect("/home");
}
