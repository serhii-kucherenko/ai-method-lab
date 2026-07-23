export function PlanField({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="ead-trace"
        d="M0 40 H40 L56 40 L72 18 L88 52 L104 28 L120 40 H180 L196 40 L212 12 L228 56 L244 32 L260 40 H320 L336 40 L352 22 L368 50 L384 34 L400 40 H420"
        stroke="var(--ead-cyan)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="88" cy="52" r="2.5" fill="var(--ead-teal)" opacity="0.85" />
      <circle cx="228" cy="56" r="2.5" fill="var(--ead-teal)" opacity="0.85" />
      <circle cx="368" cy="50" r="2.5" fill="var(--ead-teal)" opacity="0.85" />
    </svg>
  );
}
