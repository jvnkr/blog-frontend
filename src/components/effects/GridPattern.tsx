const GridPattern = () => (
  <div className="fixed pointer-events-none top-0 left-0 bottom-0 w-full h-screen">
    <svg width="100%" height="100%" className="block">
      <pattern
        id="grid-pattern"
        patternUnits="userSpaceOnUse"
        width="20"
        height="20"
      >
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="#252525"
          strokeWidth="1"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
);

export default GridPattern;
