/** Decorative 70s-style wavy backdrop, matching the retro mockup. Purely cosmetic. */
export function RetroWaves({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" fill="#FAF3E6" />
      <path
        d="M0 15 C 15 5, 35 25, 50 15 S 85 5, 100 15 L 100 28 C 85 18, 65 38, 50 28 S 15 18, 0 28 Z"
        fill="#C4501E"
        opacity="0.9"
      />
      <path
        d="M0 32 C 15 22, 35 42, 50 32 S 85 22, 100 32 L 100 44 C 85 34, 65 54, 50 44 S 15 34, 0 44 Z"
        fill="#E3A23B"
        opacity="0.85"
      />
      <path
        d="M0 48 C 15 38, 35 58, 50 48 S 85 38, 100 48 L 100 60 C 85 50, 65 70, 50 60 S 15 50, 0 60 Z"
        fill="#EFE0C6"
      />
      <path
        d="M0 64 C 15 54, 35 74, 50 64 S 85 54, 100 64 L 100 76 C 85 66, 65 86, 50 76 S 15 66, 0 76 Z"
        fill="#6B7A2E"
        opacity="0.85"
      />
      <path
        d="M0 80 C 15 70, 35 90, 50 80 S 85 70, 100 80 L 100 100 L 0 100 Z"
        fill="#1E3A2A"
        opacity="0.08"
      />
    </svg>
  );
}
