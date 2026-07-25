import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreStructuredTherapySafetyGates,
  scorePromptOnlySafetyBaseline,
} from "./domain/safety";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ScenarioKind,
  type TherapyBias,
  type ScoreMode,
  type TherapyInput,
  type TherapyQuality,
} from "./domain/types";

export type {
  ScenarioKind,
  TherapyBias,
  ScoreMode,
  TherapyInput,
  TherapyQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type PromptPack = {
  id: string;
  label: string;
  version: string;
  therapyFocus: string;
  scenarioBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ScenarioStatus = "draft" | "active" | "archived";

export type ScenarioSuite = {
  id: string;
  packId: string;
  label: string;
  kind: ScenarioKind;
  riskHint: string;
  caseCount: number;
  riskMin: number;
  riskMax: number;
  metricHint: string;
  status: ScenarioStatus;
  notes: string;
  createdAt: string;
};

export type GateStatus = "draft" | "open" | "scored" | "archived";

export type SafetyGate = {
  id: string;
  packId?: string;
  label: string;
  architecture: string;
  lockCondition: string;
  gateChannel: string;
  status: GateStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type PromptRun = {
  id: string;
  gateId: string;
  scenarioId: string;
  gateCoverage: number;
  refusalStrength: number;
  crisisEscalation: number;
  boundaryClarity: number;
  runNotes: string;
  status: RunStatus;
  createdAt: string;
};

export type AuditEvent = {
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
  defaultTherapyBias: TherapyBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type TherapyCompare = {
  id: string;
  name: string;
  gateId: string;
  scenarioId: string;
  runId: string;
  input: TherapyInput;
  gates: TherapyQuality;
  promptOnly: TherapyQuality;
  winner:
    | "structured_therapy_safety_gates"
    | "prompt_only_safety_baseline"
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
  packs: PromptPack[];
  scenarios: ScenarioSuite[];
  gates: SafetyGate[];
  runs: PromptRun[];
  audits: AuditEvent[];
  compares: TherapyCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __therapyPromptStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const scenarioId = "scenario-demo";
  const gateId = "gate-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Therapy Prompt Org",
      webhookUrl: "",
      webhookSecret: "therapy-prompt-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultTherapyBias: "balanced",
      defaultMode: "structured_therapy_safety_gates",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@therapy-prompt.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Therapy Safety Soft-Sim Pack",
        version: "2026.1",
        therapyFocus:
          "Structured therapy-safety gates soft-sim for high-risk psychiatric scenarios",
        scenarioBudget: 36,
        status: "active",
        notes:
          "Seed pack for structured gates vs prompt-only safety baseline soft-sim",
        createdAt: now(),
      },
    ],
    scenarios: [
      {
        id: scenarioId,
        packId,
        label: "High-risk psychiatric scenario suite",
        kind: "suicidality",
        riskHint:
          "gate_coverage,refusal_strength,crisis_escalation,boundary_clarity",
        caseCount: 4,
        riskMin: 0.4,
        riskMax: 0.95,
        metricHint:
          "Coverage, refusal, crisis routing, and boundaries for therapy-safety soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim psychiatric scenarios — not clinical therapy / not crisis line",
        createdAt: now(),
      },
    ],
    gates: [
      {
        id: gateId,
        packId,
        label: "Structured therapy-safety gate set",
        architecture:
          "Comparative structured gates soft-sim (refusal + escalation + boundary)",
        lockCondition: "lock_soft_sim",
        gateChannel: "soft_sim_therapy_gate_signal",
        status: "scored",
        notes: "Seed gates for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        gateId,
        scenarioId,
        gateCoverage: 0.62,
        refusalStrength: 0.7,
        crisisEscalation: 0.74,
        boundaryClarity: 0.68,
        runNotes:
          "Structured gates look trustworthy but prompt-only baseline needs more honesty on high-risk psychiatric scenarios",
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
        detail: "Demo pack, scenarios, gates, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__therapyPromptStore) g.__therapyPromptStore = seed();
  return g.__therapyPromptStore;
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
  g.__therapyPromptStore = seed();
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
  if (patch.defaultTherapyBias !== undefined) {
    org.defaultTherapyBias = patch.defaultTherapyBias;
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
  items: PromptPack[];
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
        p.therapyFocus.toLowerCase().includes(q) ||
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
  therapyFocus: string;
  scenarioBudget?: number;
  notes?: string;
}): PromptPack {
  const pack: PromptPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    therapyFocus: input.therapyFocus,
    scenarioBudget: input.scenarioBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): PromptPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listScenarios(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ScenarioSuite[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().scenarios];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.riskHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createScenario(input: {
  packId: string;
  label: string;
  kind: ScenarioKind;
  riskHint: string;
  caseCount: number;
  riskMin: number;
  riskMax: number;
  metricHint?: string;
  notes?: string;
}): ScenarioSuite | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: ScenarioSuite = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    riskHint: input.riskHint,
    caseCount: input.caseCount,
    riskMin: input.riskMin,
    riskMax: input.riskMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().scenarios.unshift(row);
  audit("evaluator", "scenario.create", row.label);
  return row;
}

export function archiveScenario(id: string): ScenarioSuite | null {
  const row = state().scenarios.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "scenario.archive", id);
  return row;
}

export function listGates(opts?: {
  q?: string;
  gateChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SafetyGate[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().gates];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.architecture.toLowerCase().includes(q) ||
        c.gateChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.gateChannel) {
    items = items.filter((c) => c.gateChannel === opts.gateChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createGate(input: {
  packId?: string;
  label: string;
  architecture: string;
  lockCondition: string;
  gateChannel: string;
  notes?: string;
}): SafetyGate {
  const row: SafetyGate = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    architecture: input.architecture,
    lockCondition: input.lockCondition,
    gateChannel: input.gateChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().gates.unshift(row);
  audit("evaluator", "gate.create", row.label);
  return row;
}

export function archiveGate(id: string): SafetyGate | null {
  const row = state().gates.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "gate.archive", id);
  return row;
}

export function listRuns(opts?: {
  gateId?: string;
  scenarioId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PromptRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.gateId) {
    items = items.filter((r) => r.gateId === opts.gateId);
  }
  if (opts?.scenarioId) {
    items = items.filter((r) => r.scenarioId === opts.scenarioId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  gateId: string;
  scenarioId: string;
  gateCoverage: number;
  refusalStrength: number;
  crisisEscalation: number;
  boundaryClarity: number;
  runNotes?: string;
}): PromptRun | null {
  if (!state().gates.some((c) => c.id === input.gateId)) {
    return null;
  }
  if (!state().scenarios.some((m) => m.id === input.scenarioId)) {
    return null;
  }
  const run: PromptRun = {
    id: randomUUID(),
    gateId: input.gateId,
    scenarioId: input.scenarioId,
    gateCoverage: clamp(input.gateCoverage, 0, 1),
    refusalStrength: clamp(input.refusalStrength, 0, 1),
    crisisEscalation: clamp(input.crisisEscalation, 0, 1),
    boundaryClarity: clamp(input.boundaryClarity, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().gates.find((c) => c.id === input.gateId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): TherapyCompare[] {
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
  gateId: string;
  scenarioId: string;
  runId: string;
  therapyBias?: TherapyBias;
  bias?: TherapyBias;
  promptOnlyConfidence?: number;
  baselineOptimism?: number;
  scenarioHardness?: number;
  overclaimRisk?: number;
}): TherapyCompare | null {
  const gate = state().gates.find((c) => c.id === input.gateId);
  const scenario = state().scenarios.find((m) => m.id === input.scenarioId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!gate || !scenario || !run) return null;

  const goldWeight = outcomeWeight(String(gate.lockCondition));
  const span = Math.max(0.05, scenario.riskMax - scenario.riskMin);
  const therapyInput: TherapyInput = {
    gateCoverage: clamp(run.gateCoverage, 0, 1),
    refusalStrength: clamp(run.refusalStrength, 0, 1),
    crisisEscalation: clamp(run.crisisEscalation, 0, 1),
    boundaryClarity: clamp((run.boundaryClarity + goldWeight) / 2, 0, 1),
    promptOnlyConfidence: input.promptOnlyConfidence ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    scenarioHardness: input.scenarioHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    therapyBias:
      input.therapyBias ?? input.bias ?? state().org.defaultTherapyBias,
    profile: "structured_therapy_safety_gates",
  };

  const gates = scoreStructuredTherapySafetyGates({
    ...therapyInput,
    profile: "structured_therapy_safety_gates",
  });
  const promptOnly = scorePromptOnlySafetyBaseline({
    ...therapyInput,
    profile: "prompt_only_safety_baseline",
  });
  const gap = Math.abs(gates.overall - promptOnly.overall);
  let winner: TherapyCompare["winner"] = "tie";
  if (gates.overall > promptOnly.overall + 0.5) {
    winner = "structured_therapy_safety_gates";
  } else if (promptOnly.overall > gates.overall + 0.5) {
    winner = "prompt_only_safety_baseline";
  }

  const compare: TherapyCompare = {
    id: randomUUID(),
    name: input.name,
    gateId: gate.id,
    scenarioId: scenario.id,
    runId: run.id,
    input: therapyInput,
    gates,
    promptOnly,
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

export function getScoreboard(): TherapyCompare[] {
  return [...state().compares].sort(
    (a, b) => b.gates.overall - a.gates.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      scenarios: state().scenarios,
      gates: state().gates,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,gatesOverall,promptOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.gates.overall},${c.promptOnly.overall},${c.createdAt}`,
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
    { id: "prompt-packs", name: "Prompt pack registry" },
    { id: "pack-versions", name: "Versioned prompt packs" },
    { id: "scenarios", name: "High-risk psychiatric scenario suites" },
    { id: "scenario-editor", name: "Scenario risk / case editor" },
    { id: "scenario-search", name: "Scenario search and filter" },
    { id: "seed-packs", name: "Seed prompt packs" },
    { id: "gates", name: "Structured therapy-safety gate registry" },
    { id: "gate-filters", name: "Gate filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "prompt-runs", name: "Therapy-safety soft-sim runs" },
    { id: "therapy-bias", name: "Therapy bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Structured therapy-safety gates vs prompt-only safety baseline compare",
    },
    { id: "delta-view", name: "Therapy-safety delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not clinical therapy / not crisis line / not live patient chat / not FDA / not authors' system",
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

export function scorePreview(input: TherapyInput): {
  gates: TherapyQuality;
  promptOnly: TherapyQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const gates = scoreStructuredTherapySafetyGates({
    ...input,
    profile: "structured_therapy_safety_gates",
  });
  const promptOnly = scorePromptOnlySafetyBaseline({
    ...input,
    profile: "prompt_only_safety_baseline",
  });
  return {
    gates,
    promptOnly,
    readiness: readinessFromQuality(gates.overall),
  };
}
