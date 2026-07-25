import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreNaiveLocal, scoreStructuredMemory } from "./domain/route";
import {
  clamp,
  readinessFromQuality,
  round2,
  type MemoryBias,
  type RouteInput,
  type RouteQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  MemoryBias,
  RouteInput,
  RouteQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "planner" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type RoutePack = {
  id: string;
  label: string;
  version: string;
  targetSmiles: string;
  routeCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type CandidateRouteStatus = "open" | "tried" | "locked" | "archived";

export type CandidateRoute = {
  id: string;
  packId: string;
  label: string;
  steps: number;
  branchingFactor: number;
  memoryCoverage: number;
  status: CandidateRouteStatus;
  notes: string;
  createdAt: string;
};

export type MemoryOutcome = "dead_end" | "promising" | "solved";

export type SearchMemoryCell = {
  id: string;
  packId: string;
  routeId?: string;
  triedPathHash: string;
  outcome: MemoryOutcome;
  intermediateIds: string[];
  notes: string;
  createdAt: string;
};

export type Intermediate = {
  id: string;
  packId: string;
  smilesLike: string;
  mw: number;
  logP: number;
  reactiveFlags: number;
  availability: number;
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
  defaultMemoryBias: MemoryBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
  honestyAckedAt: string | null;
};

export type RouteCompare = {
  id: string;
  name: string;
  packId: string;
  routeId: string;
  input: RouteInput;
  structured: RouteQuality;
  naive: RouteQuality;
  winner: "structured_memory" | "naive_local" | "tie";
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
  packs: RoutePack[];
  routes: CandidateRoute[];
  memory: SearchMemoryCell[];
  intermediates: Intermediate[];
  audits: AuditEntry[];
  compares: RouteCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __rrsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const routeId = "route-demo";
  const intermediateId = "int-demo";
  return {
    org: {
      name: "Retro Route Org",
      webhookUrl: "",
      webhookSecret: "rrs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultMemoryBias: "balanced",
      defaultMode: "structured_memory",
      rateLimitPerMinute: 120,
      honestyAckedAt: null,
    },
    members: [
      {
        id: "member-owner",
        email: "planner@retro-route.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Kinase Scaffold Pack",
        version: "2026.1",
        targetSmiles: "c1ccc(Nc2nccc(-c3ccncc3)n2)cc1",
        routeCount: 1,
        status: "active",
        notes: "Seed pack for demo compare",
        createdAt: now(),
      },
    ],
    routes: [
      {
        id: routeId,
        packId,
        label: "Four-step aryl amination route",
        steps: 4,
        branchingFactor: 2.4,
        memoryCoverage: 0.72,
        status: "tried",
        notes: "Seed candidate with structured memory",
        createdAt: now(),
      },
    ],
    memory: [
      {
        id: "mem-demo",
        packId,
        routeId,
        triedPathHash: "ph_demo_aryl",
        outcome: "promising",
        intermediateIds: [intermediateId],
        notes: "Seed memory cell",
        createdAt: now(),
      },
    ],
    intermediates: [
      {
        id: intermediateId,
        packId,
        smilesLike: "Nc1ccccc1",
        mw: 93.1,
        logP: 0.9,
        reactiveFlags: 0.2,
        availability: 0.85,
        notes: "Aniline building block",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, route, memory, and intermediate seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__rrsStore) g.__rrsStore = seed();
  return g.__rrsStore;
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

export function resetStore(): void {
  g.__rrsStore = seed();
}

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  const org = state().org;
  Object.assign(org, patch);
  audit("owner", "org.update", JSON.stringify(patch));
  return getOrg();
}

export function ackHonesty(): OrgSettings {
  state().org.honestyAckedAt = now();
  audit("planner", "honesty.ack", "soft-sim fence acknowledged");
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
}): { items: RoutePack[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.targetSmiles.toLowerCase().includes(q) ||
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
  targetSmiles: string;
  notes?: string;
}): RoutePack {
  const pack: RoutePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    targetSmiles: input.targetSmiles,
    routeCount: 0,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): RoutePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listRoutes(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CandidateRoute[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().routes];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.id.includes(q) ||
        r.notes.toLowerCase().includes(q),
    );
  }
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.status) items = items.filter((r) => r.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRoute(input: {
  packId: string;
  label: string;
  steps: number;
  branchingFactor: number;
  memoryCoverage: number;
  notes?: string;
}): CandidateRoute | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const route: CandidateRoute = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    steps: input.steps,
    branchingFactor: input.branchingFactor,
    memoryCoverage: clamp(input.memoryCoverage, 0, 1),
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().routes.unshift(route);
  const pack = state().packs.find((p) => p.id === input.packId);
  if (pack) pack.routeCount += 1;
  audit("planner", "route.create", route.label);
  return route;
}

export function listMemory(opts?: {
  packId?: string;
  outcome?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SearchMemoryCell[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().memory];
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.outcome) items = items.filter((m) => m.outcome === opts.outcome);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createMemoryCell(input: {
  packId: string;
  routeId?: string;
  triedPathHash: string;
  outcome: MemoryOutcome;
  intermediateIds?: string[];
  notes?: string;
}): SearchMemoryCell | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const cell: SearchMemoryCell = {
    id: randomUUID(),
    packId: input.packId,
    routeId: input.routeId,
    triedPathHash: input.triedPathHash,
    outcome: input.outcome,
    intermediateIds: input.intermediateIds ?? [],
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().memory.unshift(cell);
  if (input.routeId) {
    const route = state().routes.find((r) => r.id === input.routeId);
    if (route && route.status === "open") route.status = "tried";
  }
  audit("planner", "memory.create", cell.triedPathHash);
  return cell;
}

export function listIntermediates(opts?: {
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Intermediate[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().intermediates];
  if (opts?.packId) items = items.filter((i) => i.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createIntermediate(input: {
  packId: string;
  smilesLike: string;
  mw: number;
  logP: number;
  reactiveFlags: number;
  availability: number;
  notes?: string;
}): Intermediate | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const intermediate: Intermediate = {
    id: randomUUID(),
    packId: input.packId,
    smilesLike: input.smilesLike,
    mw: input.mw,
    logP: input.logP,
    reactiveFlags: clamp(input.reactiveFlags, 0, 1),
    availability: clamp(input.availability, 0, 1),
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().intermediates.unshift(intermediate);
  audit("planner", "intermediate.create", intermediate.smilesLike);
  return intermediate;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): RouteCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  routeId: string;
  memoryBias?: MemoryBias;
  localGreedyFit?: number;
  singleStepFluency?: number;
  deadEndPressure?: number;
  routeDrift?: number;
}): RouteCompare | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  const route = state().routes.find((r) => r.id === input.routeId);
  if (!pack || !route) return null;

  const memCells = state().memory.filter(
    (m) => m.packId === pack.id || m.routeId === route.id,
  );
  const ints = state().intermediates.filter((i) => i.packId === pack.id);
  const triedRecall =
    memCells.length === 0
      ? 0.35
      : clamp(
          memCells.filter((m) => m.outcome !== "dead_end").length /
            Math.max(1, memCells.length) +
            0.2,
          0,
          1,
        );
  const intermediateCoverage =
    ints.length === 0
      ? 0.4
      : clamp(
          ints.reduce((s, i) => s + i.availability, 0) / ints.length,
          0,
          1,
        );
  const branchAvoidance = clamp(
    memCells.filter((m) => m.outcome === "dead_end").length > 0
      ? 0.55 + triedRecall * 0.3
      : 0.4 + route.memoryCoverage * 0.3,
    0,
    1,
  );

  const routeInput: RouteInput = {
    memoryCoverage: clamp(route.memoryCoverage, 0, 1),
    triedPathRecall: triedRecall,
    intermediateCoverage,
    branchAvoidance,
    routeCoherence: clamp(
      1 - Math.abs(route.branchingFactor - 2.2) / 4 + route.steps / 20,
      0,
      1,
    ),
    localGreedyFit: input.localGreedyFit ?? 0.78,
    singleStepFluency: input.singleStepFluency ?? 0.72,
    deadEndPressure:
      input.deadEndPressure ??
      clamp(1 - route.memoryCoverage * 0.7 + route.steps / 20, 0, 1),
    routeDrift:
      input.routeDrift ?? clamp(route.branchingFactor / 5, 0.15, 0.85),
    memoryBias: input.memoryBias ?? state().org.defaultMemoryBias,
    profile: "structured_memory",
  };

  const structured = scoreStructuredMemory({
    ...routeInput,
    profile: "structured_memory",
  });
  const naive = scoreNaiveLocal({
    ...routeInput,
    profile: "naive_local",
  });
  const gap = Math.abs(structured.overall - naive.overall);
  let winner: RouteCompare["winner"] = "tie";
  if (structured.overall > naive.overall + 0.5) {
    winner = "structured_memory";
  } else if (naive.overall > structured.overall + 0.5) {
    winner = "naive_local";
  }

  const compare: RouteCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    routeId: route.id,
    input: routeInput,
    structured,
    naive,
    winner,
    gap: round2(gap),
    createdAt: now(),
  };
  state().compares.unshift(compare);
  audit(
    "planner",
    "compare.run",
    `${compare.name} winner=${winner} gap=${compare.gap}`,
  );
  return compare;
}

export function getScoreboard(): RouteCompare[] {
  return [...state().compares].sort(
    (a, b) => b.structured.overall - a.structured.overall,
  );
}

export function exportRoutesJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      routes: state().routes,
      memory: state().memory,
      intermediates: state().intermediates,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,structuredOverall,naiveOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.structured.overall},${c.naive.overall},${c.createdAt}`,
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
    { id: "packs", name: "Route pack registry" },
    { id: "pack-search", name: "Pack search and filter" },
    { id: "pack-version", name: "Versioned route packs" },
    { id: "routes", name: "Candidate route workspace" },
    { id: "route-search", name: "Route search and filter" },
    { id: "route-steps", name: "Multi-step route fields" },
    { id: "memory", name: "Structured search-memory board" },
    { id: "memory-outcome", name: "Memory outcome tagging" },
    { id: "intermediates", name: "Intermediate property workspace" },
    { id: "intermediate-props", name: "MW / logP / reactivity fields" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Structured-memory vs naive local compare" },
    { id: "scoreboard", name: "Compare scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not wet-lab notes" },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "Idempotent webhook" },
    { id: "export-json", name: "Export routes JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "pagination", name: "Pagination on list APIs" },
    { id: "score-preview", name: "Score preview" },
  ];
}

export function scorePreview(input: RouteInput): {
  structured: RouteQuality;
  naive: RouteQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const structured = scoreStructuredMemory({
    ...input,
    profile: "structured_memory",
  });
  const naive = scoreNaiveLocal({
    ...input,
    profile: "naive_local",
  });
  return {
    structured,
    naive,
    readiness: readinessFromQuality(structured.overall),
  };
}
