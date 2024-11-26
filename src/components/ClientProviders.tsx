"use client";

import { ThemeProvider } from "next-themes";
import { PostsProvider } from "@/context/PostsContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PostsProvider>{children}</PostsProvider>
    </ThemeProvider>
  );
}
