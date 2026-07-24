import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreMulti, scoreSingle } from "./domain/plan";
import {
  orchestrationFromQuality,
  type OrchestrationView,
  type PlanInput,
  type PlanProfile,
  type PlanQuality,
  type ScoreMode,
} from "./domain/types";

export type MemberRole = "owner" | "planner" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type DomainKind =
  | "finance"
  | "supply"
  | "hr"
  | "manufacturing"
  | "procurement";

export type ErpDomain = {
  id: string;
  name: string;
  kind: DomainKind;
  complexity: number;
  crossLinks: number;
  notes: string;
  createdAt: string;
};

export type AgentRoleKind = "planner" | "allocator" | "reviewer" | "coordinator";

export type AgentRole = {
  id: string;
  domainId: string;
  name: string;
  kind: AgentRoleKind;
  specialization: number;
  active: boolean;
  createdAt: string;
};

export type PlanRun = {
  id: string;
  domainId: string;
  mode: ScoreMode;
  profile: PlanProfile;
  stage:
    | "queued"
    | "intake"
    | "allocate"
    | "reconcile"
    | "review"
    | "complete"
    | "failed";
  input: PlanInput;
  quality?: PlanQuality;
  orchestration?: OrchestrationView;
  domainLabel: string;
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
  defaultProfile: PlanProfile;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  domainId: string;
  input: PlanInput;
  multi: PlanQuality;
  single: PlanQuality;
  winner: "multi" | "single" | "tie";
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
  domains: ErpDomain[];
  agents: AgentRole[];
  runs: PlanRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __easStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): PlanInput {
  return {
    domainComplexity: 0.68,
    constraintCount: 10,
    roleCoverage: 0.82,
    coordinationRounds: 4,
    conflictResolutionDepth: 0.74,
    capacityTightness: 0.58,
    demandVolatility: 0.42,
    crossDomainLinks: 2,
    auditTrailStrictness: 0.7,
    plannerSpecialization: 0.78,
    allocatorSpecialization: 0.72,
    reviewerSpecialization: 0.68,
    profile: "balanced",
  };
}

