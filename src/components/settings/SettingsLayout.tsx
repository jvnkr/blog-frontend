"use client";

import { ArrowLeft, PanelLeftClose, PanelLeftOpen, Shield } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { HiOutlineUser } from "react-icons/hi";
interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/home");
    }
  };

  // Calculate the width for closed sidebar to ensure equal padding
  const iconSize = 36; // Assuming icon size is 36px (9 * 4)
  const padding = 16; // Assuming padding is 16px (2 * 8)
  const closedWidth = iconSize + 2 * padding;

  return (
    <>
      <motion.div
        initial={{ width: "300px" }}
        animate={{
          width: sidebarOpen ? "300px" : `${closedWidth + 4}px`,
        }}
        transition={{ duration: 0.125 }}
        className="flex p-2 flex-col h-full w-[300px]"
      >
        <div className="flex overflow-hidden relative bg-zinc-900/30 border border-[#272629] rounded-xl flex-col h-full">
          <div
            className={
              "flex select-none justify-between items-center rounded-b-[15px] sticky rounded-t-xl border bg-zinc-900 border-t-0 border-x-0 bg-opacity-[0.7] border-[#272629] w-full min-h-[50px] text-white text-md font-semibold px-2 gap-2 ml-[-1px] translate-x-[1px]"
            }
          >
            {sidebarOpen && (
              <ArrowLeft
                className="text-white w-9 h-9 min-w-9 min-h-9 cursor-pointer p-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-[0.5] transition-all duration-150"
                onClick={handleBack}
              />
            )}
            {!sidebarOpen && (
              <PanelLeftOpen
                style={{
                  width: "38px",
                  height: "38px",
                  minWidth: "38px",
                  minHeight: "38px",
                }}
                className="min-w-9 min-h-9 cursor-pointer p-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-[0.5] transition-all duration-150"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
            )}
            <motion.span
              initial={{
                opacity: 1,
              }}
              animate={{
                opacity: sidebarOpen ? 1 : 0,
              }}
              transition={{ duration: 0.125 }}
              className="text-xl"
            >
              Settings
            </motion.span>
            {sidebarOpen && (
              <PanelLeftClose
                style={{
                  width: sidebarOpen ? "36px" : "38px",
                  height: sidebarOpen ? "36px" : "38px",
                }}
                className="min-w-9 min-h-9 cursor-pointer p-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-[0.5] transition-all duration-150"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
            )}
          </div>

          <div className="flex flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto">
            <div
              className={`flex overflow-hidden items-center gap-2 transition-all duration-150 ease-in-out text-white hover:bg-zinc-900 border hover:border-[#272629] cursor-pointer p-2 rounded-lg${
                pathname === "/settings/profile"
                  ? " font-bold bg-zinc-900 border-[#272629]"
                  : " border-transparent"
              }`}
              onClick={() => router.replace("/settings/profile")}
            >
              {pathname === "/settings/profile" ? (
                <HiOutlineUser className="max-w-5 max-h-5 min-w-5 min-h-5 fill-white" />
              ) : (
                <HiOutlineUser className="max-w-5 max-h-5 min-w-5 min-h-5" />
              )}
              <span>Profile</span>
            </div>
            <div
              className={`flex overflow-hidden items-center gap-2 transition-all duration-150 ease-in-out text-white hover:bg-zinc-900 border hover:border-[#272629] cursor-pointer p-2 rounded-lg${
                pathname === "/settings/account"
                  ? " font-bold bg-zinc-900 border-[#272629]"
                  : " border-transparent"
              }`}
              onClick={() => router.replace("/settings/account")}
            >
              {pathname === "/settings/account" ? (
                <Shield className="max-w-5 max-h-5 min-w-5 min-h-5 fill-white" />
              ) : (
                <Shield className="max-w-5 max-h-5 min-w-5 min-h-5" />
              )}
              <span>Account</span>
            </div>
          </div>
        </div>
      </motion.div>
      <div
        style={{
          zIndex: 1,
        }}
        className="flex w-full h-full overflow-hidden"
      >
        <div className="w-full overflow-hidden p-6 bg-zinc-900 border mt-[-1px] mb-[-1px] border-zinc-800 border-r-0 rounded-l-3xl">
          <div className="flex flex-col justify-center items-start border border-zinc-700 border-x-0 border-t-0 pb-7 mb-7">
            <span className="text-2xl font-bold">
              {pathname === "/settings/profile" ? "Profile" : "Account"}
            </span>
            <span className="text-sm text-zinc-400">
              {pathname === "/settings/profile"
                ? "Customize your public profile"
                : "Manage your account settings"}
            </span>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default SettingsLayout;
