export type Finding = {
  id: string;
  kind: "api_key" | "password" | "token" | "pii";
  matched: boolean;
  redacted: boolean;
};

export type ScoreInput = {
  findings: Finding[];
  exportRequested: boolean;
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  leakCount: number;
  redactCoverage: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Pattern-redact: strip matched secrets before export. */
export function scorePatternRedact(input: ScoreInput): ScoreOutput {
  const matched = input.findings.filter((f) => f.matched);
  const redacted = matched.filter((f) => f.redacted);
  const leaks = matched.filter((f) => !f.redacted).length;
  const coverage = matched.length ? (redacted.length / matched.length) * 100 : 100;
  return {
    score: clamp(coverage * 0.75 + (leaks === 0 ? 25 : 5)),
    trust: clamp(70 + coverage * 0.25 - leaks * 8),
    escalated: leaks > 0 && input.exportRequested,
    leakCount: leaks,
    redactCoverage: Math.round(coverage * 10) / 10,
    rationale: `Pattern-redact matched=${matched.length} redacted=${redacted.length} leaks=${leaks}`,
  };
}

/** Raw-export: ship traces as-is; ignore patterns. */
export function scoreRawExport(input: ScoreInput): ScoreOutput {
  const leaks = input.findings.filter((f) => f.matched).length;
  return {
    score: clamp(55 - leaks * 2),
    trust: 40,
    escalated: false,
    leakCount: leaks,
    redactCoverage: 0,
    rationale: `Raw-export ships ${leaks} matched secrets without redaction`,
  };
}
