import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { fetcher } from "@/lib/utils";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";

const formSchema = z.object({
  usernameOrEmail: z.string().min(3, {
    message: "Username or email must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface LoginCardProps {
  next?: string;
}

const LoginCard = ({ next = "/home" }: LoginCardProps) => {
  const {
    setUsername,
    setUnauthWall,
    setName,
    setUserId,
    setAccessToken,
    setLoggedIn,
  } = useAuthContext();
  const formMethods = useForm<z.infer<typeof formSchema>>({
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
        setUnauthWall(false);
        setCookie("a_t", accessToken);
        setCookie("r_t", refreshToken);
        setUsername(username);
        setName(name);
        setUserId(userId);
        setAccessToken(accessToken);
        setLoggedIn(true);
        window.location.href = next;
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
        closeButton: false,
      });
    }
  }

  return (
    <Card
      className="mx-auto border-[#272629] text-white bg-zinc-900 max-w-sm"
      style={{ zIndex: 99 }}
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
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <div className="flex flex-col gap-6 mb-4">
              <div className="grid gap-2">
                <FormField
                  control={formMethods.control}
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
                  control={formMethods.control}
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
          </form>
        </FormProvider>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link tabIndex={-1} href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
