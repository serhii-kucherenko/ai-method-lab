import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreNeuroAgentic, scoreReactive } from "./domain/neuro";
import {
  readinessFromQuality,
  type GuardInput,
  type GuardQuality,
  type PlanProfile,
  type PlanReadiness,
  type ScoreMode,
} from "./domain/types";

export type {
  GuardInput,
  GuardQuality,
  PlanProfile,
  PlanReadiness,
  ScoreMode,
};

export type MemberRole = "owner" | "operator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type SiteCriticality = "low" | "medium" | "high" | "critical";

export type IiotSite = {
  id: string;
  name: string;
  code: string;
  criticality: SiteCriticality;
  zone: string;
  notes: string;
  createdAt: string;
};

export type SensorMetric =
  | "pressure"
  | "vibration"
  | "temperature"
  | "flow"
  | "current"
  | "network";

export type SensorStream = {
  id: string;
  siteId: string;
  name: string;
  metric: SensorMetric;
  sampleRateHz: number;
  anomalyScore: number;
  notes: string;
  createdAt: string;
};

export type PlanStatus = "draft" | "ready" | "stale" | "archived";

export type DefensePlan = {
  id: string;
  siteId: string;
  name: string;
  mode: ScoreMode;
  status: PlanStatus;
  profile: PlanProfile;
  quality?: GuardQuality;
  readiness?: PlanReadiness;
  createdAt: string;
  updatedAt: string;
};

export type CpiStatus = "queued" | "running" | "complete" | "aborted";

export type CounterfactualRun = {
  id: string;
  planId: string;
  siteId: string;
  label: string;
  status: CpiStatus;
  projectedSafety: number;
  baselineSafety: number;
  delta: number;
  timeline: string[];
  createdAt: string;
  updatedAt: string;
};

export type InterventionStatus =
  | "proposed"
  | "approved"
  | "applied"
  | "rolled-back";

