import React from "react";

const PatternCircles = ({ fadeStrength = 0.5 }) => {
  return (
    <div
      className="fixed pointer-events-none top-0 left-0 bottom-0 w-full h-screen"
      style={{
        maskImage: `radial-gradient(circle, rgba(255, 0, 0, 1) ${
          fadeStrength * 100
        }%, rgba(0, 0, 0, 0) 100%)`,
        WebkitMaskImage: `radial-gradient(circle, rgba(255, 0, 0, 1) ${
          fadeStrength * 100
        }%, rgba(0, 0, 0, 0) 100%)`,
      }}
    >
      <svg width="100%" height="100%" className="block">
        <pattern
          id="pattern-circles"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle
            id="pattern-circle"
            cx="10"
            cy="10"
            r="1.6257413380501518"
            fill="#252525"
            opacity="0.8"
          ></circle>
        </pattern>
        <rect
          id="rect"
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#pattern-circles)"
        ></rect>
      </svg>
    </div>
  );
};

export default PatternCircles;
