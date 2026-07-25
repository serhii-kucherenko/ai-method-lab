import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMultiDomainLatentTrajectory,
  scoreSingleDomainBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type PathBias,
  type PredictorKind,
  type ScoreMode,
  type CohortKind,
  type LatentPathInput,
  type LatentPathQuality,
} from "./domain/types";

export type {
  PathBias,
  PredictorKind,
  ScoreMode,
  CohortKind,
  LatentPathInput,
  LatentPathQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CohortPack = {
  id: string;
  label: string;
  version: string;
  studyFocus: string;
  sessionBudget: number;
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
  regionHint: string;
  waveCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: CohortStatus;
  notes: string;
  createdAt: string;
};

export type PredictorStatus = "draft" | "active" | "archived";

export type Predictor = {
  id: string;
  packId: string;
  label: string;
  kind: PredictorKind;
  fidelityHint: string;
  featureCount: number;
  severityFloor: number;
  metricHint: string;
  status: PredictorStatus;
  notes: string;
  createdAt: string;
};

export type OutcomeStatus = "draft" | "open" | "scored" | "archived";

export type OutcomeBatch = {
  id: string;
  packId?: string;
  label: string;
  captureNotes: string;
  lockCondition: string;
  outcomeChannel: string;
  status: OutcomeStatus;
  notes: string;
  createdAt: string;
};

export type TrajectoryStatus = "draft" | "active" | "archived";

export type TrajectoryClass = {
  id: string;
  outcomeId: string;
  cohortId: string;
  predictorId: string;
  multiDomainCoverage: number;
  jointClassClarity: number;
  trajectorySeparation: number;
  packReadiness: number;
  runNotes: string;
  status: TrajectoryStatus;
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
  defaultPathBias: PathBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type LatentPathCompare = {
  id: string;
  name: string;
  outcomeId: string;
  cohortId: string;
  predictorId: string;
  trajectoryId: string;
  input: LatentPathInput;
  multiDomain: LatentPathQuality;
  singleDomain: LatentPathQuality;
  winner:
    | "multi_domain_latent_trajectory"
    | "single_domain_baseline"
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
  packs: CohortPack[];
  cohorts: Cohort[];
  predictors: Predictor[];
  outcomes: OutcomeBatch[];
  trajectories: TrajectoryClass[];
  auditEvents: AuditEvent[];
  compares: LatentPathCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __latentPathStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const cohortId = "cohort-demo";
  const predictorId = "predictor-demo";
  const outcomeId = "outcome-demo";
  const trajectoryId = "trajectory-demo";
  return {
    org: {
      name: "Latent Path Org",
      webhookUrl: "",
      webhookSecret: "latent-path-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPathBias: "balanced",
      defaultMode: "multi_domain_latent_trajectory",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@latent-path.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Adolescent Latent Path Soft-Sim Pack",
        version: "2026.1",
        studyFocus:
          "Multi-domain latent trajectory vs single-domain baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for multi-domain latent paths vs single-domain soft-sim",
        createdAt: now(),
      },
    ],
    cohorts: [
      {
        id: cohortId,
        packId,
        label: "School + clinic adolescent cohort",
        kind: "school",
        regionHint: "multi_wave,school_clinic,adolescent",
        waveCount: 4,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint:
          "Wave coverage and domain span for latent path soft-sim",
        status: "active",
        notes:
          "Soft-sim cohorts — not clinical diagnostic / not crisis intervention",
        createdAt: now(),
      },
    ],
    predictors: [
      {
        id: predictorId,
        packId,
        label: "Joint symptom predictor set",
        kind: "joint_set",
        fidelityHint: "internalizing,externalizing,psychotic_like",
        featureCount: 12,
        severityFloor: 0.35,
        metricHint: "Predictor fidelity and domain-noise controls",
        status: "active",
        notes:
          "Soft-sim predictors — not suicide-risk clearance / not EHR write-back",
        createdAt: now(),
      },
    ],
    outcomes: [
      {
        id: outcomeId,
        packId,
        label: "Outcome batch",
        captureNotes: "Follow-up outcomes under dual path methods",
        lockCondition: "lock_soft_sim",
        outcomeChannel: "soft_sim_latent_path",
        status: "scored",
        notes: "Seed outcome batch for demo compare",
        createdAt: now(),
      },
    ],
    trajectories: [
      {
        id: trajectoryId,
        outcomeId,
        cohortId,
        predictorId,
        multiDomainCoverage: 0.62,
        jointClassClarity: 0.7,
        trajectorySeparation: 0.74,
        packReadiness: 0.68,
        runNotes:
          "Multi-domain looks strong but single-domain still leads when joint classes are thin",
        status: "active",
        createdAt: now(),
      },
    ],
    auditEvents: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail:
          "Demo pack, cohorts, predictors, outcomes, and trajectory seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__latentPathStore) g.__latentPathStore = seed();
  return g.__latentPathStore;
}

function audit(actor: string, action: string, detail: string): void {
  state().auditEvents.unshift({
    id: randomUUID(),
    at: now(),
    actor,
    action,
    detail,
  });
}

export function resetStore(): void {
  g.__latentPathStore = seed();
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
  if (patch.defaultPathBias !== undefined) {
    org.defaultPathBias = patch.defaultPathBias;
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
  items: CohortPack[];
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
        p.studyFocus.toLowerCase().includes(q) ||
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
  studyFocus: string;
  sessionBudget?: number;
  notes?: string;
}): CohortPack {
  const pack: CohortPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    studyFocus: input.studyFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CohortPack | null {
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
        m.regionHint.toLowerCase().includes(q) ||
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
  regionHint: string;
  waveCount: number;
  coverageMin: number;
  coverageMax: number;
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
    regionHint: input.regionHint,
    waveCount: input.waveCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
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

export function listPredictors(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Predictor[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().predictors];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.fidelityHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPredictor(input: {
  packId: string;
  label: string;
  kind: PredictorKind;
  fidelityHint: string;
  featureCount: number;
  severityFloor: number;
  metricHint?: string;
  notes?: string;
}): Predictor | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Predictor = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    fidelityHint: input.fidelityHint,
    featureCount: input.featureCount,
    severityFloor: input.severityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().predictors.unshift(row);
  audit("evaluator", "predictor.create", row.label);
  return row;
}

export function archivePredictor(id: string): Predictor | null {
  const row = state().predictors.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "predictor.archive", id);
  return row;
}

export function listOutcomes(opts?: {
  q?: string;
  outcomeChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: OutcomeBatch[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().outcomes];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.captureNotes.toLowerCase().includes(q) ||
        c.outcomeChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.outcomeChannel) {
    items = items.filter((c) => c.outcomeChannel === opts.outcomeChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createOutcome(input: {
  packId?: string;
  label: string;
  captureNotes: string;
  lockCondition: string;
  outcomeChannel: string;
  notes?: string;
}): OutcomeBatch {
  const row: OutcomeBatch = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    captureNotes: input.captureNotes,
    lockCondition: input.lockCondition,
    outcomeChannel: input.outcomeChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().outcomes.unshift(row);
  audit("evaluator", "outcome.create", row.label);
  return row;
}

export function archiveOutcome(id: string): OutcomeBatch | null {
  const row = state().outcomes.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "outcome.archive", id);
  return row;
}

export function listTrajectories(opts?: {
  outcomeId?: string;
  cohortId?: string;
  predictorId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TrajectoryClass[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().trajectories];
  if (opts?.outcomeId) {
    items = items.filter((r) => r.outcomeId === opts.outcomeId);
  }
  if (opts?.cohortId) {
    items = items.filter((r) => r.cohortId === opts.cohortId);
  }
  if (opts?.predictorId) {
    items = items.filter((r) => r.predictorId === opts.predictorId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTrajectory(input: {
  outcomeId: string;
  cohortId: string;
  predictorId: string;
  multiDomainCoverage: number;
  jointClassClarity: number;
  trajectorySeparation: number;
  packReadiness: number;
  runNotes?: string;
}): TrajectoryClass | null {
  if (!state().outcomes.some((c) => c.id === input.outcomeId)) {
    return null;
  }
  if (!state().cohorts.some((m) => m.id === input.cohortId)) {
    return null;
  }
  if (!state().predictors.some((m) => m.id === input.predictorId)) {
    return null;
  }
  const run: TrajectoryClass = {
    id: randomUUID(),
    outcomeId: input.outcomeId,
    cohortId: input.cohortId,
    predictorId: input.predictorId,
    multiDomainCoverage: clamp(input.multiDomainCoverage, 0, 1),
    jointClassClarity: clamp(input.jointClassClarity, 0, 1),
    trajectorySeparation: clamp(input.trajectorySeparation, 0, 1),
    packReadiness: clamp(input.packReadiness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().trajectories.unshift(run);
  const row = state().outcomes.find((c) => c.id === input.outcomeId);
  if (row) row.status = "scored";
  audit("evaluator", "trajectory.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): LatentPathCompare[] {
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
  outcomeId: string;
  cohortId: string;
  predictorId: string;
  trajectoryId: string;
  pathBias?: PathBias;
  bias?: PathBias;
  singleDomainAdherence?: number;
  domainIsolation?: number;
  predictorNoise?: number;
  overclaimRisk?: number;
}): LatentPathCompare | null {
  const outcome = state().outcomes.find((c) => c.id === input.outcomeId);
  const cohort = state().cohorts.find((m) => m.id === input.cohortId);
  const predictor = state().predictors.find((m) => m.id === input.predictorId);
  const trajectory = state().trajectories.find(
    (r) => r.id === input.trajectoryId,
  );
  if (!outcome || !cohort || !predictor || !trajectory) return null;

  const goldWeight = outcomeWeight(String(outcome.lockCondition));
  const span = Math.max(0.05, cohort.coverageMax - cohort.coverageMin);
  const lpInput: LatentPathInput = {
    multiDomainCoverage: clamp(trajectory.multiDomainCoverage, 0, 1),
    jointClassClarity: clamp(trajectory.jointClassClarity, 0, 1),
    trajectorySeparation: clamp(trajectory.trajectorySeparation, 0, 1),
    packReadiness: clamp((trajectory.packReadiness + goldWeight) / 2, 0, 1),
    singleDomainAdherence: input.singleDomainAdherence ?? 0.82,
    domainIsolation: input.domainIsolation ?? 0.7,
    predictorNoise: input.predictorNoise ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    pathBias: input.pathBias ?? input.bias ?? state().org.defaultPathBias,
    profile: "multi_domain_latent_trajectory",
  };

  const multiDomain = scoreMultiDomainLatentTrajectory({
    ...lpInput,
    profile: "multi_domain_latent_trajectory",
  });
  const singleDomain = scoreSingleDomainBaseline({
    ...lpInput,
    profile: "single_domain_baseline",
  });
  const gap = Math.abs(multiDomain.overall - singleDomain.overall);
  let winner: LatentPathCompare["winner"] = "tie";
  if (multiDomain.overall > singleDomain.overall + 0.5) {
    winner = "multi_domain_latent_trajectory";
  } else if (singleDomain.overall > multiDomain.overall + 0.5) {
    winner = "single_domain_baseline";
  }

  const compare: LatentPathCompare = {
    id: randomUUID(),
    name: input.name,
    outcomeId: outcome.id,
    cohortId: cohort.id,
    predictorId: predictor.id,
    trajectoryId: trajectory.id,
    input: lpInput,
    multiDomain,
    singleDomain,
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

export function getScoreboard(): LatentPathCompare[] {
  return [...state().compares].sort(
    (a, b) => b.multiDomain.overall - a.multiDomain.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      cohorts: state().cohorts,
      predictors: state().predictors,
      outcomes: state().outcomes,
      trajectories: state().trajectories,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,multiDomainOverall,singleDomainOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.multiDomain.overall},${c.singleDomain.overall},${c.createdAt}`,
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
    { id: "cohort-packs", name: "Cohort pack registry" },
    { id: "pack-versions", name: "Versioned cohort packs" },
    { id: "cohorts", name: "Cohort configs" },
    { id: "cohort-editor", name: "Multi-wave cohort editor" },
    { id: "cohort-search", name: "Cohort search and filter" },
    { id: "predictors", name: "Predictor configs" },
    { id: "predictor-editor", name: "Joint predictor editor" },
    { id: "outcomes", name: "Outcome batch registry" },
    { id: "outcome-filters", name: "Outcome filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "trajectories", name: "Trajectory class soft-sim runs" },
    { id: "path-bias", name: "Path bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Multi-domain latent trajectory vs single-domain compare",
    },
    { id: "delta-view", name: "Path delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not clinical / not crisis / not EHR write-back / not suicide-risk clearance",
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

export function scorePreview(input: LatentPathInput): {
  multiDomain: LatentPathQuality;
  singleDomain: LatentPathQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const multiDomain = scoreMultiDomainLatentTrajectory({
    ...input,
    profile: "multi_domain_latent_trajectory",
  });
  const singleDomain = scoreSingleDomainBaseline({
    ...input,
    profile: "single_domain_baseline",
  });
  return {
    multiDomain,
    singleDomain,
    readiness: readinessFromQuality(multiDomain.overall),
  };
}
