import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import { fetcher } from "@/lib/utils";
import { SessionData } from "@/lib/types";
import { AuthContextProvider } from "@/context/AuthContext";
import { cookies } from "next/headers";
import PatternCircles from "@/components/CirclePattern";
import NoiseTexture from "@/components/NoiseTexture";

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
  title: "Blog",
  description: "blog app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("a_t")?.value;
  const refreshToken = cookieStore.get("r_t")?.value;

  const res = await fetcher("/api/auth/session", {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `a_t=${accessToken}; r_t=${refreshToken}`,
    },
  });
  const serverAuthData: SessionData = {
    accessToken: accessToken || "",
    username: "",
    userId: "",
    name: "",
    loggedIn: res.status === 200,
  };

  // Means that session expired
  if (res.status === 401) {
    const data = await res.json();
    console.log(data);
    if (data && data.accessToken) {
      serverAuthData.username = data.username;
      serverAuthData.name = data.name;
      serverAuthData.userId = data.userId;
      serverAuthData.accessToken = data.accessToken;
      serverAuthData.loggedIn = true;
    }
  }

  return (
    <html lang="en">
      <AuthContextProvider serverData={serverAuthData}>
        <body
          suppressHydrationWarning
          className={`min-h-screen h-screen mx-auto overflow-x-hidden bg-zinc-900 ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PatternCircles />
          {/* <GridPattern /> */}
          {/* <DiagonalStripes /> */}
          <NoiseTexture />
          <div className="flex justify-center items-center">{children}</div>
        </body>
      </AuthContextProvider>
    </html>
  );
}
