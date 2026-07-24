import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreTrialError, scoreWorldModel } from "./domain/world";
import {
  readinessFromQuality,
  type ForecastReadiness,
  type PlanProfile,
  type ScoreMode,
  type WorldInput,
  type WorldQuality,
} from "./domain/types";

export type {
  ForecastReadiness,
  PlanProfile,
  ScoreMode,
  WorldInput,
  WorldQuality,
};

export type MemberRole = "owner" | "operator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type WorkspaceTier = "sandbox" | "team" | "production";

export type Workspace = {
  id: string;
  name: string;
  code: string;
  tier: WorkspaceTier;
  datasetCount: number;
  notes: string;
  createdAt: string;
};

export type OpKind =
  | "feature-build"
  | "model-fit"
  | "eval-run"
  | "data-clean"
  | "export-pack"
  | "hyper-search";

export type DataOperation = {
  id: string;
  workspaceId: string;
  name: string;
  kind: OpKind;
  estimatedCost: number;
  complexity: number;
  notes: string;
  createdAt: string;
};

export type ForecastStatus = "draft" | "ready" | "stale" | "archived";

export type OutcomeForecast = {
  id: string;
  operationId: string;
  workspaceId: string;
  name: string;
  mode: ScoreMode;
  status: ForecastStatus;
  profile: PlanProfile;
  quality?: WorldQuality;
  readiness?: ForecastReadiness;
  createdAt: string;
  updatedAt: string;
};

export type AgentStyle = "cautious" | "balanced" | "explorer";

export type AgentProfile = {
  id: string;
  workspaceId: string;
  name: string;
  style: AgentStyle;
  skill: number;
  notes: string;
  createdAt: string;
};

export type RolloutStatus = "planned" | "running" | "complete" | "aborted";

export type RolloutRun = {
  id: string;
  forecastId: string;
  agentId: string;
  workspaceId: string;
  label: string;
  status: RolloutStatus;
  plannedOverall: number;
  executedOverall: number;
  delta: number;
  timeline: string[];
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
  operationId: string;
  input: WorldInput;
  worldModel: WorldQuality;
  trialError: WorldQuality;
  winner: "world-model" | "trial-error" | "tie";
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
  workspaces: Workspace[];
  operations: DataOperation[];
  forecasts: OutcomeForecast[];
  agents: AgentProfile[];
  rollouts: RolloutRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __dwsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): WorldInput {
  return {
    stateCoverage: 0.86,
    costAwareness: 0.78,
    planHorizon: 0.74,
    simFidelity: 0.72,
    dataQuality: 0.8,
    featureRichness: 0.7,
    agentSkill: 0.76,
    explorationNoise: 0.22,
    retryBudget: 0.35,
    computeBudget: 0.68,
    opComplexity: 0.55,
    stepCount: 12,
    profile: "balanced",
  };
}

