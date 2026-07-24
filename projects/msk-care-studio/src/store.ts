import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreEvidenceGrounded, scoreUngroundedLlm } from "./domain/care";
import {
  readinessFromQuality,
  type CareInput,
  type CareQuality,
  type CareReadiness,
  type CareStage,
  type PlannerKind,
  type ScoreMode,
} from "./domain/types";

export type {
  CareInput,
  CareQuality,
  CareReadiness,
  CareStage,
  PlannerKind,
  ScoreMode,
};

export type MemberRole = "owner" | "clinician" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type EpisodeFocus =
  | "joint_replacement"
  | "spine"
  | "sports_injury"
  | "trauma";

export type CareEpisode = {
  id: string;
  name: string;
  patientLabel: string;
  focus: EpisodeFocus;
  careStage: CareStage;
  episodeDays: number;
  notes: string;
  createdAt: string;
};

export type StreamKind = "vitals" | "imaging" | "notes" | "orders" | "therapy";

export type StateStream = {
  id: string;
  episodeId: string;
  name: string;
  kind: StreamKind;
  freshness: number;
  coverage: number;
  notes: string;
  createdAt: string;
};

export type KnowledgeKind = "guideline" | "trial" | "protocol" | "local_kb";

export type KnowledgeSource = {
  id: string;
  episodeId: string;
  name: string;
  kind: KnowledgeKind;
  relevance: number;
  citation: string;
  notes: string;
  createdAt: string;
};

export type DecisionStatus = "draft" | "grounded" | "archived";

export type CareDecision = {
  id: string;
  episodeId: string;
  name: string;
  status: DecisionStatus;
  groundingScore: number;
  rationale: string;
  notes: string;
  createdAt: string;
};

export type PathwayStatus = "planned" | "active" | "complete";

export type CarePathway = {
  id: string;
  episodeId: string;
  name: string;
  status: PathwayStatus;
  progress: number;
  rehabTarget: number;
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
  defaultPlanner: PlannerKind;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  episodeId: string;
  input: CareInput;
  evidenceGrounded: CareQuality;
  ungroundedLlm: CareQuality;
  winner: "evidence_grounded" | "ungrounded_llm" | "tie";
  createdAt: string;
};

export type PlanRun = {
  id: string;
  episodeId: string;
  name: string;
  mode: ScoreMode;
  planner: PlannerKind;
  quality?: CareQuality;
  readiness?: CareReadiness;
  createdAt: string;
  updatedAt: string;
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
  episodes: CareEpisode[];
  streams: StateStream[];
  knowledge: KnowledgeSource[];
  decisions: CareDecision[];
  pathways: CarePathway[];
  planRuns: PlanRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __mskcsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): CareInput {
  return {
    streamCoverage: 0.84,
    knowledgeGrounding: 0.78,
    pathwayProgress: 0.62,
    decisionTraceability: 0.8,
    patientStability: 0.74,
    rehabReadiness: 0.58,
    evidenceFreshness: 0.86,
    comorbidityLoad: 0.28,
    episodeDays: 12,
    careStage: "acute",
    planner: "grounded",
  };
}

