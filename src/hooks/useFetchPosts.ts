import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import useFetcher from "./useFetcher";

export function useFetchItems(
  items: unknown[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItems: React.Dispatch<React.SetStateAction<any[]>>,
  endpoint: string,
  pageNumber: number,
  setPageNumber: React.Dispatch<React.SetStateAction<number>>,
  hasMoreItems: boolean,
  setHasMoreItems: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(0);
  const initialFetchRef = useRef(false);
  const { accessToken } = useAuthContext();
  const fetcher = useFetcher();

  useEffect(() => {
    if (items.length === 0 && !initialFetchRef.current && hasMoreItems) {
      document.body.style.overflow = "hidden";
      setSkeletonCount(Math.floor(window.innerHeight / (16 * 16)));
      setInitialLoading(true);
      fetchItems().then(() => {
        setInitialLoading(false);
      });
    }
    return () => {
      document.body.style.overflow = "visible";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, hasMoreItems]); // Add dependencies to prevent double fetch

  const fetchItems = async () => {
    if (
      loading ||
      !hasMoreItems ||
      initialFetchRef.current ||
      endpoint.length === 0
    )
      return;
    initialFetchRef.current = true;
    if (!initialLoading) setLoading(true);

    try {
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "force-cache",
        body: JSON.stringify({ pageNumber }),
        credentials: "include",
      });

      if (!response.ok) {
        setHasMoreItems(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setItems((prev) => [...prev, ...data]);
      setPageNumber((prev) => prev + 1);
      toast.success("Items fetched successfully");
      setHasMoreItems(data.length > 0);
      setLoading(false);
      initialFetchRef.current = false;
    } catch (error) {
      console.error("Failed to fetch items:", error);
      setHasMoreItems(false);
      setLoading(false);
      initialFetchRef.current = false;
    } finally {
      setLoading(false);
      // Restore overflow after items are loaded or on error
      document.body.style.overflow = "visible";
    }
  };

  const handleUpdateItem = (item: unknown) => {
    setItems((prev) =>
      prev.map((p) =>
        (p as unknown as { id: string }).id ===
        (item as unknown as { id: string }).id
          ? item
          : p
      )
    );
  };

  return {
    loading,
    skeletonCount,
    initialLoading,
    fetchItems,
    handleUpdateItem,
  };
}