function seed(): StoreState {
  const workspaceId = "ws-demo";
  const operationId = "op-demo";
  const forecastId = "fc-demo";
  const agentId = "agent-demo";
  const input = seedInput();
  const quality = scoreWorldModel(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Data World Org",
      webhookUrl: "",
      webhookSecret: "dws-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "balanced",
      defaultMode: "world-model",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "ds-lead@studio.local", role: "operator" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    workspaces: [
      {
        id: workspaceId,
        name: "Churn Lab Alpha",
        code: "CLA-01",
        tier: "team",
        datasetCount: 4,
        notes: "Demo workspace for pre-execution forecasts",
        createdAt: now(),
      },
    ],
    operations: [
      {
        id: operationId,
        workspaceId,
        name: "Feature build + model fit",
        kind: "model-fit",
        estimatedCost: 42,
        complexity: 0.62,
        notes: "Cost-sensitive pipeline with eval gate",
        createdAt: now(),
      },
    ],
    forecasts: [
      {
        id: forecastId,
        operationId,
        workspaceId,
        name: "World-model pre-run",
        mode: "world-model",
        status: "ready",
        profile: "balanced",
        quality,
        readiness,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    agents: [
      {
        id: agentId,
        workspaceId,
        name: "Planner-7",
        style: "balanced",
        skill: 0.78,
        notes: "Default DS agent profile for demo rollouts",
        createdAt: now(),
      },
    ],
    rollouts: [
      {
        id: "roll-demo",
        forecastId,
        agentId,
        workspaceId,
        label: "Planned vs executed demo",
        status: "complete",
        plannedOverall: quality.overall,
        executedOverall: round2(quality.overall - 3.2),
        delta: -3.2,
        timeline: [
          "Forecast locked with world-model plan",
          "Agent started with cost caps",
          "Lightweight sim matched mid-run state",
          "Executed outcome within forecast band",
        ],
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
        detail:
          "Demo workspace, operation, forecast, agent, and rollout loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function state(): StoreState {
  if (!g.__dwsStore) g.__dwsStore = seed();
  return g.__dwsStore;
}

export function resetStore(): void {
  g.__dwsStore = seed();
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

export function listWorkspaces(q?: string): Workspace[] {
  const all = [...state().workspaces].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (w) =>
      w.name.toLowerCase().includes(needle) ||
      w.code.toLowerCase().includes(needle) ||
      w.notes.toLowerCase().includes(needle) ||
      w.tier.toLowerCase().includes(needle),
  );
}

export function createWorkspace(input: {
  name: string;
  code: string;
  tier: WorkspaceTier;
  datasetCount: number;
  notes: string;
}): Workspace {
  const workspace: Workspace = {
    id: randomUUID(),
    name: input.name.trim(),
    code: input.code.trim().toUpperCase(),
    tier: input.tier,
    datasetCount: Math.max(0, Math.min(500, Math.round(input.datasetCount))),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().workspaces.unshift(workspace);
  audit("operator", "workspace.create", workspace.name);
  return workspace;
}

export function getWorkspace(id: string): Workspace | undefined {
  return state().workspaces.find((w) => w.id === id);
}

export function listOperations(
  workspaceId?: string,
  q?: string,
  maxCost?: number,
): DataOperation[] {
  let rows = [...state().operations];
  if (workspaceId) rows = rows.filter((o) => o.workspaceId === workspaceId);
  if (maxCost !== undefined) {
    rows = rows.filter((o) => o.estimatedCost <= maxCost);
  }
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (o) =>
        o.name.toLowerCase().includes(needle) ||
        o.kind.toLowerCase().includes(needle) ||
        o.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createOperation(input: {
  workspaceId: string;
  name: string;
  kind: OpKind;
  estimatedCost: number;
  complexity: number;
  notes: string;
}): DataOperation {
  const workspace = getWorkspace(input.workspaceId);
  if (!workspace) throw new Error("workspace_not_found");
  const operation: DataOperation = {
    id: randomUUID(),
    workspaceId: input.workspaceId,
    name: input.name.trim(),
    kind: input.kind,
    estimatedCost: Math.max(1, Math.min(10_000, Math.round(input.estimatedCost))),
    complexity: Math.max(0, Math.min(1, input.complexity)),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().operations.unshift(operation);
  audit("operator", "operation.create", operation.name);
  return operation;
}

export function getOperation(id: string): DataOperation | undefined {
  return state().operations.find((o) => o.id === id);
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromOperation(
  operation: DataOperation,
  workspace: Workspace,
  agent?: AgentProfile,
  patch?: Partial<WorldInput>,
  profile?: PlanProfile,
): WorldInput {
  const base = seedInput();
  const tierBoost =
    workspace.tier === "production"
      ? 0.82
      : workspace.tier === "team"
        ? 0.68
        : 0.45;
  return {
    ...base,
    ...patch,
    stateCoverage: patch?.stateCoverage ?? clamp01(0.55 + tierBoost * 0.35),
    costAwareness: patch?.costAwareness ?? clamp01(0.5 + tierBoost * 0.3),
    planHorizon: patch?.planHorizon ?? clamp01(0.48 + (1 - operation.complexity) * 0.35),
    simFidelity: patch?.simFidelity ?? clamp01(0.5 + tierBoost * 0.28),
    dataQuality:
      patch?.dataQuality ??
      clamp01(0.45 + Math.min(1, workspace.datasetCount / 8) * 0.4),
    featureRichness: patch?.featureRichness ?? clamp01(0.5 + tierBoost * 0.25),
    agentSkill: patch?.agentSkill ?? agent?.skill ?? 0.72,
    explorationNoise:
      patch?.explorationNoise ??
      clamp01(
        agent?.style === "explorer"
          ? 0.55
          : agent?.style === "cautious"
            ? 0.15
            : 0.28,
      ),
    retryBudget: patch?.retryBudget ?? 0.4,
    computeBudget:
      patch?.computeBudget ??
      clamp01(0.75 - Math.min(1, operation.estimatedCost / 200) * 0.35),
    opComplexity: patch?.opComplexity ?? operation.complexity,
    stepCount:
      patch?.stepCount ??
      Math.max(3, Math.min(40, Math.round(6 + operation.complexity * 18))),
    profile: profile ?? state().org.defaultProfile,
  };
}

export function listForecasts(operationId?: string): OutcomeForecast[] {
  let rows = [...state().forecasts];
  if (operationId) rows = rows.filter((f) => f.operationId === operationId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createForecast(input: {
  operationId: string;
  name: string;
  mode?: ScoreMode;
  profile?: PlanProfile;
  agentId?: string;
  worldInput?: Partial<WorldInput>;
}): OutcomeForecast {
  const operation = getOperation(input.operationId);
  if (!operation) throw new Error("operation_not_found");
  const workspace = getWorkspace(operation.workspaceId);
  if (!workspace) throw new Error("workspace_not_found");
  const agent = input.agentId
    ? state().agents.find((a) => a.id === input.agentId)
    : state().agents.find((a) => a.workspaceId === workspace.id);
  const profile = input.profile ?? state().org.defaultProfile;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromOperation(
    operation,
    workspace,
    agent,
    input.worldInput,
    profile,
  );
  const quality =
    mode === "trial-error" ? scoreTrialError(emb) : scoreWorldModel(emb);
  const readiness = readinessFromQuality(quality, emb);
  const forecast: OutcomeForecast = {
    id: randomUUID(),
    operationId: operation.id,
    workspaceId: workspace.id,
    name: input.name.trim(),
    mode,
    status: "ready",
    profile,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().forecasts.unshift(forecast);
  audit("operator", "forecast.create", `${forecast.name} (${forecast.mode})`);
  return forecast;
}

export function listAgents(workspaceId?: string): AgentProfile[] {
  let rows = [...state().agents];
  if (workspaceId) rows = rows.filter((a) => a.workspaceId === workspaceId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createAgent(input: {
  workspaceId: string;
  name: string;
  style: AgentStyle;
  skill: number;
  notes: string;
}): AgentProfile {
  const workspace = getWorkspace(input.workspaceId);
  if (!workspace) throw new Error("workspace_not_found");
  const agent: AgentProfile = {
    id: randomUUID(),
    workspaceId: input.workspaceId,
    name: input.name.trim(),
    style: input.style,
    skill: Math.max(0, Math.min(1, input.skill)),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().agents.unshift(agent);
  audit("operator", "agent.create", agent.name);
  return agent;
}

export function listRollouts(workspaceId?: string): RolloutRun[] {
  let rows = [...state().rollouts];
  if (workspaceId) rows = rows.filter((r) => r.workspaceId === workspaceId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createRollout(input: {
  forecastId: string;
  agentId: string;
  label?: string;
}): RolloutRun {
  const forecast = state().forecasts.find((f) => f.id === input.forecastId);
  if (!forecast) throw new Error("forecast_not_found");
  const agent = state().agents.find((a) => a.id === input.agentId);
  if (!agent) throw new Error("agent_not_found");
  const planned = forecast.quality?.overall ?? 50;
  const drift =
    agent.style === "explorer"
      ? 6.5
      : agent.style === "cautious"
        ? 2.2
        : 3.8;
  const executed = round2(
    Math.max(0, Math.min(100, planned - drift + agent.skill * 4)),
  );
  const rollout: RolloutRun = {
    id: randomUUID(),
    forecastId: forecast.id,
    agentId: agent.id,
    workspaceId: forecast.workspaceId,
    label: (input.label ?? `Rollout · ${forecast.name}`).trim(),
    status: "complete",
    plannedOverall: planned,
    executedOverall: executed,
    delta: round2(executed - planned),
    timeline: [
      "Forecast locked before execution",
      `${agent.name} started with ${forecast.mode} plan`,
      "Mid-run cost and state checks",
      "Executed outcome recorded against forecast",
    ],
    createdAt: now(),
    updatedAt: now(),
  };
  state().rollouts.unshift(rollout);
  audit("operator", "rollout.create", rollout.label);
  return rollout;
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

export function exportForecastsJson(workspaceId?: string): string {
  const rows = workspaceId
    ? listForecasts().filter((f) => f.workspaceId === workspaceId)
    : listForecasts();
  return JSON.stringify(rows, null, 2);
}

export function createCompare(input: {
  name: string;
  operationId: string;
  worldInput: WorldInput;
}): CompareResult {
  const operation = getOperation(input.operationId);
  if (!operation) throw new Error("operation_not_found");
  const worldModel = scoreWorldModel(input.worldInput);
  const trialError = scoreTrialError(input.worldInput);
  let winner: CompareResult["winner"] = "tie";
  if (worldModel.overall > trialError.overall + 0.01) {
    winner = "world-model";
  } else if (trialError.overall > worldModel.overall + 0.01) {
    winner = "trial-error";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    operationId: input.operationId,
    input: input.worldInput,
    worldModel,
    trialError,
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
    "Marketing landing for DS-agent efficiency",
    "Data science workspace registry",
    "Workspace search by code and tier",
    "Operation catalog with kinds",
    "Cost signals on operations",
    "Cost filter on operation list",
    "Pre-execution outcome forecasts",
    "World-model plan quality score",
    "Trial-and-error baseline score",
    "Balanced vs aggressive plan profile",
    "Forecast readiness checklist",
    "Autonomous agent profiles",
    "Agent style tags (cautious / balanced / explorer)",
    "Rollout runs planned vs executed",
    "Rollout timeline audit trail",
    "World-model vs trial-and-error compare",
    "Compare winner badge + score bars",
    "Audit history list",
    "CSV audit export",
    "JSON forecasts export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on workspaces",
    "Dual-impl goldens sample API",
    "Pagination on workspaces / forecasts / audits",
    "Soft simulation disclaimer (not DSWorld brand)",
  ];
}
