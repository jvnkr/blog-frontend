import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_URL = `http://localhost:8080`;

export async function fetcher(url: string, options: RequestInit = {}) {
  return await fetch(API_URL + url, options);
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
  if (diffInSeconds >= 2592000) {
    // 30 days in seconds
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
    if (diffInSeconds >= 31536000) {
      // 1 year in seconds
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
  return "0s"; // fallback for very recent posts
}
