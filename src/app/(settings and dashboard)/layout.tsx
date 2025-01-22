"use client";

import DashboardLayout from "@/components/admin/dashboard/DashboardLayout";
import SettingsLayout from "@/components/settings/SettingsLayout";
import { useAuthContext } from "@/context/AuthContext";
import { Role } from "@/lib/types";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loggedIn, role } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loggedIn) {
      redirect("/home");
    }
  }, [loggedIn, router]);

  if (!loggedIn) {
    return null;
  }

  let layout = null;

  if (pathname === "/settings/profile" || pathname === "/settings/account") {
    layout = <SettingsLayout>{children}</SettingsLayout>;
  } else if (pathname === "/dashboard" || pathname === "/dashboard/reports") {
    if (role === Role.ADMIN) {
      layout = <DashboardLayout>{children}</DashboardLayout>;
    } else {
      redirect("/home");
    }
  }

  return (
    <div
      style={{
        zIndex: 1,
      }}
      className="flex w-full max-h-screen h-screen overflow-hidden"
    >
      {layout}
    </div>
  );
}
