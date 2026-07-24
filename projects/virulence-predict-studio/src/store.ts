import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  featureBreakdown,
  scoreFeatureIntegrated,
  scoreSequenceOnly,
} from "./domain/virulence";
import type {
  FeatureBreakdown,
  PredictInput,
  PredictMode,
  PredictProfile,
  PredictQuality,
} from "./domain/types";

export type MemberRole = "owner" | "analyst" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type OrganismPanel = {
  id: string;
  name: string;
  organism: string;
  sampleSource: string;
  accessionTags: string[];
  sequenceCount: number;
  createdAt: string;
};

export type PredictionRun = {
  id: string;
  panelId: string;
  mode: PredictMode;
  profile: PredictProfile;
  stage: "queued" | "featuring" | "scoring" | "complete" | "failed";
  input: PredictInput;
  quality?: PredictQuality;
  features?: FeatureBreakdown;
  proteinLabel: string;
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
  defaultProfile: PredictProfile;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  panelId: string;
  input: PredictInput;
  featureIntegrated: PredictQuality;
  sequenceOnly: PredictQuality;
  winner: "feature_integrated" | "sequence_only" | "tie";
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
  panels: OrganismPanel[];
  runs: PredictionRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __vpsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): PredictInput {
  return {
    seqLength: 420,
    aaCompositionEntropy: 0.72,
    hydrophobicFraction: 0.38,
    pssmConservation: 0.68,
    msaDepth: 48,
    structureCoverage: 0.81,
    contactMapDensity: 0.55,
    signalPeptideScore: 0.42,
    profile: "full",
  };
}

function seed(): StoreState {
  const panelId = "panel-demo";
  const runId = "run-demo";
  const input = seedInput();
  const quality = scoreFeatureIntegrated(input);
  const features = featureBreakdown(input, "feature_integrated");

  return {
    org: {
      name: "Virulence Predict Lab",
      webhookUrl: "",
      webhookSecret: "vps-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "full",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "analyst@studio.local", role: "analyst" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    panels: [
      {
        id: panelId,
        name: "E. coli VF panel",
        organism: "Escherichia coli",
        sampleSource: "Clinical isolate bank",
        accessionTags: ["E3XRD1", "P0A7B8", "VFDB-001"],
        sequenceCount: 24,
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        panelId,
        mode: "feature_integrated",
        profile: "full",
        stage: "complete",
        input,
        quality,
        features,
        proteinLabel: "E3XRD1 putative VF",
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
        detail: "Demo organism panel and completed prediction loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__vpsStore) g.__vpsStore = seed();
  return g.__vpsStore;
}

export function resetStore(): void {
  g.__vpsStore = seed();
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

export function listPanels(q?: string): OrganismPanel[] {
  const all = [...state().panels].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.organism.toLowerCase().includes(needle) ||
      p.sampleSource.toLowerCase().includes(needle) ||
      p.accessionTags.some((t) => t.toLowerCase().includes(needle)),
  );
}

export function createPanel(input: {
  name: string;
  organism: string;
  sampleSource: string;
  accessionTags: string[];
  sequenceCount: number;
}): OrganismPanel {
  const p: OrganismPanel = {
    id: randomUUID(),
    name: input.name.trim(),
    organism: input.organism.trim(),
    sampleSource: input.sampleSource.trim(),
    accessionTags: input.accessionTags.map((t) => t.trim()).filter(Boolean),
    sequenceCount: Math.max(1, Math.round(input.sequenceCount)),
    createdAt: now(),
  };
  state().panels.unshift(p);
  audit("analyst", "panel.create", p.name);
  return p;
}

export function getPanel(id: string): OrganismPanel | undefined {
  return state().panels.find((p) => p.id === id);
}

export function listRuns(panelId?: string): PredictionRun[] {
  let rows = [...state().runs];
  if (panelId) rows = rows.filter((r) => r.panelId === panelId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createRun(input: {
  panelId: string;
  mode?: PredictMode;
  profile?: PredictProfile;
  proteinLabel?: string;
  predictInput?: Partial<PredictInput>;
}): PredictionRun {
  const panel = getPanel(input.panelId);
  if (!panel) throw new Error("panel_not_found");
  const base = seedInput();
  const profile = input.profile ?? state().org.defaultProfile;
  const pred: PredictInput = {
    ...base,
    ...input.predictInput,
    profile,
  };
  const run: PredictionRun = {
    id: randomUUID(),
    panelId: input.panelId,
    mode: input.mode ?? "feature_integrated",
    profile,
    stage: "queued",
    input: pred,
    proteinLabel: (input.proteinLabel ?? "Query protein").trim(),
    createdAt: now(),
    updatedAt: now(),
  };
  state().runs.unshift(run);
  audit("analyst", "run.create", `${run.id} ${run.mode}`);
  return run;
}

const STAGE_ORDER: PredictionRun["stage"][] = [
  "queued",
  "featuring",
  "scoring",
  "complete",
];

export function advanceRun(id: string): PredictionRun {
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
      run.mode === "feature_integrated"
        ? scoreFeatureIntegrated(run.input)
        : scoreSequenceOnly(run.input);
    run.quality = quality;
    run.features = featureBreakdown(run.input, run.mode);
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

export function exportRunsJson(panelId?: string): string {
  return JSON.stringify(listRuns(panelId), null, 2);
}

export function createCompare(input: {
  name: string;
  panelId: string;
  predictInput: PredictInput;
}): CompareResult {
  const panel = getPanel(input.panelId);
  if (!panel) throw new Error("panel_not_found");
  const featureIntegrated = scoreFeatureIntegrated(input.predictInput);
  const sequenceOnly = scoreSequenceOnly(input.predictInput);
  let winner: CompareResult["winner"] = "tie";
  if (featureIntegrated.overall > sequenceOnly.overall + 0.01) {
    winner = "feature_integrated";
  } else if (sequenceOnly.overall > featureIntegrated.overall + 0.01) {
    winner = "sequence_only";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    panelId: input.panelId,
    input: input.predictInput,
    featureIntegrated,
    sequenceOnly,
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

export function getLatestFeatures(
  runId?: string,
): { run: PredictionRun; features: FeatureBreakdown } | null {
  const runs = listRuns();
  const run = runId
    ? runs.find((r) => r.id === runId)
    : runs.find((r) => r.features);
  if (!run?.features) return null;
  return { run, features: run.features };
}
