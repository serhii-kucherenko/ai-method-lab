export function EcgTrace({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="hrd-trace"
        d="M0 32 H48 L60 32 L72 8 L84 56 L96 20 L108 32 H168 L180 32 L192 4 L204 60 L216 28 L228 32 H300 L312 32 L324 12 L336 52 L348 24 L360 32 H420"
        stroke="var(--hrd-signal)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