export type Intervention = {
  id: string;
  planId: string;
  siteId: string;
  action: string;
  status: InterventionStatus;
  riskScore: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
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
  defaultProfile: PlanProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  siteId: string;
  input: GuardInput;
  neuroAgentic: GuardQuality;
  reactive: GuardQuality;
  winner: "neuro-agentic" | "reactive" | "tie";
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
  sites: IiotSite[];
  sensors: SensorStream[];
  plans: DefensePlan[];
  counterfactuals: CounterfactualRun[];
  interventions: Intervention[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __ngsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function seedInput(): GuardInput {
  return {
    sensorCoverage: 0.84,
    physicsFidelity: 0.76,
    planHorizon: 0.72,
    threatSeverity: 0.58,
    anomalyConfidence: 0.74,
    latencyBudget: 0.68,
    actuatorRisk: 0.32,
    contextFreshness: 0.8,
    thresholdNoise: 0.24,
    isolationDepth: 0.7,
    cascadeRisk: 0.42,
    sensorCount: 12,
    profile: "balanced",
  };
}

function seed(): StoreState {
  const siteId = "site-demo";
  const sensorId = "sensor-demo";
  const planId = "plan-demo";
  const input = seedInput();
  const quality = scoreNeuroAgentic(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Neuro Guard Org",
      webhookUrl: "",
      webhookSecret: "ngs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "balanced",
      defaultMode: "neuro-agentic",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "soc@studio.local", role: "operator" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    sites: [
      {
        id: siteId,
        name: "Bay Compressors West",
        code: "BCW-01",
        criticality: "high",
        zone: "OT-Line-3",
        notes: "Demo IIoT site for CPI-before-act plans",
        createdAt: now(),
      },
    ],
    sensors: [
      {
        id: sensorId,
        siteId,
        name: "Compressor vibration bus",
        metric: "vibration",
        sampleRateHz: 100,
        anomalyScore: 0.62,
        notes: "Primary anomaly feed for planner context",
        createdAt: now(),
      },
    ],
    plans: [
      {
        id: planId,
        siteId,
        name: "Neuro-agentic containment draft",
        mode: "neuro-agentic",
        status: "ready",
        profile: "balanced",
        quality,
        readiness,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    counterfactuals: [
      {
        id: "cpi-demo",
        planId,
        siteId,
        label: "CPI isolate valve A vs baseline",
        status: "complete",
        projectedSafety: quality.planSafety,
        baselineSafety: round2(quality.planSafety - 11.4),
        delta: 11.4,
        timeline: [
          "Sensor context locked for planner",
          "Counterfactual physics injection ran on isolate valve A",
          "Projected cascade risk below site threshold",
          "Plan marked ready for intervention review",
        ],
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    interventions: [
      {
        id: "int-demo",
        planId,
        siteId,
        action: "Isolate valve A + rate-limit PLC segment",
        status: "proposed",
        riskScore: round2(100 - quality.cascadeAvoided),
        notes: "Awaiting CPI confirmation before apply",
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
        detail: "Demo site, sensor, plan, CPI run, and intervention loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__ngsStore) g.__ngsStore = seed();
  return g.__ngsStore;
}

export function resetStore(): void {
  g.__ngsStore = seed();
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

export function listSites(q?: string): IiotSite[] {
  const all = [...state().sites].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (s) =>
      s.name.toLowerCase().includes(needle) ||
      s.code.toLowerCase().includes(needle) ||
      s.zone.toLowerCase().includes(needle) ||
      s.criticality.toLowerCase().includes(needle) ||
      s.notes.toLowerCase().includes(needle),
  );
}

export function createSite(input: {
  name: string;
  code: string;
  criticality: SiteCriticality;
  zone: string;
  notes: string;
}): IiotSite {
  const site: IiotSite = {
    id: randomUUID(),
    name: input.name.trim(),
    code: input.code.trim().toUpperCase(),
    criticality: input.criticality,
    zone: input.zone.trim(),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().sites.unshift(site);
  audit("operator", "site.create", site.name);
  return site;
}

export function getSite(id: string): IiotSite | undefined {
  return state().sites.find((s) => s.id === id);
}

export function listSensors(
  siteId?: string,
  q?: string,
  maxAnomaly?: number,
): SensorStream[] {
  let rows = [...state().sensors];
  if (siteId) rows = rows.filter((s) => s.siteId === siteId);
  if (maxAnomaly !== undefined) {
    rows = rows.filter((s) => s.anomalyScore <= maxAnomaly);
  }
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (s) =>
        s.name.toLowerCase().includes(needle) ||
        s.metric.toLowerCase().includes(needle) ||
        s.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSensor(input: {
  siteId: string;
  name: string;
  metric: SensorMetric;
  sampleRateHz: number;
  anomalyScore: number;
  notes: string;
}): SensorStream {
  const site = getSite(input.siteId);
  if (!site) throw new Error("site_not_found");
  const sensor: SensorStream = {
    id: randomUUID(),
    siteId: input.siteId,
    name: input.name.trim(),
    metric: input.metric,
    sampleRateHz: Math.max(1, Math.min(10_000, Math.round(input.sampleRateHz))),
    anomalyScore: Math.max(0, Math.min(1, input.anomalyScore)),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().sensors.unshift(sensor);
  audit("operator", "sensor.create", sensor.name);
  return sensor;
}

export function getSensor(id: string): SensorStream | undefined {
  return state().sensors.find((s) => s.id === id);
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromSite(
  site: IiotSite,
  sensors: SensorStream[],
  patch?: Partial<GuardInput>,
  profile?: PlanProfile,
): GuardInput {
  const base = seedInput();
  const critBoost =
    site.criticality === "critical"
      ? 0.88
      : site.criticality === "high"
        ? 0.74
        : site.criticality === "medium"
          ? 0.58
          : 0.4;
  const avgAnomaly =
    sensors.length === 0
      ? 0.4
      : sensors.reduce((s, x) => s + x.anomalyScore, 0) / sensors.length;
  return {
    ...base,
    ...patch,
    sensorCoverage:
      patch?.sensorCoverage ??
      clamp01(0.45 + Math.min(1, sensors.length / 8) * 0.4 + critBoost * 0.1),
    physicsFidelity: patch?.physicsFidelity ?? clamp01(0.5 + critBoost * 0.3),
    planHorizon: patch?.planHorizon ?? clamp01(0.48 + critBoost * 0.28),
    threatSeverity: patch?.threatSeverity ?? clamp01(avgAnomaly * 0.9 + 0.08),
    anomalyConfidence:
      patch?.anomalyConfidence ?? clamp01(0.4 + avgAnomaly * 0.45),
    latencyBudget: patch?.latencyBudget ?? clamp01(0.72 - avgAnomaly * 0.25),
    actuatorRisk: patch?.actuatorRisk ?? clamp01(0.55 - critBoost * 0.2),
    contextFreshness: patch?.contextFreshness ?? clamp01(0.55 + critBoost * 0.25),
    thresholdNoise: patch?.thresholdNoise ?? clamp01(0.18 + avgAnomaly * 0.35),
    isolationDepth: patch?.isolationDepth ?? clamp01(0.5 + critBoost * 0.28),
    cascadeRisk: patch?.cascadeRisk ?? clamp01(0.55 - critBoost * 0.15 + avgAnomaly * 0.2),
    sensorCount: patch?.sensorCount ?? Math.max(1, Math.min(48, sensors.length || 4)),
    profile: profile ?? state().org.defaultProfile,
  };
}

export function listPlans(siteId?: string): DefensePlan[] {
  let rows = [...state().plans];
  if (siteId) rows = rows.filter((p) => p.siteId === siteId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPlan(input: {
  siteId: string;
  name: string;
  mode?: ScoreMode;
  profile?: PlanProfile;
  guardInput?: Partial<GuardInput>;
}): DefensePlan {
  const site = getSite(input.siteId);
  if (!site) throw new Error("site_not_found");
  const sensors = listSensors(site.id);
  const profile = input.profile ?? state().org.defaultProfile;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromSite(site, sensors, input.guardInput, profile);
  const quality =
    mode === "reactive" ? scoreReactive(emb) : scoreNeuroAgentic(emb);
  const readiness = readinessFromQuality(quality, emb);
  const plan: DefensePlan = {
    id: randomUUID(),
    siteId: site.id,
    name: input.name.trim(),
    mode,
    status: "ready",
    profile,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().plans.unshift(plan);
  audit("operator", "plan.create", `${plan.name} (${plan.mode})`);
  return plan;
}

export function getPlan(id: string): DefensePlan | undefined {
  return state().plans.find((p) => p.id === id);
}

export function listCounterfactuals(siteId?: string): CounterfactualRun[] {
  let rows = [...state().counterfactuals];
  if (siteId) rows = rows.filter((c) => c.siteId === siteId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createCounterfactual(input: {
  planId: string;
  label?: string;
}): CounterfactualRun {
  const plan = getPlan(input.planId);
  if (!plan) throw new Error("plan_not_found");
  const projected = plan.quality?.planSafety ?? 50;
  const cpiBoost = plan.mode === "neuro-agentic" ? 10.5 : 2.2;
  const baseline = round2(Math.max(0, projected - cpiBoost - 4));
  const run: CounterfactualRun = {
    id: randomUUID(),
    planId: plan.id,
    siteId: plan.siteId,
    label: (input.label ?? `CPI · ${plan.name}`).trim(),
    status: "complete",
    projectedSafety: projected,
    baselineSafety: baseline,
    delta: round2(projected - baseline),
    timeline: [
      "Sensor context locked for CPI",
      `${plan.mode} plan injected into physics twin`,
      "Projected cascade and actuator risk scored",
      "Counterfactual complete — ready for intervention gate",
    ],
    createdAt: now(),
    updatedAt: now(),
  };
  state().counterfactuals.unshift(run);
  audit("operator", "counterfactual.create", run.label);
  return run;
}

export function listInterventions(siteId?: string): Intervention[] {
  let rows = [...state().interventions];
  if (siteId) rows = rows.filter((i) => i.siteId === siteId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createIntervention(input: {
  planId: string;
  action: string;
  notes?: string;
  status?: InterventionStatus;
}): Intervention {
  const plan = getPlan(input.planId);
  if (!plan) throw new Error("plan_not_found");
  const risk = round2(100 - (plan.quality?.cascadeAvoided ?? 40));
  const row: Intervention = {
    id: randomUUID(),
    planId: plan.id,
    siteId: plan.siteId,
    action: input.action.trim(),
    status: input.status ?? "proposed",
    riskScore: risk,
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
    updatedAt: now(),
  };
  state().interventions.unshift(row);
  audit("operator", "intervention.create", row.action);
  return row;
}

export function updateInterventionStatus(
  id: string,
  status: InterventionStatus,
): Intervention {
  const row = state().interventions.find((i) => i.id === id);
  if (!row) throw new Error("intervention_not_found");
  row.status = status;
  row.updatedAt = now();
  audit("operator", "intervention.status", `${row.action} → ${status}`);
  return row;
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

export function exportPlansJson(siteId?: string): string {
  const rows = siteId ? listPlans(siteId) : listPlans();
  return JSON.stringify(rows, null, 2);
}

export function createCompare(input: {
  name: string;
  siteId: string;
  guardInput: GuardInput;
}): CompareResult {
  const site = getSite(input.siteId);
  if (!site) throw new Error("site_not_found");
  const neuroAgentic = scoreNeuroAgentic(input.guardInput);
  const reactive = scoreReactive(input.guardInput);
  let winner: CompareResult["winner"] = "tie";
  if (neuroAgentic.overall > reactive.overall + 0.01) {
    winner = "neuro-agentic";
  } else if (reactive.overall > neuroAgentic.overall + 0.01) {
    winner = "reactive";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    siteId: input.siteId,
    input: input.guardInput,
    neuroAgentic,
    reactive,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("operator", "compare.create", row.name);
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
    "Marketing landing for IIoT defense buyers",
    "Industrial IoT site registry",
    "Site search by code, zone, and criticality",
    "Sensor stream catalog with metrics",
    "Anomaly score signals on sensors",
    "Anomaly filter on sensor list",
    "LLM defense plan drafts",
    "Neuro-agentic plan quality score",
    "Reactive threshold baseline score",
    "Balanced vs aggressive plan profile",
    "Plan readiness checklist",
    "Counterfactual physics injection runs",
    "CPI projected vs baseline safety delta",
    "CPI timeline audit trail",
    "Proposed / applied interventions",
    "Intervention status transitions",
    "Neuro-agentic vs reactive compare",
    "Compare winner badge + score bars",
    "Audit history list",
    "CSV audit export",
    "JSON defense plans export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on sites",
    "Dual-impl goldens sample API",
    "Pagination on sites / plans / audits",
    "Soft simulation disclaimer (not paper product brand)",
  ];
}
