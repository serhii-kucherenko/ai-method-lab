import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreIterativeDeltOptimize,
  scoreSinglePassLibraryScreen,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type DeltBias,
  type CycleKind,
  type ScoreMode,
  type LibraryKind,
  type HitFilterKind,
  type DeltInput,
  type DeltQuality,
} from "./domain/types";

export type {
  DeltBias,
  CycleKind,
  ScoreMode,
  LibraryKind,
  HitFilterKind,
  DeltInput,
  DeltQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type LibraryPack = {
  id: string;
  label: string;
  version: string;
  assayFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type LibraryDef = {
  id: string;
  packId: string;
  label: string;
  kind: LibraryKind;
  scaffoldHint: string;
  memberCount: number;
  diversityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type ConstructCycle = {
  id: string;
  packId: string;
  label: string;
  kind: CycleKind;
  cycleHint: string;
  roundCount: number;
  enrichmentFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type HitShortlist = {
  id: string;
  packId: string;
  label: string;
  kind: HitFilterKind;
  filterHint: string;
  hitCount: number;
  precisionFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  libraryId: string;
  cycleId: string;
  hitId: string;
  cycleDepth: number;
  enrichmentFold: number;
  diversityRetention: number;
  hitPrecision: number;
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
  defaultDeltBias: DeltBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type DeltCompare = {
  id: string;
  name: string;
  packId: string;
  libraryId: string;
  cycleId: string;
  hitId: string;
  assayRunId: string;
  input: DeltInput;
  iterative: DeltQuality;
  singlePass: DeltQuality;
  winner:
    | "iterative_delt_optimize"
    | "single_pass_library_screen"
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
  packs: LibraryPack[];
  libraries: LibraryDef[];
  cycles: ConstructCycle[];
  hits: HitShortlist[];
  assayRuns: AssayRun[];
  auditEvents: AuditEvent[];
  compares: DeltCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __encodedLibraryStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const libraryId = "library-demo";
  const cycleId = "cycle-demo";
  const hitId = "hit-demo";
  const assayRunId = "assay-demo";
  return {
    org: {
      name: "Encoded Library Org",
      webhookUrl: "",
      webhookSecret: "encoded-library-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultDeltBias: "balanced",
      defaultMode: "iterative_delt_optimize",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@encoded-library.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Macrocyclic DELT Soft-Sim Pack",
        version: "2026.1",
        assayFocus:
          "Iterative DELT construct-and-screen vs single-pass library screen",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for construct cycles and hit shortlists vs single-pass soft-sim",
        createdAt: now(),
      },
    ],
    libraries: [
      {
        id: libraryId,
        packId,
        label: "Macrocyclic DNA-encoded library",
        kind: "macrocyclic",
        scaffoldHint: "macrocycle,dna-tag,building-blocks",
        memberCount: 120000,
        diversityFloor: 0.35,
        metricHint: "Library diversity and scaffold soft-sim",
        status: "active",
        notes: "Soft-sim libraries — not wet-lab validated IND/NDA",
        createdAt: now(),
      },
    ],
    cycles: [
      {
        id: cycleId,
        packId,
        label: "Construct–screen cycle A",
        kind: "construct_screen",
        cycleHint: "construct,screen,enrich",
        roundCount: 3,
        enrichmentFloor: 0.4,
        metricHint: "Cycle depth and enrichment soft-sim",
        status: "active",
        notes: "Soft-sim cycles — not live screening robotics",
        createdAt: now(),
      },
    ],
    hits: [
      {
        id: hitId,
        packId,
        label: "Macrocycle hit shortlist",
        kind: "macrocycle_fit",
        filterHint: "enrichment,diversity,off-target",
        hitCount: 48,
        precisionFloor: 0.35,
        metricHint: "Hit precision and shortlist fidelity",
        status: "active",
        notes:
          "Soft-sim hits — not clinical candidate nomination / not authors’ DELT system",
        createdAt: now(),
      },
    ],
    assayRuns: [
      {
        id: assayRunId,
        packId,
        libraryId,
        cycleId,
        hitId,
        cycleDepth: 0.62,
        enrichmentFold: 0.7,
        diversityRetention: 0.74,
        hitPrecision: 0.68,
        runNotes:
          "Iterative DELT looks strong but single-pass still leads when cycle depth is thin",
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
        detail: "Demo pack, libraries, cycles, hits, and assay run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__encodedLibraryStore) g.__encodedLibraryStore = seed();
  return g.__encodedLibraryStore;
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
  g.__encodedLibraryStore = seed();
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
  if (patch.defaultDeltBias !== undefined) {
    org.defaultDeltBias = patch.defaultDeltBias;
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
  items: LibraryPack[];
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
        p.assayFocus.toLowerCase().includes(q) ||
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
  assayFocus: string;
  sessionBudget?: number;
  notes?: string;
}): LibraryPack {
  const pack: LibraryPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    assayFocus: input.assayFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): LibraryPack | null {
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

export function listLibraries(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().libraries, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.scaffoldHint.toLowerCase().includes(q),
  });
}

export function createLibrary(input: {
  packId: string;
  label: string;
  kind: LibraryKind;
  scaffoldHint: string;
  memberCount: number;
  diversityFloor: number;
  metricHint?: string;
  notes?: string;
}): LibraryDef | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: LibraryDef = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    scaffoldHint: input.scaffoldHint,
    memberCount: input.memberCount,
    diversityFloor: input.diversityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().libraries.unshift(row);
  audit("evaluator", "library.create", row.label);
  return row;
}

export function archiveLibrary(id: string): LibraryDef | null {
  const row = state().libraries.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "library.archive", id);
  return row;
}

export function listCycles(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().cycles, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.cycleHint.toLowerCase().includes(q),
  });
}

export function createCycle(input: {
  packId: string;
  label: string;
  kind: CycleKind;
  cycleHint: string;
  roundCount: number;
  enrichmentFloor: number;
  metricHint?: string;
  notes?: string;
}): ConstructCycle | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ConstructCycle = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    cycleHint: input.cycleHint,
    roundCount: input.roundCount,
    enrichmentFloor: input.enrichmentFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().cycles.unshift(row);
  audit("evaluator", "cycle.create", row.label);
  return row;
}

export function archiveCycle(id: string): ConstructCycle | null {
  const row = state().cycles.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "cycle.archive", id);
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
      m.filterHint.toLowerCase().includes(q),
  });
}

