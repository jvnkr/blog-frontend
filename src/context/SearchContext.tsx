"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { UserData } from "@/lib/types";
import { usePathname } from "next/navigation";

interface SearchContextType {
  results: UserData[];
  setResults: React.Dispatch<React.SetStateAction<UserData[]>>;
  showSearchDialog: boolean;
  setShowSearchDialog: React.Dispatch<React.SetStateAction<boolean>>;
  fetched: boolean;
  setFetched: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<UserData[]>([]);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [fetched, setFetched] = useState(false);

  return (
    <SearchProviderContent
      results={results}
      setResults={setResults}
      showSearchDialog={showSearchDialog}
      setShowSearchDialog={setShowSearchDialog}
      fetched={fetched}
      setFetched={setFetched}
    >
      {children}
    </SearchProviderContent>
  );
};

const SearchProviderContent = ({
  children,
  results,
  setResults,
  showSearchDialog,
  setShowSearchDialog,
  fetched,
  setFetched,
}: {
  children: ReactNode;
  results: UserData[];
  setResults: React.Dispatch<React.SetStateAction<UserData[]>>;
  showSearchDialog: boolean;
  setShowSearchDialog: React.Dispatch<React.SetStateAction<boolean>>;
  fetched: boolean;
  setFetched: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();

  useEffect(() => {
    setShowSearchDialog(false);
  }, [pathname, setShowSearchDialog]);

  return (
    <SearchContext.Provider
      value={{
        results,
        setResults,
        showSearchDialog,
        setShowSearchDialog,
        fetched,
        setFetched,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
