import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreHarnessed, scoreNaive } from "./domain/deploy";
import {
  readinessFromQuality,
  type DeployInput,
  type DeployProfile,
  type DeployQuality,
  type ReadinessView,
  type ScoreMode,
} from "./domain/types";

export type MemberRole = "owner" | "engineer" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type DeployApp = {
  id: string;
  name: string;
  environment: string;
  modalities: string[];
  gpuBudget: number;
  targetLatencyMs: number;
  notes: string;
  createdAt: string;
};

export type ReadinessCheck = {
  id: string;
  appId: string;
  label: string;
  kind: "latency" | "throughput" | "multimodal" | "correctness";
  threshold: number;
  observed: number;
  ready: boolean;
  updatedAt: string;
};

export type DeployRun = {
  id: string;
  appId: string;
  mode: ScoreMode;
  profile: DeployProfile;
  stage:
    | "queued"
    | "ir"
    | "validate"
    | "transform"
    | "measure"
    | "complete"
    | "failed";
  input: DeployInput;
  quality?: DeployQuality;
  readiness?: ReadinessView;
  appLabel: string;
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
  defaultProfile: DeployProfile;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  appId: string;
  input: DeployInput;
  harnessed: DeployQuality;
  naive: DeployQuality;
  winner: "harnessed" | "naive" | "tie";
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
  apps: DeployApp[];
  readinessChecks: ReadinessCheck[];
  runs: DeployRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __rdsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): DeployInput {
  return {
    pipelineStages: 6,
    gpuBudget: 4,
    modalityCount: 3,
    latencyWeight: 0.72,
    throughputWeight: 0.48,
    streamingOverlap: 0.68,
    stateScopeComplexity: 0.62,
    placementFlexibility: 0.7,
    irValidationDepth: 0.78,
    measurementGateStrictness: 0.74,
    candidatePassCount: 5,
    profile: "full",
  };
}

