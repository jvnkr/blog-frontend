"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  Form,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/utils";
import { setCookie } from "cookies-next";
import { redirect, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

const formSchema = z.object({
  usernameOrEmail: z.string().min(3, {
    message: "Username or email must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginPage = () => {
  const { loggedIn, setLoggedIn, setAccessToken } = useAuthContext();
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
        const { accessToken, refreshToken } = await response.json();
        setCookie("a_t", accessToken);
        setCookie("r_t", refreshToken);
        setAccessToken(accessToken);
        setLoggedIn(true);
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (loggedIn) redirect("/home");
  }, [loggedIn, router]);

  if (loggedIn) return null;

  return (
    <div
      style={{
        zIndex: 9999,
      }}
      className="flex flex-col items-center justify-center w-full h-screen"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between items-center border border-zinc-700 bg-zinc-800 space-y-8 w-[22rem] min-h-[18rem] p-[2rem] rounded-lg"
        >
          <div className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="usernameOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Username or Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-white border-neutral-600"
                      placeholder="Enter your username or email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="text-white border-neutral-600"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
