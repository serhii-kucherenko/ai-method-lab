export function ControlField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="scd-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="640" height="180" fill="url(#scd-wash)" />
      {/* Rising open-loop forecast */}
      <path
        className="scd-trace"
        d="M40 140 C120 130, 200 110, 280 70 S440 30, 600 18"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.45"
        strokeDasharray="5 4"
      />
      {/* Counterfactual drained trajectory */}
      <path
        className="scd-trace"
        style={{ animationDelay: "120ms" }}
        d="M40 140 C120 128, 200 118, 280 108 S440 100, 600 96"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Safety threshold */}
      <line
        className="scd-trace"
        style={{ animationDelay: "200ms" }}
        x1="40"
        y1="56"
        x2="600"
        y2="56"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <text x="48" y="48" fontSize="11" fill="currentColor" opacity="0.8">
        θ threshold
      </text>
      {[80, 200, 340, 480].map((x, i) => (
        <g
          key={x}
          className="scd-trace"
          style={{ animationDelay: `${260 + i * 80}ms` }}
        >
          <circle cx={x} cy={i < 2 ? 120 - i * 12 : 104} r={7} stroke="currentColor" strokeWidth="2" />
          <text
            x={x}
            y={148}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            opacity="0.75"
          >
            {i % 2 === 0 ? "cf" : "act"}
          </text>
        </g>
      ))}
    </svg>
  );
}
