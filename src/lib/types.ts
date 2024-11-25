import { FieldError, UseFormRegister } from "react-hook-form";

export interface PostData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  overDescLimit: boolean;
  liked: boolean;
  likes: number;
  comments: number;
  author: {
    id: string;
    username: string;
    name: string;
    verified: boolean;
  };
}

export interface UserData {
  username: string;
  name: string;
  email: string;
}

export interface SessionData {
  error?: string;
  accessToken: string;
  username: string;
  userId: string;
  name: string;
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
