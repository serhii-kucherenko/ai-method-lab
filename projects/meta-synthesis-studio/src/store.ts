import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreAdhoc, scoreAgentic } from "./domain/synthesis";
import {
  readinessFromQuality,
  type PipelineReadiness,
  type ScoreMode,
  type SynthesisInput,
  type SynthesisProfile,
  type SynthesisQuality,
} from "./domain/types";

export type {
  PipelineReadiness,
  ScoreMode,
  SynthesisInput,
  SynthesisProfile,
  SynthesisQuality,
};

export type MemberRole = "owner" | "analyst" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type QuestionStatus = "draft" | "active" | "closed";

export type ReviewQuestion = {
  id: string;
  title: string;
  pico: string;
  population: string;
  intervention: string;
  comparator: string;
  outcome: string;
  status: QuestionStatus;
  notes: string;
  createdAt: string;
};

export type SearchStrategy = {
  id: string;
  questionId: string;
  name: string;
  databases: string;
  queryString: string;
  dateFrom: string;
  dateTo: string;
  hitEstimate: number;
  notes: string;
  createdAt: string;
};

export type ScreenVerdict = "include" | "exclude" | "maybe";

export type ScreenDecision = {
  id: string;
  questionId: string;
  searchId: string;
  citation: string;
  verdict: ScreenVerdict;
  reason: string;
  reviewer: string;
  createdAt: string;
};

export type EffectRecord = {
  id: string;
  questionId: string;
  studyLabel: string;
  effectSize: number;
  se: number;
  n: number;
  outcome: string;
  notes: string;
  createdAt: string;
};

