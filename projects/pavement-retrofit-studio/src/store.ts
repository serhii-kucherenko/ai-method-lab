import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreConventionalPreservation,
  scorePhotocatalyticPavementRetrofit,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type CorridorKind,
  type RetrofitInput,
  type RetrofitQuality,
  type ScoreMode,
  type TreatmentBias,
  type TreatmentKind,
} from "./domain/types";

export type {
  AssayKind,
  CorridorKind,
  RetrofitInput,
  RetrofitQuality,
  ScoreMode,
  TreatmentBias,
  TreatmentKind,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CorridorPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  corridorBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type CorridorSpec = {
  id: string;
  packId: string;
  label: string;
  kind: CorridorKind;
  routeHint: string;
  trafficCeiling: number;
  exposureFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type TreatmentSpec = {
  id: string;
  packId: string;
  label: string;
  kind: TreatmentKind;
  materialHint: string;
  tio2Floor: number;
  durabilityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  corridorId: string;
  treatmentId: string;
  label: string;
  kind: AssayKind;
  noxBaseline: number;
  co2Baseline: number;
  tio2Loading: number;
  assaySignal: number;
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
  defaultTreatmentBias: TreatmentBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type RetrofitCompare = {
  id: string;
  name: string;
  packId: string;
  corridorId: string;
  treatmentId: string;
  assayId: string;
  input: RetrofitInput;
  photocatalytic: RetrofitQuality;
  conventional: RetrofitQuality;
  winner:
    | "photocatalytic_pavement_retrofit"
    | "conventional_preservation"
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
  packs: CorridorPack[];
  corridors: CorridorSpec[];
  treatments: TreatmentSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: RetrofitCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __pavementRetrofitStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const corridorId = "corridor-demo";
  const treatmentId = "treatment-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Pavement Retrofit Org",
      webhookUrl: "",
      webhookSecret: "pavement-retrofit-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultTreatmentBias: "balanced",
      defaultMode: "photocatalytic_pavement_retrofit",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@pavement-retrofit.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Urban Arterial Retrofit Pack",
        version: "2026.1",
        programFocus:
          "Photocatalytic pavement retrofit vs conventional preservation soft-sim",
        corridorBudget: 36,
        status: "active",
        notes:
          "Seed pack for corridors, treatments, and emission assay soft-sims",
        createdAt: now(),
      },
    ],
    corridors: [
      {
        id: corridorId,
        packId,
        label: "Downtown arterial draft",
        kind: "urban_arterial",
        routeHint: "arterial-a12",
        trafficCeiling: 0.45,
        exposureFloor: 0.4,
        metricHint: "Corridor soft-sim",
        status: "active",
        notes: "Soft-sim corridor panel — not live construction control",
        createdAt: now(),
      },
    ],
    treatments: [
      {
        id: treatmentId,
        packId,
        label: "TiO2 overlay draft",
        kind: "tio2_overlay",
        materialHint: "photocatalytic-overlay",
        tio2Floor: 0.4,
        durabilityFloor: 0.35,
        metricHint: "Treatment soft-sim",
        status: "active",
        notes: "Soft-sim treatment — not certified emissions audit",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        corridorId,
        treatmentId,
        label: "NOx / CO2 proxy assay soft-sim",
        kind: "nox_reduction",
        noxBaseline: 0.32,
        co2Baseline: 0.28,
        tio2Loading: 0.42,
        assaySignal: 0.7,
        runNotes:
          "Photocatalytic path looks strong on emissions but conventional still leads when TiO2 is ignored",
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
        detail: "Demo pack, corridors, treatments, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pavementRetrofitStore) g.__pavementRetrofitStore = seed();
  return g.__pavementRetrofitStore;
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
  g.__pavementRetrofitStore = seed();
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
  if (patch.defaultTreatmentBias !== undefined) {
    org.defaultTreatmentBias = patch.defaultTreatmentBias;
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
  items: CorridorPack[];
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
  corridorBudget?: number;
  notes?: string;
}): CorridorPack {
  const pack: CorridorPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    corridorBudget: input.corridorBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CorridorPack | null {
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

export function listCorridors(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().corridors, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.routeHint.toLowerCase().includes(q),
  });
}

export function createCorridor(input: {
  packId: string;
  label: string;
  kind: CorridorKind;
  routeHint: string;
  trafficCeiling: number;
  exposureFloor: number;
  metricHint?: string;
  notes?: string;
}): CorridorSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: CorridorSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    routeHint: input.routeHint,
    trafficCeiling: input.trafficCeiling,
    exposureFloor: input.exposureFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().corridors.unshift(row);
  audit("evaluator", "corridor.create", row.label);
  return row;
}

export function archiveCorridor(id: string): CorridorSpec | null {
  const row = state().corridors.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "corridor.archive", id);
  return row;
}

export function listTreatments(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().treatments, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.materialHint.toLowerCase().includes(q),
  });
}

