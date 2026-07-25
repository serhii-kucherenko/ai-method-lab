import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreProductiveOpenMindedDesign,
  scoreEngagementMaximizingBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type DialogueBias,
  type BadgeKind,
  type ScoreMode,
  type FeedLane,
  type TopicMode,
  type DialogueInput,
  type DialogueQuality,
} from "./domain/types";

export type {
  DialogueBias,
  BadgeKind,
  ScoreMode,
  FeedLane,
  TopicMode,
  DialogueInput,
  DialogueQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type FeedPack = {
  id: string;
  label: string;
  version: string;
  studyFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type FeedStatus = "draft" | "active" | "archived";

export type FeedSurface = {
  id: string;
  packId: string;
  label: string;
  lane: FeedLane;
  rankingHint: string;
  slotCount: number;
  openMin: number;
  openMax: number;
  metricHint: string;
  status: FeedStatus;
  notes: string;
  createdAt: string;
};

export type BadgeStatus = "draft" | "active" | "archived";

export type BadgeRule = {
  id: string;
  packId: string;
  label: string;
  kind: BadgeKind;
  badgeHint: string;
  signalCount: number;
  clarityFloor: number;
  metricHint: string;
  status: BadgeStatus;
  notes: string;
  createdAt: string;
};

export type TopicStatus = "draft" | "active" | "archived";

export type TopicThread = {
  id: string;
  packId: string;
  label: string;
  mode: TopicMode;
  threadHint: string;
  postCount: number;
  balanceFloor: number;
  metricHint: string;
  status: TopicStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type DialogueRun = {
  id: string;
  packId: string;
  badgeId: string;
  feedId: string;
  topicId: string;
  openMindedness: number;
  badgeClarity: number;
  topicBalance: number;
  packReadiness: number;
  runNotes: string;
  status: RunStatus;
  createdAt: string;
};

export type AuditEvent = {
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
  defaultDialogueBias: DialogueBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type DialogueCompare = {
  id: string;
  name: string;
  packId: string;
  badgeId: string;
  feedId: string;
  topicId: string;
  dialogueRunId: string;
  input: DialogueInput;
  productiveOpen: DialogueQuality;
  engagementMax: DialogueQuality;
  winner:
    | "productive_open_minded_design"
    | "engagement_maximizing_baseline"
    | "tie";
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
  packs: FeedPack[];
  feeds: FeedSurface[];
  badges: BadgeRule[];
  topics: TopicThread[];
  dialogueRuns: DialogueRun[];
  auditEvents: AuditEvent[];
  compares: DialogueCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __dialogueDesignStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const feedId = "feed-demo";
  const badgeId = "badge-demo";
  const topicId = "topic-demo";
  const dialogueRunId = "run-demo";
  return {
    org: {
      name: "Dialogue Design Org",
      webhookUrl: "",
      webhookSecret: "dialogue-design-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultDialogueBias: "balanced",
      defaultMode: "productive_open_minded_design",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@dialogue-design.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Open-Minded Dialogue Soft-Sim Pack",
        version: "2026.1",
        studyFocus:
          "Productive open-minded design vs engagement-maximizing baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for dialogue feed badges and topics vs engagement soft-sim",
        createdAt: now(),
      },
    ],
    feeds: [
      {
        id: feedId,
        packId,
        label: "Topic-balanced civic feed",
        lane: "open_minded_rank",
        rankingHint: "open_minded,topic_balanced,civic",
        slotCount: 12,
        openMin: 0.4,
        openMax: 0.95,
        metricHint: "Feed ranking openness for dialogue soft-sim",
        status: "active",
        notes: "Soft-sim feeds — not live social network deployment",
        createdAt: now(),
      },
    ],
    badges: [
      {
        id: badgeId,
        packId,
        label: "Open-minded badge rule",
        kind: "open_minded",
        badgeHint: "open_minded,perspective,civility",
        signalCount: 5,
        clarityFloor: 0.35,
        metricHint: "Badge clarity and open-minded signals",
        status: "active",
        notes:
          "Soft-sim badges — not content moderation authority / not attitude-change clearance",
        createdAt: now(),
      },
    ],
    topics: [
      {
        id: topicId,
        packId,
        label: "Cross-cutting topic thread",
        mode: "cross_cutting",
        threadHint: "deliberative,cross_cutting,civic",
        postCount: 12,
        balanceFloor: 0.35,
        metricHint: "Topic balance and thread fidelity",
        status: "active",
        notes:
          "Soft-sim topics — not authors’ platform brand / not live moderation",
        createdAt: now(),
      },
    ],
    dialogueRuns: [
      {
        id: dialogueRunId,
        packId,
        badgeId,
        feedId,
        topicId,
        openMindedness: 0.62,
        badgeClarity: 0.7,
        topicBalance: 0.74,
        packReadiness: 0.68,
        runNotes:
          "Open-minded design looks strong but engagement-max still leads when badges are thin",
        status: "active",
        createdAt: now(),
      },
    ],
    auditEvents: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, feeds, badges, topics, and dialogue run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__dialogueDesignStore) g.__dialogueDesignStore = seed();
  return g.__dialogueDesignStore;
}

function audit(actor: string, action: string, detail: string): void {
  state().auditEvents.unshift({
    id: randomUUID(),
    at: now(),
    actor,
    action,
    detail,
  });
}

export function resetStore(): void {
  g.__dialogueDesignStore = seed();
}

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  const org = state().org;
  if (patch.name !== undefined) org.name = patch.name;
  if (patch.webhookUrl !== undefined) org.webhookUrl = patch.webhookUrl;
  if (patch.webhookSecret !== undefined) org.webhookSecret = patch.webhookSecret;
  if (patch.bearerToken !== undefined) org.bearerToken = patch.bearerToken;
  if (patch.defaultDialogueBias !== undefined) {
    org.defaultDialogueBias = patch.defaultDialogueBias;
  }
  if (patch.defaultMode !== undefined) org.defaultMode = patch.defaultMode;
  if (patch.rateLimitPerMinute !== undefined) {
    org.rateLimitPerMinute = patch.rateLimitPerMinute;
  }
  audit("owner", "org.update", JSON.stringify(patch));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole): Member {
  const member: Member = { id: randomUUID(), email, role };
  state().members.push(member);
  audit("owner", "member.invite", `${email} as ${role}`);
  return member;
}

export function listPacks(opts?: {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: FeedPack[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.studyFocus.toLowerCase().includes(q) ||
        p.version.toLowerCase().includes(q),
    );
  }
  if (opts?.status) {
    items = items.filter((p) => p.status === opts.status);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPack(input: {
  label: string;
  version: string;
  studyFocus: string;
  sessionBudget?: number;
  notes?: string;
}): FeedPack {
  const pack: FeedPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    studyFocus: input.studyFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): FeedPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listFeeds(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: FeedSurface[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().feeds];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.lane.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.rankingHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createFeed(input: {
  packId: string;
  label: string;
  lane: FeedLane;
  rankingHint: string;
  slotCount: number;
  openMin: number;
  openMax: number;
  metricHint?: string;
  notes?: string;
}): FeedSurface | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: FeedSurface = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    lane: input.lane,
    rankingHint: input.rankingHint,
    slotCount: input.slotCount,
    openMin: input.openMin,
    openMax: input.openMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().feeds.unshift(row);
  audit("evaluator", "feed.create", row.label);
  return row;
}

export function archiveFeed(id: string): FeedSurface | null {
  const row = state().feeds.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "feed.archive", id);
  return row;
}

export function listBadges(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: BadgeRule[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().badges];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.badgeHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createBadge(input: {
  packId: string;
  label: string;
  kind: BadgeKind;
  badgeHint: string;
  signalCount: number;
  clarityFloor: number;
  metricHint?: string;
  notes?: string;
}): BadgeRule | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: BadgeRule = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    badgeHint: input.badgeHint,
    signalCount: input.signalCount,
    clarityFloor: input.clarityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().badges.unshift(row);
  audit("evaluator", "badge.create", row.label);
  return row;
}

export function archiveBadge(id: string): BadgeRule | null {
  const row = state().badges.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "badge.archive", id);
  return row;
}

export function listTopics(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TopicThread[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().topics];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.mode.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.threadHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTopic(input: {
  packId: string;
  label: string;
  mode: TopicMode;
  threadHint: string;
  postCount: number;
  balanceFloor: number;
  metricHint?: string;
  notes?: string;
}): TopicThread | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: TopicThread = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    mode: input.mode,
    threadHint: input.threadHint,
    postCount: input.postCount,
    balanceFloor: input.balanceFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().topics.unshift(row);
  audit("evaluator", "topic.create", row.label);
  return row;
}

export function archiveTopic(id: string): TopicThread | null {
  const row = state().topics.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "topic.archive", id);
  return row;
}

export function listDialogueRuns(opts?: {
  packId?: string;
  badgeId?: string;
  feedId?: string;
  topicId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DialogueRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().dialogueRuns];
  if (opts?.packId) {
    items = items.filter((r) => r.packId === opts.packId);
  }
  if (opts?.badgeId) {
    items = items.filter((r) => r.badgeId === opts.badgeId);
  }
  if (opts?.feedId) {
    items = items.filter((r) => r.feedId === opts.feedId);
  }
  if (opts?.topicId) {
    items = items.filter((r) => r.topicId === opts.topicId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createDialogueRun(input: {
  packId: string;
  badgeId: string;
  feedId: string;
  topicId: string;
  openMindedness: number;
  badgeClarity: number;
  topicBalance: number;
  packReadiness: number;
  runNotes?: string;
}): DialogueRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) {
    return null;
  }
  if (!state().badges.some((m) => m.id === input.badgeId)) {
    return null;
  }
  if (!state().feeds.some((m) => m.id === input.feedId)) {
    return null;
  }
  if (!state().topics.some((m) => m.id === input.topicId)) {
    return null;
  }
  const run: DialogueRun = {
    id: randomUUID(),
    packId: input.packId,
    badgeId: input.badgeId,
    feedId: input.feedId,
    topicId: input.topicId,
    openMindedness: clamp(input.openMindedness, 0, 1),
    badgeClarity: clamp(input.badgeClarity, 0, 1),
    topicBalance: clamp(input.topicBalance, 0, 1),
    packReadiness: clamp(input.packReadiness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().dialogueRuns.unshift(run);
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): DialogueCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "hold_pack":
      return 0.2;
    case "review":
      return 0.45;
    case "lock_soft_sim":
      return 0.7;
    case "strong_lock":
      return 0.92;
    default: {
      const _exhaustive: string = label;
      void _exhaustive;
      return 0.55;
    }
  }
}

export function runCompare(input: {
  name: string;
  packId: string;
  badgeId: string;
  feedId: string;
  topicId: string;
  dialogueRunId: string;
  dialogueBias?: DialogueBias;
  bias?: DialogueBias;
  engagementPull?: number;
  outrageTunnel?: number;
  feedNoise?: number;
  overclaimRisk?: number;
}): DialogueCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const badge = state().badges.find((m) => m.id === input.badgeId);
  const feed = state().feeds.find((m) => m.id === input.feedId);
  const topic = state().topics.find((m) => m.id === input.topicId);
  const dialogueRun = state().dialogueRuns.find(
    (r) => r.id === input.dialogueRunId,
  );
  if (!pack || !badge || !feed || !topic || !dialogueRun) return null;

  const goldWeight = outcomeWeight("review");
  const span = Math.max(0.05, feed.openMax - feed.openMin);
  const ddInput: DialogueInput = {
    openMindedness: clamp(dialogueRun.openMindedness, 0, 1),
    badgeClarity: clamp(dialogueRun.badgeClarity, 0, 1),
    topicBalance: clamp(dialogueRun.topicBalance, 0, 1),
    packReadiness: clamp((dialogueRun.packReadiness + goldWeight) / 2, 0, 1),
    engagementPull: input.engagementPull ?? 0.82,
    outrageTunnel: input.outrageTunnel ?? 0.7,
    feedNoise: input.feedNoise ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    dialogueBias:
      input.dialogueBias ?? input.bias ?? state().org.defaultDialogueBias,
    profile: "productive_open_minded_design",
  };

  const productiveOpen = scoreProductiveOpenMindedDesign({
    ...ddInput,
    profile: "productive_open_minded_design",
  });
  const engagementMax = scoreEngagementMaximizingBaseline({
    ...ddInput,
    profile: "engagement_maximizing_baseline",
  });
  const gap = Math.abs(productiveOpen.overall - engagementMax.overall);
  let winner: DialogueCompare["winner"] = "tie";
  if (productiveOpen.overall > engagementMax.overall + 0.5) {
    winner = "productive_open_minded_design";
  } else if (engagementMax.overall > productiveOpen.overall + 0.5) {
    winner = "engagement_maximizing_baseline";
  }

  const compare: DialogueCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    badgeId: badge.id,
    feedId: feed.id,
    topicId: topic.id,
    dialogueRunId: dialogueRun.id,
    input: ddInput,
    productiveOpen,
    engagementMax,
    winner,
    gap: round2(gap),
    createdAt: now(),
  };
  state().compares.unshift(compare);
  audit(
    "evaluator",
    "compare.run",
    `${compare.name} winner=${winner} gap=${compare.gap}`,
  );
  return compare;
}

