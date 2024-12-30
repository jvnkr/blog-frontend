"use client";

import { createContext, useEffect } from "react";

import { ReactNode, useState, useContext } from "react";
import { refreshSession } from "@/lib/utils";
import useSWR from "swr";
import AuthWall from "@/components/AuthWall";

interface AuthContextProps {
  loggedIn: boolean | null;
  name: string;
  username: string;
  verified: boolean;
  userId: string;
  role: string;
  unauthWall: string;
  bio: string;
  accessToken: string;
  email: string;
  setRole: (value: string) => void;
  setBio: (value: string) => void;
  setEmail: (value: string) => void;
  setAccessToken: (value: string) => void;
  setVerified: (value: boolean) => void;
  setLoggedIn: (value: boolean | null) => void;
  setName: (value: string) => void;
  setUsername: (value: string) => void;
  setUserId: (value: string) => void;
  clearAll: () => void;
  setUnauthWall: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextProps>({
  loggedIn: null,
  name: "",
  role: "",
  username: "",
  verified: false,
  userId: "",
  unauthWall: "",
  accessToken: "",
  email: "",
  bio: "",
  setRole: (): string => "",
  setBio: (): string => "",
  setAccessToken: (): string => "",
  setEmail: (): string => "",
  setLoggedIn: (): null => null,
  setVerified: (): boolean => false,
  setName: (): string => "",
  setUsername: (): string => "",
  setUserId: (): string => "",
  clearAll: async () => null,
  setUnauthWall: (): string => "",
});

export const AuthContextProvider = ({
  children,
  serverData,
}: {
  children: ReactNode;
  serverData: {
    name?: string;
    loggedIn?: boolean;
    username?: string;
    userId?: string;
    accessToken?: string;
    verified?: boolean;
    bio?: string;
    role?: string;
    email?: string;
  };
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(
    serverData.loggedIn || null
  );
  const [name, setName] = useState(serverData.name || "");
  const [unauthWall, setUnauthWall] = useState("");
  const [username, setUsername] = useState(serverData.username || "");
  const [userId, setUserId] = useState(serverData.userId || "");
  const [accessToken, setAccessToken] = useState(serverData.accessToken || "");
  const [verified, setVerified] = useState(serverData.verified || false);
  const [bio, setBio] = useState(serverData.bio || "");
  const [email, setEmail] = useState(serverData.email || "");
  const [role, setRole] = useState(serverData.role || "");

  const clearAll = async () => {
    setLoggedIn(false);
    setUnauthWall("");
    setUsername("");
    setName("");
    setUserId("");
    setAccessToken("");
    setVerified(false);
    setBio("");
    setEmail("");
    setRole("");
  };

  /**
   * @description Gets called every time useSWR revalidates
   * (on focus, on stale, etc.) currently is on focus by default
   * @param url request url
   */
  const updateLoggedInStatus = async () => {
    if (!loggedIn) return null;

    const data = await refreshSession();

    if (data) {
      setUsername(data.username);
      setName(data.name);
      setUserId(data.userId);
      setVerified(data.verified);
      setBio(data.bio || "");
      setEmail(data.email || "");
      setRole(data.role || "");
      if (data.accessToken) {
        setLoggedIn(true);
      }
    } else {
      clearAll();
    }
  };

  useEffect(() => {
    if (serverData.accessToken) {
      setAccessToken(serverData.accessToken);
    } else {
      clearAll();
    }
  }, [serverData]);

  useSWR("/api/auth/session", updateLoggedInStatus, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    refreshInterval: 300000, // 5 minutes
  });

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        name,
        bio,
        email,
        setEmail,
        setBio,
        setName,
        clearAll,
        loggedIn,
        setLoggedIn,
        verified,
        setVerified,
        username,
        setUsername,
        userId,
        setUserId,
        unauthWall,
        setUnauthWall,
        accessToken,
        setAccessToken,
      }}
    >
      {unauthWall && <AuthWall next={unauthWall} />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
