import React from "react";

interface AvatarProps {
  name: string;
}

export default function Avatar({ name }: AvatarProps) {
  const letterColors: { [key: string]: string } = {
    A: "#FF6B6B", // Red
    B: "#4ECDC4", // Teal
    C: "#45B7D1", // Light Blue
    D: "#96CEB4", // Sage Green
    E: "#FFEEAD", // Light Yellow
    F: "#D4A5A5", // Dusty Rose
    G: "#9B59B6", // Purple
    H: "#3498DB", // Blue
    I: "#E74C3C", // Dark Red
    J: "#2ECC71", // Green
    K: "#F1C40F", // Yellow
    L: "#E67E22", // Orange
    M: "#1ABC9C", // Turquoise
    N: "#D35400", // Burnt Orange
    O: "#8E44AD", // Dark Purple
    P: "#16A085", // Dark Turquoise
    Q: "#F39C12", // Dark Yellow
    R: "#C0392B", // Maroon
    S: "#27AE60", // Dark Green
    T: "#2980B9", // Dark Blue
    U: "#F7DC6F", // Light Gold
    V: "#82E0AA", // Light Green
    W: "#85C1E9", // Sky Blue
    X: "#F1948A", // Salmon
    Y: "#BB8FCE", // Light Purple
    Z: "#F8C471", // Light Orange
  };

  const firstLetter = name.at(0)?.toUpperCase() || "A";
  const bgColor = letterColors[firstLetter] || "#6B7280"; // Fallback to neutral gray

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={
        "flex font-medium justify-center items-center rounded-full w-[2.5rem] h-[2.5rem] text-white"
      }
    >
      {firstLetter}
    </div>
  );
}
