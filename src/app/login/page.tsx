"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetcher } from "@/lib/utils";
import { setCookie } from "cookies-next";
import { redirect, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const formSchema = z.object({
  usernameOrEmail: z.string().min(3, {
    message: "Username or email must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginPage = () => {
  const {
    loggedIn,
    setLoggedIn,
    setAccessToken,
    setUsername,
    setName,
    setUserId,
  } = useAuthContext();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetcher("/api/auth/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const { accessToken, refreshToken, username, name, userId } =
          await response.json();
        setCookie("a_t", accessToken, {
          // httpOnly: true,
          // secure: true,
          // sameSite: "lax",
          // domain: API_DOMAIN,
        });
        setCookie("r_t", refreshToken, {
          // httpOnly: true,
          // secure: true,
          // sameSite: "lax",
          // domain: API_DOMAIN,
        });
        setUsername(username);
        setName(name);
        setUserId(userId);
        setAccessToken(accessToken);
        setLoggedIn(true);
        router.push("/home");
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error((error as Error).message, {
        action: {
          label: "Close",
          onClick: () => {},
        },
        closeButton: false,
      });
    }
  }

  useEffect(() => {
    if (loggedIn) redirect("/home");
  }, [loggedIn, router]);

  if (loggedIn) return null;

  return (
    <div className="flex justify-center items-center h-screen">
      <Card
        style={{
          zIndex: 99,
        }}
        className="mx-auto dark:bg-zinc-900 max-w-sm"
      >
        <CardHeader className="gap-2">
          <div className="flex justify-center items-center">
            <Logo size={64} />
          </div>
          <CardTitle className="text-3xl text-center">Welcome Back</CardTitle>

          <CardDescription className="flex flex-col text-center">
            <span>Glad to see you again 👋</span>
            <span>Enter your credentials below to sign in to your account</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="flex flex-col gap-6 mb-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="usernameOrEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username or email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="text"
                            placeholder="Enter your username or email"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                      tabIndex={-1}
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="password"
                            placeholder="Enter your password"
                            type="password"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link tabIndex={-1} href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
