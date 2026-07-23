export function WorldField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dsd-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="640" height="180" fill="url(#dsd-wash)" />
      {[40, 120, 200, 280, 360, 440, 520].map((x, i) => (
        <g key={x} className="dsd-trace" style={{ animationDelay: `${i * 90}ms` }}>
          <circle cx={x} cy={90} r={10} stroke="currentColor" strokeWidth="2" />
          {i < 6 ? (
            <path
              d={`M${x + 12} 90 H${x + 68}`}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray={i % 2 === 0 ? "0" : "4 4"}
              opacity="0.7"
            />
          ) : null}
          <text
            x={x}
            y={118}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            opacity="0.75"
          >
            {i % 2 === 0 ? "sim" : "run"}
          </text>
        </g>
      ))}
    </svg>
  );
}
