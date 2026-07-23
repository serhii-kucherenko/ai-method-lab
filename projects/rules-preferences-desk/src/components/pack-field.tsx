export function PackField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rpd-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="640" height="180" fill="url(#rpd-wash)" />
      {/* Luggage silhouette */}
      <rect
        className="scd-trace"
        x="80"
        y="50"
        width="200"
        height="100"
        rx="10"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.85"
      />
      <path
        className="scd-trace"
        style={{ animationDelay: "80ms" }}
        d="M140 50 V38 H220 V50"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.7"
      />
      {/* Capacity fill vs overpack dashed */}
      <rect
        className="scd-trace"
        style={{ animationDelay: "140ms" }}
        x="95"
        y="70"
        width="110"
        height="65"
        rx="4"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        className="scd-trace"
        style={{ animationDelay: "200ms" }}
        x="210"
        y="70"
        width="55"
        height="65"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.55"
      />
      <text x="100" y="160" fontSize="11" fill="currentColor" opacity="0.8">
        capacity
      </text>
      <text x="215" y="160" fontSize="11" fill="currentColor" opacity="0.65">
        overpack
      </text>
      {/* Preference bars into feasible subset */}
      {[340, 400, 460, 520].map((x, i) => (
        <g
          key={x}
          className="scd-trace"
          style={{ animationDelay: `${220 + i * 70}ms` }}
        >
          <rect
            x={x}
            y={110 - i * 14}
            width="36"
            height={40 + i * 10}
            rx="3"
            stroke="currentColor"
            strokeWidth="2"
            opacity={i === 3 ? 0.35 : 0.85}
            strokeDasharray={i === 3 ? "4 3" : undefined}
          />
          <text
            x={x + 18}
            y={168}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            opacity="0.75"
          >
            {i === 3 ? "ban" : `u${9 - i}`}
          </text>
        </g>
      ))}
    </svg>
  );
}
