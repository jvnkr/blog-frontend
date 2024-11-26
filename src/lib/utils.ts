import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_URL = `http://localhost:8080`;

export async function fetcher(url: string, options: RequestInit = {}) {
  const mainResponse = await fetch(API_URL + url, {
    ...options,
    credentials: "include",
  });

  if (mainResponse.status === 401 || mainResponse.status === 403) {
    try {
      const data = await refreshSession();
      if (data) {
        const retryResponse = await fetch(API_URL + url, {
          ...options,
          credentials: "include",
          headers: {
            ...options.headers,
            Authorization: `Bearer ${data.accessToken}`,
          },
        });
        return retryResponse;
      }
    } catch (error) {
      console.log("Error refreshing session:", error);
      throw new Error("Error refreshing session");
    }
    return mainResponse;
  }

  return mainResponse;
}

export async function refreshSession() {
  try {
    console.log("Refreshing session...");
    const response = await fetch(`${API_URL}/api/auth/session`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = (await response.json()) as SessionData;
      console.log("Refreshed session successfully!");
      return data;
    }
  } catch (error) {
    console.log("Error refreshing session:", error);
    return null;
  }
}

export function formatTimeDifference(date: Date): string {
  const now = new Date().getTime();
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

  // Check if date is in the future (maybe scheduled posts)
  if (diffInSeconds < 0) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  }

  // If more than 30 days have passed, show date format
  // 30 days in seconds
  if (diffInSeconds >= 2592000) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];

    // If more than a year has passed, include the year
    // 1 year in seconds
    if (diffInSeconds >= 31536000) {
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    }

    return `${month} ${day}`;
  }

  const units = [
    { label: "w", seconds: 604800 }, // 7 days in seconds
    { label: "d", seconds: 86400 }, // 24 hours in seconds
    { label: "h", seconds: 3600 }, // 1 hour in seconds
    { label: "m", seconds: 60 }, // 1 minute in seconds
    { label: "s", seconds: 1 },
  ];

  for (const unit of units) {
    const quotient = Math.floor(diffInSeconds / unit.seconds);
    if (quotient > 0) {
      return `${quotient}${unit.label}`;
    }
  }

  return "now"; // fallback for very recent posts
}
