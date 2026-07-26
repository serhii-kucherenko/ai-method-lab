import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreAnionicMofCapture,
  scoreConventionalSorbent,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type WaterKind,
  type MofCaptureInput,
  type MofCaptureQuality,
  type SorbentKind,
  type ScoreMode,
  type ScoringBias,
} from "./domain/types";

export type {
  AssayKind,
  WaterKind,
  MofCaptureInput,
  MofCaptureQuality,
  SorbentKind,
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

export type WaterPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  waterBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type WaterSpec = {
  id: string;
  packId: string;
  label: string;
  kind: WaterKind;
  siteHint: string;
  sorbentFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type SorbentSpec = {
  id: string;
  packId: string;
  label: string;
  kind: SorbentKind;
  modelHint: string;
  mofFloor: number;
  evidenceFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  waterId: string;
  sorbentId: string;
  label: string;
  kind: AssayKind;
  ionExchangeFidelity: number;
  conventionalCapacity: number;
  assayFidelity: number;
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

export type CaptureCompare = {
  id: string;
  name: string;
  packId: string;
  waterId: string;
  sorbentId: string;
  assayId: string;
  input: MofCaptureInput;
  mof: MofCaptureQuality;
  conventional: MofCaptureQuality;
  winner: "anionic_mof_capture" | "conventional_sorbent" | "tie";
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
  packs: WaterPack[];
  waters: WaterSpec[];
  sorbents: SorbentSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: CaptureCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __mofCaptureStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const waterId = "water-demo";
  const sorbentId = "sorbent-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Mof Capture Org",
      webhookUrl: "",
      webhookSecret: "mof-capture-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultScoringBias: "balanced",
      defaultMode: "anionic_mof_capture",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@mof-capture.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Heavy-Metal Water Pack",
        version: "2026.1",
        programFocus:
          "Anionic MOF capture vs conventional sorbent soft-sim",
        waterBudget: 36,
        status: "active",
        notes: "Seed pack for waters, sorbents, and assay runs",
        createdAt: now(),
      },
    ],
    waters: [
      {
        id: waterId,
        packId,
        label: "Industrial effluent draft",
        kind: "industrial_effluent",
        siteHint: "site-remediation-a",
        sorbentFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Water soft-sim",
        status: "active",
        notes: "Soft-sim water panel — not certified water audit",
        createdAt: now(),
      },
    ],
    sorbents: [
      {
        id: sorbentId,
        packId,
        label: "Anionic MOF zirconium draft",
        kind: "anionic_mof_zr",
        modelHint: "anionic-mof-capture",
        mofFloor: 0.4,
        evidenceFloor: 0.35,
        metricHint: "Sorbent soft-sim",
        status: "active",
        notes: "Soft-sim sorbent — not live plant control",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        waterId,
        sorbentId,
        label: "Lead / dual-gate soft-sim",
        kind: "dual_gate_soft_sim",
        ionExchangeFidelity: 0.42,
        conventionalCapacity: 0.32,
        assayFidelity: 0.7,
        assayReadout: 0.68,
        runNotes:
          "MOF path looks strong on ion exchange but conventional sorbent still leads when MOF fidelity is ignored",
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
        detail: "Demo pack, waters, sorbents, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__mofCaptureStore) g.__mofCaptureStore = seed();
  return g.__mofCaptureStore;
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
  g.__mofCaptureStore = seed();
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
  items: WaterPack[];
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
  waterBudget?: number;
  notes?: string;
}): WaterPack {
  const pack: WaterPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    waterBudget: input.waterBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): WaterPack | null {
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

export function listWaters(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().waters, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.siteHint.toLowerCase().includes(q),
  });
}

export function createWater(input: {
  packId: string;
  label: string;
  kind: WaterKind;
  siteHint: string;
  sorbentFloor: number;
  fidelityFloor: number;
  metricHint?: string;
  notes?: string;
}): WaterSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: WaterSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    siteHint: input.siteHint,
    sorbentFloor: input.sorbentFloor,
    fidelityFloor: input.fidelityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().waters.unshift(row);
  audit("evaluator", "water.create", row.label);
  return row;
}

export function archiveWater(id: string): WaterSpec | null {
  const row = state().waters.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "water.archive", id);
  return row;
}

