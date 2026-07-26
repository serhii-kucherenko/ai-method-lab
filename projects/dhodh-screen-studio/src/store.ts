import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreStructureBasedDhodh,
  scoreNaiveLibraryBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type ScreenKind,
  type DhodhInput,
  type DhodhQuality,
  type HitKind,
  type ScoreMode,
  type ScoringBias,
} from "./domain/types";

export type {
  AssayKind,
  ScreenKind,
  DhodhInput,
  DhodhQuality,
  HitKind,
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

export type ScreenPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  screenBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type ScreenSpec = {
  id: string;
  packId: string;
  label: string;
  kind: ScreenKind;
  pocketHint: string;
  coverageFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type HitSpec = {
  id: string;
  packId: string;
  label: string;
  kind: HitKind;
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
  screenId: string;
  hitId: string;
  label: string;
  kind: AssayKind;
  dockingFit: number;
  libraryHitRate: number;
  pharmacophoreMatch: number;
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

export type ScreenCompare = {
  id: string;
  name: string;
  packId: string;
  screenId: string;
  hitId: string;
  assayId: string;
  input: DhodhInput;
  structure: DhodhQuality;
  library: DhodhQuality;
  winner:
    | "structure_based_dhodh"
    | "naive_library_baseline"
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
  packs: ScreenPack[];
  screens: ScreenSpec[];
  hits: HitSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: ScreenCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __dhodhScreenStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const screenId = "screen-demo";
  const hitId = "hit-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Dhodh Screen Org",
      webhookUrl: "",
      webhookSecret: "dhodh-screen-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultScoringBias: "balanced",
      defaultMode: "structure_based_dhodh",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@dhodh-screen.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "PfDHODH Screen Pack",
        version: "2026.1",
        programFocus:
          "Structure-based vs naive library PfDHODH soft-sim",
        screenBudget: 36,
        status: "active",
        notes: "Seed pack for screens, hits, and assay runs",
        createdAt: now(),
      },
    ],
    screens: [
      {
        id: screenId,
        packId,
        label: "Docking + pharmacophore PfDHODH draft",
        kind: "docking_pharmacophore",
        pocketHint: "pf-dhodh-pocket",
        coverageFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Screen soft-sim",
        status: "active",
        notes: "Soft-sim screen panel — not wet-lab validated",
        createdAt: now(),
      },
    ],
    hits: [
      {
        id: hitId,
        packId,
        label: "Structure-based DHODH hit draft",
        kind: "structure_based_dhodh",
        modelHint: "structure-dhodh-vs",
        yieldFloor: 0.4,
        evidenceFloor: 0.35,
        metricHint: "Hit soft-sim",
        status: "active",
        notes: "Soft-sim hit — not compound procurement",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        screenId,
        hitId,
        label: "Structure / library dual soft-sim",
        kind: "dual_screen_soft_sim",
        dockingFit: 0.42,
        libraryHitRate: 0.32,
        pharmacophoreMatch: 0.7,
        assayReadout: 0.68,
        runNotes:
          "Structure-based path looks strong on docking but low parasite selectivity can hide naive library lookalikes",
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
        detail: "Demo pack, screens, hits, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__dhodhScreenStore) g.__dhodhScreenStore = seed();
  return g.__dhodhScreenStore;
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
  g.__dhodhScreenStore = seed();
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
  items: ScreenPack[];
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
  screenBudget?: number;
  notes?: string;
}): ScreenPack {
  const pack: ScreenPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    screenBudget: input.screenBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ScreenPack | null {
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

export function listScreens(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().screens, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.pocketHint.toLowerCase().includes(q),
  });
}

export function createScreen(input: {
  packId: string;
  label: string;
  kind: ScreenKind;
  pocketHint: string;
  coverageFloor: number;
  fidelityFloor: number;
  metricHint?: string;
  notes?: string;
}): ScreenSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ScreenSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    pocketHint: input.pocketHint,
    coverageFloor: input.coverageFloor,
    fidelityFloor: input.fidelityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().screens.unshift(row);
  audit("evaluator", "screen.create", row.label);
  return row;
}

export function archiveScreen(id: string): ScreenSpec | null {
  const row = state().screens.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "screen.archive", id);
  return row;
}

