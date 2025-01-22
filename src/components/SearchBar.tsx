import { debounce } from "lodash";
import { Command, Search } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { motion } from "motion/react";
import AvatarInfo from "./profile/AvatarInfo";
import useFetcher from "@/hooks/useFetcher";
import { useAuthContext } from "@/context/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSearchContext } from "@/context/SearchContext";
import { UserData } from "@/lib/types";

interface SearchBarProps {
  isWindows: null | boolean;
  searchRef: React.RefObject<HTMLInputElement>;
}

const SearchBar = ({ searchRef, isWindows }: SearchBarProps) => {
  const { accessToken } = useAuthContext();
  const pathname = usePathname();
  const { setShowSearchDialog, setResults, results, setFetched, fetched } =
    useSearchContext();
  const [isSearching, setIsSearching] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [tempResults, setTempResults] = useState<UserData[]>(
    pathname.startsWith("/search") ? results : []
  );
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [searchValue, setSearchValue] = useState(searchQuery ?? "");
  const abortControllerRef = useRef<AbortController>();

  const router = useRouter();
  const fetcher = useFetcher();

  const RESULT_ITEM_HEIGHT = 74; // Height of each result item including gap
  const HEADER_HEIGHT = 40; // Height of search header
  const PADDING = 32; // Total vertical padding (16px top + 16px bottom)
  const MAX_RESULTS_SHOWN = 5; // Maximum number of results to show before scrolling

  const updateShouldScroll = (data: UserData[]) => {
    const totalHeight =
      HEADER_HEIGHT + data.length * RESULT_ITEM_HEIGHT + PADDING;
    const maxHeight =
      HEADER_HEIGHT + MAX_RESULTS_SHOWN * RESULT_ITEM_HEIGHT + PADDING;
    setShouldScroll(totalHeight > maxHeight);
  };

  const fetchSearchResult = async (query: string) => {
    try {
      // Abort previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setFetched(false);
      const result = await fetcher(
        `/api/v1/users/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          method: "GET",
          credentials: "include",
          signal: abortControllerRef.current.signal,
        }
      );
      const data = await result.json();
      console.log(data);
      setTempResults(data);
      if (results.length === 0) {
        setResults(data);
      }
      setFetched(true);
      updateShouldScroll(data);
      setIsSearching(false);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error(error);
      setIsSearching(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchSearchResult(value);
    }, 420),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value.trim().length === 0 ||
      (e.target.value.trim() === "" && searchValue === "")
    ) {
      setIsSearching(false);
      setResults([]);
      setFetched(false);
      return;
    }
    setSearchValue(e.target.value.trim());
    setIsSearching(true);
    debouncedSearch(e.target.value.trim());
  };

  useEffect(() => {
    console.log(tempResults, results);
    if (searchValue && !fetched) {
      setIsSearching(true);
      fetchSearchResult(searchValue);
    }
    searchRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateShouldScroll(tempResults);
  }, [tempResults]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch]);

  const getResultsHeight = () => {
    if (isSearching) return 65;
    if (tempResults.length === 0) return HEADER_HEIGHT + 100; // Header + "No results found" height

    const totalHeight =
      HEADER_HEIGHT + tempResults.length * RESULT_ITEM_HEIGHT + PADDING;
    const maxHeight =
      HEADER_HEIGHT + MAX_RESULTS_SHOWN * RESULT_ITEM_HEIGHT + PADDING;
    return Math.min(totalHeight, maxHeight);
  };

  return (
    <div className="flex relative h-full justify-center items-center w-full max-w-[45rem] flex-col gap-3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: isSearching || searchRef.current?.value.trim() ? 0.95 : 1,
        }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="flex w-full justify-start search-input border border-[#272629] bg-zinc-900 p-3 gap-2 rounded-lg items-center"
      >
        <Search className="text-zinc-500 ml-[0.2rem] w-5 h-5" />
        <input
          ref={searchRef}
          type="text"
          defaultValue={searchValue}
          onChange={handleSearch}
          placeholder="Search..."
          className="outline-none text-lg bg-transparent text-white w-full"
        />
        {isWindows !== null && (
          <div className="flex gap-2 items-center">
            {!isWindows && (
              <Command className="bg-zinc-800 border border-[#333] p-2 rounded-md w-8 h-8 min-w-8 min-h-8 text-neutral-300" />
            )}
            {isWindows && (
              <span className="text-neutral-300 border border-[#333] font-semibold p-2 rounded-md bg-zinc-800 min-w-8 min-h-8 w-8 h-8 flex justify-center items-center">
                {"ALT"}
              </span>
            )}
            <span className="text-neutral-300 border border-[#333] font-semibold p-2 rounded-md bg-zinc-800 min-w-8 min-h-8 w-8 h-8 flex justify-center items-center">
              {"K"}
            </span>
          </div>
        )}
      </motion.div>
      {(isSearching || fetched) && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            height: getResultsHeight(),
          }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`flex flex-col overflow-hidden w-full border border-[#272629] bg-zinc-900 min-w-[48px] rounded-lg items-center
              ${
                isSearching
                  ? "justify-center"
                  : shouldScroll
                  ? "overflow-y-auto"
                  : "overflow-hidden"
              }`}
        >
          {isSearching && <LoadingSpinner />}
          {searchValue && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex relative w-full h-full overflow-x-hidden justify-between items-center flex-col gap-0 p-4 pt-0 px-0 ${
                shouldScroll ? "overflow-y-auto" : "overflow-hidden"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  zIndex: 10,
                }}
                className="flex sticky justify-center bg-zinc-900/10 rounded-b-xl top-0 w-full max-w-full gap-2 items-center p-2 backdrop-blur-sm my-1 border border-b-zinc-900/50 border-x-0 border-t-0"
              >
                <div
                  onClick={() => {
                    const url = new URL(window.location.origin + "/search");
                    url.searchParams.set("q", encodeURIComponent(searchValue));
                    url.searchParams.set(
                      "filter",
                      searchParams.get("filter") ?? "posts"
                    );
                    setResults(tempResults);
                    setSearchValue("");
                    setIsSearching(false);
                    setShouldScroll(false);
                    setShowSearchDialog(false);
                    window.location.href = url.pathname + url.search;
                  }}
                  className="flex cursor-pointer w-fit h-fit gap-2 items-center bg-zinc-800 rounded-lg p-2"
                >
                  <Search className="min-w-5 min-h-5 w-5 h-5" />
                  <span className="select-none truncate">{`Search for "${searchValue}"`}</span>
                </div>
              </motion.div>
              {tempResults.length > 0 &&
                tempResults.map((user, index) => (
                  <motion.div
                    key={user.username}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => {
                      router.push(`/@${user.username}`);
                      searchRef.current!.value = "";
                      setIsSearching(false);
                      setResults([]);
                      setSearchValue("");
                      setShouldScroll(false);
                      setShowSearchDialog(false);
                    }}
                    className="flex cursor-pointer p-2 px-4 hover:bg-white/10 transition-colors duration-150 min-h-[58px] max-h-[58px] justify-start items-center w-full"
                  >
                    <AvatarInfo
                      onClick={() => null}
                      username={user.username}
                      name={user.name}
                      verified={user.verified}
                    />
                  </motion.div>
                ))}
              {searchRef.current?.value.trim() &&
                !isSearching &&
                tempResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center items-center h-[100px] w-full"
                  >
                    <span className="text-neutral-400 font-semibold">
                      No results found
                    </span>
                  </motion.div>
                )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
