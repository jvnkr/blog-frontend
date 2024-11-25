import React from "react";

interface AvatarProps {
  name: string;
}

export default function Avatar({ name }: AvatarProps) {
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

  const firstLetter = name.at(0)?.toUpperCase() || "B";
  const bgColor = letterColors[firstLetter] || "#6B7280"; // Fallback to neutral gray

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={
        "flex font-medium justify-center items-center rounded-full w-[2.5rem] h-[2.5rem] text-white"
      }
    >
      <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.)] text-lg">
        {firstLetter}
      </span>
    </div>
  );
}
