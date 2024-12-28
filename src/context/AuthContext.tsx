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
  unauthWall: string;
  accessToken: string;
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
  username: "",
  verified: false,
  userId: "",
  unauthWall: "",
  accessToken: "",
  setAccessToken: (): string => "",
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

  const clearAll = async () => {
    setLoggedIn(false);
    setUnauthWall("");
    setUsername("");
    setName("");
    setUserId("");
    setAccessToken("");
    setVerified(false);
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
        name,
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
