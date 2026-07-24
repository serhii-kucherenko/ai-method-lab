import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreImputationFree,
  scoreImputeThenPredict,
} from "./domain/predict";
import {
  readinessFromQuality,
  type CohortModality,
  type PlanKind,
  type PredictInput,
  type PredictQuality,
  type ScoreMode,
  type UncertaintyReadiness,
} from "./domain/types";

export type {
  CohortModality,
  PlanKind,
  PredictInput,
  PredictQuality,
  ScoreMode,
  UncertaintyReadiness,
};

export type MemberRole = "owner" | "analyst" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PatientCohort = {
  id: string;
  name: string;
  modality: CohortModality;
  size: number;
  missingnessRate: number;
  notes: string;
  createdAt: string;
};

export type SnapshotStatus = "draft" | "reviewed" | "locked" | "archived";

export type FeatureSnapshot = {
  id: string;
  cohortId: string;
  name: string;
  status: SnapshotStatus;
  missingnessRate: number;
  maskQuality: number;
  featureCount: number;
  notes: string;
  createdAt: string;
};

export type RunStatus = "queued" | "running" | "complete" | "failed";

export type PredictRun = {
  id: string;
  cohortId: string;
  name: string;
  status: RunStatus;
  plan: PlanKind;
  calibrationPrior: number;
  notes: string;
  createdAt: string;
};

export type BandStatus = "draft" | "reviewed" | "accepted" | "rejected";

export type UncertaintyBand = {
  id: string;
  runId: string;
  name: string;
  status: BandStatus;
  lower: number;
  upper: number;
  coverageTarget: number;
  notes: string;
  createdAt: string;
};

