import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMultiSignal,
  scoreVisionOnly,
  signalBreakdown,
} from "./domain/pathology";
import type {
  EmbedInput,
  EmbedMode,
  EmbedProfile,
  EmbedQuality,
  SignalBreakdown,
} from "./domain/types";

export type MemberRole = "owner" | "analyst" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type SlideCohort = {
  id: string;
  name: string;
  organSite: string;
  stainProtocol: string;
  caseTags: string[];
  slideCount: number;
  createdAt: string;
};

export type SlideAsset = {
  id: string;
  cohortId: string;
  label: string;
  magnification: string;
  patchCount: number;
  notes: string;
  createdAt: string;
};

export type EvalRun = {
  id: string;
  cohortId: string;
  mode: EmbedMode;
  profile: EmbedProfile;
  stage: "queued" | "tiling" | "embedding" | "complete" | "failed";
  input: EmbedInput;
  quality?: EmbedQuality;
  signals?: SignalBreakdown;
  slideLabel: string;
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
  defaultProfile: EmbedProfile;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  cohortId: string;
  input: EmbedInput;
  multiSignal: EmbedQuality;
  visionOnly: EmbedQuality;
  winner: "multi_signal" | "vision_only" | "tie";
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
  cohorts: SlideCohort[];
  slides: SlideAsset[];
  runs: EvalRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __pssStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): EmbedInput {
  return {
    patchMorphology: 0.72,
    textureEntropy: 0.58,
    stainQuality: 0.81,
    languageAlign: 0.64,
    conceptMatch: 0.55,
    slideContext: 0.7,
    tissueHeterogeneity: 0.48,
    milAggregator: 62,
    profile: "full",
  };
}