export function getScoreboard(): DialogueCompare[] {
  return [...state().compares].sort(
    (a, b) => b.productiveOpen.overall - a.productiveOpen.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      feeds: state().feeds,
      badges: state().badges,
      topics: state().topics,
      dialogueRuns: state().dialogueRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,productiveOpenOverall,engagementMaxOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.productiveOpen.overall},${c.engagementMax.overall},${c.createdAt}`,
    ),
  ];
  return rows.join("\n");
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  const expected = state().org.bearerToken;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
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
  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
  };
}

export function ingestWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const body = JSON.stringify(payload ?? {});
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  if (!signature || signature !== `sha256=${expected}`) {
    return { ok: false, error: "bad_signature" };
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, id: existing.id };
  const event: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(event);
  audit("webhook", "webhook.ingest", idempotencyKey);
  return { ok: true, id: event.id };
}

export function featureInventory(): { id: string; name: string }[] {
  return [
    { id: "landing", name: "Marketing landing" },
    { id: "pricing", name: "Pricing tiers" },
    { id: "demo", name: "Guided demo" },
    { id: "onboarding", name: "Onboarding checklist" },
    { id: "flows", name: "Multi-flow index" },
    { id: "feed-packs", name: "Feed pack registry" },
    { id: "pack-versions", name: "Versioned feed packs" },
    { id: "badge-rules", name: "Open-minded badge rules" },
    { id: "badge-editor", name: "Badge rule editor" },
    { id: "badge-search", name: "Badge search and filter" },
    { id: "feeds", name: "Feed surface configs" },
    { id: "feed-editor", name: "Feed ranking editor" },
    { id: "topics", name: "Topic thread registry" },
    { id: "topic-filters", name: "Topic thread filters" },
    { id: "dialogue-runs", name: "Dialogue run soft-sim" },
    { id: "dialogue-bias", name: "Dialogue bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Productive open-minded vs engagement-maximizing compare",
    },
    { id: "delta-view", name: "Dialogue delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not live network / not moderation / not attitude change / not authors’ brand",
    },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "HMAC webhook ingest" },
    { id: "export-json", name: "Export packs JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "pagination", name: "Pagination on list APIs" },
    { id: "search", name: "Search across packs and badges" },
    { id: "runs-page", name: "Dialogue runs workspace" },
  ];
}

export function scorePreview(input: DialogueInput): {
  productiveOpen: DialogueQuality;
  engagementMax: DialogueQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const productiveOpen = scoreProductiveOpenMindedDesign({
    ...input,
    profile: "productive_open_minded_design",
  });
  const engagementMax = scoreEngagementMaximizingBaseline({
    ...input,
    profile: "engagement_maximizing_baseline",
  });
  return {
    productiveOpen,
    engagementMax,
    readiness: readinessFromQuality(productiveOpen.overall),
  };
}