export function listSorbents(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().sorbents, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createSorbent(input: {
  packId: string;
  label: string;
  kind: SorbentKind;
  modelHint: string;
  mofFloor: number;
  evidenceFloor: number;
  metricHint?: string;
  notes?: string;
}): SorbentSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: SorbentSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    mofFloor: input.mofFloor,
    evidenceFloor: input.evidenceFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().sorbents.unshift(row);
  audit("evaluator", "sorbent.create", row.label);
  return row;
}

export function archiveSorbent(id: string): SorbentSpec | null {
  const row = state().sorbents.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "sorbent.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  waterId?: string;
  sorbentId?: string;
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
  if (opts?.waterId) items = items.filter((r) => r.waterId === opts.waterId);
  if (opts?.sorbentId)
    items = items.filter((r) => r.sorbentId === opts.sorbentId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  waterId: string;
  sorbentId: string;
  label: string;
  kind: AssayKind;
  ionExchangeFidelity: number;
  conventionalCapacity: number;
  assayFidelity: number;
  assayReadout: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().waters.some((m) => m.id === input.waterId)) return null;
  if (!state().sorbents.some((m) => m.id === input.sorbentId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    waterId: input.waterId,
    sorbentId: input.sorbentId,
    label: input.label,
    kind: input.kind,
    ionExchangeFidelity: clamp(input.ionExchangeFidelity, 0, 1),
    conventionalCapacity: clamp(input.conventionalCapacity, 0, 1),
    assayFidelity: clamp(input.assayFidelity, 0, 1),
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

export function listCompares(): CaptureCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  waterId: string;
  sorbentId: string;
  assayId: string;
  scoringBias?: ScoringBias;
  bias?: ScoringBias;
  overclaimRisk?: number;
  sorbentCompleteness?: number;
  evidenceStrength?: number;
  waterFollowThrough?: number;
}): CaptureCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const water = state().waters.find((m) => m.id === input.waterId);
  const sorbent = state().sorbents.find((m) => m.id === input.sorbentId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !water || !sorbent || !assay) return null;

  const captureInput: MofCaptureInput = {
    ionExchangeFidelity: clamp(assay.ionExchangeFidelity, 0, 1),
    conventionalCapacity: clamp(assay.conventionalCapacity, 0, 1),
    assayFidelity: clamp(assay.assayFidelity, 0, 1),
    sorbentCompleteness: clamp(
      input.sorbentCompleteness ?? water.sorbentFloor,
      0,
      1,
    ),
    evidenceStrength: clamp(
      input.evidenceStrength ?? sorbent.evidenceFloor,
      0,
      1,
    ),
    waterFollowThrough: clamp(
      input.waterFollowThrough ?? water.fidelityFloor,
      0,
      1,
    ),
    assayReadout: clamp(assay.assayReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - sorbent.mofFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    scoringBias:
      input.scoringBias ?? input.bias ?? state().org.defaultScoringBias,
    profile: "anionic_mof_capture",
  };

  const mof = scoreAnionicMofCapture({
    ...captureInput,
    profile: "anionic_mof_capture",
  });
  const conventional = scoreConventionalSorbent({
    ...captureInput,
    profile: "conventional_sorbent",
  });
  const gap = Math.abs(mof.overall - conventional.overall);
  let winner: CaptureCompare["winner"] = "tie";
  if (mof.overall > conventional.overall + 0.5) {
    winner = "anionic_mof_capture";
  } else if (conventional.overall > mof.overall + 0.5) {
    winner = "conventional_sorbent";
  }

  const compare: CaptureCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    waterId: water.id,
    sorbentId: sorbent.id,
    assayId: assay.id,
    input: captureInput,
    mof,
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

export function getScoreboard(): CaptureCompare[] {
  return [...state().compares].sort(
    (a, b) => b.mof.overall - a.mof.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      waters: state().waters,
      sorbents: state().sorbents,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,mofOverall,conventionalOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.mof.overall},${c.conventional.overall},${c.createdAt}`,
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
    { id: "packs", label: "Water pack registry CRUD" },
    { id: "waters", label: "Water workspace" },
    { id: "sorbents", label: "Anionic MOF sorbent specs" },
    { id: "assays", label: "Heavy-metal assay runs" },
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
    { id: "search", label: "Pack/water search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "anionic_mof_capture scorer" },
    { id: "scorer-b", label: "conventional_sorbent scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "scoring-bias", label: "Scoring bias controls" },
    { id: "archive", label: "Archive packs/waters/sorbents" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "water-kinds", label: "Recorded water kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