export function createHit(input: {
  packId: string;
  label: string;
  kind: HitFilterKind;
  filterHint: string;
  hitCount: number;
  precisionFloor: number;
  metricHint?: string;
  notes?: string;
}): HitShortlist | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: HitShortlist = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    filterHint: input.filterHint,
    hitCount: input.hitCount,
    precisionFloor: input.precisionFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().hits.unshift(row);
  audit("evaluator", "hit.create", row.label);
  return row;
}

export function archiveHit(id: string): HitShortlist | null {
  const row = state().hits.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "hit.archive", id);
  return row;
}

export function listAssayRuns(opts?: {
  packId?: string;
  libraryId?: string;
  cycleId?: string;
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
  let items = [...state().assayRuns];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.libraryId)
    items = items.filter((r) => r.libraryId === opts.libraryId);
  if (opts?.cycleId) items = items.filter((r) => r.cycleId === opts.cycleId);
  if (opts?.hitId) items = items.filter((r) => r.hitId === opts.hitId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssayRun(input: {
  packId: string;
  libraryId: string;
  cycleId: string;
  hitId: string;
  cycleDepth: number;
  enrichmentFold: number;
  diversityRetention: number;
  hitPrecision: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().libraries.some((m) => m.id === input.libraryId)) return null;
  if (!state().cycles.some((m) => m.id === input.cycleId)) return null;
  if (!state().hits.some((m) => m.id === input.hitId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    libraryId: input.libraryId,
    cycleId: input.cycleId,
    hitId: input.hitId,
    cycleDepth: clamp(input.cycleDepth, 0, 1),
    enrichmentFold: clamp(input.enrichmentFold, 0, 1),
    diversityRetention: clamp(input.diversityRetention, 0, 1),
    hitPrecision: clamp(input.hitPrecision, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().assayRuns.unshift(run);
  audit("evaluator", "assay.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): DeltCompare[] {
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
  libraryId: string;
  cycleId: string;
  hitId: string;
  assayRunId: string;
  deltBias?: DeltBias;
  bias?: DeltBias;
  libraryCoverage?: number;
  selectionBias?: number;
  synthesisNoise?: number;
  overclaimRisk?: number;
}): DeltCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const library = state().libraries.find((m) => m.id === input.libraryId);
  const cycle = state().cycles.find((m) => m.id === input.cycleId);
  const hit = state().hits.find((m) => m.id === input.hitId);
  const assayRun = state().assayRuns.find((r) => r.id === input.assayRunId);
  if (!pack || !library || !cycle || !hit || !assayRun) return null;

  const goldWeight = outcomeWeight("review");
  const span = Math.max(0.05, 1 - cycle.enrichmentFloor);
  const deltInput: DeltInput = {
    cycleDepth: clamp(assayRun.cycleDepth, 0, 1),
    enrichmentFold: clamp(assayRun.enrichmentFold, 0, 1),
    diversityRetention: clamp(assayRun.diversityRetention, 0, 1),
    hitPrecision: clamp((assayRun.hitPrecision + goldWeight) / 2, 0, 1),
    libraryCoverage: input.libraryCoverage ?? 0.82,
    selectionBias: input.selectionBias ?? 0.7,
    synthesisNoise: input.synthesisNoise ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    deltBias: input.deltBias ?? input.bias ?? state().org.defaultDeltBias,
    profile: "iterative_delt_optimize",
  };

  const iterative = scoreIterativeDeltOptimize({
    ...deltInput,
    profile: "iterative_delt_optimize",
  });
  const singlePass = scoreSinglePassLibraryScreen({
    ...deltInput,
    profile: "single_pass_library_screen",
  });
  const gap = Math.abs(iterative.overall - singlePass.overall);
  let winner: DeltCompare["winner"] = "tie";
  if (iterative.overall > singlePass.overall + 0.5) {
    winner = "iterative_delt_optimize";
  } else if (singlePass.overall > iterative.overall + 0.5) {
    winner = "single_pass_library_screen";
  }

  const compare: DeltCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    libraryId: library.id,
    cycleId: cycle.id,
    hitId: hit.id,
    assayRunId: assayRun.id,
    input: deltInput,
    iterative,
    singlePass,
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

export function getScoreboard(): DeltCompare[] {
  return [...state().compares].sort(
    (a, b) => b.iterative.overall - a.iterative.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      libraries: state().libraries,
      cycles: state().cycles,
      hits: state().hits,
      assayRuns: state().assayRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,iterativeOverall,singlePassOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.iterative.overall},${c.singlePass.overall},${c.createdAt}`,
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
    { id: "library-packs", name: "Library pack registry" },
    { id: "pack-versions", name: "Versioned library packs" },
    { id: "libraries", name: "DNA-encoded library registry" },
    { id: "library-editor", name: "Library scaffold editor" },
    { id: "library-search", name: "Library search and filter" },
    { id: "cycles", name: "Construct cycle configs" },
    { id: "cycle-editor", name: "Construct cycle editor" },
    { id: "hits", name: "Hit shortlist registry" },
    { id: "hit-filters", name: "Hit shortlist filters" },
    { id: "assay-runs", name: "Assay run soft-sim" },
    { id: "delt-bias", name: "DELT bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Iterative DELT vs single-pass library screen compare",
    },
    { id: "delta-view", name: "DELT delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not wet-lab IND/NDA / not live robotics / not clinical nomination",
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
    { id: "search", name: "Search across packs and libraries" },
    { id: "assays-page", name: "Assay runs workspace" },
  ];
}

export function scorePreview(input: DeltInput): {
  iterative: DeltQuality;
  singlePass: DeltQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const iterative = scoreIterativeDeltOptimize({
    ...input,
    profile: "iterative_delt_optimize",
  });
  const singlePass = scoreSinglePassLibraryScreen({
    ...input,
    profile: "single_pass_library_screen",
  });
  return {
    iterative,
    singlePass,
    readiness: readinessFromQuality(iterative.overall),
  };
}
