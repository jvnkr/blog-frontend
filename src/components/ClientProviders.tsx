"use client";

import { ThemeProvider } from "next-themes";
import { PostsProvider } from "@/context/PostsContext";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PostsProvider>{children}</PostsProvider>
      <ProgressBar
        height="4px"
        color="#fff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </ThemeProvider>
  );
}
