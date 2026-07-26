import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreCyclosporineMps,
  scoreVoclosporinMps,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type TubuleKind,
  type TubuleMpsInput,
  type TubuleMpsQuality,
  type RegimenKind,
  type ScoreMode,
  type ScoringBias,
} from "./domain/types";

export type {
  AssayKind,
  TubuleKind,
  TubuleMpsInput,
  TubuleMpsQuality,
  RegimenKind,
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

export type TubulePack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  tubuleBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type TubuleSpec = {
  id: string;
  packId: string;
  label: string;
  kind: TubuleKind;
  segmentHint: string;
  perfusionFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type RegimenSpec = {
  id: string;
  packId: string;
  label: string;
  kind: RegimenKind;
  modelHint: string;
  preservationFloor: number;
  evidenceFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  tubuleId: string;
  regimenId: string;
  label: string;
  kind: AssayKind;
  mpsPreservation: number;
  cyclosporineHarm: number;
  culture2dMasking: number;
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

export type MpsCompare = {
  id: string;
  name: string;
  packId: string;
  tubuleId: string;
  regimenId: string;
  assayId: string;
  input: TubuleMpsInput;
  voclosporin: TubuleMpsQuality;
  cyclosporine: TubuleMpsQuality;
  winner: "voclosporin_mps" | "cyclosporine_mps" | "tie";
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
  packs: TubulePack[];
  tubules: TubuleSpec[];
  regimens: RegimenSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: MpsCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __tubuleMpsStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const tubuleId = "tubule-demo";
  const regimenId = "regimen-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Tubule Mps Org",
      webhookUrl: "",
      webhookSecret: "tubule-mps-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultScoringBias: "balanced",
      defaultMode: "voclosporin_mps",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@tubule-mps.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Proximal Tubule Pack",
        version: "2026.1",
        programFocus: "Voclosporin MPS vs cyclosporine A soft-sim",
        tubuleBudget: 36,
        status: "active",
        notes: "Seed pack for tubules, regimens, and assay runs",
        createdAt: now(),
      },
    ],
    tubules: [
      {
        id: tubuleId,
        packId,
        label: "Perfused proximal tubule draft",
        kind: "perfused_mps",
        segmentHint: "S1-S2-proximal",
        perfusionFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Tubule soft-sim",
        status: "active",
        notes: "Soft-sim tubule panel — not wet-lab MPS validated",
        createdAt: now(),
      },
    ],
    regimens: [
      {
        id: regimenId,
        packId,
        label: "Voclosporin MPS draft",
        kind: "voclosporin_mps",
        modelHint: "voclosporin-mps",
        preservationFloor: 0.4,
        evidenceFloor: 0.35,
        metricHint: "Regimen soft-sim",
        status: "active",
        notes: "Soft-sim regimen — not transplant dosing advice",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        tubuleId,
        regimenId,
        label: "Mitochondrial / dual-MPS soft-sim",
        kind: "dual_mps_soft_sim",
        mpsPreservation: 0.42,
        cyclosporineHarm: 0.32,
        culture2dMasking: 0.7,
        assayReadout: 0.68,
        runNotes:
          "Voclosporin MPS path looks strong on mitochondrial preservation but 2D masking can hide cyclosporine harm",
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
        detail: "Demo pack, tubules, regimens, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__tubuleMpsStore) g.__tubuleMpsStore = seed();
  return g.__tubuleMpsStore;
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
  g.__tubuleMpsStore = seed();
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
  items: TubulePack[];
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
  tubuleBudget?: number;
  notes?: string;
}): TubulePack {
  const pack: TubulePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    tubuleBudget: input.tubuleBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): TubulePack | null {
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

export function listTubules(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().tubules, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.segmentHint.toLowerCase().includes(q),
  });
}

export function createTubule(input: {
  packId: string;
  label: string;
  kind: TubuleKind;
  segmentHint: string;
  perfusionFloor: number;
  fidelityFloor: number;
  metricHint?: string;
  notes?: string;
}): TubuleSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: TubuleSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    segmentHint: input.segmentHint,
    perfusionFloor: input.perfusionFloor,
    fidelityFloor: input.fidelityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().tubules.unshift(row);
  audit("evaluator", "tubule.create", row.label);
  return row;
}

export function archiveTubule(id: string): TubuleSpec | null {
  const row = state().tubules.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "tubule.archive", id);
  return row;
}

