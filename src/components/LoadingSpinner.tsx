import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-12 h-12 rounded-full border-4 border-zinc-700 border-t-zinc-300 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
