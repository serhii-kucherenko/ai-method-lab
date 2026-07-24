import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreDesireFirst, scorePlaFeasibility } from "./domain/trip";
import {
  readinessFromQuality,
  type PlannerKind,
  type ScoreMode,
  type TripInput,
  type TripQuality,
  type TripReadiness,
} from "./domain/types";

export type {
  PlannerKind,
  ScoreMode,
  TripInput,
  TripQuality,
  TripReadiness,
};

export type MemberRole = "owner" | "planner" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type TripPurpose = "business" | "leisure" | "adventure" | "family";

export type TripBrief = {
  id: string;
  name: string;
  destination: string;
  purpose: TripPurpose;
  tripHours: number;
  notes: string;
  createdAt: string;
};

export type ConstraintKind = "schedule" | "resource" | "transfer" | "offline";

export type HardConstraint = {
  id: string;
  tripId: string;
  name: string;
  kind: ConstraintKind;
  severity: number;
  constraint: string;
  notes: string;
  createdAt: string;
};

export type DesireSignal = {
  id: string;
  tripId: string;
  name: string;
  category: string;
  weight: number;
  notes: string;
  createdAt: string;
};

export type PlanStatus = "draft" | "feasible" | "archived";

export type FeasiblePlan = {
  id: string;
  tripId: string;
  name: string;
  status: PlanStatus;
  stopCount: number;
  notes: string;
  createdAt: string;
};

export type AdaptStatus = "queued" | "running" | "done";

export type AdaptPass = {
  id: string;
  tripId: string;
  name: string;
  status: AdaptStatus;
  desireLift: number;
  feasibilityHold: number;
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
  tripId: string;
  input: TripInput;
  plaFeasibility: TripQuality;
  desireFirst: TripQuality;
  winner: "pla_feasibility" | "desire_first" | "tie";
  createdAt: string;
};

export type PlanRun = {
  id: string;
  tripId: string;
  name: string;
  mode: ScoreMode;
  planner: PlannerKind;
  quality?: TripQuality;
  readiness?: TripReadiness;
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
  trips: TripBrief[];
  constraints: HardConstraint[];
  desires: DesireSignal[];
  plans: FeasiblePlan[];
  adapts: AdaptPass[];
  planRuns: PlanRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __odtsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): TripInput {
  return {
    scheduleFeasibility: 0.82,
    resourceHeadroom: 0.74,
    transferReliability: 0.78,
    desireAlignment: 0.7,
    constraintStrictness: 0.8,
    desireWeight: 0.62,
    stopCount: 12,
    weatherRisk: 0.22,
    offlineMapCoverage: 0.86,
    mobilityAdaptability: 0.72,
    tripHours: 48,
    planner: "on_device",
  };
}

