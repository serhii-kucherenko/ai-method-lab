export function RouteField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="agd-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="640" height="180" fill="url(#agd-wash)" />
      <rect
        className="scd-trace"
        x="40"
        y="48"
        width="140"
        height="72"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <text
        x="110"
        y="90"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity="0.9"
      >
        screen
      </text>
      <path
        d="M190 84 H230"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
        markerEnd="url(#agd-arrow)"
      />
      <rect
        className="scd-trace"
        style={{ animationDelay: "80ms" }}
        x="240"
        y="48"
        width="150"
        height="72"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <text
        x="315"
        y="90"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity="0.9"
      >
        {"preference alignment"}
      </text>
      <path
        d="M400 84 H440"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      <rect
        className="scd-trace"
        style={{ animationDelay: "160ms" }}
        x="450"
        y="40"
        width="150"
        height="88"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <text
        x="525"
        y="90"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity="0.9"
      >
        preference-aligned
      </text>
      <text x="40" y="156" fontSize="12" fill="currentColor" opacity="0.7">
        clear preference cells → standardize → pool
      </text>
    </svg>
  );
}
