// Logo.jsx - the SharePlate mark: a plate (two circles) with a leaf growing from it.
// It is a simple SVG drawn for this project, so it needs no image file.
function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="SharePlate logo">
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 46 C 32 34, 34 26, 44 20 C 45 31, 41 41, 32 46 Z" fill="var(--harvest)" />
      <path d="M32 46 C 32 36, 28 30, 20 27 C 19 36, 24 43, 32 46 Z" fill="currentColor" />
    </svg>
  );
}

export default Logo;
