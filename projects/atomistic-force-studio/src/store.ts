import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreFoundationModelAtomistics,
  scoreClassicalForceFieldBaseline,
} from "./domain/force";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ForceKind,
  type ForceBias,
  type ScoreMode,
  type ForceInput,
  type ForceQuality,
} from "./domain/types";

export type {
  ForceKind,
  ForceBias,
  ScoreMode,
  ForceInput,
  ForceQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type SimPack = {
  id: string;
  label: string;
  version: string;
  chemTarget: string;
  forceBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ForceStatus = "draft" | "active" | "archived";

export type ForceConfig = {
  id: string;
  packId: string;
  label: string;
  kind: ForceKind;
  terms: string;
  termCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: ForceStatus;
  notes: string;
  createdAt: string;
};

export type TrajectoryStatus = "draft" | "open" | "scored" | "archived";

export type Trajectory = {
  id: string;
  packId?: string;
  label: string;
  trajectoryText: string;
  successCondition: string;
  trajectoryChannel: string;
  status: TrajectoryStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type AtomRun = {
  id: string;
  trajectoryId: string;
  forceId: string;
  packCoverage: number;
  fmFidelity: number;
  forceClarity: number;
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
  defaultForceBias: ForceBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ForceCompare = {
  id: string;
  name: string;
  trajectoryId: string;
  forceId: string;
  runId: string;
  input: ForceInput;
  foundation: ForceQuality;
  classicalBaseline: ForceQuality;
  winner:
    | "foundation_model_atomistics"
    | "classical_force_field_baseline"
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
  packs: SimPack[];
  forces: ForceConfig[];
  trajectories: Trajectory[];
  runs: AtomRun[];
  audits: AuditEntry[];
  compares: ForceCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __atomisticForceStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const forceId = "force-demo";
  const trajectoryId = "trajectory-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Atomistic Force Org",
      webhookUrl: "",
      webhookSecret: "atomistic-force-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultForceBias: "balanced",
      defaultMode: "foundation_model_atomistics",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@atomistic-force.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Kinase Pocket Reactive Soft-Sim Pack",
        version: "2026.1",
        chemTarget: "Kinase hinge — reactive soft-sim atomistics",
        forceBudget: 36,
        status: "active",
        notes: "Seed pack for FM atomistics vs classical FF compare",
        createdAt: now(),
      },
    ],
    forces: [
      {
        id: forceId,
        packId,
        label: "FeNNix-style FM reactive force",
        kind: "reactive_fm",
        terms: "bond,angle,dihedral,reactive_pair",
        termCount: 4,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint: "Foundation-model atomistics under soft-sim honesty",
        status: "active",
        notes: "Soft-sim force — not DFT-validated",
        createdAt: now(),
      },
    ],
    trajectories: [
      {
        id: trajectoryId,
        packId,
        label: "Reactive bond-break trajectory gate",
        trajectoryText:
          "Does foundation-model atomistics catch reactive bond events before classical FF?",
        successCondition: "lock_soft_sim",
        trajectoryChannel: "soft_sim_reactive",
        status: "scored",
        notes: "Seed trajectory for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        trajectoryId,
        forceId,
        packCoverage: 0.62,
        fmFidelity: 0.7,
        forceClarity: 0.74,
        runStability: 0.68,
        reviewerNotes:
          "FM force looks trustworthy but classical FF drifts under hard reactive steps",
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
        detail: "Demo pack, force, trajectory, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__atomisticForceStore) g.__atomisticForceStore = seed();
  return g.__atomisticForceStore;
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
  g.__atomisticForceStore = seed();
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
  if (patch.defaultForceBias !== undefined) {
    org.defaultForceBias = patch.defaultForceBias;
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
  items: SimPack[];
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
        p.chemTarget.toLowerCase().includes(q) ||
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
  chemTarget: string;
  forceBudget?: number;
  notes?: string;
}): SimPack {
  const pack: SimPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    chemTarget: input.chemTarget,
    forceBudget: input.forceBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): SimPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listForces(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ForceConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().forces];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.terms.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createForce(input: {
  packId: string;
  label: string;
  kind: ForceKind;
  terms: string;
  termCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): ForceConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const force: ForceConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    terms: input.terms,
    termCount: input.termCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().forces.unshift(force);
  audit("evaluator", "force.create", force.label);
  return force;
}

export function archiveForce(id: string): ForceConfig | null {
  const force = state().forces.find((m) => m.id === id);
  if (!force) return null;
  force.status = "archived";
  audit("evaluator", "force.archive", id);
  return force;
}

export function listTrajectories(opts?: {
  q?: string;
  trajectoryChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Trajectory[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().trajectories];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.trajectoryText.toLowerCase().includes(q) ||
        c.trajectoryChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.trajectoryChannel) {
    items = items.filter((c) => c.trajectoryChannel === opts.trajectoryChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTrajectory(input: {
  packId?: string;
  label: string;
  trajectoryText: string;
  successCondition: string;
  trajectoryChannel: string;
  notes?: string;
}): Trajectory {
  const trajectory: Trajectory = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    trajectoryText: input.trajectoryText,
    successCondition: input.successCondition,
    trajectoryChannel: input.trajectoryChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().trajectories.unshift(trajectory);
  audit("evaluator", "trajectory.create", trajectory.label);
  return trajectory;
}

export function archiveTrajectory(id: string): Trajectory | null {
  const trajectory = state().trajectories.find((c) => c.id === id);
  if (!trajectory) return null;
  trajectory.status = "archived";
  audit("evaluator", "trajectory.archive", id);
  return trajectory;
}

export function listRuns(opts?: {
  trajectoryId?: string;
  forceId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AtomRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.trajectoryId) {
    items = items.filter((r) => r.trajectoryId === opts.trajectoryId);
  }
  if (opts?.forceId) {
    items = items.filter((r) => r.forceId === opts.forceId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  trajectoryId: string;
  forceId: string;
  packCoverage: number;
  fmFidelity: number;
  forceClarity: number;
  runStability: number;
  reviewerNotes?: string;
}): AtomRun | null {
  if (!state().trajectories.some((c) => c.id === input.trajectoryId)) {
    return null;
  }
  if (!state().forces.some((m) => m.id === input.forceId)) return null;
  const run: AtomRun = {
    id: randomUUID(),
    trajectoryId: input.trajectoryId,
    forceId: input.forceId,
    packCoverage: clamp(input.packCoverage, 0, 1),
    fmFidelity: clamp(input.fmFidelity, 0, 1),
    forceClarity: clamp(input.forceClarity, 0, 1),
    runStability: clamp(input.runStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const trajectory = state().trajectories.find(
    (c) => c.id === input.trajectoryId,
  );
  if (trajectory) trajectory.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ForceCompare[] {
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
  trajectoryId: string;
  forceId: string;
  runId: string;
  forceBias?: ForceBias;
  bias?: ForceBias;
  classicalFfRate?: number;
  ffOptimism?: number;
  reactionHardness?: number;
  overclaimRisk?: number;
}): ForceCompare | null {
  const trajectory = state().trajectories.find(
    (c) => c.id === input.trajectoryId,
  );
  const force = state().forces.find((m) => m.id === input.forceId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!trajectory || !force || !run) return null;

  const goldWeight = outcomeWeight(String(trajectory.successCondition));
  const span = Math.max(0.05, force.coverageMax - force.coverageMin);
  const forceInput: ForceInput = {
    packCoverage: clamp(run.packCoverage, 0, 1),
    fmFidelity: clamp(run.fmFidelity, 0, 1),
    forceClarity: clamp(run.forceClarity, 0, 1),
    runStability: clamp((run.runStability + goldWeight) / 2, 0, 1),
    classicalFfRate: input.classicalFfRate ?? 0.82,
    ffOptimism: input.ffOptimism ?? 0.7,
    reactionHardness:
      input.reactionHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    forceBias: input.forceBias ?? input.bias ?? state().org.defaultForceBias,
    profile: "foundation_model_atomistics",
  };

  const foundation = scoreFoundationModelAtomistics({
    ...forceInput,
    profile: "foundation_model_atomistics",
  });
  const classicalBaseline = scoreClassicalForceFieldBaseline({
    ...forceInput,
    profile: "classical_force_field_baseline",
  });
  const gap = Math.abs(foundation.overall - classicalBaseline.overall);
  let winner: ForceCompare["winner"] = "tie";
  if (foundation.overall > classicalBaseline.overall + 0.5) {
    winner = "foundation_model_atomistics";
  } else if (classicalBaseline.overall > foundation.overall + 0.5) {
    winner = "classical_force_field_baseline";
  }

  const compare: ForceCompare = {
    id: randomUUID(),
    name: input.name,
    trajectoryId: trajectory.id,
    forceId: force.id,
    runId: run.id,
    input: forceInput,
    foundation,
    classicalBaseline,
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

export function getScoreboard(): ForceCompare[] {
  return [...state().compares].sort(
    (a, b) => b.foundation.overall - a.foundation.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      forces: state().forces,
      trajectories: state().trajectories,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,foundationOverall,baselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.foundation.overall},${c.classicalBaseline.overall},${c.createdAt}`,
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
    { id: "sim-packs", name: "Sim pack registry" },
    { id: "pack-versions", name: "Versioned sim packs" },
    { id: "force-configs", name: "Foundation-model force configs" },
    { id: "force-editor", name: "Force term / coverage editor" },
    { id: "force-search", name: "Force search and filter" },
    { id: "seed-packs", name: "Seed sim packs" },
    { id: "trajectories", name: "Trajectory workspace" },
    { id: "trajectory-filters", name: "Trajectory filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "atom-runs", name: "Atomistic soft-sim runs" },
    { id: "force-bias", name: "Force bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "FM atomistics vs classical FF compare" },
    { id: "delta-view", name: "Force delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not DFT / not HPC notes" },
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

export function scorePreview(input: ForceInput): {
  foundation: ForceQuality;
  classicalBaseline: ForceQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const foundation = scoreFoundationModelAtomistics({
    ...input,
    profile: "foundation_model_atomistics",
  });
  const classicalBaseline = scoreClassicalForceFieldBaseline({
    ...input,
    profile: "classical_force_field_baseline",
  });
  return {
    foundation,
    classicalBaseline,
    readiness: readinessFromQuality(foundation.overall),
  };
}
