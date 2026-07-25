import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreExperienceAware, scoreFirstFeasible } from "./domain/hold";
import {
  readinessFromQuality,
  type HoldInput,
  type HoldProfile,
  type HoldQuality,
  type HoldTierBias,
  type ScoreMode,
} from "./domain/types";

export type {
  HoldInput,
  HoldProfile,
  HoldQuality,
  HoldTierBias,
  ScoreMode,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type MatchStatus = "open" | "holding" | "matched" | "archived";

export type MatchCandidate = {
  id: string;
  orderLabel: string;
  driverLabel: string;
  zone: string;
  pickupEtaMin: number;
  fareProxy: number;
  supplyDemandStress: number;
  status: MatchStatus;
  notes: string;
  createdAt: string;
};

export type HoldTier =
  | "release_now"
  | "hold_short"
  | "hold_long"
  | "guardrail_block";

export type HoldStatus = "draft" | "active" | "released" | "archived";

export type HoldDecision = {
  id: string;
  matchId: string;
  tier: HoldTier;
  holdBudgetSec: number;
  passengerWaitRisk: number;
  driverIdleCost: number;
  cancelBeforeAccept: number;
  cancelAfterAccept: number;
  status: HoldStatus;
  notes: string;
  createdAt: string;
};

export type LaneSide = "passenger" | "driver";

export type ExperienceLane = {
  id: string;
  matchId: string;
  side: LaneSide;
  waitScore: number;
  cancelScore: number;
  completionScore: number;
  incomeOrFareScore: number;
  notes: string;
  createdAt: string;
};

export type TimelineEventKind =
  | "candidate"
  | "hold_start"
  | "hold_release"
  | "accept"
  | "cancel"
  | "complete";

export type TimelineEvent = {
  atSec: number;
  kind: TimelineEventKind;
  detail: string;
};

export type MatchTimeline = {
  id: string;
  matchId: string;
  events: TimelineEvent[];
  horizonSec: number;
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
  defaultProfile: HoldProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type HoldCompare = {
  id: string;
  name: string;
  matchId: string;
  holdId: string;
  input: HoldInput;
  experienceAware: HoldQuality;
  firstFeasible: HoldQuality;
  winner: "experience_aware" | "first_feasible" | "tie";
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
  matches: MatchCandidate[];
  holds: HoldDecision[];
  lanes: ExperienceLane[];
  timelines: MatchTimeline[];
  audits: AuditEntry[];
  compares: HoldCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __hmsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const matchId = "match-demo";
  const holdId = "hold-demo";
  return {
    org: {
      name: "Hold Match Org",
      webhookUrl: "",
      webhookSecret: "hms-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "experience_aware",
      defaultMode: "experience_aware",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@hold-match.local", role: "owner" },
      { id: "m2", email: "reader@hold-match.local", role: "reader" },
      { id: "m3", email: "viewer@hold-match.local", role: "viewer" },
    ],
    matches: [
      {
        id: matchId,
        orderLabel: "ORD-SEA-1042",
        driverLabel: "DRV-441",
        zone: "Capitol Hill",
        pickupEtaMin: 6,
        fareProxy: 0.72,
        supplyDemandStress: 0.48,
        status: "holding",
        notes: "Seed driver–order candidate",
        createdAt: now(),
      },
    ],
    holds: [
      {
        id: holdId,
        matchId,
        tier: "hold_short",
        holdBudgetSec: 18,
        passengerWaitRisk: 0.34,
        driverIdleCost: 0.28,
        cancelBeforeAccept: 0.22,
        cancelAfterAccept: 0.18,
        status: "active",
        notes: "Seed experience hold",
        createdAt: now(),
      },
    ],
    lanes: [
      {
        id: "lane-p-demo",
        matchId,
        side: "passenger",
        waitScore: 62,
        cancelScore: 58,
        completionScore: 71,
        incomeOrFareScore: 68,
        notes: "Passenger experience lane",
        createdAt: now(),
      },
      {
        id: "lane-d-demo",
        matchId,
        side: "driver",
        waitScore: 55,
        cancelScore: 60,
        completionScore: 74,
        incomeOrFareScore: 70,
        notes: "Driver experience lane",
        createdAt: now(),
      },
    ],
    timelines: [
      {
        id: "tl-demo",
        matchId,
        events: [
          { atSec: 0, kind: "candidate", detail: "DO pair observed" },
          { atSec: 2, kind: "hold_start", detail: "hold_short tier" },
          { atSec: 18, kind: "hold_release", detail: "Released to broadcast" },
          { atSec: 24, kind: "accept", detail: "Driver accepted" },
        ],
        horizonSec: 90,
        notes: "Seed match timeline",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: randomUUID(),
        at: now(),
        actor: "system",
        action: "store.seed",
        detail: "Hold Match Studio seed state",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__hmsStore) g.__hmsStore = seed();
  return g.__hmsStore;
}

export function resetStore(): void {
  g.__hmsStore = seed();
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

export function listMatches(
  q?: string,
  page = 1,
  pageSize = 20,
  status?: MatchStatus,
  zone?: string,
) {
  let rows = [...state().matches];
  if (status) rows = rows.filter((m) => m.status === status);
  if (zone?.trim()) {
    const z = zone.trim().toLowerCase();
    rows = rows.filter((m) => m.zone.toLowerCase().includes(z));
  }
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (m) =>
        m.orderLabel.toLowerCase().includes(needle) ||
        m.driverLabel.toLowerCase().includes(needle) ||
        m.zone.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createMatch(input: {
  orderLabel: string;
  driverLabel: string;
  zone?: string;
  pickupEtaMin?: number;
  fareProxy?: number;
  supplyDemandStress?: number;
  status?: MatchStatus;
  notes?: string;
}): MatchCandidate {
  const row: MatchCandidate = {
    id: randomUUID(),
    orderLabel: input.orderLabel.trim(),
    driverLabel: input.driverLabel.trim(),
    zone: input.zone?.trim() || "Downtown",
    pickupEtaMin: input.pickupEtaMin ?? 5,
    fareProxy: input.fareProxy ?? 0.6,
    supplyDemandStress: input.supplyDemandStress ?? 0.4,
    status: input.status ?? "open",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().matches.unshift(row);
  audit("owner", "match.create", row.id);
  return row;
}

export function archiveMatch(id: string): MatchCandidate {
  const row = state().matches.find((m) => m.id === id);
  if (!row) throw new Error("match_not_found");
  row.status = "archived";
  audit("owner", "match.archive", id);
  return row;
}

export function listHolds(
  q?: string,
  page = 1,
  pageSize = 20,
  matchId?: string,
) {
  let rows = [...state().holds];
  if (matchId) rows = rows.filter((h) => h.matchId === matchId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (h) =>
        h.tier.toLowerCase().includes(needle) ||
        h.notes.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createHold(input: {
  matchId: string;
  tier?: HoldTier;
  holdBudgetSec?: number;
  passengerWaitRisk?: number;
  driverIdleCost?: number;
  cancelBeforeAccept?: number;
  cancelAfterAccept?: number;
  status?: HoldStatus;
  notes?: string;
}): HoldDecision {
  if (!state().matches.some((m) => m.id === input.matchId)) {
    throw new Error("match_not_found");
  }
  const row: HoldDecision = {
    id: randomUUID(),
    matchId: input.matchId,
    tier: input.tier ?? "hold_short",
    holdBudgetSec: input.holdBudgetSec ?? 15,
    passengerWaitRisk: input.passengerWaitRisk ?? 0.35,
    driverIdleCost: input.driverIdleCost ?? 0.3,
    cancelBeforeAccept: input.cancelBeforeAccept ?? 0.25,
    cancelAfterAccept: input.cancelAfterAccept ?? 0.2,
    status: input.status ?? "draft",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().holds.unshift(row);
  const match = state().matches.find((m) => m.id === input.matchId);
  if (match && match.status === "open") match.status = "holding";
  audit("owner", "hold.create", row.id);
  return row;
}

export function listLanes(
  q?: string,
  page = 1,
  pageSize = 20,
  matchId?: string,
) {
  let rows = [...state().lanes];
  if (matchId) rows = rows.filter((l) => l.matchId === matchId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (l) =>
        l.side.toLowerCase().includes(needle) ||
        l.notes.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createLane(input: {
  matchId: string;
  side: LaneSide;
  waitScore?: number;
  cancelScore?: number;
  completionScore?: number;
  incomeOrFareScore?: number;
  notes?: string;
}): ExperienceLane {
  if (!state().matches.some((m) => m.id === input.matchId)) {
    throw new Error("match_not_found");
  }
  const row: ExperienceLane = {
    id: randomUUID(),
    matchId: input.matchId,
    side: input.side,
    waitScore: input.waitScore ?? 50,
    cancelScore: input.cancelScore ?? 50,
    completionScore: input.completionScore ?? 50,
    incomeOrFareScore: input.incomeOrFareScore ?? 50,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().lanes.unshift(row);
  audit("owner", "lane.create", `${row.id}:${row.side}`);
  return row;
}

export function listTimelines(
  q?: string,
  page = 1,
  pageSize = 20,
  matchId?: string,
) {
  let rows = [...state().timelines];
  if (matchId) rows = rows.filter((t) => t.matchId === matchId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((t) => t.notes.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createTimeline(input: {
  matchId: string;
  events?: TimelineEvent[];
  horizonSec?: number;
  notes?: string;
}): MatchTimeline {
  if (!state().matches.some((m) => m.id === input.matchId)) {
    throw new Error("match_not_found");
  }
  const row: MatchTimeline = {
    id: randomUUID(),
    matchId: input.matchId,
    events: input.events ?? [
      { atSec: 0, kind: "candidate", detail: "Observed" },
      { atSec: 5, kind: "hold_start", detail: "Hold started" },
    ],
    horizonSec: input.horizonSec ?? 60,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().timelines.unshift(row);
  audit("owner", "timeline.create", row.id);
  return row;
}

function inputFromHold(holdId: string): HoldInput {
  const hold = state().holds.find((h) => h.id === holdId);
  const match = hold
    ? state().matches.find((m) => m.id === hold.matchId)
    : undefined;
  const tier = hold?.tier ?? "hold_short";
  const tierBias: HoldTierBias =
    tier === "release_now" ||
    tier === "hold_short" ||
    tier === "hold_long" ||
    tier === "guardrail_block"
      ? tier
      : "balanced";
  const budget = hold?.holdBudgetSec ?? 15;
  return {
    passengerWaitRisk: hold?.passengerWaitRisk ?? 0.35,
    driverIdleCost: hold?.driverIdleCost ?? 0.3,
    cancelBeforeAccept: hold?.cancelBeforeAccept ?? 0.25,
    cancelAfterAccept: hold?.cancelAfterAccept ?? 0.2,
    supplyDemandStress: match?.supplyDemandStress ?? 0.4,
    pickupEtaPressure: Math.min(1, (match?.pickupEtaMin ?? 5) / 15),
    fareStrength: match?.fareProxy ?? 0.6,
    holdIntensity: Math.min(1, budget / 40),
    tierBias,
    profile: "experience_aware",
  };
}

export function listCompares(page = 1, pageSize = 20) {
  return paginate([...state().compares], page, pageSize);
}

export function createCompare(input: {
  name: string;
  matchId: string;
  holdId: string;
  supplyDemandStress?: number;
  fareStrength?: number;
  holdIntensity?: number;
  tierBias?: HoldTierBias;
}): HoldCompare {
  if (!state().matches.some((m) => m.id === input.matchId)) {
    throw new Error("match_not_found");
  }
  if (!state().holds.some((h) => h.id === input.holdId)) {
    throw new Error("hold_not_found");
  }
  const base = inputFromHold(input.holdId);
  const snap: HoldInput = {
    ...base,
    supplyDemandStress: input.supplyDemandStress ?? base.supplyDemandStress,
    fareStrength: input.fareStrength ?? base.fareStrength,
    holdIntensity: input.holdIntensity ?? base.holdIntensity,
    tierBias: input.tierBias ?? base.tierBias,
  };
  const experienceAware = scoreExperienceAware({
    ...snap,
    profile: "experience_aware",
  });
  const firstFeasible = scoreFirstFeasible({
    ...snap,
    profile: "first_feasible",
  });
  const gap =
    Math.round((experienceAware.overall - firstFeasible.overall) * 100) / 100;
  let winner: HoldCompare["winner"] = "tie";
  if (gap > 1) winner = "experience_aware";
  else if (gap < -1) winner = "first_feasible";
  const row: HoldCompare = {
    id: randomUUID(),
    name: input.name.trim(),
    matchId: input.matchId,
    holdId: input.holdId,
    input: snap,
    experienceAware,
    firstFeasible,
    winner,
    gap,
    createdAt: now(),
  };
  state().compares.unshift(row);
  const hold = state().holds.find((h) => h.id === input.holdId);
  if (hold) hold.status = "released";
  audit("owner", "compare.create", `${row.id}:${winner}`);
  return row;
}

export function listAudits(page = 1, pageSize = 20) {
  return paginate([...state().audits], page, pageSize);
}

export function exportMatchesJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      matches: state().matches,
      holds: state().holds,
      lanes: state().lanes,
      timelines: state().timelines,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const header =
    "id,name,matchId,holdId,winner,gap,experienceAwareOverall,firstFeasibleOverall,createdAt";
  const lines = state().compares.map(
    (c) =>
      `${c.id},${JSON.stringify(c.name)},${c.matchId},${c.holdId},${c.winner},${c.gap},${c.experienceAware.overall},${c.firstFeasible.overall},${c.createdAt}`,
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
    "match_registry",
    "match_search_filter",
    "hold_decision_board",
    "hold_tiers_budgets",
    "passenger_experience_lane",
    "driver_experience_lane",
    "match_timeline",
    "timeline_events",
    "dual_score_panel",
    "experience_vs_first_feasible_compare",
    "honesty_fence",
    "org_settings",
    "member_invite",
    "bearer_auth",
    "rate_limit",
    "idempotent_webhook",
    "export_matches_json",
    "export_compares_csv",
    "features_api",
    "goldens_sample_api",
    "audit_trail",
    "in_app_guide_link",
    "try_html_demo",
  ];
}

export { readinessFromQuality };