function seed(): StoreState {
  const episodeId = "ep-demo";
  const input = seedInput();
  const quality = scoreEvidenceGrounded(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "MSK Care Org",
      webhookUrl: "",
      webhookSecret: "mskcs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlanner: "grounded",
      defaultMode: "evidence_grounded",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@msk.local", role: "owner" },
      { id: "m2", email: "clinician@msk.local", role: "clinician" },
      { id: "m3", email: "viewer@msk.local", role: "viewer" },
    ],
    episodes: [
      {
        id: episodeId,
        name: "TKA · left knee · ward 4",
        patientLabel: "Patient A · de-identified",
        focus: "joint_replacement",
        careStage: "acute",
        episodeDays: 12,
        notes: "Demo episode for evidence-grounded MSK decisions",
        createdAt: now(),
      },
    ],
    streams: [
      {
        id: "st-demo",
        episodeId,
        name: "Post-op vitals + PT notes",
        kind: "therapy",
        freshness: 0.9,
        coverage: 0.85,
        notes: "Linked hospital state stream (simulated)",
        createdAt: now(),
      },
    ],
    knowledge: [
      {
        id: "kn-demo",
        episodeId,
        name: "AAOS TKA rehab pathway",
        kind: "guideline",
        relevance: 0.88,
        citation: "AAOS clinical practice guideline (simulated)",
        notes: "External knowledge source for grounding",
        createdAt: now(),
      },
    ],
    decisions: [
      {
        id: "dec-demo",
        episodeId,
        name: "Advance to supervised ambulation",
        status: "grounded",
        groundingScore: 0.82,
        rationale: "Stream vitals stable + guideline ambulation criteria met",
        notes: "Demo grounded decision",
        createdAt: now(),
      },
    ],
    pathways: [
      {
        id: "path-demo",
        episodeId,
        name: "Admission → acute → rehab",
        status: "active",
        progress: 0.55,
        rehabTarget: 0.75,
        notes: "Demo pathway across care stages",
        createdAt: now(),
      },
    ],
    planRuns: [
      {
        id: "run-demo",
        episodeId,
        name: "Evidence-grounded care plan",
        mode: "evidence_grounded",
        planner: "grounded",
        quality,
        readiness,
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
        detail: "Demo episode, stream, knowledge, decision, pathway loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__mskcsStore) g.__mskcsStore = seed();
  return g.__mskcsStore;
}

export function resetStore(): void {
  g.__mskcsStore = seed();
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

export function listEpisodes(
  q?: string,
  page = 1,
  pageSize = 50,
): {
  items: CareEpisode[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().episodes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.patientLabel.toLowerCase().includes(needle) ||
        r.focus.toLowerCase().includes(needle) ||
        r.careStage.toLowerCase().includes(needle) ||
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

export function createEpisode(input: {
  name: string;
  patientLabel: string;
  focus: EpisodeFocus;
  careStage?: CareStage;
  episodeDays?: number;
  notes?: string;
}): CareEpisode {
  const row: CareEpisode = {
    id: randomUUID(),
    name: input.name.trim(),
    patientLabel: input.patientLabel.trim(),
    focus: input.focus,
    careStage: input.careStage ?? "admission",
    episodeDays: Math.max(1, Math.min(120, Math.round(input.episodeDays ?? 1))),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().episodes.unshift(row);
  audit("clinician", "episode.create", row.name);
  return row;
}

export function getEpisode(id: string): CareEpisode | undefined {
  return state().episodes.find((e) => e.id === id);
}

export function listStreams(episodeId?: string, q?: string): StateStream[] {
  let rows = [...state().streams];
  if (episodeId) rows = rows.filter((r) => r.episodeId === episodeId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createStream(input: {
  episodeId: string;
  name: string;
  kind: StreamKind;
  freshness?: number;
  coverage?: number;
  notes?: string;
}): StateStream {
  const ep = getEpisode(input.episodeId);
  if (!ep) throw new Error("episode_not_found");
  const row: StateStream = {
    id: randomUUID(),
    episodeId: input.episodeId,
    name: input.name.trim(),
    kind: input.kind,
    freshness: Math.max(0, Math.min(1, input.freshness ?? 0.7)),
    coverage: Math.max(0, Math.min(1, input.coverage ?? 0.7)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().streams.unshift(row);
  audit("clinician", "stream.create", row.name);
  return row;
}

export function listKnowledge(
  episodeId?: string,
  q?: string,
): KnowledgeSource[] {
  let rows = [...state().knowledge];
  if (episodeId) rows = rows.filter((r) => r.episodeId === episodeId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle) ||
        r.citation.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createKnowledge(input: {
  episodeId: string;
  name: string;
  kind: KnowledgeKind;
  relevance?: number;
  citation: string;
  notes?: string;
}): KnowledgeSource {
  const ep = getEpisode(input.episodeId);
  if (!ep) throw new Error("episode_not_found");
  const row: KnowledgeSource = {
    id: randomUUID(),
    episodeId: input.episodeId,
    name: input.name.trim(),
    kind: input.kind,
    relevance: Math.max(0, Math.min(1, input.relevance ?? 0.7)),
    citation: input.citation.trim(),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().knowledge.unshift(row);
  audit("clinician", "knowledge.create", row.name);
  return row;
}

export function listDecisions(episodeId?: string): CareDecision[] {
  let rows = [...state().decisions];
  if (episodeId) rows = rows.filter((d) => d.episodeId === episodeId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createDecision(input: {
  episodeId: string;
  name: string;
  status?: DecisionStatus;
  groundingScore?: number;
  rationale: string;
  notes?: string;
}): CareDecision {
  const ep = getEpisode(input.episodeId);
  if (!ep) throw new Error("episode_not_found");
  const row: CareDecision = {
    id: randomUUID(),
    episodeId: input.episodeId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    groundingScore: Math.max(0, Math.min(1, input.groundingScore ?? 0.5)),
    rationale: input.rationale.trim(),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().decisions.unshift(row);
  audit("clinician", "decision.create", row.name);
  return row;
}

export function listPathways(episodeId?: string): CarePathway[] {
  let rows = [...state().pathways];
  if (episodeId) rows = rows.filter((p) => p.episodeId === episodeId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPathway(input: {
  episodeId: string;
  name: string;
  status?: PathwayStatus;
  progress?: number;
  rehabTarget?: number;
  notes?: string;
}): CarePathway {
  const ep = getEpisode(input.episodeId);
  if (!ep) throw new Error("episode_not_found");
  const row: CarePathway = {
    id: randomUUID(),
    episodeId: input.episodeId,
    name: input.name.trim(),
    status: input.status ?? "planned",
    progress: Math.max(0, Math.min(1, input.progress ?? 0.1)),
    rehabTarget: Math.max(0, Math.min(1, input.rehabTarget ?? 0.7)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().pathways.unshift(row);
  audit("clinician", "pathway.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromEpisode(
  episodeId: string,
  patch?: Partial<CareInput>,
  plannerKind?: PlannerKind,
): CareInput {
  const base = seedInput();
  const ep = getEpisode(episodeId);
  const streams = listStreams(episodeId);
  const knowledge = listKnowledge(episodeId);
  const decisions = listDecisions(episodeId);
  const pathways = listPathways(episodeId);
  const avgFresh =
    streams.length > 0
      ? streams.reduce((s, r) => s + r.freshness, 0) / streams.length
      : 0.55;
  const avgCov =
    streams.length > 0
      ? streams.reduce((s, r) => s + r.coverage, 0) / streams.length
      : 0.5;
  const avgRel =
    knowledge.length > 0
      ? knowledge.reduce((s, k) => s + k.relevance, 0) / knowledge.length
      : 0.5;
  const avgGround =
    decisions.length > 0
      ? decisions.reduce((s, d) => s + d.groundingScore, 0) / decisions.length
      : 0.45;
  const avgProg =
    pathways.length > 0
      ? pathways.reduce((s, p) => s + p.progress, 0) / pathways.length
      : 0.35;
  const avgRehab =
    pathways.length > 0
      ? pathways.reduce((s, p) => s + p.rehabTarget, 0) / pathways.length
      : 0.55;
  return {
    ...base,
    ...patch,
    streamCoverage:
      patch?.streamCoverage ??
      clamp01(0.35 + Math.min(0.45, streams.length * 0.12) + avgCov * 0.25),
    knowledgeGrounding:
      patch?.knowledgeGrounding ??
      clamp01(0.35 + Math.min(0.4, knowledge.length * 0.12) + avgRel * 0.3),
    pathwayProgress: patch?.pathwayProgress ?? clamp01(0.3 + avgProg * 0.55),
    decisionTraceability:
      patch?.decisionTraceability ??
      clamp01(0.35 + Math.min(0.4, decisions.length * 0.1) + avgGround * 0.3),
    patientStability:
      patch?.patientStability ?? clamp01(0.45 + avgFresh * 0.35),
    rehabReadiness: patch?.rehabReadiness ?? clamp01(0.35 + avgRehab * 0.45),
    evidenceFreshness: patch?.evidenceFreshness ?? clamp01(0.4 + avgFresh * 0.45),
    episodeDays: patch?.episodeDays ?? ep?.episodeDays ?? 7,
    careStage: patch?.careStage ?? ep?.careStage ?? "acute",
    planner: plannerKind ?? state().org.defaultPlanner,
  };
}

export function listPlanRuns(episodeId?: string): PlanRun[] {
  let rows = [...state().planRuns];
  if (episodeId) rows = rows.filter((p) => p.episodeId === episodeId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPlanRun(input: {
  episodeId: string;
  name: string;
  mode?: ScoreMode;
  planner?: PlannerKind;
  careInput?: Partial<CareInput>;
}): PlanRun {
  const ep = getEpisode(input.episodeId);
  if (!ep) throw new Error("episode_not_found");
  const planner = input.planner ?? state().org.defaultPlanner;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromEpisode(input.episodeId, input.careInput, planner);
  const quality =
    mode === "ungrounded_llm"
      ? scoreUngroundedLlm(emb)
      : scoreEvidenceGrounded(emb);
  const readiness = readinessFromQuality(quality, emb);
  const row: PlanRun = {
    id: randomUUID(),
    episodeId: input.episodeId,
    name: input.name.trim(),
    mode,
    planner,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().planRuns.unshift(row);
  audit("clinician", "plan_run.create", `${row.name} (${row.mode})`);
  return row;
}

export function listAudits(): AuditEntry[] {
  return [...state().audits];
}

export function exportAuditsCsv(): string {
  const header = "id,at,actor,action,detail";
  const lines = listAudits().map(
    (a) =>
      `${a.id},${a.at},${a.actor},${a.action},"${a.detail.replace(/"/g, '""')}"`,
  );
  return [header, ...lines].join("\n");
}

export function exportDecisionsJson(episodeId?: string): string {
  return JSON.stringify(listDecisions(episodeId), null, 2);
}

export function createCompare(input: {
  name: string;
  episodeId: string;
  careInput?: Partial<CareInput>;
}): CompareResult {
  const ep = getEpisode(input.episodeId);
  if (!ep) throw new Error("episode_not_found");
  const emb = inputFromEpisode(input.episodeId, input.careInput);
  const evidenceGrounded = scoreEvidenceGrounded(emb);
  const ungroundedLlm = scoreUngroundedLlm(emb);
  let winner: CompareResult["winner"] = "tie";
  if (evidenceGrounded.overall > ungroundedLlm.overall + 0.5)
    winner = "evidence_grounded";
  else if (ungroundedLlm.overall > evidenceGrounded.overall + 0.5)
    winner = "ungrounded_llm";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim() || `Compare · ${ep.name}`,
    episodeId: input.episodeId,
    input: emb,
    evidenceGrounded,
    ungroundedLlm,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("clinician", "compare.create", `${row.name} → ${row.winner}`);
  return row;
}

export function listCompares(): CompareResult[] {
  return [...state().compares].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function checkBearer(auth: string | null): boolean {
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === state().org.bearerToken;
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const s = state();
  const nowMs = Date.now();
  if (nowMs - s.rateBucket.windowStart > 60_000) {
    s.rateBucket = { windowStart: nowMs, count: 0 };
  }
  s.rateBucket.count += 1;
  const limit = s.org.rateLimitPerMinute;
  return {
    ok: s.rateBucket.count <= limit,
    remaining: Math.max(0, limit - s.rateBucket.count),
  };
}

export function signWebhook(body: string): string {
  return createHmac("sha256", state().org.webhookSecret)
    .update(body)
    .digest("hex");
}

export function ingestWebhook(
  body: string,
  signature: string | null,
  idempotencyKey: string,
): { ok: boolean; duplicate: boolean; id?: string; error?: string } {
  const expected = signWebhook(body);
  const sig = (signature ?? "").replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(sig, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, duplicate: false, error: "invalid_signature" };
    }
  } catch {
    return { ok: false, duplicate: false, error: "invalid_signature" };
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) {
    return { ok: true, duplicate: true, id: existing.id };
  }
  let payload: unknown = body;
  try {
    payload = JSON.parse(body);
  } catch {
    /* keep raw */
  }
  const row: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(row);
  audit("webhook", "ingest", idempotencyKey);
  return { ok: true, duplicate: false, id: row.id };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing for MSK care buyers",
    "Patient care episode registry",
    "Hospital state stream linking",
    "External medical knowledge sources",
    "Evidence-grounded decision ledger",
    "Admission → rehab pathway tracker",
    "Evidence-grounded plan scoring",
    "Ungrounded LLM baseline scoring",
    "Grounded vs ungrounded compare",
    "Care readiness gates",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotency",
    "Bearer auth",
    "Rate-limit feedback",
    "Audit log",
    "CSV audit export",
    "JSON decision export",
    "Episode search + pagination",
    "Honesty fence + Sources",
    "Features inventory API",
    "Grounding / pathway gap signals",
    "Onboarding checklist on episodes",
    "Offline try.html demo",
    "In-app guide link",
  ];
}

export function sampleGoldenInput(): CareInput {
  return seedInput();
}
