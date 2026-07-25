import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreCorrectnessOnly, scoreFailGate } from "./domain/failGate";
import {
  clamp,
  readinessFromQuality,
  round2,
  type FailGateInput,
  type FailGateQuality,
  type GateBias,
  type GateType,
  type ScoreMode,
} from "./domain/types";

export type { FailGateInput, FailGateQuality, GateBias, GateType, ScoreMode };

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CasePack = {
  id: string;
  label: string;
  version: string;
  specialtyFocus: string;
  caseCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type CaseStatus = "draft" | "open" | "gated" | "archived";

export type FailCase = {
  id: string;
  packId?: string;
  label: string;
  specialty: string;
  promptHash: string;
  modelAnswerHash: string;
  severityHint: number;
  status: CaseStatus;
  notes: string;
  createdAt: string;
};

export type SeverityBand = "low" | "moderate" | "high" | "critical";

export type TaxonomyStatus = "draft" | "active" | "archived";

export type GateTaxonomy = {
  id: string;
  caseId: string;
  gateType: GateType;
  severityBand: SeverityBand;
  boundaryCode: string;
  status: TaxonomyStatus;
  notes: string;
  createdAt: string;
};

export type InspectionStatus = "draft" | "active" | "archived";

export type BoundaryInspection = {
  id: string;
  caseId: string;
  taxonomyId: string;
  boundaryFit: number;
  evidenceStrength: number;
  taxonomyCoherence: number;
  reviewerNotes: string;
  status: InspectionStatus;
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
  defaultGateBias: GateBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type FailCompare = {
  id: string;
  name: string;
  caseId: string;
  taxonomyId: string;
  inspectionId: string;
  input: FailGateInput;
  failGate: FailGateQuality;
  correctnessOnly: FailGateQuality;
  winner: "fail_gate" | "correctness_only" | "tie";
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
  packs: CasePack[];
  cases: FailCase[];
  taxonomies: GateTaxonomy[];
  inspections: BoundaryInspection[];
  audits: AuditEntry[];
  compares: FailCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __fgsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const caseId = "case-demo";
  const taxonomyId = "tax-demo";
  const inspectionId = "insp-demo";
  return {
    org: {
      name: "Fail Gate Org",
      webhookUrl: "",
      webhookSecret: "fgs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultGateBias: "balanced",
      defaultMode: "fail_gate",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "eval-lead@fail-gate.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Health QA Release Pack",
        version: "2026.1",
        specialtyFocus: "internal_medicine",
        caseCount: 1,
        status: "active",
        notes: "Seed pack for demo compare",
        createdAt: now(),
      },
    ],
    cases: [
      {
        id: caseId,
        packId,
        label: "Dosage boundary probe",
        specialty: "internal_medicine",
        promptHash: "ph_demo123",
        modelAnswerHash: "ma_demo456",
        severityHint: 0.72,
        status: "gated",
        notes: "Seed fail case for demo compare",
        createdAt: now(),
      },
    ],
    taxonomies: [
      {
        id: taxonomyId,
        caseId,
        gateType: "dosage",
        severityBand: "high",
        boundaryCode: "BC-DOSAGE-014",
        status: "active",
        notes: "Dosage gate for demo case",
        createdAt: now(),
      },
    ],
    inspections: [
      {
        id: inspectionId,
        caseId,
        taxonomyId,
        boundaryFit: 0.78,
        evidenceStrength: 0.7,
        taxonomyCoherence: 0.74,
        reviewerNotes: "Boundary reason coherent with dosage gate family",
        status: "active",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, case, taxonomy, and inspection seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__fgsStore) g.__fgsStore = seed();
  return g.__fgsStore;
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
  g.__fgsStore = seed();
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
}): { items: CasePack[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.specialtyFocus.toLowerCase().includes(q) ||
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
  specialtyFocus: string;
  notes?: string;
}): CasePack {
  const pack: CasePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    specialtyFocus: input.specialtyFocus,
    caseCount: 0,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CasePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listCases(opts?: {
  q?: string;
  specialty?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): { items: FailCase[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().cases];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.specialty) items = items.filter((c) => c.specialty === opts.specialty);
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCase(input: {
  packId?: string;
  label: string;
  specialty: string;
  promptHash: string;
  modelAnswerHash: string;
  severityHint: number;
  notes?: string;
}): FailCase {
  const failCase: FailCase = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    specialty: input.specialty,
    promptHash: input.promptHash,
    modelAnswerHash: input.modelAnswerHash,
    severityHint: input.severityHint,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().cases.unshift(failCase);
  if (input.packId) {
    const pack = state().packs.find((p) => p.id === input.packId);
    if (pack) pack.caseCount += 1;
  }
  audit("evaluator", "case.create", failCase.label);
  return failCase;
}

export function archiveCase(id: string): FailCase | null {
  const failCase = state().cases.find((c) => c.id === id);
  if (!failCase) return null;
  failCase.status = "archived";
  audit("evaluator", "case.archive", id);
  return failCase;
}

export function listTaxonomies(opts?: {
  caseId?: string;
  page?: number;
  pageSize?: number;
}): { items: GateTaxonomy[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().taxonomies];
  if (opts?.caseId) items = items.filter((t) => t.caseId === opts.caseId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTaxonomy(input: {
  caseId: string;
  gateType: GateType;
  severityBand: SeverityBand;
  boundaryCode: string;
  notes?: string;
}): GateTaxonomy | null {
  if (!state().cases.some((c) => c.id === input.caseId)) return null;
  const taxonomy: GateTaxonomy = {
    id: randomUUID(),
    caseId: input.caseId,
    gateType: input.gateType,
    severityBand: input.severityBand,
    boundaryCode: input.boundaryCode,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().taxonomies.unshift(taxonomy);
  audit("evaluator", "taxonomy.create", taxonomy.boundaryCode);
  return taxonomy;
}

export function listInspections(opts?: {
  caseId?: string;
  taxonomyId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: BoundaryInspection[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().inspections];
  if (opts?.caseId) items = items.filter((i) => i.caseId === opts.caseId);
  if (opts?.taxonomyId) items = items.filter((i) => i.taxonomyId === opts.taxonomyId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createInspection(input: {
  caseId: string;
  taxonomyId: string;
  boundaryFit: number;
  evidenceStrength: number;
  taxonomyCoherence: number;
  reviewerNotes?: string;
}): BoundaryInspection | null {
  if (!state().cases.some((c) => c.id === input.caseId)) return null;
  if (!state().taxonomies.some((t) => t.id === input.taxonomyId)) return null;
  const inspection: BoundaryInspection = {
    id: randomUUID(),
    caseId: input.caseId,
    taxonomyId: input.taxonomyId,
    boundaryFit: input.boundaryFit,
    evidenceStrength: input.evidenceStrength,
    taxonomyCoherence: input.taxonomyCoherence,
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().inspections.unshift(inspection);
  audit("evaluator", "inspection.create", inspection.id);
  return inspection;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): FailCompare[] {
  return [...state().compares];
}

function bandWeight(band: SeverityBand): number {
  switch (band) {
    case "low":
      return 0.2;
    case "moderate":
      return 0.45;
    case "high":
      return 0.7;
    case "critical":
      return 0.92;
    default: {
      const exhaustive: never = band;
      return exhaustive;
    }
  }
}

export function runCompare(input: {
  name: string;
  caseId: string;
  taxonomyId: string;
  inspectionId: string;
  gateBias?: GateBias;
  answerMatch?: number;
  fluencyScore?: number;
  harmProximity?: number;
  scopeDrift?: number;
}): FailCompare | null {
  const failCase = state().cases.find((c) => c.id === input.caseId);
  const taxonomy = state().taxonomies.find((t) => t.id === input.taxonomyId);
  const inspection = state().inspections.find((i) => i.id === input.inspectionId);
  if (!failCase || !taxonomy || !inspection) return null;

  const severityBandWeight = bandWeight(taxonomy.severityBand);
  const failGateInput: FailGateInput = {
    severityFit: clamp((failCase.severityHint + severityBandWeight) / 2, 0, 1),
    gateTypeFit: clamp((severityBandWeight + inspection.boundaryFit) / 2, 0, 1),
    boundaryCoherence: clamp(inspection.boundaryFit, 0, 1),
    evidenceStrength: clamp(inspection.evidenceStrength, 0, 1),
    taxonomyCoverage: clamp(inspection.taxonomyCoherence, 0, 1),
    answerMatch: input.answerMatch ?? 0.78,
    fluencyScore: input.fluencyScore ?? 0.72,
    harmProximity:
      input.harmProximity ?? clamp((severityBandWeight + failCase.severityHint) / 2, 0, 1),
    scopeDrift: input.scopeDrift ?? (taxonomy.gateType === "scope" ? 0.55 : 0.3),
    gateBias: input.gateBias ?? state().org.defaultGateBias,
    profile: "fail_gate",
  };

  const failGate = scoreFailGate({ ...failGateInput, profile: "fail_gate" });
  const correctnessOnly = scoreCorrectnessOnly({
    ...failGateInput,
    profile: "correctness_only",
  });
  const gap = Math.abs(failGate.overall - correctnessOnly.overall);
  let winner: FailCompare["winner"] = "tie";
  if (failGate.overall > correctnessOnly.overall + 0.5) {
    winner = "fail_gate";
  } else if (correctnessOnly.overall > failGate.overall + 0.5) {
    winner = "correctness_only";
  }

  const compare: FailCompare = {
    id: randomUUID(),
    name: input.name,
    caseId: failCase.id,
    taxonomyId: taxonomy.id,
    inspectionId: inspection.id,
    input: failGateInput,
    failGate,
    correctnessOnly,
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

export function getScoreboard(): FailCompare[] {
  return [...state().compares].sort(
    (a, b) => b.failGate.overall - a.failGate.overall,
  );
}

export function exportCasesJson(): string {
  return JSON.stringify({ exportedAt: now(), cases: state().cases }, null, 2);
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,failGateOverall,correctnessOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.failGate.overall},${c.correctnessOnly.overall},${c.createdAt}`,
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
  return { ok: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count) };
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
    { id: "packs", name: "Case pack registry" },
    { id: "pack-search", name: "Pack search and filter" },
    { id: "cases", name: "Fail case registry" },
    { id: "case-search", name: "Case search and filter" },
    { id: "case-status", name: "Case status lifecycle board" },
    { id: "gate-taxonomy", name: "Gate taxonomy board" },
    { id: "gate-type-filter", name: "Gate type filter" },
    { id: "severity-band", name: "Severity band classification" },
    { id: "boundary-inspection", name: "Boundary inspection workspace" },
    { id: "reviewer-notes", name: "Reviewer notes on inspections" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Fail-gate vs correctness-only compare" },
    { id: "scoreboard", name: "Compare scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-clinical-decision notes" },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "Idempotent webhook" },
    { id: "export-json", name: "Export cases JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "seed-onboarding", name: "Seed demo case pack from onboarding" },
    { id: "pagination", name: "Pagination on list APIs" },
    { id: "specialty-filter", name: "Specialty filter on cases" },
  ];
}

export function scorePreview(input: FailGateInput): {
  failGate: FailGateQuality;
  correctnessOnly: FailGateQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const failGate = scoreFailGate({ ...input, profile: "fail_gate" });
  const correctnessOnly = scoreCorrectnessOnly({
    ...input,
    profile: "correctness_only",
  });
  return {
    failGate,
    correctnessOnly,
    readiness: readinessFromQuality(failGate.overall),
  };
}
