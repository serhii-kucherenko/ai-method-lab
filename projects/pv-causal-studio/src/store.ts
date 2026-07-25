import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreTargetTrialCausalSignal,
  scoreSpontaneousReportingBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type CohortKind,
  type SignalBias,
  type ScoreMode,
  type PvCausalInput,
  type PvCausalQuality,
} from "./domain/types";

export type {
  CohortKind,
  SignalBias,
  ScoreMode,
  PvCausalInput,
  PvCausalQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type PvPack = {
  id: string;
  label: string;
  version: string;
  signalFocus: string;
  cohortBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type CohortStatus = "draft" | "active" | "archived";

export type Cohort = {
  id: string;
  packId: string;
  label: string;
  kind: CohortKind;
  eligibilityHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: CohortStatus;
  notes: string;
  createdAt: string;
};

export type ExposureStatus = "draft" | "open" | "scored" | "archived";

export type Exposure = {
  id: string;
  packId?: string;
  label: string;
  regimen: string;
  lockCondition: string;
  signalChannel: string;
  status: ExposureStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type SignalRun = {
  id: string;
  exposureId: string;
  cohortId: string;
  cohortCoverage: number;
  exposureFidelity: number;
  confounderControl: number;
  packCompleteness: number;
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
  defaultSignalBias: SignalBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type PvCausalCompare = {
  id: string;
  name: string;
  exposureId: string;
  cohortId: string;
  runId: string;
  input: PvCausalInput;
  targetTrial: PvCausalQuality;
  spontaneous: PvCausalQuality;
  winner:
    | "target_trial_causal_signal"
    | "spontaneous_reporting_baseline"
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
  packs: PvPack[];
  cohorts: Cohort[];
  exposures: Exposure[];
  runs: SignalRun[];
  audits: AuditEvent[];
  compares: PvCausalCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __pvCausalStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const cohortId = "cohort-demo";
  const exposureId = "exposure-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Pv Causal Org",
      webhookUrl: "",
      webhookSecret: "pv-causal-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultSignalBias: "balanced",
      defaultMode: "target_trial_causal_signal",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@pv-causal.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Atorvastatin Initiation Soft-Sim Pack",
        version: "2026.1",
        signalFocus:
          "Target-trial causal soft-sim vs spontaneous-reporting baseline",
        cohortBudget: 36,
        status: "active",
        notes:
          "Seed pack for target-trial vs spontaneous-reporting PV soft-sim",
        createdAt: now(),
      },
    ],
    cohorts: [
      {
        id: cohortId,
        packId,
        label: "Medicare initiator cohort",
        kind: "medicare_initiators",
        eligibilityHint:
          "cohort_coverage,confounder_control,exposure_fidelity,pack_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Cohort, exposure, causal control, and completeness for PV soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim defined population — not regulatory submission / not live claims write-back",
        createdAt: now(),
      },
    ],
    exposures: [
      {
        id: exposureId,
        packId,
        label: "Atorvastatin new-user exposure",
        regimen:
          "Comparative target-trial soft-sim (causal signal vs tip-line baseline)",
        lockCondition: "lock_soft_sim",
        signalChannel: "soft_sim_pv_causal_signal",
        status: "scored",
        notes: "Seed exposure for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        exposureId,
        cohortId,
        cohortCoverage: 0.62,
        exposureFidelity: 0.7,
        confounderControl: 0.74,
        packCompleteness: 0.68,
        runNotes:
          "Target-trial looks strong but spontaneous-reporting baseline still leads on tip-line volume",
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
        detail: "Demo pack, cohorts, exposures, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pvCausalStore) g.__pvCausalStore = seed();
  return g.__pvCausalStore;
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
  g.__pvCausalStore = seed();
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
  if (patch.defaultSignalBias !== undefined) {
    org.defaultSignalBias = patch.defaultSignalBias;
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
  items: PvPack[];
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
        p.signalFocus.toLowerCase().includes(q) ||
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
  signalFocus: string;
  cohortBudget?: number;
  notes?: string;
}): PvPack {
  const pack: PvPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    signalFocus: input.signalFocus,
    cohortBudget: input.cohortBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): PvPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listCohorts(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Cohort[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().cohorts];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.eligibilityHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCohort(input: {
  packId: string;
  label: string;
  kind: CohortKind;
  eligibilityHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): Cohort | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Cohort = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    eligibilityHint: input.eligibilityHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().cohorts.unshift(row);
  audit("evaluator", "cohort.create", row.label);
  return row;
}

export function archiveCohort(id: string): Cohort | null {
  const row = state().cohorts.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "cohort.archive", id);
  return row;
}

export function listExposures(opts?: {
  q?: string;
  signalChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Exposure[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().exposures];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.regimen.toLowerCase().includes(q) ||
        c.signalChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.signalChannel) {
    items = items.filter((c) => c.signalChannel === opts.signalChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createExposure(input: {
  packId?: string;
  label: string;
  regimen: string;
  lockCondition: string;
  signalChannel: string;
  notes?: string;
}): Exposure {
  const row: Exposure = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    regimen: input.regimen,
    lockCondition: input.lockCondition,
    signalChannel: input.signalChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().exposures.unshift(row);
  audit("evaluator", "exposure.create", row.label);
  return row;
}

export function archiveExposure(id: string): Exposure | null {
  const row = state().exposures.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "exposure.archive", id);
  return row;
}

export function listRuns(opts?: {
  exposureId?: string;
  cohortId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SignalRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.exposureId) {
    items = items.filter((r) => r.exposureId === opts.exposureId);
  }
  if (opts?.cohortId) {
    items = items.filter((r) => r.cohortId === opts.cohortId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  exposureId: string;
  cohortId: string;
  cohortCoverage: number;
  exposureFidelity: number;
  confounderControl: number;
  packCompleteness: number;
  runNotes?: string;
}): SignalRun | null {
  if (!state().exposures.some((c) => c.id === input.exposureId)) {
    return null;
  }
  if (!state().cohorts.some((m) => m.id === input.cohortId)) {
    return null;
  }
  const run: SignalRun = {
    id: randomUUID(),
    exposureId: input.exposureId,
    cohortId: input.cohortId,
    cohortCoverage: clamp(input.cohortCoverage, 0, 1),
    exposureFidelity: clamp(input.exposureFidelity, 0, 1),
    confounderControl: clamp(input.confounderControl, 0, 1),
    packCompleteness: clamp(input.packCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().exposures.find((c) => c.id === input.exposureId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): PvCausalCompare[] {
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
    default: {
      const _exhaustive: string = label;
      void _exhaustive;
      return 0.55;
    }
  }
}

export function runCompare(input: {
  name: string;
  exposureId: string;
  cohortId: string;
  runId: string;
  signalBias?: SignalBias;
  bias?: SignalBias;
  spontaneousVolume?: number;
  tipLineOptimism?: number;
  trialHardness?: number;
  overclaimRisk?: number;
}): PvCausalCompare | null {
  const exposure = state().exposures.find((c) => c.id === input.exposureId);
  const cohort = state().cohorts.find((m) => m.id === input.cohortId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!exposure || !cohort || !run) return null;

  const goldWeight = outcomeWeight(String(exposure.lockCondition));
  const span = Math.max(0.05, cohort.hardnessMax - cohort.hardnessMin);
  const pvInput: PvCausalInput = {
    cohortCoverage: clamp(run.cohortCoverage, 0, 1),
    exposureFidelity: clamp(run.exposureFidelity, 0, 1),
    confounderControl: clamp(run.confounderControl, 0, 1),
    packCompleteness: clamp((run.packCompleteness + goldWeight) / 2, 0, 1),
    spontaneousVolume: input.spontaneousVolume ?? 0.82,
    tipLineOptimism: input.tipLineOptimism ?? 0.7,
    trialHardness: input.trialHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    signalBias:
      input.signalBias ?? input.bias ?? state().org.defaultSignalBias,
    profile: "target_trial_causal_signal",
  };

  const targetTrial = scoreTargetTrialCausalSignal({
    ...pvInput,
    profile: "target_trial_causal_signal",
  });
  const spontaneous = scoreSpontaneousReportingBaseline({
    ...pvInput,
    profile: "spontaneous_reporting_baseline",
  });
  const gap = Math.abs(targetTrial.overall - spontaneous.overall);
  let winner: PvCausalCompare["winner"] = "tie";
  if (targetTrial.overall > spontaneous.overall + 0.5) {
    winner = "target_trial_causal_signal";
  } else if (spontaneous.overall > targetTrial.overall + 0.5) {
    winner = "spontaneous_reporting_baseline";
  }

  const compare: PvCausalCompare = {
    id: randomUUID(),
    name: input.name,
    exposureId: exposure.id,
    cohortId: cohort.id,
    runId: run.id,
    input: pvInput,
    targetTrial,
    spontaneous,
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

export function getScoreboard(): PvCausalCompare[] {
  return [...state().compares].sort(
    (a, b) => b.targetTrial.overall - a.targetTrial.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      cohorts: state().cohorts,
      exposures: state().exposures,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,targetTrialOverall,spontaneousOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.targetTrial.overall},${c.spontaneous.overall},${c.createdAt}`,
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
    { id: "pv-packs", name: "Pv pack / signals registry" },
    { id: "pack-versions", name: "Versioned pv packs" },
    { id: "cohorts", name: "Cohort configs" },
    { id: "cohort-editor", name: "Cohort / eligibility editor" },
    { id: "cohort-search", name: "Cohort search and filter" },
    { id: "seed-packs", name: "Seed pv packs" },
    { id: "exposures", name: "Exposure registry" },
    { id: "exposure-filters", name: "Exposure filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "signal-runs", name: "Signal soft-sim runs" },
    { id: "signal-bias", name: "Signal bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Target-trial causal vs spontaneous-reporting baseline compare",
    },
    { id: "delta-view", name: "Causal delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not regulatory / not live claims write-back / not FDA / not authors' system",
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

export function scorePreview(input: PvCausalInput): {
  targetTrial: PvCausalQuality;
  spontaneous: PvCausalQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const targetTrial = scoreTargetTrialCausalSignal({
    ...input,
    profile: "target_trial_causal_signal",
  });
  const spontaneous = scoreSpontaneousReportingBaseline({
    ...input,
    profile: "spontaneous_reporting_baseline",
  });
  return {
    targetTrial,
    spontaneous,
    readiness: readinessFromQuality(targetTrial.overall),
  };
}
