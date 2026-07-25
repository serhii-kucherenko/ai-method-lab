import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreArabicCotDistilled,
  scoreNondistilledBaseline,
} from "./domain/aracot";
import {
  clamp,
  readinessFromQuality,
  round2,
  type TraceKind,
  type AgentBias,
  type ScoreMode,
  type AgentInput,
  type AgentQuality,
} from "./domain/types";

export type {
  TraceKind,
  AgentBias,
  ScoreMode,
  AgentInput,
  AgentQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type AgentPack = {
  id: string;
  label: string;
  version: string;
  cohortTarget: string;
  traceBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type TraceStatus = "draft" | "active" | "archived";

export type TraceSet = {
  id: string;
  packId: string;
  label: string;
  kind: TraceKind;
  sequenceHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: TraceStatus;
  notes: string;
  createdAt: string;
};

export type DistillStatus = "draft" | "open" | "scored" | "archived";

export type DistillConfig = {
  id: string;
  packId?: string;
  label: string;
  distillText: string;
  successCondition: string;
  taskChannel: string;
  status: DistillStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type AgentRun = {
  id: string;
  distillId: string;
  traceId: string;
  cotStepQuality: number;
  arabicFluency: number;
  distillFidelity: number;
  agentGrounding: number;
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
  defaultAgentBias: AgentBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type AgentCompare = {
  id: string;
  name: string;
  distillId: string;
  traceId: string;
  runId: string;
  input: AgentInput;
  distilledAgent: AgentQuality;
  nondistilledBaseline: AgentQuality;
  winner:
    | "arabic_cot_distilled_agent"
    | "nondistilled_multilingual_baseline"
    | "tie";
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
  packs: AgentPack[];
  traces: TraceSet[];
  distills: DistillConfig[];
  runs: AgentRun[];
  audits: AuditEntry[];
  compares: AgentCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __aracotAgentStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const traceId = "trace-demo";
  const distillId = "distill-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Aracot Agent Org",
      webhookUrl: "",
      webhookSecret: "aracot-agent-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultAgentBias: "balanced",
      defaultMode: "arabic_cot_distilled_agent",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@aracot-agent.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Arabic CoT Soft-Sim Agent Pack",
        version: "2026.1",
        cohortTarget: "Arabic CoT distillation soft-sim",
        traceBudget: 36,
        status: "active",
        notes:
          "Seed pack for Arabic CoT distilled agent vs non-distilled multilingual baseline",
        createdAt: now(),
      },
    ],
    traces: [
      {
        id: traceId,
        packId,
        label: "Arabic CoT reasoning traces",
        kind: "arabic_cot",
        sequenceHint:
          "cot_step_quality,arabic_fluency,distill_fidelity,agent_grounding",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "Arabic CoT distillation for multilingual agent soft-sim honesty",
        status: "active",
        notes: "Soft-sim traces — not production LLM deployment",
        createdAt: now(),
      },
    ],
    distills: [
      {
        id: distillId,
        packId,
        label: "AraCoT-style distill config",
        distillText:
          "Given Arabic CoT traces, distill an agent soft-sim against the pack.",
        successCondition: "lock_soft_sim",
        taskChannel: "soft_sim_arabic_cot_distill",
        status: "scored",
        notes: "Seed distill config for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        distillId,
        traceId,
        cotStepQuality: 0.62,
        arabicFluency: 0.7,
        distillFidelity: 0.74,
        agentGrounding: 0.68,
        reviewerNotes:
          "Distilled CoT looks trustworthy but non-distilled multilingual needs Arabic step depth",
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
        detail: "Demo pack, traces, distill, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__aracotAgentStore) g.__aracotAgentStore = seed();
  return g.__aracotAgentStore;
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
  g.__aracotAgentStore = seed();
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
  if (patch.defaultAgentBias !== undefined) {
    org.defaultAgentBias = patch.defaultAgentBias;
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
  items: AgentPack[];
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
        p.cohortTarget.toLowerCase().includes(q) ||
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
  cohortTarget: string;
  traceBudget?: number;
  notes?: string;
}): AgentPack {
  const pack: AgentPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    cohortTarget: input.cohortTarget,
    traceBudget: input.traceBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): AgentPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listTraces(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TraceSet[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().traces];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.sequenceHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTrace(input: {
  packId: string;
  label: string;
  kind: TraceKind;
  sequenceHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): TraceSet | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: TraceSet = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    sequenceHint: input.sequenceHint,
    seriesCount: input.seriesCount,
    fidelityMin: input.fidelityMin,
    fidelityMax: input.fidelityMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().traces.unshift(row);
  audit("evaluator", "trace.create", row.label);
  return row;
}

export function archiveTrace(id: string): TraceSet | null {
  const row = state().traces.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "trace.archive", id);
  return row;
}

export function listDistills(opts?: {
  q?: string;
  taskChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DistillConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().distills];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.distillText.toLowerCase().includes(q) ||
        c.taskChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.taskChannel) {
    items = items.filter((c) => c.taskChannel === opts.taskChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createDistill(input: {
  packId?: string;
  label: string;
  distillText: string;
  successCondition: string;
  taskChannel: string;
  notes?: string;
}): DistillConfig {
  const row: DistillConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    distillText: input.distillText,
    successCondition: input.successCondition,
    taskChannel: input.taskChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().distills.unshift(row);
  audit("evaluator", "distill.create", row.label);
  return row;
}

export function archiveDistill(id: string): DistillConfig | null {
  const row = state().distills.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "distill.archive", id);
  return row;
}

export function listRuns(opts?: {
  distillId?: string;
  traceId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AgentRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.distillId) {
    items = items.filter((r) => r.distillId === opts.distillId);
  }
  if (opts?.traceId) {
    items = items.filter((r) => r.traceId === opts.traceId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  distillId: string;
  traceId: string;
  cotStepQuality: number;
  arabicFluency: number;
  distillFidelity: number;
  agentGrounding: number;
  reviewerNotes?: string;
}): AgentRun | null {
  if (!state().distills.some((c) => c.id === input.distillId)) {
    return null;
  }
  if (!state().traces.some((m) => m.id === input.traceId)) return null;
  const run: AgentRun = {
    id: randomUUID(),
    distillId: input.distillId,
    traceId: input.traceId,
    cotStepQuality: clamp(input.cotStepQuality, 0, 1),
    arabicFluency: clamp(input.arabicFluency, 0, 1),
    distillFidelity: clamp(input.distillFidelity, 0, 1),
    agentGrounding: clamp(input.agentGrounding, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().distills.find((c) => c.id === input.distillId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): AgentCompare[] {
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
  distillId: string;
  traceId: string;
  runId: string;
  agentBias?: AgentBias;
  bias?: AgentBias;
  multilingualCoverage?: number;
  baselineOptimism?: number;
  reasoningHardness?: number;
  overclaimRisk?: number;
}): AgentCompare | null {
  const distill = state().distills.find((c) => c.id === input.distillId);
  const series = state().traces.find((m) => m.id === input.traceId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!distill || !series || !run) return null;

  const goldWeight = outcomeWeight(String(distill.successCondition));
  const span = Math.max(0.05, series.fidelityMax - series.fidelityMin);
  const agentInput: AgentInput = {
    cotStepQuality: clamp(run.cotStepQuality, 0, 1),
    arabicFluency: clamp(run.arabicFluency, 0, 1),
    distillFidelity: clamp(run.distillFidelity, 0, 1),
    agentGrounding: clamp((run.agentGrounding + goldWeight) / 2, 0, 1),
    multilingualCoverage: input.multilingualCoverage ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    reasoningHardness:
      input.reasoningHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    agentBias:
      input.agentBias ?? input.bias ?? state().org.defaultAgentBias,
    profile: "arabic_cot_distilled_agent",
  };

  const distilledAgent = scoreArabicCotDistilled({
    ...agentInput,
    profile: "arabic_cot_distilled_agent",
  });
  const nondistilledBaseline = scoreNondistilledBaseline({
    ...agentInput,
    profile: "nondistilled_multilingual_baseline",
  });
  const gap = Math.abs(distilledAgent.overall - nondistilledBaseline.overall);
  let winner: AgentCompare["winner"] = "tie";
  if (distilledAgent.overall > nondistilledBaseline.overall + 0.5) {
    winner = "arabic_cot_distilled_agent";
  } else if (nondistilledBaseline.overall > distilledAgent.overall + 0.5) {
    winner = "nondistilled_multilingual_baseline";
  }

  const compare: AgentCompare = {
    id: randomUUID(),
    name: input.name,
    distillId: distill.id,
    traceId: series.id,
    runId: run.id,
    input: agentInput,
    distilledAgent,
    nondistilledBaseline,
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

export function getScoreboard(): AgentCompare[] {
  return [...state().compares].sort(
    (a, b) => b.distilledAgent.overall - a.distilledAgent.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      traces: state().traces,
      distills: state().distills,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,distilledOverall,baselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.distilledAgent.overall},${c.nondistilledBaseline.overall},${c.createdAt}`,
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
    { id: "agent-packs", name: "Agent pack registry" },
    { id: "pack-versions", name: "Versioned agent packs" },
    { id: "trace-sets", name: "Arabic CoT trace sets" },
    { id: "trace-editor", name: "Trace fidelity / sequence editor" },
    { id: "trace-search", name: "Trace search and filter" },
    { id: "seed-packs", name: "Seed agent packs" },
    { id: "distills", name: "Distillation workspace" },
    { id: "distill-filters", name: "Distill filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "agent-runs", name: "Agent soft-sim runs" },
    { id: "agent-bias", name: "Agent bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Arabic CoT distilled agent vs non-distilled multilingual baseline compare",
    },
    { id: "delta-view", name: "Agent delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not production LLM / not live chat / not authors' system",
    },
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

export function scorePreview(input: AgentInput): {
  distilledAgent: AgentQuality;
  nondistilledBaseline: AgentQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const distilledAgent = scoreArabicCotDistilled({
    ...input,
    profile: "arabic_cot_distilled_agent",
  });
  const nondistilledBaseline = scoreNondistilledBaseline({
    ...input,
    profile: "nondistilled_multilingual_baseline",
  });
  return {
    distilledAgent,
    nondistilledBaseline,
    readiness: readinessFromQuality(distilledAgent.overall),
  };
}
