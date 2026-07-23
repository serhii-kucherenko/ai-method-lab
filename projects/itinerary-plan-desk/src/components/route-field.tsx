export function RouteField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ipd-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="640" height="180" fill="url(#ipd-wash)" />
      {/* Day timeline */}
      <line
        className="scd-trace"
        x1="40"
        y1="90"
        x2="600"
        y2="90"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      {/* Feasible stops on the day */}
      {[
        { x: 80, label: "cafe", h: 36 },
        { x: 200, label: "museum", h: 52 },
        { x: 360, label: "park", h: 44 },
      ].map((stop, i) => (
        <g
          key={stop.label}
          className="scd-trace"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <rect
            x={stop.x}
            y={90 - stop.h / 2}
            width={70}
            height={stop.h}
            rx="6"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="currentColor"
            fillOpacity="0.12"
            opacity="0.9"
          />
          <text
            x={stop.x + 35}
            y={148}
            textAnchor="middle"
            fontSize="11"
            fill="currentColor"
            opacity="0.8"
          >
            {stop.label}
          </text>
        </g>
      ))}
      {/* Naive overrun dashed block past day budget */}
      <rect
        className="scd-trace"
        style={{ animationDelay: "280ms" }}
        x="480"
        y="58"
        width="90"
        height="64"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.5"
      />
      <text x="525" y="148" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.65">
        overrun
      </text>
      <text x="40" y="40" fontSize="12" fill="currentColor" opacity="0.75">
        day window
      </text>
    </svg>
  );
}