function seed(): StoreState {
  const domainId = "dom-demo";
  const runId = "run-demo";
  const input = seedInput();
  const quality = scoreMulti(input);
  const orchestration = orchestrationFromQuality(quality, input);

  return {
    org: {
      name: "Enterprise Agent Org",
      webhookUrl: "",
      webhookSecret: "eas-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "balanced",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "planner@studio.local", role: "planner" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    domains: [
      {
        id: domainId,
        name: "Supply network planning",
        kind: "supply",
        complexity: 0.68,
        crossLinks: 2,
        notes: "Demo ERP domain for multi-agent resource plans",
        createdAt: now(),
      },
    ],
    agents: [
      {
        id: "ag1",
        domainId,
        name: "Demand planner",
        kind: "planner",
        specialization: 0.78,
        active: true,
        createdAt: now(),
      },
      {
        id: "ag2",
        domainId,
        name: "Capacity allocator",
        kind: "allocator",
        specialization: 0.72,
        active: true,
        createdAt: now(),
      },
      {
        id: "ag3",
        domainId,
        name: "Plan reviewer",
        kind: "reviewer",
        specialization: 0.68,
        active: true,
        createdAt: now(),
      },
      {
        id: "ag4",
        domainId,
        name: "Cross-domain coordinator",
        kind: "coordinator",
        specialization: 0.65,
        active: true,
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        domainId,
        mode: "multi",
        profile: "balanced",
        stage: "complete",
        input,
        quality,
        orchestration,
        domainLabel: "Supply network planning",
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
        detail: "Demo domain, role agents, and completed multi-agent plan loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__easStore) g.__easStore = seed();
  return g.__easStore;
}

export function resetStore(): void {
  g.__easStore = seed();
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

export function listDomains(q?: string): ErpDomain[] {
  const all = [...state().domains].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (d) =>
      d.name.toLowerCase().includes(needle) ||
      d.kind.toLowerCase().includes(needle) ||
      d.notes.toLowerCase().includes(needle),
  );
}

export function createDomain(input: {
  name: string;
  kind: DomainKind;
  complexity: number;
  crossLinks: number;
  notes: string;
}): ErpDomain {
  const domain: ErpDomain = {
    id: randomUUID(),
    name: input.name.trim(),
    kind: input.kind,
    complexity: Math.max(0, Math.min(1, input.complexity)),
    crossLinks: Math.max(0, Math.min(5, Math.round(input.crossLinks))),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().domains.unshift(domain);
  audit("planner", "domain.create", domain.name);
  return domain;
}

export function getDomain(id: string): ErpDomain | undefined {
  return state().domains.find((d) => d.id === id);
}

export function listAgents(domainId?: string): AgentRole[] {
  let rows = [...state().agents];
  if (domainId) rows = rows.filter((a) => a.domainId === domainId);
  return rows.sort((a, b) => a.kind.localeCompare(b.kind));
}

export function createAgent(input: {
  domainId: string;
  name: string;
  kind: AgentRoleKind;
  specialization: number;
  active?: boolean;
}): AgentRole {
  const domain = getDomain(input.domainId);
  if (!domain) throw new Error("domain_not_found");
  const agent: AgentRole = {
    id: randomUUID(),
    domainId: input.domainId,
    name: input.name.trim(),
    kind: input.kind,
    specialization: Math.max(0, Math.min(1, input.specialization)),
    active: input.active ?? true,
    createdAt: now(),
  };
  state().agents.unshift(agent);
  audit("planner", "agent.create", `${agent.name} (${agent.kind})`);
  return agent;
}

export function setAgentActive(id: string, active: boolean): AgentRole {
  const agent = state().agents.find((a) => a.id === id);
  if (!agent) throw new Error("agent_not_found");
  agent.active = active;
  audit("planner", "agent.toggle", `${agent.name} → ${active}`);
  return { ...agent };
}

export function listRuns(domainId?: string): PlanRun[] {
  let rows = [...state().runs];
  if (domainId) rows = rows.filter((r) => r.domainId === domainId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function inputFromDomain(
  domain: ErpDomain,
  agents: AgentRole[],
  patch?: Partial<PlanInput>,
  profile?: PlanProfile,
): PlanInput {
  const active = agents.filter((a) => a.active);
  const byKind = (k: AgentRoleKind) =>
    active.find((a) => a.kind === k)?.specialization ?? 0.35;
  const base = seedInput();
  return {
    ...base,
    ...patch,
    domainComplexity: patch?.domainComplexity ?? domain.complexity,
    crossDomainLinks: patch?.crossDomainLinks ?? domain.crossLinks,
    roleCoverage:
      patch?.roleCoverage ??
      Math.min(1, active.length / 4),
    plannerSpecialization: patch?.plannerSpecialization ?? byKind("planner"),
    allocatorSpecialization:
      patch?.allocatorSpecialization ?? byKind("allocator"),
    reviewerSpecialization: patch?.reviewerSpecialization ?? byKind("reviewer"),
    profile: profile ?? state().org.defaultProfile,
  };
}

export function createRun(input: {
  domainId: string;
  mode?: ScoreMode;
  profile?: PlanProfile;
  domainLabel?: string;
  planInput?: Partial<PlanInput>;
}): PlanRun {
  const domain = getDomain(input.domainId);
  if (!domain) throw new Error("domain_not_found");
  const profile = input.profile ?? state().org.defaultProfile;
  const emb = inputFromDomain(
    domain,
    listAgents(domain.id),
    input.planInput,
    profile,
  );
  const qualityPreview =
    input.mode === "single" ? scoreSingle(emb) : scoreMulti(emb);
  const run: PlanRun = {
    id: randomUUID(),
    domainId: input.domainId,
    mode: input.mode ?? "multi",
    profile,
    stage: "queued",
    input: emb,
    orchestration: orchestrationFromQuality(qualityPreview, emb),
    domainLabel: (input.domainLabel ?? domain.name).trim(),
    createdAt: now(),
    updatedAt: now(),
  };
  state().runs.unshift(run);
  audit("planner", "run.create", `${run.id} ${run.mode}`);
  return run;
}

const STAGE_ORDER: PlanRun["stage"][] = [
  "queued",
  "intake",
  "allocate",
  "reconcile",
  "review",
  "complete",
];

export function advanceRun(id: string): PlanRun {
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
      run.mode === "multi" ? scoreMulti(run.input) : scoreSingle(run.input);
    run.orchestration = orchestrationFromQuality(run.quality, run.input);
  }

  run.stage = next;
  run.updatedAt = now();
  audit("planner", "run.advance", `${run.id} → ${next}`);
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

export function exportRunsJson(domainId?: string): string {
  return JSON.stringify(listRuns(domainId), null, 2);
}

export function createCompare(input: {
  name: string;
  domainId: string;
  planInput: PlanInput;
}): CompareResult {
  const domain = getDomain(input.domainId);
  if (!domain) throw new Error("domain_not_found");
  const multi = scoreMulti(input.planInput);
  const single = scoreSingle(input.planInput);
  let winner: CompareResult["winner"] = "tie";
  if (multi.overall > single.overall + 0.01) {
    winner = "multi";
  } else if (single.overall > multi.overall + 0.01) {
    winner = "single";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    domainId: input.domainId,
    input: input.planInput,
    multi,
    single,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("planner", "compare.create", row.name);
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
    "ERP domain workspace create",
    "Domain search (kind / notes)",
    "Role agent roster",
    "Agent orchestration toggle",
    "Resource plan console",
    "Multi-agent orchestrated mode",
    "Single-agent unchecked baseline",
    "Balanced vs aggressive plan profile",
    "Intake / allocate / reconcile / review stage advance",
    "Constraint count editor on plans",
    "Role coverage from active agents",
    "Multi vs single compare",
    "Compare winner badge + score bars",
    "Runs audit list",
    "CSV audit export",
    "JSON plan-run export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on domains",
    "Dual-impl goldens sample API",
    "Pagination on domains / runs / audits",
    "Coordination lift + allocation fit metrics",
    "Soft simulation disclaimer (not Agentic ERP brand)",
  ];
}
