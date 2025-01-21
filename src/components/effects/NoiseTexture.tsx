const NoiseTexture = () => (
  <div className="fixed pointer-events-none top-0 left-0 bottom-0 w-full h-screen">
    <svg width="100%" height="100%" className="block">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" opacity="0.1" />
    </svg>
  </div>
);

export default NoiseTexture;
