import { FieldError, UseFormRegister } from "react-hook-form";

export interface DashboardData {
  postsCount: number;
  usersCount: number;
  reportsCount: number;
  earliestYear: number;
  topUsers: {
    author: PostAuthor;
    posts: number;
  }[];
  postsPerMonth: { month: string; postsCount: number }[];
}

export enum ReportReasons {
  Spam = "SPAM",
  Inappropriate = "INAPPROPRIATE",
  Harassment = "HARASSMENT",
  Misinformation = "MISINFORMATION",
  Other = "OTHER",
}

export enum ReportStatus {
  Pending = "PENDING",
  Resolved = "RESOLVED",
  Dismissed = "DISMISSED",
}

export interface PostData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  overDescLimit: boolean;
  liked: boolean;
  likes: number;
  comments: number;
  author: PostAuthor;
}

export enum Role {
  ADMIN = "ROLE_ADMIN",
  USER = "ROLE_USER",
}

export interface PostAuthor {
  id: string;
  username: string;
  name: string;
  verified: boolean;
}

export interface CommentData {
  id: string;
  rootId?: string;
  repliesTo?: {
    id: string;
    username: string;
  };
  text: string;
  createdAt: string;
  liked: boolean;
  likes: number;
  replies: number;
  author: PostAuthor;
}

export interface UserData {
  username: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  followingUser: boolean;
}

export interface SessionData {
  error?: string;
  accessToken: string;
  username: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  role: string;
  verified: boolean;
  loggedIn: boolean;
}

export type FormData = {
  email: string;
  githubUrl: string;
  yearsOfExperience: number;
  password: string;
  confirmPassword: string;
};

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type ValidFieldNames =
  | "email"
  | "githubUrl"
  | "yearsOfExperience"
  | "password"
  | "confirmPassword";

export type SearchFilter = "users" | "posts";
