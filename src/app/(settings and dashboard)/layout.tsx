"use client";

import DashboardLayout from "@/components/DashboardLayout";
import SettingsLayout from "@/components/SettingsLayout";
import { useAuthContext } from "@/context/AuthContext";
import { Role } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
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
      router.replace("/home");
    }
  }, [loggedIn, router, pathname, role]);

  let layout = null;

  if (pathname === "/settings/profile" || pathname === "/settings/account") {
    layout = <SettingsLayout>{children}</SettingsLayout>;
  } else if (pathname === "/dashboard" || pathname === "/dashboard/reports") {
    layout = <DashboardLayout>{children}</DashboardLayout>;
    if (!loggedIn || role !== Role.ADMIN) {
      return null;
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