function seed(): StoreState {
  const tripId = "trip-demo";
  const input = seedInput();
  const quality = scorePlaFeasibility(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "On-Device Travel Org",
      webhookUrl: "",
      webhookSecret: "odts-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlanner: "on_device",
      defaultMode: "pla_feasibility",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "planner@studio.local", role: "planner" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    trips: [
      {
        id: tripId,
        name: "Porto · weekend on-device",
        destination: "Porto",
        purpose: "leisure",
        tripHours: 48,
        notes: "Demo trip brief for feasibility-first planning",
        createdAt: now(),
      },
    ],
    constraints: [
      {
        id: "c-demo",
        tripId,
        name: "Battery ≥30% by evening",
        kind: "resource",
        severity: 0.9,
        constraint: "battery_floor_30pct",
        notes: "Hard on-device resource constraint",
        createdAt: now(),
      },
    ],
    desires: [
      {
        id: "d-demo",
        tripId,
        name: "Prefer riverside cafés",
        category: "food",
        weight: 0.7,
        notes: "Soft desire after feasibility",
        createdAt: now(),
      },
    ],
    plans: [
      {
        id: "plan-demo",
        tripId,
        name: "Porto · feasible draft",
        status: "feasible",
        stopCount: 10,
        notes: "Demo plan after constraint pass",
        createdAt: now(),
      },
    ],
    adapts: [
      {
        id: "adapt-demo",
        tripId,
        name: "Lift café desire under battery floor",
        status: "done",
        desireLift: 0.12,
        feasibilityHold: 0.98,
        notes: "Demo adapt pass",
        createdAt: now(),
      },
    ],
    planRuns: [
      {
        id: "run-demo",
        tripId,
        name: "Feasibility-first itinerary",
        mode: "pla_feasibility",
        planner: "on_device",
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
        detail: "Demo trip, constraint, desire, plan, and adapt loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__odtsStore) g.__odtsStore = seed();
  return g.__odtsStore;
}

export function resetStore(): void {
  g.__odtsStore = seed();
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

export function listTrips(q?: string, page = 1, pageSize = 50): {
  items: TripBrief[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().trips].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.destination.toLowerCase().includes(needle) ||
        r.purpose.toLowerCase().includes(needle) ||
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

export function createTrip(input: {
  name: string;
  destination: string;
  purpose: TripPurpose;
  tripHours?: number;
  notes?: string;
}): TripBrief {
  const row: TripBrief = {
    id: randomUUID(),
    name: input.name.trim(),
    destination: input.destination.trim(),
    purpose: input.purpose,
    tripHours: Math.max(4, Math.min(168, Math.round(input.tripHours ?? 48))),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().trips.unshift(row);
  audit("planner", "trip.create", row.name);
  return row;
}

export function getTrip(id: string): TripBrief | undefined {
  return state().trips.find((t) => t.id === id);
}

export function listConstraints(tripId?: string, q?: string): HardConstraint[] {
  let rows = [...state().constraints];
  if (tripId) rows = rows.filter((r) => r.tripId === tripId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle) ||
        r.constraint.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createConstraint(input: {
  tripId: string;
  name: string;
  kind: ConstraintKind;
  severity?: number;
  constraint: string;
  notes?: string;
}): HardConstraint {
  const trip = getTrip(input.tripId);
  if (!trip) throw new Error("trip_not_found");
  const row: HardConstraint = {
    id: randomUUID(),
    tripId: input.tripId,
    name: input.name.trim(),
    kind: input.kind,
    severity: Math.max(0, Math.min(1, input.severity ?? 0.7)),
    constraint: input.constraint.trim(),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().constraints.unshift(row);
  audit("planner", "constraint.create", row.name);
  return row;
}

export function listDesires(tripId?: string, q?: string): DesireSignal[] {
  let rows = [...state().desires];
  if (tripId) rows = rows.filter((d) => d.tripId === tripId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.category.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createDesire(input: {
  tripId: string;
  name: string;
  category: string;
  weight?: number;
  notes?: string;
}): DesireSignal {
  const trip = getTrip(input.tripId);
  if (!trip) throw new Error("trip_not_found");
  const row: DesireSignal = {
    id: randomUUID(),
    tripId: input.tripId,
    name: input.name.trim(),
    category: input.category.trim(),
    weight: Math.max(0, Math.min(1, input.weight ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().desires.unshift(row);
  audit("planner", "desire.create", row.name);
  return row;
}

export function listPlans(tripId?: string): FeasiblePlan[] {
  let rows = [...state().plans];
  if (tripId) rows = rows.filter((p) => p.tripId === tripId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPlan(input: {
  tripId: string;
  name: string;
  status?: PlanStatus;
  stopCount?: number;
  notes?: string;
}): FeasiblePlan {
  const trip = getTrip(input.tripId);
  if (!trip) throw new Error("trip_not_found");
  const row: FeasiblePlan = {
    id: randomUUID(),
    tripId: input.tripId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    stopCount: Math.max(1, Math.round(input.stopCount ?? 10)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().plans.unshift(row);
  audit("planner", "plan.create", row.name);
  return row;
}

export function listAdapts(tripId?: string): AdaptPass[] {
  let rows = [...state().adapts];
  if (tripId) rows = rows.filter((a) => a.tripId === tripId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createAdapt(input: {
  tripId: string;
  name: string;
  status?: AdaptStatus;
  desireLift?: number;
  feasibilityHold?: number;
  notes?: string;
}): AdaptPass {
  const trip = getTrip(input.tripId);
  if (!trip) throw new Error("trip_not_found");
  const row: AdaptPass = {
    id: randomUUID(),
    tripId: input.tripId,
    name: input.name.trim(),
    status: input.status ?? "done",
    desireLift: Math.max(0, Math.min(1, input.desireLift ?? 0.1)),
    feasibilityHold: Math.max(0, Math.min(1, input.feasibilityHold ?? 0.95)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().adapts.unshift(row);
  audit("planner", "adapt.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromTrip(
  tripId: string,
  patch?: Partial<TripInput>,
  plannerKind?: PlannerKind,
): TripInput {
  const base = seedInput();
  const trip = getTrip(tripId);
  const constraints = listConstraints(tripId);
  const desires = listDesires(tripId);
  const plans = listPlans(tripId);
  const adapts = listAdapts(tripId);
  const avgSeverity =
    constraints.length > 0
      ? constraints.reduce((s, r) => s + r.severity, 0) / constraints.length
      : 0.55;
  const avgWeight =
    desires.length > 0
      ? desires.reduce((s, d) => s + d.weight, 0) / desires.length
      : 0.5;
  const stops =
    plans.length > 0
      ? plans.reduce((s, p) => s + p.stopCount, 0) / plans.length
      : 10;
  const lift =
    adapts.length > 0
      ? adapts.reduce((s, a) => s + a.desireLift, 0) / adapts.length
      : 0.08;
  const hold =
    adapts.length > 0
      ? adapts.reduce((s, a) => s + a.feasibilityHold, 0) / adapts.length
      : 0.9;
  return {
    ...base,
    ...patch,
    scheduleFeasibility:
      patch?.scheduleFeasibility ??
      clamp01(
        0.4 + Math.min(0.5, constraints.length * 0.12) + avgSeverity * 0.15,
      ),
    resourceHeadroom:
      patch?.resourceHeadroom ??
      clamp01(0.45 + hold * 0.35 - Math.min(0.25, stops / 80)),
    transferReliability:
      patch?.transferReliability ??
      clamp01(
        0.4 +
          Math.min(
            0.4,
            constraints.filter((c) => c.kind === "transfer").length * 0.2,
          ),
      ),
    desireAlignment:
      patch?.desireAlignment ?? clamp01(0.4 + avgWeight * 0.35 + lift * 0.4),
    constraintStrictness:
      patch?.constraintStrictness ?? clamp01(0.45 + avgSeverity * 0.4),
    desireWeight: patch?.desireWeight ?? clamp01(0.35 + avgWeight * 0.45),
    stopCount: patch?.stopCount ?? Math.max(3, Math.min(40, Math.round(stops))),
    tripHours: patch?.tripHours ?? trip?.tripHours ?? 48,
    planner: plannerKind ?? state().org.defaultPlanner,
  };
}

export function listPlanRuns(tripId?: string): PlanRun[] {
  let rows = [...state().planRuns];
  if (tripId) rows = rows.filter((p) => p.tripId === tripId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPlanRun(input: {
  tripId: string;
  name: string;
  mode?: ScoreMode;
  planner?: PlannerKind;
  tripInput?: Partial<TripInput>;
}): PlanRun {
  const trip = getTrip(input.tripId);
  if (!trip) throw new Error("trip_not_found");
  const planner = input.planner ?? state().org.defaultPlanner;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromTrip(input.tripId, input.tripInput, planner);
  const quality =
    mode === "desire_first" ? scoreDesireFirst(emb) : scorePlaFeasibility(emb);
  const readiness = readinessFromQuality(quality, emb);
  const row: PlanRun = {
    id: randomUUID(),
    tripId: input.tripId,
    name: input.name.trim(),
    mode,
    planner,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().planRuns.unshift(row);
  audit("planner", "plan_run.create", `${row.name} (${row.mode})`);
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

export function exportPlansJson(tripId?: string): string {
  return JSON.stringify(listPlans(tripId), null, 2);
}

export function createCompare(input: {
  name: string;
  tripId: string;
  tripInput?: Partial<TripInput>;
}): CompareResult {
  const trip = getTrip(input.tripId);
  if (!trip) throw new Error("trip_not_found");
  const emb = inputFromTrip(input.tripId, input.tripInput);
  const plaFeasibility = scorePlaFeasibility(emb);
  const desireFirst = scoreDesireFirst(emb);
  let winner: CompareResult["winner"] = "tie";
  if (plaFeasibility.overall > desireFirst.overall + 0.5)
    winner = "pla_feasibility";
  else if (desireFirst.overall > plaFeasibility.overall + 0.5)
    winner = "desire_first";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim() || `Compare · ${trip.name}`,
    tripId: input.tripId,
    input: emb,
    plaFeasibility,
    desireFirst,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("planner", "compare.create", `${row.name} → ${row.winner}`);
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
    "Marketing landing for on-device itinerary buyers",
    "Trip brief registry",
    "Hard constraint encoder (schedule, resource, transfer, offline)",
    "Desire / preference signal capture",
    "Feasibility-first plan drafts",
    "Plan→Learn→Adapt scoring",
    "Desire-first baseline scoring",
    "Feasibility-first vs desire-first compare",
    "Learn + adapt passes",
    "Trip readiness gates",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotency",
    "Bearer auth",
    "Rate-limit feedback",
    "Audit log",
    "CSV audit export",
    "JSON plan export",
    "Trip search + pagination",
    "Honesty fence + Sources",
    "Features inventory API",
    "Feasibility / desire gap signals",
    "Onboarding checklist on trips",
    "Offline try.html demo",
    "In-app guide link",
  ];
}

export function sampleGoldenInput(): TripInput {
  return seedInput();
}
