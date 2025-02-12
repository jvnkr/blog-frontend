import React from "react";

interface AvatarProps {
  name: React.ReactNode;
  children?: React.ReactNode;
  size?: number;
  className?: string;
}

export default function Avatar({
  name,
  children,
  className,
  size = 40,
}: AvatarProps) {
  const letterColors: { [key: string]: string } = {
    A: "#FF0000", // Bright Red
    B: "#00FF00", // Bright Green
    C: "#0000FF", // Bright Blue
    D: "#FF00FF", // Magenta
    E: "#00FFFF", // Cyan
    F: "#FF8000", // Orange
    G: "#8000FF", // Purple
    H: "#FFC0CB", // Pinky
    I: "#00FF80", // Spring Green
    J: "#8000FF", // Violet
    K: "#FFFF00", // Yellow
    L: "#FF4000", // Vermillion
    M: "#00FF40", // Lime Green
    N: "#4000FF", // Ultramarine
    O: "#FF0040", // Crimson
    P: "#FF0080", // Hot Pink
    Q: "#0040FF", // Royal Blue
    R: "#FF8040", // Coral
    S: "#80FF00", // Yellow Green
    T: "#0080FF", // Azure
    U: "#FF0080", // Deep Pink
    V: "#00FF80", // Mint
    W: "#8040FF", // Amethyst
    X: "#FF4080", // Rose
    Y: "#40FF80", // Sea Green
    Z: "#4080FF", // Cornflower Blue
  };

  const firstLetter = typeof name === "string" ? name[0]?.toUpperCase() : "B";
  const bgColor = letterColors[firstLetter] || "#6B7280"; // Fallback to neutral gray

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        backgroundColor: bgColor,
      }}
      className={`flex font-medium justify-center items-center rounded-full text-white${
        className ? " " + className : ""
      }`}
    >
      <span
        style={{
          fontSize: `${size / 2.5}px`,
        }}
        className="select-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.)]"
      >
        {firstLetter}
      </span>
      {children}
    </div>
  );
}
