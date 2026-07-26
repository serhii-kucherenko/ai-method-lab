import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMyo7aGeneSupplement,
  scoreMyo7bActivation,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type AlleleKind,
  type UsherDualInput,
  type UsherDualQuality,
  type VectorKind,
  type ScoreMode,
  type ScoringBias,
} from "./domain/types";

export type {
  AssayKind,
  AlleleKind,
  UsherDualInput,
  UsherDualQuality,
  VectorKind,
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

export type AllelePack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  alleleBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type AlleleSpec = {
  id: string;
  packId: string;
  label: string;
  kind: AlleleKind;
  locusHint: string;
  coverageFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type VectorSpec = {
  id: string;
  packId: string;
  label: string;
  kind: VectorKind;
  modelHint: string;
  rescueFloor: number;
  evidenceFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  alleleId: string;
  vectorId: string;
  label: string;
  kind: AssayKind;
  myo7aRescue: number;
  myo7bActivation: number;
  alleleGap: number;
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

export type PathwayCompare = {
  id: string;
  name: string;
  packId: string;
  alleleId: string;
  vectorId: string;
  assayId: string;
  input: UsherDualInput;
  myo7a: UsherDualQuality;
  myo7b: UsherDualQuality;
  winner: "myo7a_gene_supplement" | "myo7b_activation" | "tie";
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
  packs: AllelePack[];
  alleles: AlleleSpec[];
  vectors: VectorSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: PathwayCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __usherDualStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const alleleId = "allele-demo";
  const vectorId = "vector-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Usher Dual Org",
      webhookUrl: "",
      webhookSecret: "usher-dual-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultScoringBias: "balanced",
      defaultMode: "myo7a_gene_supplement",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@usher-dual.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Usher 1B Allele Pack",
        version: "2026.1",
        programFocus: "MYO7A supplementation vs Myo7b activation soft-sim",
        alleleBudget: 36,
        status: "active",
        notes: "Seed pack for alleles, vectors, and assay runs",
        createdAt: now(),
      },
    ],
    alleles: [
      {
        id: alleleId,
        packId,
        label: "MYO7A null panel draft",
        kind: "myo7a_null",
        locusHint: "MYO7A-exon",
        coverageFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Allele soft-sim",
        status: "active",
        notes: "Soft-sim allele panel — not wet-lab validated",
        createdAt: now(),
      },
    ],
    vectors: [
      {
        id: vectorId,
        packId,
        label: "MYO7A gene supplement draft",
        kind: "myo7a_gene_supplement",
        modelHint: "dual-aav-myo7a",
        rescueFloor: 0.4,
        evidenceFloor: 0.35,
        metricHint: "Vector soft-sim",
        status: "active",
        notes: "Soft-sim vector — not patient dosing advice",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        alleleId,
        vectorId,
        label: "Rescue / dual-pathway soft-sim",
        kind: "dual_pathway_soft_sim",
        myo7aRescue: 0.42,
        myo7bActivation: 0.32,
        alleleGap: 0.7,
        assayReadout: 0.68,
        runNotes:
          "MYO7A supplementation looks strong on rescue but allele gaps can hide incomplete coverage Myo7b activation may exploit",
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
        detail: "Demo pack, alleles, vectors, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__usherDualStore) g.__usherDualStore = seed();
  return g.__usherDualStore;
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
  g.__usherDualStore = seed();
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
  items: AllelePack[];
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
  alleleBudget?: number;
  notes?: string;
}): AllelePack {
  const pack: AllelePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    alleleBudget: input.alleleBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): AllelePack | null {
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

export function listAlleles(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().alleles, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.locusHint.toLowerCase().includes(q),
  });
}

export function createAllele(input: {
  packId: string;
  label: string;
  kind: AlleleKind;
  locusHint: string;
  coverageFloor: number;
  fidelityFloor: number;
  metricHint?: string;
  notes?: string;
}): AlleleSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: AlleleSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    locusHint: input.locusHint,
    coverageFloor: input.coverageFloor,
    fidelityFloor: input.fidelityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().alleles.unshift(row);
  audit("evaluator", "allele.create", row.label);
  return row;
}

export function archiveAllele(id: string): AlleleSpec | null {
  const row = state().alleles.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "allele.archive", id);
  return row;
}

