import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreMultiAgent, scoreSingleAgent } from "./domain/score";
import {
  readinessFromQuality,
  type DomainKind,
  type PlanKind,
  type ReasonInput,
  type ReasonQuality,
  type ScoreMode,
  type DebateReadiness,
} from "./domain/types";

export type {
  DomainKind,
  PlanKind,
  ReasonInput,
  ReasonQuality,
  ScoreMode,
  DebateReadiness,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type RulePackStatus = "draft" | "active" | "archived";

export type RulePack = {
  id: string;
  name: string;
  domainKind: DomainKind;
  status: RulePackStatus;
  coverage: number;
  ruleCount: number;
  notes: string;
  createdAt: string;
};

export type AgentRole = "proposer" | "challenger" | "referee" | "synthesizer";

export type AgentConfig = {
  id: string;
  name: string;
  role: AgentRole;
  temperature: number;
  notes: string;
  createdAt: string;
};

export type DebateStatus = "draft" | "running" | "completed" | "archived";

export type DebateRound = {
  id: string;
  rulePackId: string;
  name: string;
  status: DebateStatus;
  turnCount: number;
  depth: number;
  challengerPressure: number;
  consensusStrength: number;
  notes: string;
  createdAt: string;
};

export type GameScoreStatus = "draft" | "computed" | "reviewed" | "rejected";

export type GameScoreRecord = {
  id: string;
  rulePackId: string;
  debateId: string;
  name: string;
  status: GameScoreStatus;
  bayesianUpdate: number;
  teamCoordination: number;
  evidenceGrounding: number;
  notes: string;
  createdAt: string;
};

export type FlagSeverity = "low" | "medium" | "high" | "critical";

export type FlagStatus = "open" | "reviewing" | "resolved" | "dismissed";

export type HallucinationFlag = {
  id: string;
  rulePackId: string;
  debateId: string;
  name: string;
  severity: FlagSeverity;
  status: FlagStatus;
  fluencyBias: number;
  contradictionRate: number;
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
  rulePackId: string;
  input: ReasonInput;
  multiAgent: ReasonQuality;
  singleAgent: ReasonQuality;
  winner: "multi_agent" | "single_agent" | "tie";
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
  rulePacks: RulePack[];
  agents: AgentConfig[];
  debates: DebateRound[];
  scores: GameScoreRecord[];
  flags: HallucinationFlag[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __rfsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): ReasonInput {
  return {
    ruleCoverage: 0.78,
    debateDepth: 0.74,
    consensusStrength: 0.72,
    challengerPressure: 0.7,
    bayesianUpdate: 0.73,
    evidenceGrounding: 0.76,
    fluencyBias: 0.22,
    teamCoordination: 0.75,
    priorConfidence: 0.55,
    contradictionRate: 0.2,
    domainKind: "physics",
    plan: "multi_agent",
  };
}

function seed(): StoreState {
  const packId = "pack-demo";
  const debateId = "debate-demo";
  return {
    org: {
      name: "Reason Frame Org",
      webhookUrl: "",
      webhookSecret: "rfs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "multi_agent",
      defaultMode: "multi_agent",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@reason-frame.local", role: "owner" },
      { id: "m2", email: "reader@reason-frame.local", role: "reader" },
      { id: "m3", email: "viewer@reason-frame.local", role: "viewer" },
    ],
    rulePacks: [
      {
        id: packId,
        name: "Thermo constraint pack",
        domainKind: "physics",
        status: "active",
        coverage: 0.78,
        ruleCount: 24,
        notes: "Conservation + unit consistency rules for thermo claims",
        createdAt: now(),
      },
    ],
    agents: [
      {
        id: "agent-proposer",
        name: "Proposer Alpha",
        role: "proposer",
        temperature: 0.4,
        notes: "Drafts rule-grounded answers",
        createdAt: now(),
      },
      {
        id: "agent-challenger",
        name: "Challenger Beta",
        role: "challenger",
        temperature: 0.7,
        notes: "Pressure-tests for fluent falsehoods",
        createdAt: now(),
      },
      {
        id: "agent-referee",
        name: "Referee Gamma",
        role: "referee",
        temperature: 0.2,
        notes: "Scores team-game outcomes",
        createdAt: now(),
      },
    ],
    debates: [
      {
        id: debateId,
        rulePackId: packId,
        name: "Entropy inequality round",
        status: "completed",
        turnCount: 6,
        depth: 0.74,
        challengerPressure: 0.7,
        consensusStrength: 0.72,
        notes: "Seed debate for thermo pack",
        createdAt: now(),
      },
    ],
    scores: [
      {
        id: "score-demo",
        rulePackId: packId,
        debateId,
        name: "Bayesian team score",
        status: "computed",
        bayesianUpdate: 0.73,
        teamCoordination: 0.75,
        evidenceGrounding: 0.76,
        notes: "Seed game score",
        createdAt: now(),
      },
    ],
    flags: [
      {
        id: "flag-demo",
        rulePackId: packId,
        debateId,
        name: "Unit slip in fluent answer",
        severity: "medium",
        status: "open",
        fluencyBias: 0.55,
        contradictionRate: 0.35,
        notes: "Single-agent path invented joules as watts",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: randomUUID(),
        at: now(),
        actor: "system",
        action: "store.seed",
        detail: "Reason Frame Studio seed state",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__rfsStore) g.__rfsStore = seed();
  return g.__rfsStore;
}

export function resetStore(): void {
  g.__rfsStore = seed();
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
  const org = state().org;
  Object.assign(org, patch);
  audit("owner", "org.update", JSON.stringify(Object.keys(patch)));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole = "reader"): Member {
  const row: Member = {
    id: randomUUID(),
    email: email.trim().toLowerCase(),
    role,
  };
  state().members.push(row);
  audit("owner", "member.invite", `${row.email}:${row.role}`);
  return row;
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === state().org.bearerToken;
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
  if (bucket.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: Math.max(0, limit - bucket.count) };
}

export function listRulePacks(q?: string, page = 1, pageSize = 20): {
  items: RulePack[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().rulePacks];
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.domainKind.includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const total = rows.length;
  const start = Math.max(0, (page - 1) * pageSize);
  return {
    items: rows.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
}

export function createRulePack(input: {
  name: string;
  domainKind: DomainKind;
  status?: RulePackStatus;
  coverage?: number;
  ruleCount?: number;
  notes?: string;
}): RulePack {
  const row: RulePack = {
    id: randomUUID(),
    name: input.name.trim(),
    domainKind: input.domainKind,
    status: input.status ?? "draft",
    coverage: Math.max(0, Math.min(1, input.coverage ?? 0.7)),
    ruleCount: Math.max(1, input.ruleCount ?? 10),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().rulePacks.unshift(row);
  audit("reader", "rulepack.create", row.name);
  return row;
}

export function getRulePack(id: string): RulePack | undefined {
  return state().rulePacks.find((d) => d.id === id);
}

export function listAgents(q?: string): AgentConfig[] {
  let rows = [...state().agents];
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.role.includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createAgent(input: {
  name: string;
  role: AgentRole;
  temperature?: number;
  notes?: string;
}): AgentConfig {
  const row: AgentConfig = {
    id: randomUUID(),
    name: input.name.trim(),
    role: input.role,
    temperature: Math.max(0, Math.min(1.5, input.temperature ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().agents.unshift(row);
  audit("reader", "agent.create", `${row.name}:${row.role}`);
  return row;
}

export function listDebates(rulePackId?: string, q?: string): DebateRound[] {
  let rows = [...state().debates];
  if (rulePackId) rows = rows.filter((r) => r.rulePackId === rulePackId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle) ||
        r.status.includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createDebate(input: {
  rulePackId: string;
  name: string;
  status?: DebateStatus;
  turnCount?: number;
  depth?: number;
  challengerPressure?: number;
  consensusStrength?: number;
  notes?: string;
}): DebateRound {
  if (!getRulePack(input.rulePackId)) throw new Error("rulepack_not_found");
  const row: DebateRound = {
    id: randomUUID(),
    rulePackId: input.rulePackId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    turnCount: Math.max(1, input.turnCount ?? 4),
    depth: Math.max(0, Math.min(1, input.depth ?? 0.65)),
    challengerPressure: Math.max(
      0,
      Math.min(1, input.challengerPressure ?? 0.6),
    ),
    consensusStrength: Math.max(
      0,
      Math.min(1, input.consensusStrength ?? 0.6),
    ),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().debates.unshift(row);
  audit("reader", "debate.create", row.name);
  return row;
}

export function listScores(rulePackId?: string, q?: string): GameScoreRecord[] {
  let rows = [...state().scores];
  if (rulePackId) rows = rows.filter((r) => r.rulePackId === rulePackId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createScore(input: {
  rulePackId: string;
  debateId: string;
  name: string;
  status?: GameScoreStatus;
  bayesianUpdate?: number;
  teamCoordination?: number;
  evidenceGrounding?: number;
  notes?: string;
}): GameScoreRecord {
  if (!getRulePack(input.rulePackId)) throw new Error("rulepack_not_found");
  const debate = state().debates.find((d) => d.id === input.debateId);
  if (!debate || debate.rulePackId !== input.rulePackId) {
    throw new Error("debate_not_found");
  }
  const row: GameScoreRecord = {
    id: randomUUID(),
    rulePackId: input.rulePackId,
    debateId: input.debateId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    bayesianUpdate: Math.max(0, Math.min(1, input.bayesianUpdate ?? 0.7)),
    teamCoordination: Math.max(
      0,
      Math.min(1, input.teamCoordination ?? 0.7),
    ),
    evidenceGrounding: Math.max(
      0,
      Math.min(1, input.evidenceGrounding ?? 0.7),
    ),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().scores.unshift(row);
  audit("reader", "score.create", row.name);
  return row;
}

export function listFlags(rulePackId?: string, q?: string): HallucinationFlag[] {
  let rows = [...state().flags];
  if (rulePackId) rows = rows.filter((r) => r.rulePackId === rulePackId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.severity.includes(needle) ||
        r.status.includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createFlag(input: {
  rulePackId: string;
  debateId: string;
  name: string;
  severity?: FlagSeverity;
  status?: FlagStatus;
  fluencyBias?: number;
  contradictionRate?: number;
  notes?: string;
}): HallucinationFlag {
  if (!getRulePack(input.rulePackId)) throw new Error("rulepack_not_found");
  const debate = state().debates.find((d) => d.id === input.debateId);
  if (!debate || debate.rulePackId !== input.rulePackId) {
    throw new Error("debate_not_found");
  }
  const row: HallucinationFlag = {
    id: randomUUID(),
    rulePackId: input.rulePackId,
    debateId: input.debateId,
    name: input.name.trim(),
    severity: input.severity ?? "medium",
    status: input.status ?? "open",
    fluencyBias: Math.max(0, Math.min(1, input.fluencyBias ?? 0.5)),
    contradictionRate: Math.max(
      0,
      Math.min(1, input.contradictionRate ?? 0.3),
    ),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().flags.unshift(row);
  audit("reader", "flag.create", `${row.name}:${row.severity}`);
  return row;
}

export function resolveFlag(
  id: string,
  status: FlagStatus = "resolved",
): HallucinationFlag {
  const row = state().flags.find((f) => f.id === id);
  if (!row) throw new Error("flag_not_found");
  row.status = status;
  audit("reader", "flag.resolve", `${row.name}→${status}`);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromPack(
  rulePackId: string,
  patch?: Partial<ReasonInput>,
  planKind?: PlanKind,
): ReasonInput {
  const pack = getRulePack(rulePackId);
  if (!pack) throw new Error("rulepack_not_found");
  const debates = listDebates(rulePackId);
  const scores = listScores(rulePackId);
  const flags = listFlags(rulePackId);
  const debate = debates[0];
  const score = scores[0];
  const flag = flags[0];
  const base: ReasonInput = {
    ruleCoverage: pack.coverage,
    debateDepth: debate?.depth ?? 0.5,
    consensusStrength: debate?.consensusStrength ?? 0.5,
    challengerPressure: debate?.challengerPressure ?? 0.5,
    bayesianUpdate: score?.bayesianUpdate ?? 0.5,
    evidenceGrounding: score?.evidenceGrounding ?? 0.5,
    fluencyBias: flag?.fluencyBias ?? 0.3,
    teamCoordination: score?.teamCoordination ?? 0.5,
    priorConfidence: 0.55,
    contradictionRate: flag?.contradictionRate ?? 0.25,
    domainKind: pack.domainKind,
    plan: planKind ?? state().org.defaultPlan,
  };
  return { ...base, ...patch, domainKind: pack.domainKind };
}

export function listCompares(): CompareResult[] {
  return [...state().compares].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function createCompare(input: {
  name: string;
  rulePackId: string;
  patch?: Partial<ReasonInput>;
}): CompareResult {
  if (!getRulePack(input.rulePackId)) throw new Error("rulepack_not_found");
  const multiInput = inputFromPack(input.rulePackId, input.patch, "multi_agent");
  const singleInput: ReasonInput = {
    ...multiInput,
    plan: "single_agent",
    debateDepth: clamp01(multiInput.debateDepth - 0.35),
    challengerPressure: clamp01(multiInput.challengerPressure - 0.3),
    teamCoordination: clamp01(multiInput.teamCoordination - 0.32),
    fluencyBias: clamp01(multiInput.fluencyBias + 0.35),
    priorConfidence: clamp01(multiInput.priorConfidence + 0.2),
  };
  const multiAgent = scoreMultiAgent({ ...multiInput, plan: "multi_agent" });
  const singleAgent = scoreSingleAgent(singleInput);
  const delta = multiAgent.overall - singleAgent.overall;
  const winner =
    Math.abs(delta) < 0.5
      ? "tie"
      : delta > 0
        ? "multi_agent"
        : "single_agent";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    rulePackId: input.rulePackId,
    input: multiInput,
    multiAgent,
    singleAgent,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("reader", "compare.create", `${row.name} → ${row.winner}`);
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

export function exportRulePacksJson(): string {
  return JSON.stringify(listRulePacks().items, null, 2);
}

export function exportDebatesJson(): string {
  return JSON.stringify(listDebates(), null, 2);
}

export function receiveWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const body = JSON.stringify(payload ?? {});
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const provided = (signature ?? "").replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "invalid_signature" };
    }
  } catch {
    return { ok: false, error: "invalid_signature" };
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, id: existing.id };
  const row: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(row);
  audit("webhook", "webhook.receive", idempotencyKey);
  return { ok: true, id: row.id };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing for scientific anti-hallucination buyers",
    "Scientific rule-pack registry with search and pagination",
    "Rule coverage and domain kind tracking",
    "Multi-agent debate round workspace",
    "Debate turn count and depth tracking",
    "Challenger pressure and consensus strength",
    "Bayesian / team-game scoring records",
    "Evidence grounding on game scores",
    "Hallucination flag console",
    "Flag severity and resolve workflow",
    "Agent role configurations (proposer/challenger/referee)",
    "Agent temperature and role notes",
    "Multi-agent vs single-agent compare",
    "Dual score A multi-agent game plan quality",
    "Dual score B single-agent fluent baseline",
    "Org settings and bearer auth",
    "Member invite with roles",
    "Idempotent HMAC webhook",
    "Audit log",
    "CSV audit export",
    "JSON rule-pack export",
    "JSON debates export",
    "Rate-limit feedback",
    "Features inventory API",
    "Goldens sample API",
    "Honesty fence and Sources",
    "Offline try.html demo",
    "In-app guide link",
    "Filter debates scores flags by rule pack",
    "Onboarding checklist on rules page",
  ];
}

export function sampleGoldenInput(): ReasonInput {
  return seedInput();
}

export function scorePlan(
  input: ReasonInput,
  mode: ScoreMode,
): ReasonQuality {
  switch (mode) {
    case "multi_agent":
      return scoreMultiAgent({ ...input, plan: "multi_agent" });
    case "single_agent":
      return scoreSingleAgent({ ...input, plan: "single_agent" });
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

export function readinessFor(
  input: ReasonInput,
  mode: ScoreMode,
): DebateReadiness {
  return readinessFromQuality(scorePlan(input, mode), input);
}
