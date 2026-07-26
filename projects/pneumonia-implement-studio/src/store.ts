import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreCfirCodesignPrimaryCare,
  scoreStatusQuoPathway,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type DistrictKind,
  type FidelityKind,
  type ImplementInput,
  type ImplementQuality,
  type ImplementationBias,
  type PathwayKind,
  type ScoreMode,
} from "./domain/types";

export type {
  DistrictKind,
  FidelityKind,
  ImplementInput,
  ImplementQuality,
  ImplementationBias,
  PathwayKind,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type DistrictPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  districtBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type DistrictSpec = {
  id: string;
  packId: string;
  label: string;
  kind: DistrictKind;
  regionHint: string;
  delayCeiling: number;
  coverageFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type PathwaySpec = {
  id: string;
  packId: string;
  label: string;
  kind: PathwayKind;
  modelHint: string;
  codesignFloor: number;
  clarityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type FidelityRun = {
  id: string;
  packId: string;
  districtId: string;
  pathwayId: string;
  label: string;
  kind: FidelityKind;
  caretakerDelay: number;
  referralFriction: number;
  codesignIntensity: number;
  fidelitySignal: number;
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
  defaultImplementationBias: ImplementationBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ImplementCompare = {
  id: string;
  name: string;
  packId: string;
  districtId: string;
  pathwayId: string;
  fidelityId: string;
  input: ImplementInput;
  cfir: ImplementQuality;
  statusQuo: ImplementQuality;
  winner:
    | "cfir_codesign_primary_care"
    | "status_quo_pathway"
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
  packs: DistrictPack[];
  districts: DistrictSpec[];
  pathways: PathwaySpec[];
  fidelityRuns: FidelityRun[];
  auditEvents: AuditEvent[];
  compares: ImplementCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __pneumoniaImplementStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const districtId = "district-demo";
  const pathwayId = "pathway-demo";
  const fidelityId = "fidelity-demo";
  return {
    org: {
      name: "Pneumonia Implement Org",
      webhookUrl: "",
      webhookSecret: "pneumonia-implement-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultImplementationBias: "balanced",
      defaultMode: "cfir_codesign_primary_care",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@pneumonia-implement.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "District Childhood Pneumonia Pack",
        version: "2026.1",
        programFocus:
          "CFIR co-design primary care vs status-quo pathway soft-sim",
        districtBudget: 36,
        status: "active",
        notes:
          "Seed pack for districts, pathways, and fidelity soft-sims",
        createdAt: now(),
      },
    ],
    districts: [
      {
        id: districtId,
        packId,
        label: "Rural block draft",
        kind: "rural_block",
        regionHint: "block-a12",
        delayCeiling: 0.45,
        coverageFloor: 0.4,
        metricHint: "District soft-sim",
        status: "active",
        notes: "Soft-sim district panel — not live clinical triage",
        createdAt: now(),
      },
    ],
    pathways: [
      {
        id: pathwayId,
        packId,
        label: "CFIR co-design draft",
        kind: "cfir_codesign",
        modelHint: "codesign-primary-care",
        codesignFloor: 0.4,
        clarityFloor: 0.35,
        metricHint: "Pathway soft-sim",
        status: "active",
        notes: "Soft-sim pathway — not EMR write-back",
        createdAt: now(),
      },
    ],
    fidelityRuns: [
      {
        id: fidelityId,
        packId,
        districtId,
        pathwayId,
        label: "Caregiver delay / referral fidelity soft-sim",
        kind: "caregiver_delay",
        caretakerDelay: 0.32,
        referralFriction: 0.28,
        codesignIntensity: 0.42,
        fidelitySignal: 0.7,
        runNotes:
          "CFIR path looks strong on access but status-quo still leads when co-design is ignored",
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
        detail: "Demo pack, districts, pathways, and fidelity runs seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pneumoniaImplementStore) g.__pneumoniaImplementStore = seed();
  return g.__pneumoniaImplementStore;
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
  g.__pneumoniaImplementStore = seed();
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
  if (patch.defaultImplementationBias !== undefined) {
    org.defaultImplementationBias = patch.defaultImplementationBias;
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
  items: DistrictPack[];
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
  districtBudget?: number;
  notes?: string;
}): DistrictPack {
  const pack: DistrictPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    districtBudget: input.districtBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): DistrictPack | null {
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

export function listDistricts(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().districts, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.regionHint.toLowerCase().includes(q),
  });
}

export function createDistrict(input: {
  packId: string;
  label: string;
  kind: DistrictKind;
  regionHint: string;
  delayCeiling: number;
  coverageFloor: number;
  metricHint?: string;
  notes?: string;
}): DistrictSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: DistrictSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    regionHint: input.regionHint,
    delayCeiling: input.delayCeiling,
    coverageFloor: input.coverageFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().districts.unshift(row);
  audit("evaluator", "district.create", row.label);
  return row;
}

export function archiveDistrict(id: string): DistrictSpec | null {
  const row = state().districts.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "district.archive", id);
  return row;
}

export function listPathways(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().pathways, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createPathway(input: {
  packId: string;
  label: string;
  kind: PathwayKind;
  modelHint: string;
  codesignFloor: number;
  clarityFloor: number;
  metricHint?: string;
  notes?: string;
}): PathwaySpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: PathwaySpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    codesignFloor: input.codesignFloor,
    clarityFloor: input.clarityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().pathways.unshift(row);
  audit("evaluator", "pathway.create", row.label);
  return row;
}

export function archivePathway(id: string): PathwaySpec | null {
  const row = state().pathways.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "pathway.archive", id);
  return row;
}

export function listFidelity(opts?: {
  packId?: string;
  districtId?: string;
  pathwayId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: FidelityRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().fidelityRuns];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.districtId)
    items = items.filter((r) => r.districtId === opts.districtId);
  if (opts?.pathwayId)
    items = items.filter((r) => r.pathwayId === opts.pathwayId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createFidelity(input: {
  packId: string;
  districtId: string;
  pathwayId: string;
  label: string;
  kind: FidelityKind;
  caretakerDelay: number;
  referralFriction: number;
  codesignIntensity: number;
  fidelitySignal: number;
  runNotes?: string;
}): FidelityRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().districts.some((m) => m.id === input.districtId)) return null;
  if (!state().pathways.some((m) => m.id === input.pathwayId)) return null;
  const run: FidelityRun = {
    id: randomUUID(),
    packId: input.packId,
    districtId: input.districtId,
    pathwayId: input.pathwayId,
    label: input.label,
    kind: input.kind,
    caretakerDelay: clamp(input.caretakerDelay, 0, 1),
    referralFriction: clamp(input.referralFriction, 0, 1),
    codesignIntensity: clamp(input.codesignIntensity, 0, 1),
    fidelitySignal: clamp(input.fidelitySignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().fidelityRuns.unshift(run);
  audit("evaluator", "fidelity.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): ImplementCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  districtId: string;
  pathwayId: string;
  fidelityId: string;
  implementationBias?: ImplementationBias;
  bias?: ImplementationBias;
  overclaimRisk?: number;
  pathwayClarity?: number;
  communityEngagement?: number;
  districtCoverage?: number;
}): ImplementCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const district = state().districts.find((m) => m.id === input.districtId);
  const pathway = state().pathways.find((m) => m.id === input.pathwayId);
  const fidelity = state().fidelityRuns.find((r) => r.id === input.fidelityId);
  if (!pack || !district || !pathway || !fidelity) return null;

  const implementInput: ImplementInput = {
    codesignIntensity: clamp(fidelity.codesignIntensity, 0, 1),
    communityEngagement: clamp(
      input.communityEngagement ?? pathway.codesignFloor,
      0,
      1,
    ),
    caretakerDelay: clamp(fidelity.caretakerDelay, 0, 1),
    referralFriction: clamp(fidelity.referralFriction, 0, 1),
    pathwayClarity: clamp(
      input.pathwayClarity ?? pathway.clarityFloor,
      0,
      1,
    ),
    districtCoverage: clamp(
      input.districtCoverage ?? district.coverageFloor,
      0,
      1,
    ),
    fidelitySignal: clamp(fidelity.fidelitySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - pathway.codesignFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    implementationBias:
      input.implementationBias ??
      input.bias ??
      state().org.defaultImplementationBias,
    profile: "cfir_codesign_primary_care",
  };

  const cfir = scoreCfirCodesignPrimaryCare({
    ...implementInput,
    profile: "cfir_codesign_primary_care",
  });
  const statusQuo = scoreStatusQuoPathway({
    ...implementInput,
    profile: "status_quo_pathway",
  });
  const gap = Math.abs(cfir.overall - statusQuo.overall);
  let winner: ImplementCompare["winner"] = "tie";
  if (cfir.overall > statusQuo.overall + 0.5) {
    winner = "cfir_codesign_primary_care";
  } else if (statusQuo.overall > cfir.overall + 0.5) {
    winner = "status_quo_pathway";
  }

  const compare: ImplementCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    districtId: district.id,
    pathwayId: pathway.id,
    fidelityId: fidelity.id,
    input: implementInput,
    cfir,
    statusQuo,
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

export function getScoreboard(): ImplementCompare[] {
  return [...state().compares].sort(
    (a, b) => b.cfir.overall - a.cfir.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      districts: state().districts,
      pathways: state().pathways,
      fidelityRuns: state().fidelityRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,cfirOverall,statusQuoOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.cfir.overall},${c.statusQuo.overall},${c.createdAt}`,
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
    { id: "packs", label: "District pack registry CRUD" },
    { id: "districts", label: "District workspace" },
    { id: "pathways", label: "CFIR / status-quo pathway specs" },
    { id: "fidelity", label: "Fidelity measure runs" },
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
    { id: "search", label: "Pack/district search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "cfir_codesign_primary_care scorer" },
    { id: "scorer-b", label: "status_quo_pathway scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "implementation-bias", label: "Implementation bias controls" },
    { id: "archive", label: "Archive packs/districts/pathways" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "district-kinds", label: "District kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
