import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreTypedTraceValidated,
  scoreUngatedAgent,
} from "./domain/chem";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ChemDomain,
  type ChemInput,
  type ChemQuality,
  type ScoreMode,
  type TraceBias,
} from "./domain/types";

export type {
  ChemDomain,
  ChemInput,
  ChemQuality,
  ScoreMode,
  TraceBias,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type WorkflowPack = {
  id: string;
  label: string;
  version: string;
  chemistryFocus: string;
  ruleBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type RuleStatus = "draft" | "active" | "archived";

export type TraceRule = {
  id: string;
  packId: string;
  label: string;
  domain: ChemDomain;
  fromState: string;
  toState: string;
  allowWeight: number;
  denyWeight: number;
  metricHint: string;
  status: RuleStatus;
  notes: string;
  createdAt: string;
};

export type RecoveryStatus = "draft" | "open" | "scored" | "archived";

export type RecoveryConfig = {
  id: string;
  packId?: string;
  label: string;
  recoverySummary: string;
  successCondition: string;
  recoveryChannel: string;
  status: RecoveryStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type TraceRun = {
  id: string;
  recoveryId: string;
  ruleId: string;
  packCoverage: number;
  ruleFidelity: number;
  recoveryClarity: number;
  runStability: number;
  reviewerNotes: string;
  status: RunStatus;
  createdAt: string;
};

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export type OrgSettings = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  bearerToken: string;
  defaultTraceBias: TraceBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ChemCompare = {
  id: string;
  name: string;
  recoveryId: string;
  ruleId: string;
  runId: string;
  input: ChemInput;
  typedTraceValidated: ChemQuality;
  ungatedAgent: ChemQuality;
  winner: "typed_trace_validated" | "ungated_agent" | "tie";
  gap: number;
  createdAt: string;
};

export type WebhookEvent = {
  id: string;
  idempotencyKey: string;
  receivedAt: string;
  payload: unknown;
};

type StoreState = {
  org: OrgSettings;
  members: Member[];
  packs: WorkflowPack[];
  rules: TraceRule[];
  recoveries: RecoveryConfig[];
  runs: TraceRun[];
  audits: AuditEntry[];
  compares: ChemCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __chemTraceStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const ruleId = "rule-demo";
  const recoveryId = "recovery-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Chem Trace Org",
      webhookUrl: "",
      webhookSecret: "chem-trace-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultTraceBias: "balanced",
      defaultMode: "typed_trace_validated",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@chem-trace.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "DFT Soft-Sim Workflow Pack",
        version: "2026.1",
        chemistryFocus: "DFT with typed trace-state validation",
        ruleBudget: 36,
        status: "active",
        notes: "Seed pack for typed-trace vs ungated compare",
        createdAt: now(),
      },
    ],
    rules: [
      {
        id: ruleId,
        packId,
        label: "Allow DFT→MD handoff (soft-sim)",
        domain: "dft",
        fromState: "dft_complete",
        toState: "md_ready",
        allowWeight: 0.58,
        denyWeight: 0.42,
        metricHint: "ASP allow/deny + trace diagnosis",
        status: "active",
        notes: "Soft-sim rule — not certified compliance, not live HPC",
        createdAt: now(),
      },
    ],
    recoveries: [
      {
        id: recoveryId,
        packId,
        label: "Typed-trace recovery config",
        recoverySummary:
          "Soft-sim typed trace-state validation vs ungated agent baseline.",
        successCondition: "lock_soft_sim",
        recoveryChannel: "soft_sim_trace",
        status: "scored",
        notes: "Seed recovery for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        recoveryId,
        ruleId,
        packCoverage: 0.62,
        ruleFidelity: 0.7,
        recoveryClarity: 0.74,
        runStability: 0.68,
        reviewerNotes:
          "Typed-trace path looks informative but ungated baseline drifts under sparse ASP transitions",
        status: "active",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, rule, recovery, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__chemTraceStore) g.__chemTraceStore = seed();
  return g.__chemTraceStore;
}

function audit(actor: string, action: string, detail: string): void {
  state().audits.unshift({
    id: randomUUID(),
    at: now(),
    actor,
    action,
    detail,
  });
}

export function resetStore(): void {
  g.__chemTraceStore = seed();
}

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  const org = state().org;
  if (patch.name !== undefined) org.name = patch.name;
  if (patch.webhookUrl !== undefined) org.webhookUrl = patch.webhookUrl;
  if (patch.webhookSecret !== undefined) org.webhookSecret = patch.webhookSecret;
  if (patch.bearerToken !== undefined) org.bearerToken = patch.bearerToken;
  if (patch.defaultTraceBias !== undefined) {
    org.defaultTraceBias = patch.defaultTraceBias;
  }
  if (patch.defaultMode !== undefined) org.defaultMode = patch.defaultMode;
  if (patch.rateLimitPerMinute !== undefined) {
    org.rateLimitPerMinute = patch.rateLimitPerMinute;
  }
  audit("owner", "org.update", JSON.stringify(patch));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole): Member {
  const member: Member = { id: randomUUID(), email, role };
  state().members.push(member);
  audit("owner", "member.invite", `${email} as ${role}`);
  return member;
}

export function listPacks(opts?: {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: WorkflowPack[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.chemistryFocus.toLowerCase().includes(q) ||
        p.version.toLowerCase().includes(q),
    );
  }
  if (opts?.status) {
    items = items.filter((p) => p.status === opts.status);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPack(input: {
  label: string;
  version: string;
  chemistryFocus: string;
  ruleBudget?: number;
  notes?: string;
}): WorkflowPack {
  const pack: WorkflowPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    chemistryFocus: input.chemistryFocus,
    ruleBudget: input.ruleBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): WorkflowPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listRules(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TraceRule[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().rules];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.fromState.toLowerCase().includes(q) ||
        m.toState.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRule(input: {
  packId: string;
  label: string;
  domain: ChemDomain;
  fromState: string;
  toState: string;
  allowWeight: number;
  denyWeight?: number;
  metricHint?: string;
  notes?: string;
}): TraceRule | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const rule: TraceRule = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    domain: input.domain,
    fromState: input.fromState,
    toState: input.toState,
    allowWeight: clamp(input.allowWeight, 0, 1),
    denyWeight: clamp(input.denyWeight ?? 1 - input.allowWeight, 0, 1),
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().rules.unshift(rule);
  audit("evaluator", "rule.create", rule.label);
  return rule;
}

export function archiveRule(id: string): TraceRule | null {
  const rule = state().rules.find((m) => m.id === id);
  if (!rule) return null;
  rule.status = "archived";
  audit("evaluator", "rule.archive", id);
  return rule;
}

export function listRecoveries(opts?: {
  q?: string;
  recoveryChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: RecoveryConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().recoveries];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.recoverySummary.toLowerCase().includes(q) ||
        c.recoveryChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.recoveryChannel) {
    items = items.filter((c) => c.recoveryChannel === opts.recoveryChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRecovery(input: {
  packId?: string;
  label: string;
  recoverySummary: string;
  successCondition: string;
  recoveryChannel: string;
  notes?: string;
}): RecoveryConfig {
  const recovery: RecoveryConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    recoverySummary: input.recoverySummary,
    successCondition: input.successCondition,
    recoveryChannel: input.recoveryChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().recoveries.unshift(recovery);
  audit("evaluator", "recovery.create", recovery.label);
  return recovery;
}

export function archiveRecovery(id: string): RecoveryConfig | null {
  const recovery = state().recoveries.find((c) => c.id === id);
  if (!recovery) return null;
  recovery.status = "archived";
  audit("evaluator", "recovery.archive", id);
  return recovery;
}

export function listRuns(opts?: {
  recoveryId?: string;
  ruleId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TraceRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.recoveryId) {
    items = items.filter((r) => r.recoveryId === opts.recoveryId);
  }
  if (opts?.ruleId) {
    items = items.filter((r) => r.ruleId === opts.ruleId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  recoveryId: string;
  ruleId: string;
  packCoverage: number;
  ruleFidelity: number;
  recoveryClarity: number;
  runStability: number;
  reviewerNotes?: string;
}): TraceRun | null {
  if (!state().recoveries.some((c) => c.id === input.recoveryId)) {
    return null;
  }
  if (!state().rules.some((m) => m.id === input.ruleId)) return null;
  const run: TraceRun = {
    id: randomUUID(),
    recoveryId: input.recoveryId,
    ruleId: input.ruleId,
    packCoverage: clamp(input.packCoverage, 0, 1),
    ruleFidelity: clamp(input.ruleFidelity, 0, 1),
    recoveryClarity: clamp(input.recoveryClarity, 0, 1),
    runStability: clamp(input.runStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const recovery = state().recoveries.find((c) => c.id === input.recoveryId);
  if (recovery) recovery.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ChemCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "hold_pack":
      return 0.2;
    case "review":
      return 0.45;
    case "lock_soft_sim":
      return 0.7;
    case "strong_lock":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  recoveryId: string;
  ruleId: string;
  runId: string;
  traceBias?: TraceBias;
  bias?: TraceBias;
  ungatedPassRate?: number;
  skipOptimism?: number;
  transitionHardness?: number;
  overclaimRisk?: number;
}): ChemCompare | null {
  const recovery = state().recoveries.find((c) => c.id === input.recoveryId);
  const rule = state().rules.find((m) => m.id === input.ruleId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!recovery || !rule || !run) return null;

  const goldWeight = outcomeWeight(String(recovery.successCondition));
  const chemInput: ChemInput = {
    packCoverage: clamp(run.packCoverage, 0, 1),
    ruleFidelity: clamp(run.ruleFidelity, 0, 1),
    recoveryClarity: clamp(run.recoveryClarity, 0, 1),
    runStability: clamp((run.runStability + goldWeight) / 2, 0, 1),
    ungatedPassRate: input.ungatedPassRate ?? 0.82,
    skipOptimism: input.skipOptimism ?? 0.7,
    transitionHardness:
      input.transitionHardness ??
      clamp(1 - rule.allowWeight + 0.15, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(rule.denyWeight > 0.6 ? 0.55 : 0.28, 0, 1),
    traceBias: input.traceBias ?? input.bias ?? state().org.defaultTraceBias,
    profile: "typed_trace_validated",
  };

  const typedTraceValidated = scoreTypedTraceValidated({
    ...chemInput,
    profile: "typed_trace_validated",
  });
  const ungatedAgent = scoreUngatedAgent({
    ...chemInput,
    profile: "ungated_agent",
  });
  const gap = Math.abs(typedTraceValidated.overall - ungatedAgent.overall);
  let winner: ChemCompare["winner"] = "tie";
  if (typedTraceValidated.overall > ungatedAgent.overall + 0.5) {
    winner = "typed_trace_validated";
  } else if (ungatedAgent.overall > typedTraceValidated.overall + 0.5) {
    winner = "ungated_agent";
  }

  const compare: ChemCompare = {
    id: randomUUID(),
    name: input.name,
    recoveryId: recovery.id,
    ruleId: rule.id,
    runId: run.id,
    input: chemInput,
    typedTraceValidated,
    ungatedAgent,
    winner,
    gap: round2(gap),
    createdAt: now(),
  };
  state().compares.unshift(compare);
  audit(
    "evaluator",
    "compare.run",
    `${compare.name} winner=${winner} gap=${compare.gap}`,
  );
  return compare;
}

export function getScoreboard(): ChemCompare[] {
  return [...state().compares].sort(
    (a, b) => b.typedTraceValidated.overall - a.typedTraceValidated.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      rules: state().rules,
      recoveries: state().recoveries,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,typedTraceOverall,ungatedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.typedTraceValidated.overall},${c.ungatedAgent.overall},${c.createdAt}`,
    ),
  ];
  return rows.join("\n");
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  const expected = state().org.bearerToken;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const bucket = state().rateBucket;
  const limit = state().org.rateLimitPerMinute;
  const nowMs = Date.now();
  if (nowMs - bucket.windowStart > 60_000) {
    bucket.windowStart = nowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
  };
}

export function ingestWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const body = JSON.stringify(payload ?? {});
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  if (!signature || signature !== `sha256=${expected}`) {
    return { ok: false, error: "bad_signature" };
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, id: existing.id };
  const event: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(event);
  audit("webhook", "webhook.ingest", idempotencyKey);
  return { ok: true, id: event.id };
}

export function featureInventory(): { id: string; name: string }[] {
  return [
    { id: "landing", name: "Marketing landing" },
    { id: "pricing", name: "Pricing tiers" },
    { id: "demo", name: "Guided demo" },
    { id: "onboarding", name: "Onboarding checklist" },
    { id: "flows", name: "Multi-flow index" },
    { id: "workflow-packs", name: "Workflow pack registry" },
    { id: "pack-versions", name: "Versioned workflow packs" },
    { id: "trace-rules", name: "Trace-state rule definitions" },
    { id: "asp-editor", name: "ASP allow/deny weight editor" },
    { id: "rule-search", name: "Rule search and filter" },
    { id: "seed-packs", name: "Seed workflow packs" },
    { id: "recovery-configs", name: "Recovery action workspace" },
    { id: "recovery-filters", name: "Recovery filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "trace-runs", name: "Trace soft-sim runs" },
    { id: "trace-bias", name: "Trace bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Typed-trace vs ungated agent compare" },
    { id: "delta-view", name: "Trace delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-certified / not-HPC notes" },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "HMAC webhook ingest" },
    { id: "export-json", name: "Export packs JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "pagination", name: "Pagination on list APIs" },
  ];
}

export function scorePreview(input: ChemInput): {
  typedTraceValidated: ChemQuality;
  ungatedAgent: ChemQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const typedTraceValidated = scoreTypedTraceValidated({
    ...input,
    profile: "typed_trace_validated",
  });
  const ungatedAgent = scoreUngatedAgent({
    ...input,
    profile: "ungated_agent",
  });
  return {
    typedTraceValidated,
    ungatedAgent,
    readiness: readinessFromQuality(typedTraceValidated.overall),
  };
}