export type ExplanationNote = {
  id: string;
  runId: string;
  name: string;
  salienceFeature: string;
  salienceScore: number;
  notes: string;
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
  defaultPlan: PlanKind;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  cohortId: string;
  input: PredictInput;
  imputationFree: PredictQuality;
  imputeThenPredict: PredictQuality;
  winner: "imputation_free" | "impute_then_predict" | "tie";
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
  cohorts: PatientCohort[];
  snapshots: FeatureSnapshot[];
  runs: PredictRun[];
  bands: UncertaintyBand[];
  explanations: ExplanationNote[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __apsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): PredictInput {
  return {
    ageNorm: 0.72,
    cognitiveDecline: 0.68,
    imagingSignal: 0.64,
    biomarkerSignal: 0.7,
    missingnessRate: 0.28,
    missingnessMaskQuality: 0.82,
    calibrationPrior: 0.74,
    featureCompleteness: 0.66,
    temporalSpan: 0.7,
    comorbidityLoad: 0.24,
    modality: "mixed",
    plan: "imputation_free",
  };
}

function seed(): StoreState {
  const cohortId = "coh-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Alzheimer Predict Org",
      webhookUrl: "",
      webhookSecret: "aps-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "imputation_free",
      defaultMode: "imputation_free",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@alzheimer-predict.local", role: "owner" },
      { id: "m2", email: "analyst@alzheimer-predict.local", role: "analyst" },
      { id: "m3", email: "viewer@alzheimer-predict.local", role: "viewer" },
    ],
    cohorts: [
      {
        id: cohortId,
        name: "Memory clinic mixed cohort · demo",
        modality: "mixed",
        size: 420,
        missingnessRate: 0.28,
        notes: "Demo cohort — simulated AD-risk features only",
        createdAt: now(),
      },
      {
        id: "coh-demo-2",
        name: "Imaging-heavy research panel",
        modality: "imaging",
        size: 180,
        missingnessRate: 0.35,
        notes: "Higher missing tabular biomarkers",
        createdAt: now(),
      },
    ],
    snapshots: [
      {
        id: "snap-demo",
        cohortId,
        name: "Baseline missingness mask",
        status: "reviewed",
        missingnessRate: 0.28,
        maskQuality: 0.84,
        featureCount: 48,
        notes: "Observed missingness mask for imputation-free path",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        cohortId,
        name: "Imputation-free AD risk · demo",
        status: "complete",
        plan: "imputation_free",
        calibrationPrior: 0.76,
        notes: "Demo run with calibrated uncertainty",
        createdAt: now(),
      },
    ],
    bands: [
      {
        id: "band-demo",
        runId,
        name: "90% calibrated band",
        status: "accepted",
        lower: 0.22,
        upper: 0.61,
        coverageTarget: 0.9,
        notes: "Demo uncertainty band — widened with missingness",
        createdAt: now(),
      },
    ],
    explanations: [
      {
        id: "exp-demo",
        runId,
        name: "Cognitive + imaging salience",
        salienceFeature: "cognitive_decline",
        salienceScore: 0.78,
        notes: "Top salience under observed missingness",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo cohorts, features, models, uncertainty, explanations loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__apsStore) g.__apsStore = seed();
  return g.__apsStore;
}

export function resetStore(): void {
  g.__apsStore = seed();
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

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  Object.assign(state().org, patch);
  audit("owner", "settings.update", JSON.stringify(patch));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole): Member {
  const m: Member = { id: randomUUID(), email, role };
  state().members.push(m);
  audit("owner", "member.invite", `${email} as ${role}`);
  return m;
}

export function listCohorts(
  q?: string,
  page = 1,
  pageSize = 50,
): {
  items: PatientCohort[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().cohorts].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.modality.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  const total = rows.length;
  const start = Math.max(0, (page - 1) * pageSize);
  return {
    items: rows.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
}

export function createCohort(input: {
  name: string;
  modality: CohortModality;
  size: number;
  missingnessRate: number;
  notes?: string;
}): PatientCohort {
  const row: PatientCohort = {
    id: randomUUID(),
    name: input.name.trim(),
    modality: input.modality,
    size: Math.max(10, Math.min(50_000, Math.round(input.size))),
    missingnessRate: Math.max(0, Math.min(1, input.missingnessRate)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().cohorts.unshift(row);
  audit("analyst", "cohort.create", row.name);
  return row;
}

export function getCohort(id: string): PatientCohort | undefined {
  return state().cohorts.find((d) => d.id === id);
}

export function listSnapshots(cohortId?: string, q?: string): FeatureSnapshot[] {
  let rows = [...state().snapshots];
  if (cohortId) rows = rows.filter((r) => r.cohortId === cohortId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSnapshot(input: {
  cohortId: string;
  name: string;
  status?: SnapshotStatus;
  missingnessRate?: number;
  maskQuality?: number;
  featureCount?: number;
  notes?: string;
}): FeatureSnapshot {
  if (!getCohort(input.cohortId)) throw new Error("cohort_not_found");
  const row: FeatureSnapshot = {
    id: randomUUID(),
    cohortId: input.cohortId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    missingnessRate: Math.max(0, Math.min(1, input.missingnessRate ?? 0.3)),
    maskQuality: Math.max(0, Math.min(1, input.maskQuality ?? 0.7)),
    featureCount: Math.max(1, Math.round(input.featureCount ?? 40)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().snapshots.unshift(row);
  audit("analyst", "snapshot.create", row.name);
  return row;
}

export function listRuns(cohortId?: string, q?: string): PredictRun[] {
  let rows = [...state().runs];
  if (cohortId) rows = rows.filter((r) => r.cohortId === cohortId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle) ||
        r.plan.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createRun(input: {
  cohortId: string;
  name: string;
  status?: RunStatus;
  plan?: PlanKind;
  calibrationPrior?: number;
  notes?: string;
}): PredictRun {
  if (!getCohort(input.cohortId)) throw new Error("cohort_not_found");
  const row: PredictRun = {
    id: randomUUID(),
    cohortId: input.cohortId,
    name: input.name.trim(),
    status: input.status ?? "queued",
    plan: input.plan ?? state().org.defaultPlan,
    calibrationPrior: Math.max(0, Math.min(1, input.calibrationPrior ?? 0.7)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().runs.unshift(row);
  audit("analyst", "run.create", row.name);
  return row;
}

export function getRun(id: string): PredictRun | undefined {
  return state().runs.find((r) => r.id === id);
}

export function listBands(runId?: string, q?: string): UncertaintyBand[] {
  let rows = [...state().bands];
  if (runId) rows = rows.filter((r) => r.runId === runId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createBand(input: {
  runId: string;
  name: string;
  status?: BandStatus;
  lower?: number;
  upper?: number;
  coverageTarget?: number;
  notes?: string;
}): UncertaintyBand {
  if (!getRun(input.runId)) throw new Error("run_not_found");
  let lower = Math.max(0, Math.min(1, input.lower ?? 0.2));
  let upper = Math.max(0, Math.min(1, input.upper ?? 0.6));
  if (upper < lower) {
    const t = lower;
    lower = upper;
    upper = t;
  }
  const row: UncertaintyBand = {
    id: randomUUID(),
    runId: input.runId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    lower,
    upper,
    coverageTarget: Math.max(0.5, Math.min(0.99, input.coverageTarget ?? 0.9)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().bands.unshift(row);
  audit("analyst", "band.create", row.name);
  return row;
}

export function listExplanations(
  runId?: string,
  q?: string,
): ExplanationNote[] {
  let rows = [...state().explanations];
  if (runId) rows = rows.filter((r) => r.runId === runId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.salienceFeature.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createExplanation(input: {
  runId: string;
  name: string;
  salienceFeature: string;
  salienceScore?: number;
  notes?: string;
}): ExplanationNote {
  if (!getRun(input.runId)) throw new Error("run_not_found");
  const row: ExplanationNote = {
    id: randomUUID(),
    runId: input.runId,
    name: input.name.trim(),
    salienceFeature: input.salienceFeature.trim() || "unknown",
    salienceScore: Math.max(0, Math.min(1, input.salienceScore ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().explanations.unshift(row);
  audit("analyst", "explanation.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromCohort(
  cohortId: string,
  patch?: Partial<PredictInput>,
  planKind?: PlanKind,
): PredictInput {
  const base = seedInput();
  const cohort = getCohort(cohortId);
  const snaps = listSnapshots(cohortId);
  const runs = listRuns(cohortId);
  const avgMiss =
    snaps.length > 0
      ? snaps.reduce((s, r) => s + r.missingnessRate, 0) / snaps.length
      : (cohort?.missingnessRate ?? base.missingnessRate);
  const avgMask =
    snaps.length > 0
      ? snaps.reduce((s, r) => s + r.maskQuality, 0) / snaps.length
      : base.missingnessMaskQuality;
  const avgCal =
    runs.length > 0
      ? runs.reduce((s, r) => s + r.calibrationPrior, 0) / runs.length
      : base.calibrationPrior;
  const plan = planKind ?? state().org.defaultPlan;
  return {
    ...base,
    ...patch,
    ageNorm: patch?.ageNorm ?? clamp01(0.45 + Math.min(0.4, (cohort?.size ?? 200) / 1000)),
    cognitiveDecline:
      patch?.cognitiveDecline ??
      clamp01(0.4 + avgMiss * 0.15 + (1 - avgMask) * 0.1),
    imagingSignal:
      patch?.imagingSignal ??
      clamp01(
        cohort?.modality === "imaging" || cohort?.modality === "mixed"
          ? 0.7
          : 0.45,
      ),
    biomarkerSignal:
      patch?.biomarkerSignal ??
      clamp01(
        cohort?.modality === "biomarker" || cohort?.modality === "mixed"
          ? 0.72
          : 0.48,
      ),
    missingnessRate: patch?.missingnessRate ?? clamp01(avgMiss),
    missingnessMaskQuality: patch?.missingnessMaskQuality ?? clamp01(avgMask),
    calibrationPrior: patch?.calibrationPrior ?? clamp01(avgCal),
    featureCompleteness:
      patch?.featureCompleteness ?? clamp01(1 - avgMiss * 0.85),
    temporalSpan: patch?.temporalSpan ?? clamp01(0.55 + avgCal * 0.25),
    comorbidityLoad:
      patch?.comorbidityLoad ??
      clamp01(0.15 + (plan === "impute_then_predict" ? 0.12 : 0.05)),
    modality: patch?.modality ?? cohort?.modality ?? "mixed",
    plan,
  };
}

export function listCompares(): CompareResult[] {
  return [...state().compares].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function createCompare(input: {
  name: string;
  cohortId: string;
  patch?: Partial<PredictInput>;
}): CompareResult {
  if (!getCohort(input.cohortId)) throw new Error("cohort_not_found");
  const freeInput = inputFromCohort(
    input.cohortId,
    input.patch,
    "imputation_free",
  );
  const imputeInput: PredictInput = {
    ...freeInput,
    plan: "impute_then_predict",
    missingnessMaskQuality: clamp01(freeInput.missingnessMaskQuality - 0.18),
    calibrationPrior: clamp01(freeInput.calibrationPrior - 0.12),
    featureCompleteness: clamp01(
      freeInput.featureCompleteness + freeInput.missingnessRate * 0.4,
    ),
  };
  const imputationFree = scoreImputationFree({
    ...freeInput,
    plan: "imputation_free",
  });
  const imputeThenPredict = scoreImputeThenPredict(imputeInput);
  const delta = imputationFree.overall - imputeThenPredict.overall;
  const winner =
    Math.abs(delta) < 0.5
      ? "tie"
      : delta > 0
        ? "imputation_free"
        : "impute_then_predict";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    cohortId: input.cohortId,
    input: freeInput,
    imputationFree,
    imputeThenPredict,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("analyst", "compare.create", `${row.name} → ${row.winner}`);
  return row;
}

export function listAudits(limit = 100): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function exportAuditsCsv(): string {
  const rows = listAudits(500);
  const header = "id,at,actor,action,detail";
  const body = rows
    .map((r) =>
      [r.id, r.at, r.actor, r.action, JSON.stringify(r.detail)].join(","),
    )
    .join("\n");
  return `${header}\n${body}\n`;
}

export function exportCohortsJson(): string {
  return JSON.stringify({ items: listCohorts().items }, null, 2);
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === state().org.bearerToken;
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const org = state().org;
  const bucket = state().rateBucket;
  const nowMs = Date.now();
  if (nowMs - bucket.windowStart > 60_000) {
    bucket.windowStart = nowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  const remaining = Math.max(0, org.rateLimitPerMinute - bucket.count);
  return { ok: bucket.count <= org.rateLimitPerMinute, remaining };
}

export function ingestWebhook(
  idempotencyKey: string,
  signature: string | null,
  rawBody: string,
  payload: unknown,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = (signature ?? "").replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "bad_signature" };
    }
  } catch {
    return { ok: false, error: "bad_signature" };
  }
  const dup = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (dup) return { ok: true, duplicate: true, id: dup.id };
  const id = randomUUID();
  state().webhookEvents.push({
    id,
    idempotencyKey,
    receivedAt: now(),
    payload,
  });
  audit("webhook", "ingest", idempotencyKey);
  return { ok: true, id };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing for clinical AD-risk buyers",
    "Patient cohort registry",
    "Cohort search and pagination",
    "Feature snapshots with missingness",
    "Missingness mask quality tracking",
    "Imputation-free prediction runs",
    "Model run status tracking",
    "Calibrated uncertainty bands",
    "Uncertainty band widen review",
    "Explanation / feature salience notes",
    "Imputation-free vs impute-then-predict compare",
    "Dual score A imputation-free + calibrated uncertainty",
    "Dual score B impute-then-predict baseline",
    "Org settings and bearer auth",
    "Member invite with roles",
    "Idempotent HMAC webhook",
    "Audit log",
    "CSV audit export",
    "JSON cohorts export",
    "Rate-limit feedback",
    "Features inventory API",
    "Goldens sample API",
    "Honesty fence and Sources",
    "Offline try.html demo",
    "In-app guide link",
    "Saved onboarding checklist on cohorts",
    "Filter snapshots and runs by cohort",
  ];
}

export function sampleGoldenInput(): PredictInput {
  return seedInput();
}

export function scorePlan(
  input: PredictInput,
  mode: ScoreMode,
): { quality: PredictQuality; readiness: UncertaintyReadiness } {
  const quality =
    mode === "imputation_free"
      ? scoreImputationFree(input)
      : scoreImputeThenPredict(input);
  return { quality, readiness: readinessFromQuality(quality, input) };
}
