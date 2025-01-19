"use client";

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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";
import Logo from "@/components/Logo";
import useFetcher from "@/hooks/useFetcher";

const formSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const { loggedIn } = useAuthContext();
  const [registered, setRegistered] = useState(false);
  const router = useRouter();
  const fetcher = useFetcher();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // This enables real-time validation
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetcher("/api/auth/register", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setRegistered(true);
        const data = response.headers
          .get("content-type")
          ?.includes("application/json")
          ? await response.json()
          : null;
        if (data === null) {
          toast.success("Registered successfully", {
            description: "Please check your email for verification",
            action: {
              label: "Close",
              onClick: () => null,
            },
          });
        } else {
          toast.success("Registered successfully", {
            description: "Please login to continue",
            action: {
              label: "Close",
              onClick: () => null,
            },
          });
          // router.replace("/login");
        }
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error((error as Error).message, {
        action: {
          label: "Close",
          onClick: () => null,
        },
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
        className="mx-auto border-[#272629] text-white bg-zinc-900 max-w-sm"
      >
        <CardHeader className="gap-2">
          <div className="flex justify-center items-center">
            <Logo size={64} />
          </div>
          <CardTitle className="text-3xl text-center">Sign up</CardTitle>
          <CardDescription className="flex flex-col text-center">
            <span>
              Enter your details below to create a new account and get started
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="flex flex-col gap-6 mb-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          required
                          className="text-white"
                          placeholder="Enter your username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          required
                          className="text-white"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          required
                          className="text-white"
                          placeholder="Enter your name"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="password"
                          className="text-white"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="password"
                          className="text-white"
                          placeholder="Confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={registered}
                className="w-full select-none"
                type="submit"
              >
                Sign up
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link tabIndex={-1} href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
