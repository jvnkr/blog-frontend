import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import { fetcher } from "@/lib/utils";
import { SessionData } from "@/lib/types";
import { AuthContextProvider } from "@/context/AuthContext";
import PatternCircles from "@/components/CirclePattern";
import NoiseTexture from "@/components/NoiseTexture";
import { Toaster } from "@/components/ui/sonner";
import { ClientProviders } from "@/components/ClientProviders";
import { cookies } from "next/headers";

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
    username: "",
    userId: "",
    name: "",
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
          Cookie: await cookies().toString(),
        },
        body: JSON.stringify({
          accessToken: "",
        }),
      },
      () => null
    );

    console.log("res", res);
    if (res.ok) {
      const data = await res.json();
      console.log("data", data);
      serverAuthData = {
        accessToken: data.accessToken || "",
        username: data.username || "",
        userId: data.userId || "",
        name: data.name || "",
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
        <AuthContextProvider serverData={serverAuthData}>
          <ClientProviders>
            <Toaster />
            <PatternCircles />
            <NoiseTexture />
            <div className="flex justify-center items-center">{children}</div>
          </ClientProviders>
        </AuthContextProvider>
      </body>
    </html>
  );
}