function seed(): StoreState {
  const cohortId = "cohort-demo";
  const runId = "run-demo";
  const input = seedInput();
  const quality = scoreMultiSignal(input);
  const signals = signalBreakdown(input, "multi_signal");

  return {
    org: {
      name: "Pathology Slide Lab",
      webhookUrl: "",
      webhookSecret: "pss-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "full",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "analyst@studio.local", role: "analyst" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    cohorts: [
      {
        id: cohortId,
        name: "Colorectal ROI cohort",
        organSite: "Colon",
        stainProtocol: "H&E",
        caseTags: ["CRC-100K", "Unitopatho", "demo"],
        slideCount: 18,
        createdAt: now(),
      },
    ],
    slides: [
      {
        id: "slide-demo",
        cohortId,
        label: "CRC case A — tile grid",
        magnification: "20x",
        patchCount: 240,
        notes: "Demo WSI with language-aligned patch tags",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        cohortId,
        mode: "multi_signal",
        profile: "full",
        stage: "complete",
        input,
        quality,
        signals,
        slideLabel: "CRC case A",
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
        detail: "Demo cohort, slide, and completed embed run loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pssStore) g.__pssStore = seed();
  return g.__pssStore;
}

export function resetStore(): void {
  g.__pssStore = seed();
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

export function listCohorts(q?: string): SlideCohort[] {
  const all = [...state().cohorts].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(needle) ||
      c.organSite.toLowerCase().includes(needle) ||
      c.stainProtocol.toLowerCase().includes(needle) ||
      c.caseTags.some((t) => t.toLowerCase().includes(needle)),
  );
}

export function createCohort(input: {
  name: string;
  organSite: string;
  stainProtocol: string;
  caseTags: string[];
  slideCount: number;
}): SlideCohort {
  const c: SlideCohort = {
    id: randomUUID(),
    name: input.name.trim(),
    organSite: input.organSite.trim(),
    stainProtocol: input.stainProtocol.trim(),
    caseTags: input.caseTags.map((t) => t.trim()).filter(Boolean),
    slideCount: Math.max(1, Math.round(input.slideCount)),
    createdAt: now(),
  };
  state().cohorts.unshift(c);
  audit("analyst", "cohort.create", c.name);
  return c;
}

export function getCohort(id: string): SlideCohort | undefined {
  return state().cohorts.find((c) => c.id === id);
}

export function listSlides(cohortId?: string): SlideAsset[] {
  let rows = [...state().slides];
  if (cohortId) rows = rows.filter((s) => s.cohortId === cohortId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSlide(input: {
  cohortId: string;
  label: string;
  magnification: string;
  patchCount: number;
  notes?: string;
}): SlideAsset {
  const cohort = getCohort(input.cohortId);
  if (!cohort) throw new Error("cohort_not_found");
  const s: SlideAsset = {
    id: randomUUID(),
    cohortId: input.cohortId,
    label: input.label.trim(),
    magnification: input.magnification.trim() || "20x",
    patchCount: Math.max(1, Math.round(input.patchCount)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().slides.unshift(s);
  audit("analyst", "slide.create", s.label);
  return s;
}

export function listRuns(cohortId?: string): EvalRun[] {
  let rows = [...state().runs];
  if (cohortId) rows = rows.filter((r) => r.cohortId === cohortId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createRun(input: {
  cohortId: string;
  mode?: EmbedMode;
  profile?: EmbedProfile;
  slideLabel?: string;
  embedInput?: Partial<EmbedInput>;
}): EvalRun {
  const cohort = getCohort(input.cohortId);
  if (!cohort) throw new Error("cohort_not_found");
  const base = seedInput();
  const profile = input.profile ?? state().org.defaultProfile;
  const emb: EmbedInput = {
    ...base,
    ...input.embedInput,
    profile,
  };
  const run: EvalRun = {
    id: randomUUID(),
    cohortId: input.cohortId,
    mode: input.mode ?? "multi_signal",
    profile,
    stage: "queued",
    input: emb,
    slideLabel: (input.slideLabel ?? "Query slide").trim(),
    createdAt: now(),
    updatedAt: now(),
  };
  state().runs.unshift(run);
  audit("analyst", "run.create", `${run.id} ${run.mode}`);
  return run;
}

const STAGE_ORDER: EvalRun["stage"][] = [
  "queued",
  "tiling",
  "embedding",
  "complete",
];

export function advanceRun(id: string): EvalRun {
  const run = state().runs.find((r) => r.id === id);
  if (!run) throw new Error("run_not_found");
  if (run.stage === "failed" || run.stage === "complete") {
    throw new Error("illegal_stage_advance");
  }
  const idx = STAGE_ORDER.indexOf(run.stage);
  const next = STAGE_ORDER[idx + 1];
  if (!next) throw new Error("illegal_stage_advance");

  if (next === "complete") {
    const quality =
      run.mode === "multi_signal"
        ? scoreMultiSignal(run.input)
        : scoreVisionOnly(run.input);
    run.quality = quality;
    run.signals = signalBreakdown(run.input, run.mode);
  }

  run.stage = next;
  run.updatedAt = now();
  audit("analyst", "run.advance", `${run.id} → ${next}`);
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
  embedInput: EmbedInput;
}): CompareResult {
  const cohort = getCohort(input.cohortId);
  if (!cohort) throw new Error("cohort_not_found");
  const multiSignal = scoreMultiSignal(input.embedInput);
  const visionOnly = scoreVisionOnly(input.embedInput);
  let winner: CompareResult["winner"] = "tie";
  if (multiSignal.overall > visionOnly.overall + 0.01) {
    winner = "multi_signal";
  } else if (visionOnly.overall > multiSignal.overall + 0.01) {
    winner = "vision_only";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    cohortId: input.cohortId,
    input: input.embedInput,
    multiSignal,
    visionOnly,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("analyst", "compare.create", row.name);
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

export function getLatestSignals(
  runId?: string,
): { run: EvalRun; signals: SignalBreakdown } | null {
  const runs = listRuns();
  const run = runId
    ? runs.find((r) => r.id === runId)
    : runs.find((r) => r.signals);
  if (!run?.signals) return null;
  return { run, signals: run.signals };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing with selling points",
    "Slide cohort create",
    "Cohort search (organ / stain / tags)",
    "Multi-signal embed console",
    "Vision-only baseline mode",
    "Full vs fast profile",
    "Vision / language / slide signal inputs",
    "Stage advance (queued → complete)",
    "Slide / patch inspection",
    "Signal contribution bars",
    "Multi-signal vs vision-only compare",
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
    "Slide asset create with magnification",
    "Task-fit prediction (roi / multimodal / wsi)",
  ];
}
