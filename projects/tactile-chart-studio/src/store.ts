import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreTactile, scoreVisual } from "./domain/tactile";
import {
  readinessFromQuality,
  type ExploreProfile,
  type ExploreReadiness,
  type ScoreMode,
  type TactileInput,
  type TactileQuality,
} from "./domain/types";

export type {
  ExploreProfile,
  ExploreReadiness,
  ScoreMode,
  TactileInput,
  TactileQuality,
};

export type MemberRole = "owner" | "designer" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type ChartKind = "bar" | "line" | "pie" | "scatter";

export type ChartAsset = {
  id: string;
  title: string;
  kind: ChartKind;
  seriesLabel: string;
  categoryCount: number;
  notes: string;
  createdAt: string;
};

export type LayerKind = "overview" | "axis" | "series" | "outlier" | "summary";

export type TactileLayer = {
  id: string;
  chartId: string;
  name: string;
  kind: LayerKind;
  texture: string;
  elevation: number;
  order: number;
  notes: string;
  createdAt: string;
};

export type GrammarToken = {
  id: string;
  name: string;
  trigger: string;
  spoken: string;
  haptic: string;
  notes: string;
  createdAt: string;
};

export type SessionStatus = "draft" | "active" | "closed";

export type ExploreSession = {
  id: string;
  chartId: string;
  name: string;
  status: SessionStatus;
  turns: number;
  notes: string;
  createdAt: string;
};

export type VerifyPhase = "select" | "confirm" | "ask" | "verify";

export type VerifyTurn = {
  id: string;
  sessionId: string;
  phase: VerifyPhase;
  prompt: string;
  response: string;
  confirmed: boolean;
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
  defaultProfile: ExploreProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  chartId: string;
  input: TactileInput;
  tactile: TactileQuality;
  visual: TactileQuality;
  winner: "tactile" | "visual" | "tie";
  createdAt: string;
};

export type PlanRun = {
  id: string;
  chartId: string;
  name: string;
  mode: ScoreMode;
  profile: ExploreProfile;
  quality?: TactileQuality;
  readiness?: ExploreReadiness;
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
  charts: ChartAsset[];
  layers: TactileLayer[];
  grammar: GrammarToken[];
  sessions: ExploreSession[];
  verifies: VerifyTurn[];
  plans: PlanRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __tcsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): TactileInput {
  return {
    chartClarity: 0.78,
    layerDepth: 0.74,
    grammarCoverage: 0.72,
    verifyDiscipline: 0.8,
    selectConfirmRate: 0.76,
    askFidelity: 0.7,
    tactileResolution: 0.72,
    conversationTurns: 12,
    multimodalSync: 0.75,
    feedbackSpeed: 0.7,
    a11yReview: 0.68,
    profile: "accessible",
  };
}

