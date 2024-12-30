"use client";

import React, { useRef, useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useAuthContext } from "@/context/AuthContext";
import EmojiPicker from "./EmojiPicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  bio: z.string().max(1024, "Bio must be less than 1024 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SettingsProfile = () => {
  const { username, name, bio } = useAuthContext();
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: username,
      name: name,
      bio: bio,
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;
  const watchedBio = watch("bio") || "";
  const watchedUsername = watch("username") || "";
  const watchedName = watch("name") || "";

  useEffect(() => {
    if (
      watchedUsername === username &&
      watchedName === name &&
      watchedBio === bio
    ) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [watchedUsername, watchedName, watchedBio, username, name, bio]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start overflow-auto justify-start w-full h-full"
    >
      <div className="flex flex-col gap-8 w-full max-w-[500px]">
        <div className="flex flex-col justify-center items-start gap-2">
          <Label className="min-w-[80px]">Username</Label>
          <Input
            spellCheck={false}
            className={`w-full bg-zinc-800 border border-zinc-700 ${
              errors.username ? "border-red-500" : ""
            }`}
            {...register("username", { required: true })}
            placeholder={username ? "" : "Username"}
          />
          {errors.username && (
            <div className="flex justify-between w-full">
              <span className="text-sm text-red-500">
                {errors.username.message}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center items-start gap-2">
          <Label className="min-w-[80px]">Name</Label>
          <Input
            spellCheck={false}
            className={`w-full bg-zinc-800 border border-zinc-700 ${
              errors.name ? "border-red-500" : ""
            }`}
            {...register("name", { required: true })}
            placeholder={name ? "" : "Name"}
          />
          {errors.name && (
            <div className="flex justify-between w-full">
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center items-start gap-2">
          <Label className="min-w-[80px]">Bio</Label>
          <div className="flex flex-col w-full">
            <textarea
              style={{
                resize: "none",
              }}
              spellCheck={false}
              {...register("bio", {
                required: false,
                maxLength: {
                  value: 1024,
                  message: "Bio must be less than 1024 characters",
                },
              })}
              ref={bioRef}
              value={watchedBio}
              onChange={(e) => {
                setValue("bio", e.target.value, { shouldValidate: true });
              }}
              placeholder={bio ? "" : "Bio"}
              className={`w-full focus-visible:outline-none focus-visible:ring-2 ring-[#777] ring-border-zinc-700 transition-all duration-150 ease-in-out h-[100px] p-2 bg-zinc-800 border border-zinc-700 rounded-md rounded-b-none z-[9999] ${
                errors.bio ? "border-red-500" : ""
              }`}
            />
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex relative justify-between items-center w-full bg-zinc-900 p-1 rounded-b-md border border-t-0 border-zinc-700"
            >
              <EmojiPicker
                setShowEmojiPicker={setShowEmojiPicker}
                showEmojiPicker={showEmojiPicker}
                isPortal={false}
                top={0}
                left={35}
                size={16}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                zIndex={99999}
                onEmojiClick={(emoji: string) => {
                  if (bioRef.current) {
                    bioRef.current.scrollTo({
                      top: bioRef.current.scrollHeight,
                      behavior: "smooth",
                    });
                  }
                  setValue("bio", watchedBio + emoji, { shouldValidate: true });
                }}
              />
              <span className="text-sm text-zinc-400 pr-1">
                {watchedBio.length > 1024 ? (
                  <span className="text-red-500">
                    -{watchedBio.length - 1024}/1024
                  </span>
                ) : (
                  `${watchedBio.length}/1024`
                )}
              </span>
            </div>
            {errors.bio && (
              <span className="text-sm text-red-500 mt-1">
                {errors.bio.message}
              </span>
            )}
          </div>
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

export default SettingsProfile;
