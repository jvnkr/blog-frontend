"use client";

import { redirect } from "next/navigation";

export default function Home() {
  // const { loggedIn } = useAuthContext();
  // if (!loggedIn) redirect("/login");
  // TODO: if accessing protected route & dont have access, redirect to previous page
  redirect("/home");
}
