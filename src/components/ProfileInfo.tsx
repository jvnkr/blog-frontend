import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import Avatar from "./Avatar";
import { useAuthContext } from "@/context/AuthContext";
import useFetcher from "@/hooks/useFetcher";
import { BadgeCheck, CalendarDays, UserRoundPen, X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import EmojiPicker from "./EmojiPicker";
import { usePostsContext } from "@/context/PostsContext";
import VirtualPopup from "./VirtualPopup";
import { useRouter } from "next/navigation";

interface ProfileInfoProps {
  username: string;
  name: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  createdAt: string;
  postsCount: number;
}

const ProfileInfo = ({
  username,
  name,
  bio,
  verified,
  following,
  createdAt,
}: ProfileInfoProps) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedName, setEditedName] = useState(name);
  const [editedBio, setEditedBio] = useState<string | null>(bio);
  const [currentBio, setCurrentBio] = useState<string | null>(bio);
  const [currentUsername, setCurrentUsername] = useState(username);
  const [currentName, setCurrentName] = useState(name);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const {
    username: authUsername,
    loggedIn,
    setName,
    setUsername,
    accessToken,
  } = useAuthContext();
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const fetcher = useFetcher();
  const router = useRouter();

  const {
    setFollowingPosts,
    followingUser: followingUserContext,
    setFollowingUser,
    setFollowingPageNumber,
    setHasMoreFollowingPosts,
    followers: followersContext,
    setFollowers,
  } = usePostsContext();

  const handleEditProfile = async () => {
    const trimmedUsername = editedUsername.trim();
    const trimmedName = editedName.trim();
    const trimmedBio = editedBio?.trim() ?? "";

    const res = await fetcher("/api/v1/users/edit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: trimmedUsername,
        name: trimmedName,
        bio: trimmedBio,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setName(data.name);
      setUsername(data.username);
      setCurrentBio(data.bio);
      setCurrentUsername(data.username);
      setCurrentName(data.name);
      setShowEditProfile(false);
      router.replace(`/@${data.username}`);
      router.refresh();
    }
  };

  const handleFollow = async () => {
    const action = followingUserContext ? "unfollow" : "follow";
    const res = await fetcher(`/api/v1/users/${action}/${currentUsername}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const followerDelta = followingUserContext ? -1 : 1;
      setFollowingPosts([]);
      setHasMoreFollowingPosts(true);
      setFollowingPageNumber(0);
      setFollowers((followersContext ?? 0) + followerDelta);
      setFollowingUser(!followingUserContext);
    }
  };

  return (
    <>
      {showEditProfile && (
        <VirtualPopup onOverlayClick={() => setShowEditProfile(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-2 bg-zinc-900 border border-[#272629] p-4 rounded-xl"
          >
            <div className="flex flex-col mb-3 gap-1">
              <div className="flex items-center justify-between w-full">
                <span className="text-white font-semibold text-xl">
                  Edit Profile
                </span>
                <X
                  onClick={() => setShowEditProfile(false)}
                  className="p-1 cursor-pointer rounded-full hover:bg-zinc-800 min-w-7 min-h-7 text-white"
                />
              </div>
              <span className="text-neutral-400 text-sm">
                {
                  "Make quick changes to your profile here. Click save when you're done."
                }
              </span>
            </div>
            <div className="flex justify-center items-center gap-2">
              <Label className="min-w-[80px]">Name</Label>
              <Input
                spellCheck={false}
                className="bg-zinc-800 border border-zinc-700"
                onChange={(e) => setEditedName(e.target.value)}
                placeholder={currentName ? "" : "Name"}
                value={editedName}
              />
            </div>
            <div className="flex justify-center items-center gap-2">
              <Label className="min-w-[80px]">Username</Label>
              <Input
                spellCheck={false}
                className="bg-zinc-800 border border-zinc-700"
                onChange={(e) => setEditedUsername(e.target.value)}
                placeholder={username ? "" : "Username"}
                value={editedUsername}
              />
            </div>
            <div className="flex justify-center items-start gap-2">
              <Label className="min-w-[80px]">Bio</Label>
              <div className="flex w-full flex-col">
                <textarea
                  ref={bioRef}
                  style={{
                    resize: "none",
                  }}
                  spellCheck={false}
                  onChange={(e) => {
                    setEditedBio(
                      e.target.value.length > 0 ? e.target.value : null
                    );
                  }}
                  placeholder={currentBio ? "" : "Bio"}
                  value={editedBio ?? ""}
                  className="w-full focus-visible:outline-none focus-visible:ring-2 ring-[#777] ring-border-zinc-700 transition-all duration-150 ease-in-out h-[100px] p-2 bg-zinc-800 border border-zinc-700 rounded-md rounded-b-none z-[9999]"
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
                    isVisible={showEditProfile}
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
                      setEditedBio(editedBio + emoji);
                    }}
                  />
                  <span className="text-sm text-zinc-400 pr-1">
                    {editedBio?.length ? (
                      editedBio.length > 1024 ? (
                        <span className="text-red-500">
                          -{editedBio.length - 1024}/1024
                        </span>
                      ) : (
                        `${editedBio.length}/1024`
                      )
                    ) : (
                      "0/1024"
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex mt-3 justify-end w-full items-center">
              <Button
                disabled={
                  editedUsername.trim() === username &&
                  editedName.trim() === currentName &&
                  editedBio?.trim() === currentBio
                }
                onClick={handleEditProfile}
                className="select-none w-fit cursor-pointer"
              >
                Save changes
              </Button>
            </div>
          </div>
        </VirtualPopup>
      )}
      <div className="w-full h-[12rem] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
          <svg width="100%" height="100%" className="block">
            <defs>
              <path
                id="curve"
                d="M -100 50 Q 200 -30, 500 50 Q 800 130, 3000 50"
              />
            </defs>
            <pattern
              id="curve-pattern"
              patternUnits="userSpaceOnUse"
              width="1000"
              height="80"
            >
              <use href="#curve" stroke="#252525" strokeWidth="1" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#curve-pattern)" />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 40)"
            />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 80)"
            />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 120)"
            />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 160)"
            />
            <use
              href="#curve"
              stroke="#252525"
              strokeWidth="1"
              fill="none"
              transform="translate(0, 200)"
            />
          </svg>
        </div>
        <div
          style={{
            width: "142px",
            height: "143px",
          }}
          className="absolute rounded-full left-[0.95rem] bottom-[-1.5px] translate-y-1/2 bg-zinc-800"
        ></div>
      </div>
      <div className="flex relative flex-col rounded-b-3xl border ml-[-1px] mr-[-1px] border-zinc-800 gap-2 bg-zinc-900">
        <div className="flex w-full h-fit gap-2 p-3 pb-0 items-center justify-end">
          {loggedIn && currentUsername === authUsername && (
            <UserRoundPen
              onClick={() => setShowEditProfile(true)}
              className="w-10 h-10 cursor-pointer text-zinc-300 hover:text-white transition-all duration-150 p-2 rounded-full hover:bg-zinc-800"
            />
          )}
          {loggedIn && currentUsername !== authUsername && (
            <Button
              onClick={handleFollow}
              variant={followingUserContext ? "secondary" : "default"}
              className={`select-none w-fit h-fit cursor-pointer px-3 py-2 rounded-md hover:bg-neutral-100 hover:bg-opacity-[0.5] transition-all duration-150 ${
                followingUserContext ? "text-white" : "text-black"
              }`}
            >
              {followingUserContext ? "Following" : "Follow"}
            </Button>
          )}
        </div>
        <div className="flex w-full justify-start items-center">
          <Avatar
            size={140}
            name={currentName}
            className="absolute left-[1rem] top-0 -translate-y-1/2 border-4 border-zinc-900"
          />
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col text-[15px]">
              <div className="flex items-center gap-1">
                <h1 className="text-2xl font-bold">{currentName}</h1>
                {verified && <BadgeCheck className="w-4 h-4 fill-blue-500" />}
              </div>
              <p className="text-sm text-gray-500">@{username}</p>
            </div>
            <span className="text-sm whitespace-pre-wrap text-white">
              {currentBio}
            </span>
            <div className="flex items-start gap-1 text-sm text-gray-500">
              <CalendarDays className="w-4 h-4" />
              <span className="font-semibold">
                Joined{" "}
                {new Date(createdAt).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex text-sm items-center gap-3">
              <span className="font-semibold">
                {followersContext}
                <span className="font-normal text-gray-500 ml-[4px]">
                  Followers
                </span>
              </span>
              <span className="font-semibold">
                {following}
                <span className="font-normal text-gray-500 ml-[4px]">
                  Following
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
