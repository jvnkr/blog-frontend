"use client";

import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import useFetcher from "@/hooks/useFetcher";
import { toast } from "sonner";

// Define the form schema using zod
const formSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Require currentPassword if newPassword or confirmPassword is provided
      if ((data.newPassword || data.confirmPassword) && !data.currentPassword) {
        return false;
      }
      // Require newPassword and confirmPassword if currentPassword is provided
      if (
        data.currentPassword &&
        (!data.newPassword || !data.confirmPassword)
      ) {
        return false;
      }
      // Only validate password length if newPassword is provided
      if (data.newPassword && data.newPassword.length < 6) {
        return false;
      }
      // Only validate password match if both passwords are provided
      if (
        data.newPassword &&
        data.confirmPassword &&
        data.newPassword !== data.confirmPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "All password fields must be filled when changing passwords, or passwords do not match or are too short",
      path: ["currentPassword"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const SettingsAccount = () => {
  const { email, accessToken, setEmail } = useAuthContext();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const fetcher = useFetcher();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = form;

  const newPassword = useWatch({ control: form.control, name: "newPassword" });
  const confirmPassword = useWatch({
    control: form.control,
    name: "confirmPassword",
  });
  const watchedEmail = watch("email") || "";
  const watchedCurrentPassword = watch("currentPassword") || "";

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      clearErrors("confirmPassword");
    }
  }, [newPassword, confirmPassword, setError, clearErrors]);

  useEffect(() => {
    const isEmailChanged = watchedEmail !== email && watchedEmail !== "";
    const arePasswordsFilled =
      watchedCurrentPassword !== "" &&
      newPassword !== "" &&
      confirmPassword !== "";
    const arePasswordsValid = !errors.newPassword && !errors.confirmPassword;

    if (isEmailChanged || (arePasswordsFilled && arePasswordsValid)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [
    watchedEmail,
    watchedCurrentPassword,
    newPassword,
    confirmPassword,
    email,
    errors,
  ]);

  const onSubmit = async () => {
    const trimmedEmail = watchedEmail.trim();
    const trimmedCurrentPassword = watchedCurrentPassword.trim();
    const trimmedNewPassword = newPassword?.trim();
    const trimmedConfirmPassword = confirmPassword?.trim();

    const res = await fetcher("/api/v1/users/edit/account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: trimmedEmail,
        currentPassword: trimmedCurrentPassword,
        password: trimmedNewPassword,
        confirmPassword: trimmedConfirmPassword,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.email !== trimmedEmail) {
        setEmail(data.email);
      }
      toast.success("Account updated successfully", {
        action: {
          label: "Close",
          onClick: () => null,
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start overflow-auto justify-start w-full h-full"
    >
      <div className="flex flex-col gap-8 w-full max-w-[500px]">
        <div className="flex flex-col justify-center items-start gap-2">
          <Label className="min-w-[80px]">Email</Label>
          <Input
            spellCheck={false}
            className={`w-full bg-zinc-800 border border-zinc-700 ${
              errors.email ? "border-red-500" : ""
            }`}
            {...register("email")}
            placeholder={email ? "" : "Email"}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col justify-center items-start gap-2">
          <Label className="min-w-[80px]">Current Password</Label>
          <Input
            type="password"
            spellCheck={false}
            className={`w-full bg-zinc-800 border border-zinc-700 ${
              errors.currentPassword ? "border-red-500" : ""
            }`}
            {...register("currentPassword")}
            placeholder={"Current Password"}
          />
          {errors.currentPassword && (
            <span className="text-sm text-red-500">
              {errors.currentPassword.message}
            </span>
          )}
        </div>
        <div className="flex flex-col justify-center items-start gap-2">
          <Label className="min-w-[80px]">New Password</Label>
          <Input
            type="password"
            spellCheck={false}
            className={`w-full bg-zinc-800 border border-zinc-700 ${
              errors.newPassword ? "border-red-500" : ""
            }`}
            {...register("newPassword")}
            placeholder={"New Password"}
          />
          {errors.newPassword && (
            <span className="text-sm text-red-500">
              {errors.newPassword.message}
            </span>
          )}
        </div>
        <div className="flex flex-col justify-center items-start gap-2">
          <Label className="min-w-[80px]">Confirm Password</Label>
          <Input
            type="password"
            spellCheck={false}
            className={`w-full bg-zinc-800 border border-zinc-700 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            {...register("confirmPassword")}
            placeholder={"Confirm Password"}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <div className="flex justify-end w-full">
          <Button type="submit" className="mt-4" disabled={isButtonDisabled}>
            Save changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SettingsAccount;
