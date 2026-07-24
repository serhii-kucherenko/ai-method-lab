import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreAngularScl, scoreFlatCe } from "./domain/rhythm";
import {
  classBalance,
  type ClassBalanceView,
  type RhythmInput,
  type RhythmQuality,
  type ScoreMode,
  type TrainProfile,
} from "./domain/types";

export type MemberRole = "owner" | "engineer" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type EcgCohort = {
  id: string;
  name: string;
  source: string;
  leadCount: number;
  hoursRecorded: number;
  subjectCount: number;
  tags: string[];
  createdAt: string;
};

export type ClassStat = {
  id: string;
  cohortId: string;
  rhythmCode: string;
  label: string;
  sampleCount: number;
  prevalence: number;
  isTail: boolean;
};

export type TrainEvalRun = {
  id: string;
  cohortId: string;
  mode: ScoreMode;
  profile: TrainProfile;
  stage: "queued" | "augment" | "contrastive" | "calibrate" | "complete" | "failed";
  input: RhythmInput;
  quality?: RhythmQuality;
  balance?: ClassBalanceView;
  cohortLabel: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
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
  defaultProfile: TrainProfile;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  cohortId: string;
  input: RhythmInput;
  angularScl: RhythmQuality;
  flatCe: RhythmQuality;
  winner: "angular_scl" | "flat_ce" | "tie";
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
  cohorts: EcgCohort[];
  classStats: ClassStat[];
  runs: TrainEvalRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __rrsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): RhythmInput {
  return {
    headClassShare: 0.72,
    tailClassShare: 0.14,
    morphologyAnisotropy: 0.68,
    angularCovariance: 0.74,
    adaptiveLogit: 0.7,
    bandProtectQrs: 0.82,
    embeddingUniformity: 0.66,
    labelSparsity: 0.58,
    multiLabelDensity: 0.42,
    profile: "full",
  };
}

