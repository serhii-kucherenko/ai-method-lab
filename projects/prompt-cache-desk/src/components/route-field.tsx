export function RouteField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pcd-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="640" height="180" fill="url(#pcd-wash)" />
      {/* Two-tier threshold */}
      <line
        className="scd-trace"
        x1="360"
        y1="28"
        x2="360"
        y2="150"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity="0.55"
      />
      <text x="368" y="42" fontSize="11" fill="currentColor" opacity="0.75">
        ~3500 tier
      </text>
      {/* Hot tier bar */}
      <rect
        className="scd-trace"
        x="48"
        y="70"
        width="280"
        height="36"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <text x="188" y="94" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.85">
        hot · ρ≈0.83
      </text>
      {/* Persistent tier */}
      <rect
        className="scd-trace"
        style={{ animationDelay: "120ms" }}
        x="380"
        y="62"
        width="210"
        height="52"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <text
        x="485"
        y="94"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity="0.9"
      >
        persistent · ρ≈1
      </text>
      <text x="48" y="150" fontSize="12" fill="currentColor" opacity="0.7">
        prefix tokens
      </text>
    </svg>
  );
}