function seed(): StoreState {
  const appId = "app-demo";
  const runId = "run-demo";
  const input = seedInput();
  const quality = scoreHarnessed(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Realtime Deploy Org",
      webhookUrl: "",
      webhookSecret: "rds-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "full",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "eng@studio.local", role: "engineer" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    apps: [
      {
        id: appId,
        name: "Demo voice+avatar pipeline",
        environment: "staging-b200",
        modalities: ["audio", "text", "video"],
        gpuBudget: 4,
        targetLatencyMs: 220,
        notes: "Synthetic multimodal demo for harnessed deploy plans",
        createdAt: now(),
      },
    ],
    readinessChecks: [
      {
        id: "rc1",
        appId,
        label: "TTFO budget",
        kind: "latency",
        threshold: 70,
        observed: quality.ttfoScore,
        ready: quality.ttfoScore >= 70,
        updatedAt: now(),
      },
      {
        id: "rc2",
        appId,
        label: "Sustainable throughput",
        kind: "throughput",
        threshold: 62,
        observed: quality.throughputScore,
        ready: quality.throughputScore >= 62,
        updatedAt: now(),
      },
      {
        id: "rc3",
        appId,
        label: "Multimodal sync",
        kind: "multimodal",
        threshold: 66,
        observed: quality.readinessScore,
        ready: quality.readinessScore >= 66,
        updatedAt: now(),
      },
      {
        id: "rc4",
        appId,
        label: "IR correctness gate",
        kind: "correctness",
        threshold: 64,
        observed: quality.correctnessConfidence,
        ready: quality.correctnessConfidence >= 64,
        updatedAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        appId,
        mode: "harnessed",
        profile: "full",
        stage: "complete",
        input,
        quality,
        readiness,
        appLabel: "Demo voice+avatar pipeline",
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
        detail: "Demo app, readiness checks, and completed harnessed run loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__rdsStore) g.__rdsStore = seed();
  return g.__rdsStore;
}

export function resetStore(): void {
  g.__rdsStore = seed();
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

export function listApps(q?: string): DeployApp[] {
  const all = [...state().apps].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (a) =>
      a.name.toLowerCase().includes(needle) ||
      a.environment.toLowerCase().includes(needle) ||
      a.modalities.some((m) => m.toLowerCase().includes(needle)),
  );
}

export function createApp(input: {
  name: string;
  environment: string;
  modalities: string[];
  gpuBudget: number;
  targetLatencyMs: number;
  notes: string;
}): DeployApp {
  const app: DeployApp = {
    id: randomUUID(),
    name: input.name.trim(),
    environment: input.environment.trim(),
    modalities: input.modalities.map((m) => m.trim()).filter(Boolean),
    gpuBudget: Math.max(1, Math.min(8, Math.round(input.gpuBudget))),
    targetLatencyMs: Math.max(20, Math.round(input.targetLatencyMs)),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().apps.unshift(app);
  audit("engineer", "app.create", app.name);
  return app;
}

export function getApp(id: string): DeployApp | undefined {
  return state().apps.find((a) => a.id === id);
}

export function listReadiness(appId?: string): ReadinessCheck[] {
  let rows = [...state().readinessChecks];
  if (appId) rows = rows.filter((r) => r.appId === appId);
  return rows.sort((a, b) => a.kind.localeCompare(b.kind));
}

export function upsertReadiness(input: {
  appId: string;
  label: string;
  kind: ReadinessCheck["kind"];
  threshold: number;
  observed: number;
}): ReadinessCheck {
  const app = getApp(input.appId);
  if (!app) throw new Error("app_not_found");
  const existing = state().readinessChecks.find(
    (r) => r.appId === input.appId && r.kind === input.kind,
  );
  if (existing) {
    existing.label = input.label.trim();
    existing.threshold = input.threshold;
    existing.observed = input.observed;
    existing.ready = input.observed >= input.threshold;
    existing.updatedAt = now();
    audit("engineer", "readiness.update", existing.kind);
    return { ...existing };
  }
  const row: ReadinessCheck = {
    id: randomUUID(),
    appId: input.appId,
    label: input.label.trim(),
    kind: input.kind,
    threshold: input.threshold,
    observed: input.observed,
    ready: input.observed >= input.threshold,
    updatedAt: now(),
  };
  state().readinessChecks.unshift(row);
  audit("engineer", "readiness.create", row.kind);
  return row;
}

export function listRuns(appId?: string): DeployRun[] {
  let rows = [...state().runs];
  if (appId) rows = rows.filter((r) => r.appId === appId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createRun(input: {
  appId: string;
  mode?: ScoreMode;
  profile?: DeployProfile;
  appLabel?: string;
  deployInput?: Partial<DeployInput>;
}): DeployRun {
  const app = getApp(input.appId);
  if (!app) throw new Error("app_not_found");
  const base = seedInput();
  const profile = input.profile ?? state().org.defaultProfile;
  const emb: DeployInput = {
    ...base,
    ...input.deployInput,
    gpuBudget: input.deployInput?.gpuBudget ?? app.gpuBudget,
    modalityCount:
      input.deployInput?.modalityCount ??
      Math.max(1, Math.min(4, app.modalities.length)),
    profile,
  };
  const run: DeployRun = {
    id: randomUUID(),
    appId: input.appId,
    mode: input.mode ?? "harnessed",
    profile,
    stage: "queued",
    input: emb,
    readiness: readinessFromQuality(
      input.mode === "naive" ? scoreNaive(emb) : scoreHarnessed(emb),
      emb,
    ),
    appLabel: (input.appLabel ?? app.name).trim(),
    createdAt: now(),
    updatedAt: now(),
  };
  state().runs.unshift(run);
  audit("engineer", "run.create", `${run.id} ${run.mode}`);
  return run;
}

const STAGE_ORDER: DeployRun["stage"][] = [
  "queued",
  "ir",
  "validate",
  "transform",
  "measure",
  "complete",
];

export function advanceRun(id: string): DeployRun {
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
      run.mode === "harnessed"
        ? scoreHarnessed(run.input)
        : scoreNaive(run.input);
    run.readiness = readinessFromQuality(run.quality, run.input);
    for (const check of state().readinessChecks.filter(
      (c) => c.appId === run.appId,
    )) {
      if (check.kind === "latency") check.observed = run.quality.ttfoScore;
      else if (check.kind === "throughput")
        check.observed = run.quality.throughputScore;
      else if (check.kind === "multimodal")
        check.observed = run.quality.readinessScore;
      else check.observed = run.quality.correctnessConfidence;
      check.ready = check.observed >= check.threshold;
      check.updatedAt = now();
    }
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

export function exportRunsJson(appId?: string): string {
  return JSON.stringify(listRuns(appId), null, 2);
}

export function createCompare(input: {
  name: string;
  appId: string;
  deployInput: DeployInput;
}): CompareResult {
  const app = getApp(input.appId);
  if (!app) throw new Error("app_not_found");
  const harnessed = scoreHarnessed(input.deployInput);
  const naive = scoreNaive(input.deployInput);
  let winner: CompareResult["winner"] = "tie";
  if (harnessed.overall > naive.overall + 0.01) {
    winner = "harnessed";
  } else if (naive.overall > harnessed.overall + 0.01) {
    winner = "naive";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    appId: input.appId,
    input: input.deployInput,
    harnessed,
    naive,
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
    "Deploy app / environment create",
    "App search (environment / modalities)",
    "Harnessed deploy console",
    "Naive single-shot baseline mode",
    "Full vs fast deploy profile",
    "IR / validate / transform / measure stage advance",
    "Latency readiness checks",
    "Throughput readiness checks",
    "Multimodal sync readiness",
    "Correctness gate readiness",
    "Readiness upsert from console",
    "Harnessed vs naive compare",
    "Compare winner badge + score bars",
    "Runs audit list",
    "CSV audit export",
    "JSON run export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on apps",
    "Dual-impl goldens sample API",
    "Pagination on apps / runs / audits",
    "TTFO + harness lift metrics",
    "Soft simulation disclaimer (not FlashRT brand)",
  ];
}
