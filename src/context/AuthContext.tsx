"use client";

import { createContext, useEffect } from "react";

import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { ReactNode, useState, useContext } from "react";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

interface AuthContextProps {
  loggedIn: boolean | null;
  name: string;
  username: string;
  userId: string;
  unauthWall: boolean;
  accessToken: string;
  setAccessToken: (value: string) => void;
  setLoggedIn: (value: boolean | null) => void;
  setName: (value: string) => void;
  setUsername: (value: string) => void;
  setUserId: (value: string) => void;
  clearAll: () => void;
  setUnauthWall: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps>({
  loggedIn: null,
  name: "",
  username: "",
  userId: "",
  unauthWall: false,
  accessToken: "",
  setAccessToken: (): string => "",
  setLoggedIn: (): null => null,
  setName: (): string => "",
  setUsername: (): string => "",
  setUserId: (): string => "",
  clearAll: () => null,
  setUnauthWall: () => null,
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
  };
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(
    serverData.loggedIn || null
  );
  const [name, setName] = useState(serverData.name || "");
  const [unauthWall, setUnauthWall] = useState(false);
  const [username, setUsername] = useState(serverData.username || "");
  const [userId, setUserId] = useState(serverData.userId || "");
  const [accessToken, setAccessToken] = useState(serverData.accessToken || "");

  // const pathname = usePathname();
  // const router = useRouter();

  const clearAll = () => {
    setLoggedIn(false);
    deleteCookie("a_t");
    deleteCookie("r_t");
    setUsername("");
    setName("");
    setUserId("");
    setAccessToken("");
  };

  /**
   * @description Gets called every time useSWR revalidates
   * (on focus, on stale, etc.) currently is on focus by default
   * @param url request url
   */
  const updateLoggedInStatus = async (url: string) => {
    if (!loggedIn) return null;
    try {
      const response = await fetcher(url, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Cookie: `a_t=${accessToken}; r_t=${getCookie("r_t")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsername(data.username);
        setName(data.name);
        setUserId(data.userId);
        return;
      }

      if (data.accessToken) {
        console.log("Session expired");
        setCookie("a_t", data.accessToken, {
          // httpOnly: true,
          // secure: true,
          // sameSite: "lax",
          // domain: API_DOMAIN,
        });
        setAccessToken(data.accessToken);
        setLoggedIn(true);
        return response;
      } else {
        clearAll();
      }
    } catch (error) {
      console.log("Error checking auth status:", error);
    }
  };

  useEffect(() => {
    if (serverData.accessToken) {
      setAccessToken(serverData.accessToken);
      setCookie("a_t", serverData.accessToken, {
        // httpOnly: true,
        // secure: true,
        // sameSite: "lax",
      });
    } else {
      clearAll();
    }
  }, [serverData]);

  useSWR("/api/auth/session", updateLoggedInStatus, {
    revalidateIfStale: false,
    revalidateOnFocus: true,
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