function seed(): StoreState {
  const chartId = "chart-demo";
  const sessionId = "session-demo";
  const input = seedInput();
  const quality = scoreTactile(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Accessible Charts Org",
      webhookUrl: "",
      webhookSecret: "tcs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "accessible",
      defaultMode: "tactile",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "designer@studio.local", role: "designer" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    charts: [
      {
        id: chartId,
        title: "Quarterly revenue by region",
        kind: "bar",
        seriesLabel: "Revenue (USD)",
        categoryCount: 4,
        notes: "Demo chart for BLV conversational exploration",
        createdAt: now(),
      },
    ],
    layers: [
      {
        id: "layer-demo",
        chartId,
        name: "Series elevation peel",
        kind: "series",
        texture: "ridged",
        elevation: 0.7,
        order: 1,
        notes: "Primary tactile encoding for bar heights",
        createdAt: now(),
      },
    ],
    grammar: [
      {
        id: "grammar-demo",
        name: "Peak value spoken",
        trigger: "on_select_max",
        spoken: "Highest bar is West at 4.2 million",
        haptic: "double_pulse",
        notes: "Demo feedback token",
        createdAt: now(),
      },
    ],
    sessions: [
      {
        id: sessionId,
        chartId,
        name: "BLV explore · revenue bars",
        status: "active",
        turns: 6,
        notes: "Demo select-confirm-ask-verify session",
        createdAt: now(),
      },
    ],
    verifies: [
      {
        id: "verify-demo",
        sessionId,
        phase: "confirm",
        prompt: "You selected West. Confirm?",
        response: "Yes, confirm West",
        confirmed: true,
        createdAt: now(),
      },
    ],
    plans: [
      {
        id: "plan-demo",
        chartId,
        name: "Conversational + tactile plan",
        mode: "tactile",
        profile: "accessible",
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
        detail: "Demo chart, layer, grammar, session, and verify turn loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__tcsStore) g.__tcsStore = seed();
  return g.__tcsStore;
}

export function resetStore(): void {
  g.__tcsStore = seed();
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

export function listCharts(q?: string, page = 1, pageSize = 50): {
  items: ChartAsset[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().charts].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        r.seriesLabel.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle) ||
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

export function createChart(input: {
  title: string;
  kind: ChartKind;
  seriesLabel: string;
  categoryCount?: number;
  notes?: string;
}): ChartAsset {
  const row: ChartAsset = {
    id: randomUUID(),
    title: input.title.trim(),
    kind: input.kind,
    seriesLabel: input.seriesLabel.trim(),
    categoryCount: Math.max(1, Math.round(input.categoryCount ?? 4)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().charts.unshift(row);
  audit("designer", "chart.create", row.title);
  return row;
}

export function getChart(id: string): ChartAsset | undefined {
  return state().charts.find((c) => c.id === id);
}

export function listLayers(chartId?: string, q?: string): TactileLayer[] {
  let rows = [...state().layers];
  if (chartId) rows = rows.filter((l) => l.chartId === chartId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (l) =>
        l.name.toLowerCase().includes(needle) ||
        l.kind.toLowerCase().includes(needle) ||
        l.texture.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
}

export function createLayer(input: {
  chartId: string;
  name: string;
  kind: LayerKind;
  texture: string;
  elevation?: number;
  order?: number;
  notes?: string;
}): TactileLayer {
  const chart = getChart(input.chartId);
  if (!chart) throw new Error("chart_not_found");
  const row: TactileLayer = {
    id: randomUUID(),
    chartId: input.chartId,
    name: input.name.trim(),
    kind: input.kind,
    texture: input.texture.trim(),
    elevation: Math.max(0, Math.min(1, input.elevation ?? 0.5)),
    order: Math.max(0, Math.round(input.order ?? listLayers(input.chartId).length + 1)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().layers.unshift(row);
  audit("designer", "layer.create", row.name);
  return row;
}

export function listGrammar(q?: string): GrammarToken[] {
  let rows = [...state().grammar];
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (g) =>
        g.name.toLowerCase().includes(needle) ||
        g.trigger.toLowerCase().includes(needle) ||
        g.spoken.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createGrammar(input: {
  name: string;
  trigger: string;
  spoken: string;
  haptic: string;
  notes?: string;
}): GrammarToken {
  const row: GrammarToken = {
    id: randomUUID(),
    name: input.name.trim(),
    trigger: input.trigger.trim(),
    spoken: input.spoken.trim(),
    haptic: input.haptic.trim(),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().grammar.unshift(row);
  audit("designer", "grammar.create", row.name);
  return row;
}

export function listSessions(chartId?: string): ExploreSession[] {
  let rows = [...state().sessions];
  if (chartId) rows = rows.filter((s) => s.chartId === chartId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSession(input: {
  chartId: string;
  name: string;
  status?: SessionStatus;
  turns?: number;
  notes?: string;
}): ExploreSession {
  const chart = getChart(input.chartId);
  if (!chart) throw new Error("chart_not_found");
  const row: ExploreSession = {
    id: randomUUID(),
    chartId: input.chartId,
    name: input.name.trim(),
    status: input.status ?? "active",
    turns: Math.max(0, Math.round(input.turns ?? 0)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().sessions.unshift(row);
  audit("designer", "session.create", row.name);
  return row;
}

export function getSession(id: string): ExploreSession | undefined {
  return state().sessions.find((s) => s.id === id);
}

export function listVerifies(sessionId?: string): VerifyTurn[] {
  let rows = [...state().verifies];
  if (sessionId) rows = rows.filter((v) => v.sessionId === sessionId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createVerify(input: {
  sessionId: string;
  phase: VerifyPhase;
  prompt: string;
  response?: string;
  confirmed?: boolean;
}): VerifyTurn {
  const session = getSession(input.sessionId);
  if (!session) throw new Error("session_not_found");
  const row: VerifyTurn = {
    id: randomUUID(),
    sessionId: input.sessionId,
    phase: input.phase,
    prompt: input.prompt.trim(),
    response: (input.response ?? "").trim(),
    confirmed: Boolean(input.confirmed),
    createdAt: now(),
  };
  state().verifies.unshift(row);
  session.turns += 1;
  audit("designer", "verify.turn", `${row.phase}: ${row.prompt}`);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromChart(
  chartId: string,
  patch?: Partial<TactileInput>,
  profile?: ExploreProfile,
): TactileInput {
  const base = seedInput();
  const layers = listLayers(chartId);
  const sessions = listSessions(chartId);
  const grammar = listGrammar();
  const sessionIds = new Set(sessions.map((s) => s.id));
  const verifies = state().verifies.filter((v) => sessionIds.has(v.sessionId));
  const confirmed = verifies.filter((v) => v.confirmed).length;
  const totalVerify = Math.max(1, verifies.length);
  const avgElevation =
    layers.length > 0
      ? layers.reduce((s, l) => s + l.elevation, 0) / layers.length
      : 0.4;
  const turns = sessions.reduce((s, x) => s + x.turns, 0);
  return {
    ...base,
    ...patch,
    chartClarity:
      patch?.chartClarity ??
      clamp01(0.5 + (getChart(chartId)?.categoryCount ? 0.2 : 0)),
    layerDepth:
      patch?.layerDepth ?? clamp01(0.35 + Math.min(0.5, layers.length * 0.12)),
    grammarCoverage:
      patch?.grammarCoverage ??
      clamp01(0.35 + Math.min(0.5, grammar.length * 0.1)),
    verifyDiscipline:
      patch?.verifyDiscipline ?? clamp01(0.35 + (confirmed / totalVerify) * 0.5),
    selectConfirmRate:
      patch?.selectConfirmRate ?? clamp01(0.4 + (confirmed / totalVerify) * 0.45),
    tactileResolution: patch?.tactileResolution ?? clamp01(0.35 + avgElevation * 0.5),
    conversationTurns:
      patch?.conversationTurns ?? Math.max(1, Math.min(40, turns || 8)),
    profile: profile ?? state().org.defaultProfile,
  };
}

export function listPlans(chartId?: string): PlanRun[] {
  let rows = [...state().plans];
  if (chartId) rows = rows.filter((p) => p.chartId === chartId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPlan(input: {
  chartId: string;
  name: string;
  mode?: ScoreMode;
  profile?: ExploreProfile;
  tactileInput?: Partial<TactileInput>;
}): PlanRun {
  const chart = getChart(input.chartId);
  if (!chart) throw new Error("chart_not_found");
  const profile = input.profile ?? state().org.defaultProfile;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromChart(input.chartId, input.tactileInput, profile);
  const quality = mode === "visual" ? scoreVisual(emb) : scoreTactile(emb);
  const readiness = readinessFromQuality(quality, emb);
  const row: PlanRun = {
    id: randomUUID(),
    chartId: input.chartId,
    name: input.name.trim(),
    mode,
    profile,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().plans.unshift(row);
  audit("designer", "plan.create", `${row.name} (${row.mode})`);
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

export function exportLayersJson(chartId?: string): string {
  return JSON.stringify(listLayers(chartId), null, 2);
}

export function createCompare(input: {
  name: string;
  chartId: string;
  tactileInput?: Partial<TactileInput>;
}): CompareResult {
  const chart = getChart(input.chartId);
  if (!chart) throw new Error("chart_not_found");
  const emb = inputFromChart(input.chartId, input.tactileInput);
  const tactile = scoreTactile(emb);
  const visual = scoreVisual(emb);
  let winner: CompareResult["winner"] = "tie";
  if (tactile.overall > visual.overall + 0.5) winner = "tactile";
  else if (visual.overall > tactile.overall + 0.5) winner = "visual";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim() || `Compare · ${chart.title}`,
    chartId: input.chartId,
    input: emb,
    tactile,
    visual,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("designer", "compare.create", `${row.name} → ${row.winner}`);
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
    "Marketing landing for BLV accessible charts",
    "Chart asset library",
    "Layered tactile presentation editor",
    "Feedback grammar tokens",
    "Conversational explore sessions",
    "Select-confirm-ask-verify loop",
    "Conversational+tactile plan score",
    "Visual-only baseline score",
    "Tactile vs visual compare",
    "Explore readiness checklist",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotency",
    "Bearer auth",
    "Rate-limit feedback",
    "Audit log",
    "CSV audit export",
    "JSON layers export",
    "Chart search + pagination",
    "Honesty fence + Sources",
    "Features inventory API",
    "Layer gap / verify gap signals",
    "Onboarding checklist on charts",
    "Offline try.html demo",
    "In-app guide link",
  ];
}

export function sampleGoldenInput(): TactileInput {
  return seedInput();
}