function seed(): StoreState {
  const cohortId = "cohort-demo";
  const runId = "run-demo";
  const input = seedInput();
  const quality = scoreAngularScl(input);
  const balance = classBalance(input);

  return {
    org: {
      name: "Rhythm Lab Org",
      webhookUrl: "",
      webhookSecret: "rrs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "full",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "eng@studio.local", role: "engineer" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    cohorts: [
      {
        id: cohortId,
        name: "Demo nocturnal lead-I",
        source: "synthetic-demo",
        leadCount: 1,
        hoursRecorded: 120,
        subjectCount: 48,
        tags: ["nocturnal", "demo", "long-tail"],
        createdAt: now(),
      },
    ],
    classStats: [
      {
        id: "cs1",
        cohortId,
        rhythmCode: "SR",
        label: "Sinus rhythm",
        sampleCount: 8200,
        prevalence: 0.62,
        isTail: false,
      },
      {
        id: "cs2",
        cohortId,
        rhythmCode: "AFIB",
        label: "Atrial fibrillation",
        sampleCount: 2100,
        prevalence: 0.16,
        isTail: false,
      },
      {
        id: "cs3",
        cohortId,
        rhythmCode: "PAC",
        label: "Premature atrial complex",
        sampleCount: 420,
        prevalence: 0.032,
        isTail: true,
      },
      {
        id: "cs4",
        cohortId,
        rhythmCode: "PVC",
        label: "Premature ventricular complex",
        sampleCount: 380,
        prevalence: 0.029,
        isTail: true,
      },
      {
        id: "cs5",
        cohortId,
        rhythmCode: "VT",
        label: "Ventricular tachycardia",
        sampleCount: 95,
        prevalence: 0.007,
        isTail: true,
      },
    ],
    runs: [
      {
        id: runId,
        cohortId,
        mode: "angular_scl",
        profile: "full",
        stage: "complete",
        input,
        quality,
        balance,
        cohortLabel: "Demo nocturnal lead-I",
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo cohort, class stats, and completed train/eval run loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__rrsStore) g.__rrsStore = seed();
  return g.__rrsStore;
}

export function resetStore(): void {
  g.__rrsStore = seed();
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

export function listCohorts(q?: string): EcgCohort[] {
  const all = [...state().cohorts].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(needle) ||
      c.source.toLowerCase().includes(needle) ||
      c.tags.some((t) => t.toLowerCase().includes(needle)),
  );
}

export function createCohort(input: {
  name: string;
  source: string;
  leadCount: number;
  hoursRecorded: number;
  subjectCount: number;
  tags: string[];
}): EcgCohort {
  const c: EcgCohort = {
    id: randomUUID(),
    name: input.name.trim(),
    source: input.source.trim(),
    leadCount: Math.max(1, Math.round(input.leadCount)),
    hoursRecorded: Math.max(0.1, input.hoursRecorded),
    subjectCount: Math.max(1, Math.round(input.subjectCount)),
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    createdAt: now(),
  };
  state().cohorts.unshift(c);
  audit("engineer", "cohort.create", c.name);
  return c;
}

export function getCohort(id: string): EcgCohort | undefined {
  return state().cohorts.find((c) => c.id === id);
}

export function listClassStats(cohortId?: string): ClassStat[] {
  let rows = [...state().classStats];
  if (cohortId) rows = rows.filter((c) => c.cohortId === cohortId);
  return rows.sort((a, b) => b.prevalence - a.prevalence);
}

export function upsertClassStat(input: {
  cohortId: string;
  rhythmCode: string;
  label: string;
  sampleCount: number;
  prevalence: number;
  isTail: boolean;
}): ClassStat {
  const cohort = getCohort(input.cohortId);
  if (!cohort) throw new Error("cohort_not_found");
  const existing = state().classStats.find(
    (c) =>
      c.cohortId === input.cohortId &&
      c.rhythmCode.toUpperCase() === input.rhythmCode.trim().toUpperCase(),
  );
  if (existing) {
    existing.label = input.label.trim();
    existing.sampleCount = Math.max(0, Math.round(input.sampleCount));
    existing.prevalence = Math.max(0, Math.min(1, input.prevalence));
    existing.isTail = input.isTail;
    audit("engineer", "class.update", existing.rhythmCode);
    return { ...existing };
  }
  const row: ClassStat = {
    id: randomUUID(),
    cohortId: input.cohortId,
    rhythmCode: input.rhythmCode.trim().toUpperCase(),
    label: input.label.trim(),
    sampleCount: Math.max(0, Math.round(input.sampleCount)),
    prevalence: Math.max(0, Math.min(1, input.prevalence)),
    isTail: input.isTail,
  };
  state().classStats.unshift(row);
  audit("engineer", "class.create", row.rhythmCode);
  return row;
}

export function listRuns(cohortId?: string): TrainEvalRun[] {
  let rows = [...state().runs];
  if (cohortId) rows = rows.filter((r) => r.cohortId === cohortId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createRun(input: {
  cohortId: string;
  mode?: ScoreMode;
  profile?: TrainProfile;
  cohortLabel?: string;
  rhythmInput?: Partial<RhythmInput>;
}): TrainEvalRun {
  const cohort = getCohort(input.cohortId);
  if (!cohort) throw new Error("cohort_not_found");
  const base = seedInput();
  const profile = input.profile ?? state().org.defaultProfile;
  const emb: RhythmInput = {
    ...base,
    ...input.rhythmInput,
    profile,
  };
  const run: TrainEvalRun = {
    id: randomUUID(),
    cohortId: input.cohortId,
    mode: input.mode ?? "angular_scl",
    profile,
    stage: "queued",
    input: emb,
    balance: classBalance(emb),
    cohortLabel: (input.cohortLabel ?? cohort.name).trim(),
    createdAt: now(),
    updatedAt: now(),
  };
  state().runs.unshift(run);
  audit("engineer", "run.create", `${run.id} ${run.mode}`);
  return run;
}

const STAGE_ORDER: TrainEvalRun["stage"][] = [
  "queued",
  "augment",
  "contrastive",
  "calibrate",
  "complete",
];

export function advanceRun(id: string): TrainEvalRun {
  const run = state().runs.find((r) => r.id === id);
  if (!run) throw new Error("run_not_found");
  if (run.stage === "failed" || run.stage === "complete") {
    throw new Error("illegal_stage_advance");
  }
  const idx = STAGE_ORDER.indexOf(run.stage);
  const next = STAGE_ORDER[idx + 1];
  if (!next) throw new Error("illegal_stage_advance");

  if (next === "complete") {
    run.quality =
      run.mode === "angular_scl"
        ? scoreAngularScl(run.input)
        : scoreFlatCe(run.input);
    run.balance = classBalance(run.input);
  }

  run.stage = next;
  run.updatedAt = now();
  audit("engineer", "run.advance", `${run.id} → ${next}`);
  return { ...run };
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, Math.max(1, limit));
}

export function exportAuditsCsv(): string {
  const header = "id,at,actor,action,detail";
  const lines = state().audits.map((a) =>
    [a.id, a.at, a.actor, a.action, JSON.stringify(a.detail)].join(","),
  );
  return [header, ...lines].join("\n");
}

export function exportRunsJson(cohortId?: string): string {
  return JSON.stringify(listRuns(cohortId), null, 2);
}

export function createCompare(input: {
  name: string;
  cohortId: string;
  rhythmInput: RhythmInput;
}): CompareResult {
  const cohort = getCohort(input.cohortId);
  if (!cohort) throw new Error("cohort_not_found");
  const angularScl = scoreAngularScl(input.rhythmInput);
  const flatCe = scoreFlatCe(input.rhythmInput);
  let winner: CompareResult["winner"] = "tie";
  if (angularScl.overall > flatCe.overall + 0.01) {
    winner = "angular_scl";
  } else if (flatCe.overall > angularScl.overall + 0.01) {
    winner = "flat_ce";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    cohortId: input.cohortId,
    input: input.rhythmInput,
    angularScl,
    flatCe,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("engineer", "compare.create", row.name);
  return row;
}

export function listCompares(): CompareResult[] {
  return [...state().compares];
}

export function checkBearer(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token === state().org.bearerToken;
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const s = state();
  const minute = 60_000;
  const t = Date.now();
  if (t - s.rateBucket.windowStart > minute) {
    s.rateBucket = { windowStart: t, count: 0 };
  }
  s.rateBucket.count += 1;
  const remaining = s.org.rateLimitPerMinute - s.rateBucket.count;
  return { ok: remaining >= 0, remaining: Math.max(0, remaining) };
}

export function signWebhook(body: string, secret?: string): string {
  const key = secret ?? state().org.webhookSecret;
  return createHmac("sha256", key).update(body).digest("hex");
}

export function verifyWebhook(
  body: string,
  signature: string,
  secret?: string,
): boolean {
  const expected = signWebhook(body, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function ingestWebhook(
  body: string,
  signature: string,
  idempotencyKey: string,
): { ok: boolean; duplicate?: boolean; event?: WebhookEvent } {
  if (!verifyWebhook(body, signature)) return { ok: false };
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, event: existing };
  let payload: unknown = body;
  try {
    payload = JSON.parse(body);
  } catch {
    /* keep raw */
  }
  const event: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(event);
  audit("webhook", "webhook.ingest", idempotencyKey);
  return { ok: true, duplicate: false, event };
}

export function listWebhookEvents(): WebhookEvent[] {
  return [...state().webhookEvents];
}

export function paginate<T>(
  rows: T[],
  page = 1,
  pageSize = 10,
): { items: T[]; page: number; pageSize: number; total: number } {
  const p = Math.max(1, page);
  const size = Math.min(50, Math.max(1, pageSize));
  const start = (p - 1) * size;
  return {
    items: rows.slice(start, start + size),
    page: p,
    pageSize: size,
    total: rows.length,
  };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing with selling points",
    "ECG cohort create",
    "Cohort search (source / tags)",
    "Long-tail-aware train/eval console",
    "Flat CE / no-tail baseline mode",
    "Full vs fast train profile",
    "Angular covariance + adaptive logit inputs",
    "Stage advance (queued → complete)",
    "Class balance / rare rhythm browser",
    "Tail class upsert",
    "Class prevalence bars",
    "Angular SCL vs flat CE compare",
    "Compare winner badge + score bars",
    "Runs audit list",
    "CSV audit export",
    "JSON run export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on cohorts",
    "Dual-impl goldens sample API",
    "Pagination on cohorts / runs / audits",
    "Tail lift + rare sensitivity metrics",
    "Soft simulation disclaimer (no clinical device claims)",
  ];
}