export type PooledAnalysis = {
  id: string;
  questionId: string;
  name: string;
  mode: ScoreMode;
  profile: SynthesisProfile;
  quality?: SynthesisQuality;
  readiness?: PipelineReadiness;
  pooledEffect: number;
  iSquared: number;
  tauSquared: number;
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
  defaultProfile: SynthesisProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  questionId: string;
  input: SynthesisInput;
  agentic: SynthesisQuality;
  adhoc: SynthesisQuality;
  winner: "agentic" | "adhoc" | "tie";
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
  questions: ReviewQuestion[];
  searches: SearchStrategy[];
  screens: ScreenDecision[];
  effects: EffectRecord[];
  analyses: PooledAnalysis[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __mssStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function seedInput(): SynthesisInput {
  return {
    questionClarity: 0.78,
    searchBreadth: 0.72,
    screenDiscipline: 0.8,
    extractionCompleteness: 0.74,
    studyCount: 18,
    effectPrecision: 0.7,
    heterogeneityAware: 0.82,
    poolingQuality: 0.76,
    inclusionStrictness: 0.75,
    duplicateControl: 0.7,
    biasAssessment: 0.68,
    profile: "balanced",
  };
}

function seed(): StoreState {
  const questionId = "q-demo";
  const searchId = "search-demo";
  const input = seedInput();
  const quality = scoreAgentic(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Evidence Synthesis Org",
      webhookUrl: "",
      webhookSecret: "mss-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "balanced",
      defaultMode: "agentic",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "analyst@studio.local", role: "analyst" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    questions: [
      {
        id: questionId,
        title: "Statins vs placebo for LDL in adults with CVD",
        pico: "P: adults with CVD · I: statin · C: placebo · O: LDL-C",
        population: "Adults with established CVD",
        intervention: "Statin therapy",
        comparator: "Placebo or usual care",
        outcome: "LDL-C change (mg/dL)",
        status: "active",
        notes: "Demo review question for agentic pipeline",
        createdAt: now(),
      },
    ],
    searches: [
      {
        id: searchId,
        questionId,
        name: "PubMed + Embase lipid cascade",
        databases: "PubMed, Embase, Cochrane",
        queryString: "(statin*) AND (LDL OR lipid*) AND (CVD OR cardiovascular)",
        dateFrom: "2010-01-01",
        dateTo: "2025-12-31",
        hitEstimate: 842,
        notes: "Demo search strategy",
        createdAt: now(),
      },
    ],
    screens: [
      {
        id: "screen-demo",
        questionId,
        searchId,
        citation: "Smith 2019 · RCT · n=420 · LDL primary",
        verdict: "include",
        reason: "Meets PICO; extractable continuous LDL effect",
        reviewer: "analyst@studio.local",
        createdAt: now(),
      },
    ],
    effects: [
      {
        id: "effect-demo",
        questionId,
        studyLabel: "Smith 2019",
        effectSize: -28.4,
        se: 3.2,
        n: 420,
        outcome: "LDL-C mg/dL",
        notes: "Mean difference vs placebo",
        createdAt: now(),
      },
    ],
    analyses: [
      {
        id: "analysis-demo",
        questionId,
        name: "Agentic random-effects pool",
        mode: "agentic",
        profile: "balanced",
        quality,
        readiness,
        pooledEffect: -24.6,
        iSquared: 38.2,
        tauSquared: 12.4,
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
        detail: "Demo question, search, screen, effect, and analysis loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__mssStore) g.__mssStore = seed();
  return g.__mssStore;
}

export function resetStore(): void {
  g.__mssStore = seed();
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

export function listQuestions(q?: string, page = 1, pageSize = 50): {
  items: ReviewQuestion[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().questions].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        r.pico.toLowerCase().includes(needle) ||
        r.outcome.toLowerCase().includes(needle) ||
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

export function createQuestion(input: {
  title: string;
  pico?: string;
  population: string;
  intervention: string;
  comparator: string;
  outcome: string;
  notes?: string;
  status?: QuestionStatus;
}): ReviewQuestion {
  const pico =
    input.pico?.trim() ||
    `P: ${input.population} · I: ${input.intervention} · C: ${input.comparator} · O: ${input.outcome}`;
  const row: ReviewQuestion = {
    id: randomUUID(),
    title: input.title.trim(),
    pico,
    population: input.population.trim(),
    intervention: input.intervention.trim(),
    comparator: input.comparator.trim(),
    outcome: input.outcome.trim(),
    status: input.status ?? "active",
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().questions.unshift(row);
  audit("analyst", "question.create", row.title);
  return row;
}

export function getQuestion(id: string): ReviewQuestion | undefined {
  return state().questions.find((q) => q.id === id);
}

export function listSearches(questionId?: string, q?: string): SearchStrategy[] {
  let rows = [...state().searches];
  if (questionId) rows = rows.filter((s) => s.questionId === questionId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (s) =>
        s.name.toLowerCase().includes(needle) ||
        s.queryString.toLowerCase().includes(needle) ||
        s.databases.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSearch(input: {
  questionId: string;
  name: string;
  databases: string;
  queryString: string;
  dateFrom?: string;
  dateTo?: string;
  hitEstimate?: number;
  notes?: string;
}): SearchStrategy {
  const q = getQuestion(input.questionId);
  if (!q) throw new Error("question_not_found");
  const row: SearchStrategy = {
    id: randomUUID(),
    questionId: input.questionId,
    name: input.name.trim(),
    databases: input.databases.trim(),
    queryString: input.queryString.trim(),
    dateFrom: input.dateFrom?.trim() || "2000-01-01",
    dateTo: input.dateTo?.trim() || "2026-12-31",
    hitEstimate: Math.max(0, Math.round(input.hitEstimate ?? 0)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().searches.unshift(row);
  audit("analyst", "search.create", row.name);
  return row;
}

export function listScreens(questionId?: string): ScreenDecision[] {
  let rows = [...state().screens];
  if (questionId) rows = rows.filter((s) => s.questionId === questionId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createScreen(input: {
  questionId: string;
  searchId: string;
  citation: string;
  verdict: ScreenVerdict;
  reason?: string;
  reviewer?: string;
}): ScreenDecision {
  const q = getQuestion(input.questionId);
  if (!q) throw new Error("question_not_found");
  const search = state().searches.find((s) => s.id === input.searchId);
  if (!search) throw new Error("search_not_found");
  const row: ScreenDecision = {
    id: randomUUID(),
    questionId: input.questionId,
    searchId: input.searchId,
    citation: input.citation.trim(),
    verdict: input.verdict,
    reason: (input.reason ?? "").trim(),
    reviewer: (input.reviewer ?? "analyst@studio.local").trim(),
    createdAt: now(),
  };
  state().screens.unshift(row);
  audit("analyst", "screen.decide", `${row.verdict}: ${row.citation}`);
  return row;
}

export function listEffects(questionId?: string): EffectRecord[] {
  let rows = [...state().effects];
  if (questionId) rows = rows.filter((e) => e.questionId === questionId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createEffect(input: {
  questionId: string;
  studyLabel: string;
  effectSize: number;
  se: number;
  n: number;
  outcome: string;
  notes?: string;
}): EffectRecord {
  const q = getQuestion(input.questionId);
  if (!q) throw new Error("question_not_found");
  const row: EffectRecord = {
    id: randomUUID(),
    questionId: input.questionId,
    studyLabel: input.studyLabel.trim(),
    effectSize: input.effectSize,
    se: Math.max(0.01, input.se),
    n: Math.max(1, Math.round(input.n)),
    outcome: input.outcome.trim(),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().effects.unshift(row);
  audit("analyst", "effect.create", row.studyLabel);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromQuestion(
  questionId: string,
  patch?: Partial<SynthesisInput>,
  profile?: SynthesisProfile,
): SynthesisInput {
  const base = seedInput();
  const screens = listScreens(questionId);
  const effects = listEffects(questionId);
  const searches = listSearches(questionId);
  const included = screens.filter((s) => s.verdict === "include").length;
  const excluded = screens.filter((s) => s.verdict === "exclude").length;
  const totalScreens = Math.max(1, screens.length);
  const avgSe =
    effects.length > 0
      ? effects.reduce((s, e) => s + e.se, 0) / effects.length
      : 4;
  return {
    ...base,
    ...patch,
    questionClarity:
      patch?.questionClarity ??
      clamp01(0.55 + (getQuestion(questionId)?.pico ? 0.2 : 0)),
    searchBreadth:
      patch?.searchBreadth ??
      clamp01(0.4 + Math.min(0.45, searches.length * 0.15)),
    screenDiscipline:
      patch?.screenDiscipline ??
      clamp01(0.35 + (included + excluded) / totalScreens * 0.5),
    extractionCompleteness:
      patch?.extractionCompleteness ??
      clamp01(0.35 + Math.min(0.5, effects.length * 0.08)),
    studyCount:
      patch?.studyCount ??
      Math.max(1, Math.min(100, effects.length || included || 8)),
    effectPrecision:
      patch?.effectPrecision ?? clamp01(1 - Math.min(0.7, avgSe / 12)),
    profile: profile ?? state().org.defaultProfile,
  };
}

function softPool(effects: EffectRecord[]): {
  pooledEffect: number;
  iSquared: number;
  tauSquared: number;
} {
  if (effects.length === 0) {
    return { pooledEffect: 0, iSquared: 0, tauSquared: 0 };
  }
  let wSum = 0;
  let yw = 0;
  for (const e of effects) {
    const w = 1 / (e.se * e.se);
    wSum += w;
    yw += w * e.effectSize;
  }
  const pooled = yw / wSum;
  const qStat = effects.reduce((s, e) => {
    const w = 1 / (e.se * e.se);
    return s + w * (e.effectSize - pooled) ** 2;
  }, 0);
  const df = Math.max(1, effects.length - 1);
  const c =
    wSum -
    effects.reduce((s, e) => {
      const w = 1 / (e.se * e.se);
      return s + (w * w) / wSum;
    }, 0);
  const tau = Math.max(0, (qStat - df) / Math.max(0.01, c));
  const i2 = Math.max(0, Math.min(100, ((qStat - df) / Math.max(0.01, qStat)) * 100));
  return {
    pooledEffect: round2(pooled),
    iSquared: round2(i2),
    tauSquared: round2(tau),
  };
}

export function listAnalyses(questionId?: string): PooledAnalysis[] {
  let rows = [...state().analyses];
  if (questionId) rows = rows.filter((a) => a.questionId === questionId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createAnalysis(input: {
  questionId: string;
  name: string;
  mode?: ScoreMode;
  profile?: SynthesisProfile;
  synthesisInput?: Partial<SynthesisInput>;
}): PooledAnalysis {
  const q = getQuestion(input.questionId);
  if (!q) throw new Error("question_not_found");
  const profile = input.profile ?? state().org.defaultProfile;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromQuestion(input.questionId, input.synthesisInput, profile);
  const quality = mode === "adhoc" ? scoreAdhoc(emb) : scoreAgentic(emb);
  const readiness = readinessFromQuality(quality, emb);
  const pool = softPool(listEffects(input.questionId));
  const row: PooledAnalysis = {
    id: randomUUID(),
    questionId: input.questionId,
    name: input.name.trim(),
    mode,
    profile,
    quality,
    readiness,
    pooledEffect: pool.pooledEffect,
    iSquared: mode === "adhoc" ? 0 : pool.iSquared,
    tauSquared: mode === "adhoc" ? 0 : pool.tauSquared,
    createdAt: now(),
    updatedAt: now(),
  };
  state().analyses.unshift(row);
  audit("analyst", "analysis.create", `${row.name} (${row.mode})`);
  return row;
}

export function getAnalysis(id: string): PooledAnalysis | undefined {
  return state().analyses.find((a) => a.id === id);
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

export function exportEffectsJson(questionId?: string): string {
  return JSON.stringify(listEffects(questionId), null, 2);
}

export function createCompare(input: {
  name: string;
  questionId: string;
  synthesisInput?: Partial<SynthesisInput>;
}): CompareResult {
  const q = getQuestion(input.questionId);
  if (!q) throw new Error("question_not_found");
  const emb = inputFromQuestion(input.questionId, input.synthesisInput);
  const agentic = scoreAgentic(emb);
  const adhoc = scoreAdhoc(emb);
  let winner: CompareResult["winner"] = "tie";
  if (agentic.overall > adhoc.overall + 0.5) winner = "agentic";
  else if (adhoc.overall > agentic.overall + 0.5) winner = "adhoc";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim() || `Compare · ${q.title}`,
    questionId: input.questionId,
    input: emb,
    agentic,
    adhoc,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("analyst", "compare.create", `${row.name} → ${row.winner}`);
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
    "Marketing landing for evidence teams",
    "Review question workspace (PICO)",
    "Search strategy builder",
    "Literature screen queue",
    "Screen include / exclude / maybe",
    "Effect extraction ledger",
    "Pooled analysis with soft I²",
    "Heterogeneity-aware agentic score",
    "Ad-hoc baseline without screen/hetero",
    "Agentic vs ad-hoc compare",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotency",
    "Bearer auth",
    "Rate-limit feedback",
    "Audit log",
    "CSV audit export",
    "JSON effects export",
    "Question search + pagination",
    "Honesty fence + Sources",
    "Features inventory API",
    "Soft forest-plot readiness gaps",
    "Pipeline readiness checklist",
    "Offline try.html demo",
    "In-app guide link",
  ];
}

export function sampleGoldenInput(): SynthesisInput {
  return seedInput();
}
