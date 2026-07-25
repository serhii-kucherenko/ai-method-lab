import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreOfflineBatch, scoreRealtimeStream } from "./domain/stream";
import {
  readinessFromQuality,
  type SegmentBias,
  type ScoreMode,
  type StreamInput,
  type StreamProfile,
  type StreamQuality,
} from "./domain/types";

export type {
  SegmentBias,
  ScoreMode,
  StreamInput,
  StreamProfile,
  StreamQuality,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type StreamStatus = "live" | "paused" | "archived";

export type SignStream = {
  id: string;
  label: string;
  languagePair: string;
  signerPace: number;
  motionStability: number;
  occlusionNoise: number;
  status: StreamStatus;
  notes: string;
  createdAt: string;
};

export type SegmentStatus = "draft" | "active" | "archived";

export type SentenceSegment = {
  id: string;
  streamId: string;
  glossText: string;
  boundaryConfidence: number;
  startMs: number;
  endMs: number;
  status: SegmentStatus;
  notes: string;
  createdAt: string;
};

export type FlushPolicy = "early_flush" | "wait_boundary" | "batch_only";

export type BudgetStatus = "draft" | "active" | "archived";

export type LatencyBudget = {
  id: string;
  streamId: string;
  budgetMs: number;
  jitterMs: number;
  flushPolicy: FlushPolicy;
  status: BudgetStatus;
  notes: string;
  createdAt: string;
};

export type GlossaryPriority = "core" | "domain" | "rare";

export type GlossaryEntry = {
  id: string;
  streamId: string;
  term: string;
  coverage: number;
  priority: GlossaryPriority;
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
  defaultProfile: StreamProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type StreamCompare = {
  id: string;
  name: string;
  streamId: string;
  segmentId: string;
  budgetId: string;
  input: StreamInput;
  realtime: StreamQuality;
  offlineBatch: StreamQuality;
  winner: "realtime_stream" | "offline_batch" | "tie";
  gap: number;
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
  streams: SignStream[];
  segments: SentenceSegment[];
  budgets: LatencyBudget[];
  glossary: GlossaryEntry[];
  audits: AuditEntry[];
  compares: StreamCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __sssStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const streamId = "stream-demo";
  const segmentId = "seg-demo";
  const budgetId = "budget-demo";
  return {
    org: {
      name: "Sign Stream Org",
      webhookUrl: "",
      webhookSecret: "sss-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "realtime_stream",
      defaultMode: "realtime_stream",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@sign-stream.local", role: "owner" },
      { id: "m2", email: "reader@sign-stream.local", role: "reader" },
      { id: "m3", email: "viewer@sign-stream.local", role: "viewer" },
    ],
    streams: [
      {
        id: streamId,
        label: "Campus lobby ASL feed",
        languagePair: "ASL→EN",
        signerPace: 0.42,
        motionStability: 0.78,
        occlusionNoise: 0.18,
        status: "live",
        notes: "Seed sign stream",
        createdAt: now(),
      },
    ],
    segments: [
      {
        id: segmentId,
        streamId,
        glossText: "WHERE LIBRARY",
        boundaryConfidence: 0.82,
        startMs: 1200,
        endMs: 2800,
        status: "active",
        notes: "Seed sentence segment",
        createdAt: now(),
      },
    ],
    budgets: [
      {
        id: budgetId,
        streamId,
        budgetMs: 800,
        jitterMs: 60,
        flushPolicy: "wait_boundary",
        status: "active",
        notes: "Seed latency budget",
        createdAt: now(),
      },
    ],
    glossary: [
      {
        id: "gloss-demo",
        streamId,
        term: "LIBRARY",
        coverage: 0.91,
        priority: "core",
        notes: "Seed glossary entry",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: randomUUID(),
        at: now(),
        actor: "system",
        action: "store.seed",
        detail: "Sign Stream Studio seed state",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__sssStore) g.__sssStore = seed();
  return g.__sssStore;
}

export function resetStore(): void {
  g.__sssStore = seed();
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

export function inviteMember(
  email: string,
  role: MemberRole = "reader",
): Member {
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

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 20,
): { items: T[]; page: number; pageSize: number; total: number } {
  const p = Math.max(1, page);
  const ps = Math.min(100, Math.max(1, pageSize));
  const start = (p - 1) * ps;
  return {
    items: items.slice(start, start + ps),
    page: p,
    pageSize: ps,
    total: items.length,
  };
}

export function listStreams(
  q?: string,
  page = 1,
  pageSize = 20,
  status?: StreamStatus,
  languagePair?: string,
) {
  let rows = [...state().streams];
  if (status) rows = rows.filter((s) => s.status === status);
  if (languagePair?.trim()) {
    const lp = languagePair.trim().toLowerCase();
    rows = rows.filter((s) => s.languagePair.toLowerCase().includes(lp));
  }
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (s) =>
        s.label.toLowerCase().includes(needle) ||
        s.languagePair.toLowerCase().includes(needle) ||
        s.notes.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createStream(input: {
  label: string;
  languagePair?: string;
  signerPace?: number;
  motionStability?: number;
  occlusionNoise?: number;
  status?: StreamStatus;
  notes?: string;
}): SignStream {
  const row: SignStream = {
    id: randomUUID(),
    label: input.label.trim(),
    languagePair: input.languagePair?.trim() || "ASL→EN",
    signerPace: input.signerPace ?? 0.4,
    motionStability: input.motionStability ?? 0.7,
    occlusionNoise: input.occlusionNoise ?? 0.2,
    status: input.status ?? "live",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().streams.unshift(row);
  audit("owner", "stream.create", row.id);
  return row;
}

export function archiveStream(id: string): SignStream {
  const row = state().streams.find((s) => s.id === id);
  if (!row) throw new Error("stream_not_found");
  row.status = "archived";
  audit("owner", "stream.archive", id);
  return row;
}

export function listSegments(
  q?: string,
  page = 1,
  pageSize = 20,
  streamId?: string,
) {
  let rows = [...state().segments];
  if (streamId) rows = rows.filter((s) => s.streamId === streamId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (s) =>
        s.glossText.toLowerCase().includes(needle) ||
        s.notes.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createSegment(input: {
  streamId: string;
  glossText: string;
  boundaryConfidence?: number;
  startMs?: number;
  endMs?: number;
  status?: SegmentStatus;
  notes?: string;
}): SentenceSegment {
  if (!state().streams.some((s) => s.id === input.streamId)) {
    throw new Error("stream_not_found");
  }
  const row: SentenceSegment = {
    id: randomUUID(),
    streamId: input.streamId,
    glossText: input.glossText.trim(),
    boundaryConfidence: input.boundaryConfidence ?? 0.75,
    startMs: input.startMs ?? 0,
    endMs: input.endMs ?? 1500,
    status: input.status ?? "draft",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().segments.unshift(row);
  audit("owner", "segment.create", row.id);
  return row;
}

export function listBudgets(
  q?: string,
  page = 1,
  pageSize = 20,
  streamId?: string,
) {
  let rows = [...state().budgets];
  if (streamId) rows = rows.filter((b) => b.streamId === streamId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (b) =>
        b.flushPolicy.toLowerCase().includes(needle) ||
        b.notes.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createBudget(input: {
  streamId: string;
  budgetMs?: number;
  jitterMs?: number;
  flushPolicy?: FlushPolicy;
  status?: BudgetStatus;
  notes?: string;
}): LatencyBudget {
  if (!state().streams.some((s) => s.id === input.streamId)) {
    throw new Error("stream_not_found");
  }
  const row: LatencyBudget = {
    id: randomUUID(),
    streamId: input.streamId,
    budgetMs: input.budgetMs ?? 900,
    jitterMs: input.jitterMs ?? 50,
    flushPolicy: input.flushPolicy ?? "wait_boundary",
    status: input.status ?? "draft",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().budgets.unshift(row);
  audit("owner", "budget.create", row.id);
  return row;
}

export function listGlossary(
  q?: string,
  page = 1,
  pageSize = 20,
  streamId?: string,
) {
  let rows = [...state().glossary];
  if (streamId) rows = rows.filter((g) => g.streamId === streamId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (g) =>
        g.term.toLowerCase().includes(needle) ||
        g.notes.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createGlossaryEntry(input: {
  streamId: string;
  term: string;
  coverage?: number;
  priority?: GlossaryPriority;
  notes?: string;
}): GlossaryEntry {
  if (!state().streams.some((s) => s.id === input.streamId)) {
    throw new Error("stream_not_found");
  }
  const row: GlossaryEntry = {
    id: randomUUID(),
    streamId: input.streamId,
    term: input.term.trim().toUpperCase(),
    coverage: input.coverage ?? 0.7,
    priority: input.priority ?? "core",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().glossary.unshift(row);
  audit("owner", "glossary.create", row.id);
  return row;
}

function inputFromStream(
  streamId: string,
  segmentId: string,
  budgetId: string,
): StreamInput {
  const stream = state().streams.find((s) => s.id === streamId);
  const segment = state().segments.find((s) => s.id === segmentId);
  const budget = state().budgets.find((b) => b.id === budgetId);
  const glossRows = state().glossary.filter((g) => g.streamId === streamId);
  const coverage =
    glossRows.length === 0
      ? 0.55
      : glossRows.reduce((sum, g) => sum + g.coverage, 0) / glossRows.length;
  const flush = budget?.flushPolicy ?? "wait_boundary";
  const segmentBias: SegmentBias =
    flush === "early_flush" || flush === "wait_boundary" || flush === "batch_only"
      ? flush
      : "balanced";
  const latencyMs =
    (segment?.endMs ?? 1500) - (segment?.startMs ?? 0) + (budget?.jitterMs ?? 50);
  return {
    glossClarity: stream?.motionStability ?? 0.7,
    motionStability: stream?.motionStability ?? 0.7,
    boundaryConfidence: segment?.boundaryConfidence ?? 0.75,
    latencyMs,
    budgetMs: budget?.budgetMs ?? 900,
    vocabularyCoverage: coverage,
    signerPace: stream?.signerPace ?? 0.4,
    occlusionNoise: stream?.occlusionNoise ?? 0.2,
    streamJitter: Math.min(1, (budget?.jitterMs ?? 50) / 200),
    segmentBias,
    profile: "realtime_stream",
  };
}

export function listCompares(page = 1, pageSize = 20) {
  return paginate([...state().compares], page, pageSize);
}

export function createCompare(input: {
  name: string;
  streamId: string;
  segmentId: string;
  budgetId: string;
  glossClarity?: number;
  vocabularyCoverage?: number;
  latencyMs?: number;
  segmentBias?: SegmentBias;
}): StreamCompare {
  if (!state().streams.some((s) => s.id === input.streamId)) {
    throw new Error("stream_not_found");
  }
  if (!state().segments.some((s) => s.id === input.segmentId)) {
    throw new Error("segment_not_found");
  }
  if (!state().budgets.some((b) => b.id === input.budgetId)) {
    throw new Error("budget_not_found");
  }
  const base = inputFromStream(
    input.streamId,
    input.segmentId,
    input.budgetId,
  );
  const snap: StreamInput = {
    ...base,
    glossClarity: input.glossClarity ?? base.glossClarity,
    vocabularyCoverage: input.vocabularyCoverage ?? base.vocabularyCoverage,
    latencyMs: input.latencyMs ?? base.latencyMs,
    segmentBias: input.segmentBias ?? base.segmentBias,
  };
  const realtime = scoreRealtimeStream({
    ...snap,
    profile: "realtime_stream",
  });
  const offlineBatch = scoreOfflineBatch({
    ...snap,
    profile: "offline_batch",
  });
  const gap = Math.round((realtime.overall - offlineBatch.overall) * 100) / 100;
  let winner: StreamCompare["winner"] = "tie";
  if (gap > 1) winner = "realtime_stream";
  else if (gap < -1) winner = "offline_batch";
  const row: StreamCompare = {
    id: randomUUID(),
    name: input.name.trim(),
    streamId: input.streamId,
    segmentId: input.segmentId,
    budgetId: input.budgetId,
    input: snap,
    realtime,
    offlineBatch,
    winner,
    gap,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("owner", "compare.create", `${row.id}:${winner}`);
  return row;
}

export function listAudits(page = 1, pageSize = 20) {
  return paginate([...state().audits], page, pageSize);
}

export function exportStreamsJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      streams: state().streams,
      segments: state().segments,
      budgets: state().budgets,
      glossary: state().glossary,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const header =
    "id,name,streamId,segmentId,budgetId,winner,gap,realtimeOverall,offlineBatchOverall,createdAt";
  const lines = state().compares.map(
    (c) =>
      `${c.id},${JSON.stringify(c.name)},${c.streamId},${c.segmentId},${c.budgetId},${c.winner},${c.gap},${c.realtime.overall},${c.offlineBatch.overall},${c.createdAt}`,
  );
  return [header, ...lines].join("\n");
}

export function receiveWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  if (signature) {
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "bad_signature" };
    }
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, id: existing.id };
  const id = randomUUID();
  state().webhookEvents.push({
    id,
    idempotencyKey,
    receivedAt: now(),
    payload,
  });
  audit("webhook", "webhook.receive", idempotencyKey);
  return { ok: true, id };
}

export function featureInventory(): string[] {
  return [
    "marketing_landing",
    "pricing_tiers",
    "guided_demo",
    "onboarding_checklist_page",
    "multi_flow_index",
    "stream_registry",
    "stream_search_filter",
    "sentence_segment_workspace",
    "latency_budget_board",
    "glossary_coverage",
    "dual_score_panel",
    "realtime_vs_offline_batch_compare",
    "honesty_fence",
    "a11y_keyboard_contrast_notes",
    "org_settings",
    "member_invite",
    "bearer_auth",
    "rate_limit",
    "idempotent_webhook",
    "export_streams_json",
    "export_compares_csv",
    "features_api",
    "goldens_sample_api",
    "audit_trail",
    "in_app_guide_link",
    "try_html_demo",
    "seed_demo_stream_onboarding",
    "pagination_on_list_apis",
  ];
}

export { readinessFromQuality };
