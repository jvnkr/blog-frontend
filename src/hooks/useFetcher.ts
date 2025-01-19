import { useAuthContext } from "@/context/AuthContext";
import { fetcher as authFetcher } from "@/lib/utils";

const useFetcher = () => {
  const { setAccessToken } = useAuthContext();

  const fetcher = (url: string, options: RequestInit = {}) => {
    return authFetcher(url, options, setAccessToken);
  };

  return fetcher;
};

export default useFetcher;
