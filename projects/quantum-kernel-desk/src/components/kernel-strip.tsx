export function KernelStrip({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="qkd-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="640" height="180" fill="url(#qkd-wash)" />
      <rect
        className="qkd-trace"
        x="28"
        y="48"
        width="120"
        height="72"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <text
        x="88"
        y="90"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity="0.9"
      >
        pocket
      </text>
      <path
        d="M158 84 H188"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      <rect
        className="qkd-trace"
        style={{ animationDelay: "80ms" }}
        x="198"
        y="48"
        width="120"
        height="72"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <text
        x="258"
        y="90"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity="0.9"
      >
        affinity
      </text>
      <path
        d="M328 84 H358"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      <rect
        className="qkd-trace"
        style={{ animationDelay: "160ms" }}
        x="368"
        y="48"
        width="120"
        height="72"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <text
        x="428"
        y="90"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity="0.9"
      >
        ADMET
      </text>
      <path
        d="M498 84 H528"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      <rect
        className="qkd-trace"
        style={{ animationDelay: "240ms" }}
        x="538"
        y="40"
        width="80"
        height="88"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <text
        x="578"
        y="90"
        textAnchor="middle"
        fontSize="11"
        fill="currentColor"
        opacity="0.9"
      >
        plan
      </text>
      <text x="28" y="156" fontSize="12" fill="currentColor" opacity="0.7">
        quantum feature maps + affinity → activity_steering
      </text>
    </svg>
  );
}
