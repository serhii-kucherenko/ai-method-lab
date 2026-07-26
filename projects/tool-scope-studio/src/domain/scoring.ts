export type ToolCall = {
  id: string;
  tool: string;
  inScope: boolean;
  sensitive: boolean;
};

export type ScoreInput = {
  declaredScopes: string[];
  calls: ToolCall[];
  openToolsAllowed: boolean;
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  grantRate: number;
  denyRisk: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Scope-bound: only grant calls inside declared scopes; deny sensitive out-of-scope. */
export function scoreScopeBound(input: ScoreInput): ScoreOutput {
  const scopes = new Set(input.declaredScopes);
  let granted = 0;
  let denied = 0;
  let sensitiveDeny = 0;
  for (const call of input.calls) {
    const ok = call.inScope && scopes.has(call.tool.split(".")[0]);
    if (ok) granted += 1;
    else {
      denied += 1;
      if (call.sensitive) sensitiveDeny += 1;
    }
  }
  const total = Math.max(1, input.calls.length);
  const grantRate = Math.round((granted / total) * 1000) / 10;
  const denyRisk = clamp(denied * 12 + sensitiveDeny * 18);
  return {
    score: clamp(100 - denyRisk * 0.55 + grantRate * 0.15),
    trust: clamp(78 - sensitiveDeny * 8 + granted * 2),
    escalated: sensitiveDeny > 0,
    grantRate,
    denyRisk,
    rationale: `Scope-bound granted=${granted} denied=${denied} sensitiveDeny=${sensitiveDeny}`,
  };
}

/** Open-tools: allow every call; ignore declared scopes. */
export function scoreOpenTools(input: ScoreInput): ScoreOutput {
  const grantRate = 100;
  const sensitive = input.calls.filter((c) => c.sensitive).length;
  return {
    score: clamp(88 - sensitive * 2),
    trust: 48,
    escalated: false,
    grantRate,
    denyRisk: clamp(35 + sensitive * 10),
    rationale: `Open-tools grants all ${input.calls.length} calls; scopes ignored`,
  };
}