export function listVectors(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().vectors, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createVector(input: {
  packId: string;
  label: string;
  kind: VectorKind;
  modelHint: string;
  rescueFloor: number;
  evidenceFloor: number;
  metricHint?: string;
  notes?: string;
}): VectorSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: VectorSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    rescueFloor: input.rescueFloor,
    evidenceFloor: input.evidenceFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().vectors.unshift(row);
  audit("evaluator", "vector.create", row.label);
  return row;
}

export function archiveVector(id: string): VectorSpec | null {
  const row = state().vectors.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "vector.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  alleleId?: string;
  vectorId?: string;
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
  if (opts?.alleleId) items = items.filter((r) => r.alleleId === opts.alleleId);
  if (opts?.vectorId)
    items = items.filter((r) => r.vectorId === opts.vectorId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  alleleId: string;
  vectorId: string;
  label: string;
  kind: AssayKind;
  myo7aRescue: number;
  myo7bActivation: number;
  alleleGap: number;
  assayReadout: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().alleles.some((m) => m.id === input.alleleId)) return null;
  if (!state().vectors.some((m) => m.id === input.vectorId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    alleleId: input.alleleId,
    vectorId: input.vectorId,
    label: input.label,
    kind: input.kind,
    myo7aRescue: clamp(input.myo7aRescue, 0, 1),
    myo7bActivation: clamp(input.myo7bActivation, 0, 1),
    alleleGap: clamp(input.alleleGap, 0, 1),
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

export function listCompares(): PathwayCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  alleleId: string;
  vectorId: string;
  assayId: string;
  scoringBias?: ScoringBias;
  bias?: ScoringBias;
  overclaimRisk?: number;
  vectorDelivery?: number;
  evidenceStrength?: number;
  pathwayFollowThrough?: number;
}): PathwayCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const allele = state().alleles.find((m) => m.id === input.alleleId);
  const vector = state().vectors.find((m) => m.id === input.vectorId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !allele || !vector || !assay) return null;

  const dualInput: UsherDualInput = {
    myo7aRescue: clamp(assay.myo7aRescue, 0, 1),
    myo7bActivation: clamp(assay.myo7bActivation, 0, 1),
    alleleGap: clamp(assay.alleleGap, 0, 1),
    vectorDelivery: clamp(
      input.vectorDelivery ?? allele.coverageFloor,
      0,
      1,
    ),
    evidenceStrength: clamp(
      input.evidenceStrength ?? vector.evidenceFloor,
      0,
      1,
    ),
    pathwayFollowThrough: clamp(
      input.pathwayFollowThrough ?? allele.fidelityFloor,
      0,
      1,
    ),
    assayReadout: clamp(assay.assayReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - vector.rescueFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    scoringBias:
      input.scoringBias ?? input.bias ?? state().org.defaultScoringBias,
    profile: "myo7a_gene_supplement",
  };

  const myo7a = scoreMyo7aGeneSupplement({
    ...dualInput,
    profile: "myo7a_gene_supplement",
  });
  const myo7b = scoreMyo7bActivation({
    ...dualInput,
    profile: "myo7b_activation",
  });
  const gap = Math.abs(myo7a.overall - myo7b.overall);
  let winner: PathwayCompare["winner"] = "tie";
  if (myo7a.overall > myo7b.overall + 0.5) {
    winner = "myo7a_gene_supplement";
  } else if (myo7b.overall > myo7a.overall + 0.5) {
    winner = "myo7b_activation";
  }

  const compare: PathwayCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    alleleId: allele.id,
    vectorId: vector.id,
    assayId: assay.id,
    input: dualInput,
    myo7a,
    myo7b,
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

export function getScoreboard(): PathwayCompare[] {
  return [...state().compares].sort(
    (a, b) => b.myo7a.overall - a.myo7a.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      alleles: state().alleles,
      vectors: state().vectors,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,myo7aOverall,myo7bOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.myo7a.overall},${c.myo7b.overall},${c.createdAt}`,
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
    { id: "packs", label: "Allele pack registry CRUD" },
    { id: "alleles", label: "Allele workspace" },
    { id: "vectors", label: "MYO7A / Myo7b vector specs" },
    { id: "assays", label: "Pathway assay runs" },
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
    { id: "search", label: "Pack/allele search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "myo7a_gene_supplement scorer" },
    { id: "scorer-b", label: "myo7b_activation scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "scoring-bias", label: "Scoring bias controls" },
    { id: "archive", label: "Archive packs/alleles/vectors" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "allele-kinds", label: "Recorded allele kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
