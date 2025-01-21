const DiagonalStripes = () => (
  <div className="fixed pointer-events-none top-0 left-0 bottom-0 w-full h-screen">
    <svg width="100%" height="100%" className="block">
      <pattern
        id="diagonal-stripes"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path d="M0,10 l10,-10" stroke="#252525" strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />
    </svg>
  </div>
);

export default DiagonalStripes;
