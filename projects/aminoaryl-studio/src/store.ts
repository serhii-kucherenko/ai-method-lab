import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scorePhotocatalyticAminoaryl,
  scoreCopperCatalyzedAminoaryl,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type RouteKind,
  type AminoarylInput,
  type AminoarylQuality,
  type CatalystKind,
  type ScoreMode,
  type ScoringBias,
} from "./domain/types";

export type {
  AssayKind,
  RouteKind,
  AminoarylInput,
  AminoarylQuality,
  CatalystKind,
  ScoreMode,
  ScoringBias,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

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
  programFocus: string;
  routeBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type RouteSpec = {
  id: string;
  packId: string;
  label: string;
  kind: RouteKind;
  scaffoldHint: string;
  coverageFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type CatalystSpec = {
  id: string;
  packId: string;
  label: string;
  kind: CatalystKind;
  modelHint: string;
  yieldFloor: number;
  evidenceFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  routeId: string;
  catalystId: string;
  label: string;
  kind: AssayKind;
  photoYield: number;
  copperYield: number;
  cyclopropaneStrain: number;
  assayReadout: number;
  runNotes: string;
  status: EntityStatus;
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
  defaultScoringBias: ScoringBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type RouteCompare = {
  id: string;
  name: string;
  packId: string;
  routeId: string;
  catalystId: string;
  assayId: string;
  input: AminoarylInput;
  photo: AminoarylQuality;
  copper: AminoarylQuality;
  winner:
    | "photocatalytic_aminoaryl"
    | "copper_catalyzed_aminoaryl"
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
  packs: RoutePack[];
  routes: RouteSpec[];
  catalysts: CatalystSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: RouteCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __aminoarylStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const routeId = "route-demo";
  const catalystId = "catalyst-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Aminoaryl Org",
      webhookUrl: "",
      webhookSecret: "aminoaryl-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultScoringBias: "balanced",
      defaultMode: "photocatalytic_aminoaryl",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@aminoaryl.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "1,3-Aminoarylation Route Pack",
        version: "2026.1",
        programFocus:
          "Photocatalytic vs copper-catalyzed aminoarylation soft-sim",
        routeBudget: 36,
        status: "active",
        notes: "Seed pack for routes, catalysts, and assay runs",
        createdAt: now(),
      },
    ],
    routes: [
      {
        id: routeId,
        packId,
        label: "Aryl cyclopropane diarylpropylamine draft",
        kind: "aryl_cyclopropane",
        scaffoldHint: "aryl-cyclopropane",
        coverageFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Route soft-sim",
        status: "active",
        notes: "Soft-sim route panel — not wet-lab validated",
        createdAt: now(),
      },
    ],
    catalysts: [
      {
        id: catalystId,
        packId,
        label: "Photocatalytic aminoaryl draft",
        kind: "photocatalytic_aminoaryl",
        modelHint: "photo-1,3-aminoaryl",
        yieldFloor: 0.4,
        evidenceFloor: 0.35,
        metricHint: "Catalyst soft-sim",
        status: "active",
        notes: "Soft-sim catalyst — not manufacturing control",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        routeId,
        catalystId,
        label: "Photo / copper dual soft-sim",
        kind: "dual_route_soft_sim",
        photoYield: 0.42,
        copperYield: 0.32,
        cyclopropaneStrain: 0.7,
        assayReadout: 0.68,
        runNotes:
          "Photocatalytic path looks strong on yield but cyclopropane strain can hide incomplete photo coverage copper may exploit",
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
        detail: "Demo pack, routes, catalysts, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__aminoarylStore) g.__aminoarylStore = seed();
  return g.__aminoarylStore;
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
  g.__aminoarylStore = seed();
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
  if (patch.defaultScoringBias !== undefined) {
    org.defaultScoringBias = patch.defaultScoringBias;
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
  items: RoutePack[];
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
        p.programFocus.toLowerCase().includes(q) ||
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
  programFocus: string;
  routeBudget?: number;
  notes?: string;
}): RoutePack {
  const pack: RoutePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    routeBudget: input.routeBudget ?? 24,
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

function listEntity<
  T extends {
    label: string;
    id: string;
    packId: string;
    status: string;
    metricHint?: string;
  },
>(
  rows: T[],
  opts?: {
    q?: string;
    packId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    extra?: (row: T, q: string) => boolean;
  },
): { items: T[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...rows];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        (m.metricHint?.toLowerCase().includes(q) ?? false) ||
        m.id.includes(q) ||
        (opts.extra?.(m, q) ?? false),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function listRoutes(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().routes, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.scaffoldHint.toLowerCase().includes(q),
  });
}

export function createRoute(input: {
  packId: string;
  label: string;
  kind: RouteKind;
  scaffoldHint: string;
  coverageFloor: number;
  fidelityFloor: number;
  metricHint?: string;
  notes?: string;
}): RouteSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: RouteSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    scaffoldHint: input.scaffoldHint,
    coverageFloor: input.coverageFloor,
    fidelityFloor: input.fidelityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().routes.unshift(row);
  audit("evaluator", "route.create", row.label);
  return row;
}

export function archiveRoute(id: string): RouteSpec | null {
  const row = state().routes.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "route.archive", id);
  return row;
}

export function listCatalysts(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().catalysts, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createCatalyst(input: {
  packId: string;
  label: string;
  kind: CatalystKind;
  modelHint: string;
  yieldFloor: number;
  evidenceFloor: number;
  metricHint?: string;
  notes?: string;
}): CatalystSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: CatalystSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    yieldFloor: input.yieldFloor,
    evidenceFloor: input.evidenceFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().catalysts.unshift(row);
  audit("evaluator", "catalyst.create", row.label);
  return row;
}

export function archiveCatalyst(id: string): CatalystSpec | null {
  const row = state().catalysts.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "catalyst.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  routeId?: string;
  catalystId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AssayRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().assays];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.routeId) items = items.filter((r) => r.routeId === opts.routeId);
  if (opts?.catalystId)
    items = items.filter((r) => r.catalystId === opts.catalystId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  routeId: string;
  catalystId: string;
  label: string;
  kind: AssayKind;
  photoYield: number;
  copperYield: number;
  cyclopropaneStrain: number;
  assayReadout: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().routes.some((m) => m.id === input.routeId)) return null;
  if (!state().catalysts.some((m) => m.id === input.catalystId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    routeId: input.routeId,
    catalystId: input.catalystId,
    label: input.label,
    kind: input.kind,
    photoYield: clamp(input.photoYield, 0, 1),
    copperYield: clamp(input.copperYield, 0, 1),
    cyclopropaneStrain: clamp(input.cyclopropaneStrain, 0, 1),
    assayReadout: clamp(input.assayReadout, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().assays.unshift(run);
  audit("evaluator", "assay.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): RouteCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  routeId: string;
  catalystId: string;
  assayId: string;
  scoringBias?: ScoringBias;
  bias?: ScoringBias;
  overclaimRisk?: number;
  catalystFidelity?: number;
  evidenceStrength?: number;
  routeFollowThrough?: number;
}): RouteCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const route = state().routes.find((m) => m.id === input.routeId);
  const catalyst = state().catalysts.find((m) => m.id === input.catalystId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !route || !catalyst || !assay) return null;

  const dualInput: AminoarylInput = {
    photoYield: clamp(assay.photoYield, 0, 1),
    copperYield: clamp(assay.copperYield, 0, 1),
    cyclopropaneStrain: clamp(assay.cyclopropaneStrain, 0, 1),
    catalystFidelity: clamp(
      input.catalystFidelity ?? route.coverageFloor,
      0,
      1,
    ),
    evidenceStrength: clamp(
      input.evidenceStrength ?? catalyst.evidenceFloor,
      0,
      1,
    ),
    routeFollowThrough: clamp(
      input.routeFollowThrough ?? route.fidelityFloor,
      0,
      1,
    ),
    assayReadout: clamp(assay.assayReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - catalyst.yieldFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    scoringBias:
      input.scoringBias ?? input.bias ?? state().org.defaultScoringBias,
    profile: "photocatalytic_aminoaryl",
  };

  const photo = scorePhotocatalyticAminoaryl({
    ...dualInput,
    profile: "photocatalytic_aminoaryl",
  });
  const copper = scoreCopperCatalyzedAminoaryl({
    ...dualInput,
    profile: "copper_catalyzed_aminoaryl",
  });
  const gap = Math.abs(photo.overall - copper.overall);
  let winner: RouteCompare["winner"] = "tie";
  if (photo.overall > copper.overall + 0.5) {
    winner = "photocatalytic_aminoaryl";
  } else if (copper.overall > photo.overall + 0.5) {
    winner = "copper_catalyzed_aminoaryl";
  }

  const compare: RouteCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    routeId: route.id,
    catalystId: catalyst.id,
    assayId: assay.id,
    input: dualInput,
    photo,
    copper,
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

export function getScoreboard(): RouteCompare[] {
  return [...state().compares].sort(
    (a, b) => b.photo.overall - a.photo.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      routes: state().routes,
      catalysts: state().catalysts,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,photoOverall,copperOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.photo.overall},${c.copper.overall},${c.createdAt}`,
    ),
  ];
  return rows.join("\n");
}

export function checkBearer(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice("Bearer ".length).trim();
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
  const org = state().org;
  const bucket = state().rateBucket;
  const nowMs = Date.now();
  if (nowMs - bucket.windowStart > 60_000) {
    bucket.windowStart = nowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  const remaining = Math.max(0, org.rateLimitPerMinute - bucket.count);
  return { ok: bucket.count <= org.rateLimitPerMinute, remaining };
}

export function ingestWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  if (signature) {
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const provided = signature.replace(/^sha256=/, "");
    try {
      const a = Buffer.from(expected);
      const b = Buffer.from(provided);
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return { ok: false, error: "bad_signature" };
      }
    } catch {
      return { ok: false, error: "bad_signature" };
    }
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) {
    return { ok: true, duplicate: true, id: existing.id };
  }
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

export function featureInventory(): { id: string; label: string }[] {
  return [
    { id: "landing", label: "Marketing landing with buyer outcome" },
    { id: "pricing", label: "Pricing tiers" },
    { id: "demo", label: "Step-by-step guided demo" },
    { id: "onboarding", label: "Onboarding checklist" },
    { id: "flows", label: "Multi-flow index (≥5)" },
    { id: "honesty", label: "Honesty fence" },
    { id: "packs", label: "Route pack registry CRUD" },
    { id: "routes", label: "Route workspace" },
    { id: "catalysts", label: "Photo / copper catalyst specs" },
    { id: "assays", label: "Aminoarylation assay runs" },
    { id: "compare", label: "Dual A/B compare" },
    { id: "scoreboard", label: "Compare scoreboard" },
    { id: "settings", label: "Org settings" },
    { id: "members", label: "Member invite" },
    { id: "audit", label: "Audit trail" },
    { id: "export-json", label: "JSON pack export" },
    { id: "export-csv", label: "CSV compare export" },
    { id: "webhook", label: "Idempotent webhook ingest" },
    { id: "auth", label: "Bearer token auth" },
    { id: "rate-limit", label: "Rate-limit feedback" },
    { id: "search", label: "Pack/route search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "photocatalytic_aminoaryl scorer" },
    { id: "scorer-b", label: "copper_catalyzed_aminoaryl scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "scoring-bias", label: "Scoring bias controls" },
    { id: "archive", label: "Archive packs/routes/catalysts" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "route-kinds", label: "Recorded route kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