export function createTreatment(input: {
  packId: string;
  label: string;
  kind: TreatmentKind;
  materialHint: string;
  tio2Floor: number;
  durabilityFloor: number;
  metricHint?: string;
  notes?: string;
}): TreatmentSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: TreatmentSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    materialHint: input.materialHint,
    tio2Floor: input.tio2Floor,
    durabilityFloor: input.durabilityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().treatments.unshift(row);
  audit("evaluator", "treatment.create", row.label);
  return row;
}

export function archiveTreatment(id: string): TreatmentSpec | null {
  const row = state().treatments.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "treatment.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  corridorId?: string;
  treatmentId?: string;
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
  if (opts?.corridorId)
    items = items.filter((r) => r.corridorId === opts.corridorId);
  if (opts?.treatmentId)
    items = items.filter((r) => r.treatmentId === opts.treatmentId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  corridorId: string;
  treatmentId: string;
  label: string;
  kind: AssayKind;
  noxBaseline: number;
  co2Baseline: number;
  tio2Loading: number;
  assaySignal: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().corridors.some((m) => m.id === input.corridorId)) return null;
  if (!state().treatments.some((m) => m.id === input.treatmentId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    corridorId: input.corridorId,
    treatmentId: input.treatmentId,
    label: input.label,
    kind: input.kind,
    noxBaseline: clamp(input.noxBaseline, 0, 1),
    co2Baseline: clamp(input.co2Baseline, 0, 1),
    tio2Loading: clamp(input.tio2Loading, 0, 1),
    assaySignal: clamp(input.assaySignal, 0, 1),
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

export function listCompares(): RetrofitCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  corridorId: string;
  treatmentId: string;
  assayId: string;
  treatmentBias?: TreatmentBias;
  bias?: TreatmentBias;
  overclaimRisk?: number;
  preservationQuality?: number;
  trafficDensity?: number;
  corridorExposure?: number;
}): RetrofitCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const corridor = state().corridors.find((m) => m.id === input.corridorId);
  const treatment = state().treatments.find((m) => m.id === input.treatmentId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !corridor || !treatment || !assay) return null;

  const retrofitInput: RetrofitInput = {
    tio2Loading: clamp(assay.tio2Loading, 0, 1),
    trafficDensity: clamp(
      input.trafficDensity ?? corridor.trafficCeiling,
      0,
      1,
    ),
    noxBaseline: clamp(assay.noxBaseline, 0, 1),
    co2Baseline: clamp(assay.co2Baseline, 0, 1),
    preservationQuality: clamp(
      input.preservationQuality ?? treatment.durabilityFloor,
      0,
      1,
    ),
    corridorExposure: clamp(
      input.corridorExposure ?? corridor.exposureFloor,
      0,
      1,
    ),
    assaySignal: clamp(assay.assaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - treatment.tio2Floor > 0.5 ? 0.55 : 0.28, 0, 1),
    treatmentBias:
      input.treatmentBias ?? input.bias ?? state().org.defaultTreatmentBias,
    profile: "photocatalytic_pavement_retrofit",
  };

  const photocatalytic = scorePhotocatalyticPavementRetrofit({
    ...retrofitInput,
    profile: "photocatalytic_pavement_retrofit",
  });
  const conventional = scoreConventionalPreservation({
    ...retrofitInput,
    profile: "conventional_preservation",
  });
  const gap = Math.abs(photocatalytic.overall - conventional.overall);
  let winner: RetrofitCompare["winner"] = "tie";
  if (photocatalytic.overall > conventional.overall + 0.5) {
    winner = "photocatalytic_pavement_retrofit";
  } else if (conventional.overall > photocatalytic.overall + 0.5) {
    winner = "conventional_preservation";
  }

  const compare: RetrofitCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    corridorId: corridor.id,
    treatmentId: treatment.id,
    assayId: assay.id,
    input: retrofitInput,
    photocatalytic,
    conventional,
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

export function getScoreboard(): RetrofitCompare[] {
  return [...state().compares].sort(
    (a, b) => b.photocatalytic.overall - a.photocatalytic.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      corridors: state().corridors,
      treatments: state().treatments,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,photocatalyticOverall,conventionalOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.photocatalytic.overall},${c.conventional.overall},${c.createdAt}`,
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
    { id: "packs", label: "Corridor pack registry CRUD" },
    { id: "corridors", label: "Corridor workspace" },
    { id: "treatments", label: "Photocatalytic treatment specs" },
    { id: "assays", label: "Emission assay runs" },
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
    { id: "search", label: "Pack/corridor search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "photocatalytic_pavement_retrofit scorer" },
    { id: "scorer-b", label: "conventional_preservation scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "treatment-bias", label: "Treatment bias controls" },
    { id: "archive", label: "Archive packs/corridors/treatments" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "corridor-kinds", label: "Corridor kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
