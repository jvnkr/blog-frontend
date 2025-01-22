import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React, { Suspense } from "react";
import { fetcher } from "@/lib/utils";
import { SessionData } from "@/lib/types";
import { AuthContextProvider } from "@/context/AuthContext";
import PatternCircles from "@/components/effects/CirclePattern";
import NoiseTexture from "@/components/effects/NoiseTexture";
import { Toaster } from "@/components/ui/sonner";
import { ClientProviders } from "@/components/ClientProviders";
import { cookies } from "next/headers";
import { SearchProvider } from "@/context/SearchContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Blogify",
  description: "Write your own stories",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let serverAuthData: SessionData = {
    accessToken: "",
    role: "",
    username: "",
    userId: "",
    name: "",
    email: "",
    bio: "",
    loggedIn: false,
    verified: false,
  };

  try {
    const res = await fetcher(
      "/api/auth/session",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await cookies()).toString(),
        },
        body: JSON.stringify({
          accessToken: "",
        }),
      },
      () => null,
      "http://backend:8080" // Server side docker service url fetch through docker network
    );

    if (res.ok) {
      const data = await res.json();
      serverAuthData = {
        accessToken: data.accessToken || "",
        username: data.username || "",
        userId: data.userId || "",
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        role: data.role || "",
        loggedIn: true,
        verified: data.verified || false,
      };
    }
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }

  return (
    <html className="dark" suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={`min-h-screen h-screen mx-auto bg-zinc-900 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense
          fallback={
            <div className="flex min-h-screen w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <AuthContextProvider serverData={serverAuthData}>
            <ClientProviders>
              <SearchProvider>
                <Toaster />
                <PatternCircles />
                <NoiseTexture />
                <div className="flex justify-center items-center">
                  {children}
                </div>
              </SearchProvider>
            </ClientProviders>
          </AuthContextProvider>
        </Suspense>
      </body>
    </html>
  );
}