export function listRegimens(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().regimens, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createRegimen(input: {
  packId: string;
  label: string;
  kind: RegimenKind;
  modelHint: string;
  preservationFloor: number;
  evidenceFloor: number;
  metricHint?: string;
  notes?: string;
}): RegimenSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: RegimenSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    preservationFloor: input.preservationFloor,
    evidenceFloor: input.evidenceFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().regimens.unshift(row);
  audit("evaluator", "regimen.create", row.label);
  return row;
}

export function archiveRegimen(id: string): RegimenSpec | null {
  const row = state().regimens.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "regimen.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  tubuleId?: string;
  regimenId?: string;
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
  if (opts?.tubuleId) items = items.filter((r) => r.tubuleId === opts.tubuleId);
  if (opts?.regimenId)
    items = items.filter((r) => r.regimenId === opts.regimenId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  tubuleId: string;
  regimenId: string;
  label: string;
  kind: AssayKind;
  mpsPreservation: number;
  cyclosporineHarm: number;
  culture2dMasking: number;
  assayReadout: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().tubules.some((m) => m.id === input.tubuleId)) return null;
  if (!state().regimens.some((m) => m.id === input.regimenId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    tubuleId: input.tubuleId,
    regimenId: input.regimenId,
    label: input.label,
    kind: input.kind,
    mpsPreservation: clamp(input.mpsPreservation, 0, 1),
    cyclosporineHarm: clamp(input.cyclosporineHarm, 0, 1),
    culture2dMasking: clamp(input.culture2dMasking, 0, 1),
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

export function listCompares(): MpsCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  tubuleId: string;
  regimenId: string;
  assayId: string;
  scoringBias?: ScoringBias;
  bias?: ScoringBias;
  overclaimRisk?: number;
  perfusionFidelity?: number;
  evidenceStrength?: number;
  regimenFollowThrough?: number;
}): MpsCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const tubule = state().tubules.find((m) => m.id === input.tubuleId);
  const regimen = state().regimens.find((m) => m.id === input.regimenId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !tubule || !regimen || !assay) return null;

  const mpsInput: TubuleMpsInput = {
    mpsPreservation: clamp(assay.mpsPreservation, 0, 1),
    cyclosporineHarm: clamp(assay.cyclosporineHarm, 0, 1),
    culture2dMasking: clamp(assay.culture2dMasking, 0, 1),
    perfusionFidelity: clamp(
      input.perfusionFidelity ?? tubule.perfusionFloor,
      0,
      1,
    ),
    evidenceStrength: clamp(
      input.evidenceStrength ?? regimen.evidenceFloor,
      0,
      1,
    ),
    regimenFollowThrough: clamp(
      input.regimenFollowThrough ?? tubule.fidelityFloor,
      0,
      1,
    ),
    assayReadout: clamp(assay.assayReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - regimen.preservationFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    scoringBias:
      input.scoringBias ?? input.bias ?? state().org.defaultScoringBias,
    profile: "voclosporin_mps",
  };

  const voclosporin = scoreVoclosporinMps({
    ...mpsInput,
    profile: "voclosporin_mps",
  });
  const cyclosporine = scoreCyclosporineMps({
    ...mpsInput,
    profile: "cyclosporine_mps",
  });
  const gap = Math.abs(voclosporin.overall - cyclosporine.overall);
  let winner: MpsCompare["winner"] = "tie";
  if (voclosporin.overall > cyclosporine.overall + 0.5) {
    winner = "voclosporin_mps";
  } else if (cyclosporine.overall > voclosporin.overall + 0.5) {
    winner = "cyclosporine_mps";
  }

  const compare: MpsCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    tubuleId: tubule.id,
    regimenId: regimen.id,
    assayId: assay.id,
    input: mpsInput,
    voclosporin,
    cyclosporine,
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

export function getScoreboard(): MpsCompare[] {
  return [...state().compares].sort(
    (a, b) => b.voclosporin.overall - a.voclosporin.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      tubules: state().tubules,
      regimens: state().regimens,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,voclosporinOverall,cyclosporineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.voclosporin.overall},${c.cyclosporine.overall},${c.createdAt}`,
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
    { id: "packs", label: "Tubule pack registry CRUD" },
    { id: "tubules", label: "Tubule workspace" },
    { id: "regimens", label: "Voclosporin / cyclosporine regimen specs" },
    { id: "assays", label: "Mitochondrial assay runs" },
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
    { id: "search", label: "Pack/tubule search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "voclosporin_mps scorer" },
    { id: "scorer-b", label: "cyclosporine_mps scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "scoring-bias", label: "Scoring bias controls" },
    { id: "archive", label: "Archive packs/tubules/regimens" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "tubule-kinds", label: "Recorded tubule kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
