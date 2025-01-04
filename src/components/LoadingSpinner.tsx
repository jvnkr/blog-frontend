import React from "react";

interface LoadingSpinnerProps {
  width?: number;
  height?: number;
}

const LoadingSpinner = ({ width = 48, height = 48 }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className=" rounded-full border-4 border-zinc-700 border-t-zinc-300 animate-spin"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};

export default LoadingSpinner;