export function listHits(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().hits, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createHit(input: {
  packId: string;
  label: string;
  kind: HitKind;
  modelHint: string;
  yieldFloor: number;
  evidenceFloor: number;
  metricHint?: string;
  notes?: string;
}): HitSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: HitSpec = {
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
  state().hits.unshift(row);
  audit("evaluator", "hit.create", row.label);
  return row;
}

export function archiveHit(id: string): HitSpec | null {
  const row = state().hits.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "hit.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  screenId?: string;
  hitId?: string;
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
  if (opts?.screenId) items = items.filter((r) => r.screenId === opts.screenId);
  if (opts?.hitId) items = items.filter((r) => r.hitId === opts.hitId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  screenId: string;
  hitId: string;
  label: string;
  kind: AssayKind;
  dockingFit: number;
  libraryHitRate: number;
  pharmacophoreMatch: number;
  assayReadout: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().screens.some((m) => m.id === input.screenId)) return null;
  if (!state().hits.some((m) => m.id === input.hitId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    screenId: input.screenId,
    hitId: input.hitId,
    label: input.label,
    kind: input.kind,
    dockingFit: clamp(input.dockingFit, 0, 1),
    libraryHitRate: clamp(input.libraryHitRate, 0, 1),
    pharmacophoreMatch: clamp(input.pharmacophoreMatch, 0, 1),
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

export function listCompares(): ScreenCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  screenId: string;
  hitId: string;
  assayId: string;
  scoringBias?: ScoringBias;
  bias?: ScoringBias;
  overclaimRisk?: number;
  parasiteSelectivity?: number;
  evidenceStrength?: number;
  screenFollowThrough?: number;
}): ScreenCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const screen = state().screens.find((m) => m.id === input.screenId);
  const hit = state().hits.find((m) => m.id === input.hitId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !screen || !hit || !assay) return null;

  const dualInput: DhodhInput = {
    dockingFit: clamp(assay.dockingFit, 0, 1),
    libraryHitRate: clamp(assay.libraryHitRate, 0, 1),
    pharmacophoreMatch: clamp(assay.pharmacophoreMatch, 0, 1),
    parasiteSelectivity: clamp(
      input.parasiteSelectivity ?? screen.coverageFloor,
      0,
      1,
    ),
    evidenceStrength: clamp(
      input.evidenceStrength ?? hit.evidenceFloor,
      0,
      1,
    ),
    screenFollowThrough: clamp(
      input.screenFollowThrough ?? screen.fidelityFloor,
      0,
      1,
    ),
    assayReadout: clamp(assay.assayReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - hit.yieldFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    scoringBias:
      input.scoringBias ?? input.bias ?? state().org.defaultScoringBias,
    profile: "structure_based_dhodh",
  };

  const structure = scoreStructureBasedDhodh({
    ...dualInput,
    profile: "structure_based_dhodh",
  });
  const library = scoreNaiveLibraryBaseline({
    ...dualInput,
    profile: "naive_library_baseline",
  });
  const gap = Math.abs(structure.overall - library.overall);
  let winner: ScreenCompare["winner"] = "tie";
  if (structure.overall > library.overall + 0.5) {
    winner = "structure_based_dhodh";
  } else if (library.overall > structure.overall + 0.5) {
    winner = "naive_library_baseline";
  }

  const compare: ScreenCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    screenId: screen.id,
    hitId: hit.id,
    assayId: assay.id,
    input: dualInput,
    structure,
    library,
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

export function getScoreboard(): ScreenCompare[] {
  return [...state().compares].sort(
    (a, b) => b.structure.overall - a.structure.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      screens: state().screens,
      hits: state().hits,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,structureOverall,libraryOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.structure.overall},${c.library.overall},${c.createdAt}`,
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
    { id: "packs", label: "Screen pack registry CRUD" },
    { id: "screens", label: "Structure-based screen workspace" },
    { id: "hits", label: "Hit specs for DHODH screens" },
    { id: "assays", label: "DHODH assay runs" },
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
    { id: "search", label: "Pack/screen search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "structure_based_dhodh scorer" },
    { id: "scorer-b", label: "naive_library_baseline scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "scoring-bias", label: "Scoring bias controls" },
    { id: "archive", label: "Archive packs/screens/hits" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "screen-kinds", label: "Recorded screen kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
