import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreCardiacPocusCopd,
  scoreLungUltrasoundBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type ExamKind,
  type ImagingBias,
  type PatternKind,
  type PocusInput,
  type PocusQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  AssayKind,
  ExamKind,
  ImagingBias,
  PatternKind,
  PocusInput,
  PocusQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ExamPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  examBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type ExamSpec = {
  id: string;
  packId: string;
  label: string;
  kind: ExamKind;
  siteHint: string;
  viewFloor: number;
  probeFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type PatternSpec = {
  id: string;
  packId: string;
  label: string;
  kind: PatternKind;
  modelHint: string;
  cardiacFloor: number;
  associationFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  examId: string;
  patternId: string;
  label: string;
  kind: AssayKind;
  cardiacPatternSignal: number;
  lungBaselineSignal: number;
  probeQuality: number;
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
  defaultImagingBias: ImagingBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type PocusCompare = {
  id: string;
  name: string;
  packId: string;
  examId: string;
  patternId: string;
  assayId: string;
  input: PocusInput;
  cardiac: PocusQuality;
  lung: PocusQuality;
  winner: "cardiac_pocus_copd" | "lung_ultrasound_baseline" | "tie";
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
  packs: ExamPack[];
  exams: ExamSpec[];
  patterns: PatternSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: PocusCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __cardiacPocusStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const examId = "exam-demo";
  const patternId = "pattern-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Cardiac Pocus Org",
      webhookUrl: "",
      webhookSecret: "cardiac-pocus-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultImagingBias: "balanced",
      defaultMode: "cardiac_pocus_copd",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@cardiac-pocus.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "COPD POCUS Exam Pack",
        version: "2026.1",
        programFocus:
          "Cardiac POCUS COPD patterns vs lung-ultrasound baseline soft-sim",
        examBudget: 36,
        status: "active",
        notes: "Seed pack for exams, patterns, and detection assays",
        createdAt: now(),
      },
    ],
    exams: [
      {
        id: examId,
        packId,
        label: "Mixed cardiac windows draft",
        kind: "mixed_cardiac",
        siteHint: "site-pocus-a",
        viewFloor: 0.4,
        probeFloor: 0.45,
        metricHint: "Exam soft-sim",
        status: "active",
        notes: "Soft-sim exam panel — not live diagnostic clearance",
        createdAt: now(),
      },
    ],
    patterns: [
      {
        id: patternId,
        packId,
        label: "RV strain COPD pattern draft",
        kind: "rv_strain_copd",
        modelHint: "cardiac-pocus-copd",
        cardiacFloor: 0.4,
        associationFloor: 0.35,
        metricHint: "Pattern soft-sim",
        status: "active",
        notes: "Soft-sim pattern — not clinical advice",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        examId,
        patternId,
        label: "COPD detection / dual-gate soft-sim",
        kind: "dual_gate_soft_sim",
        cardiacPatternSignal: 0.42,
        lungBaselineSignal: 0.32,
        probeQuality: 0.7,
        assayReadout: 0.68,
        runNotes:
          "Cardiac POCUS path looks strong on COPD association but lung baseline still leads when cardiac patterns are ignored",
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
        detail: "Demo pack, exams, patterns, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__cardiacPocusStore) g.__cardiacPocusStore = seed();
  return g.__cardiacPocusStore;
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
  g.__cardiacPocusStore = seed();
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
  if (patch.defaultImagingBias !== undefined) {
    org.defaultImagingBias = patch.defaultImagingBias;
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
  items: ExamPack[];
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
  examBudget?: number;
  notes?: string;
}): ExamPack {
  const pack: ExamPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    examBudget: input.examBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ExamPack | null {
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

export function listExams(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().exams, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.siteHint.toLowerCase().includes(q),
  });
}

export function createExam(input: {
  packId: string;
  label: string;
  kind: ExamKind;
  siteHint: string;
  viewFloor: number;
  probeFloor: number;
  metricHint?: string;
  notes?: string;
}): ExamSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ExamSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    siteHint: input.siteHint,
    viewFloor: input.viewFloor,
    probeFloor: input.probeFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().exams.unshift(row);
  audit("evaluator", "exam.create", row.label);
  return row;
}

export function archiveExam(id: string): ExamSpec | null {
  const row = state().exams.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "exam.archive", id);
  return row;
}

export function listPatterns(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().patterns, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createPattern(input: {
  packId: string;
  label: string;
  kind: PatternKind;
  modelHint: string;
  cardiacFloor: number;
  associationFloor: number;
  metricHint?: string;
  notes?: string;
}): PatternSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: PatternSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    cardiacFloor: input.cardiacFloor,
    associationFloor: input.associationFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().patterns.unshift(row);
  audit("evaluator", "pattern.create", row.label);
  return row;
}

export function archivePattern(id: string): PatternSpec | null {
  const row = state().patterns.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "pattern.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  examId?: string;
  patternId?: string;
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
  if (opts?.examId) items = items.filter((r) => r.examId === opts.examId);
  if (opts?.patternId)
    items = items.filter((r) => r.patternId === opts.patternId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  examId: string;
  patternId: string;
  label: string;
  kind: AssayKind;
  cardiacPatternSignal: number;
  lungBaselineSignal: number;
  probeQuality: number;
  assayReadout: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().exams.some((m) => m.id === input.examId)) return null;
  if (!state().patterns.some((m) => m.id === input.patternId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    examId: input.examId,
    patternId: input.patternId,
    label: input.label,
    kind: input.kind,
    cardiacPatternSignal: clamp(input.cardiacPatternSignal, 0, 1),
    lungBaselineSignal: clamp(input.lungBaselineSignal, 0, 1),
    probeQuality: clamp(input.probeQuality, 0, 1),
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

export function listCompares(): PocusCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  examId: string;
  patternId: string;
  assayId: string;
  imagingBias?: ImagingBias;
  bias?: ImagingBias;
  overclaimRisk?: number;
  viewCompleteness?: number;
  copdAssociation?: number;
  examFollowThrough?: number;
}): PocusCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const exam = state().exams.find((m) => m.id === input.examId);
  const pattern = state().patterns.find((m) => m.id === input.patternId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !exam || !pattern || !assay) return null;

  const pocusInput: PocusInput = {
    cardiacPatternSignal: clamp(assay.cardiacPatternSignal, 0, 1),
    lungBaselineSignal: clamp(assay.lungBaselineSignal, 0, 1),
    probeQuality: clamp(assay.probeQuality, 0, 1),
    viewCompleteness: clamp(
      input.viewCompleteness ?? exam.viewFloor,
      0,
      1,
    ),
    copdAssociation: clamp(
      input.copdAssociation ?? pattern.associationFloor,
      0,
      1,
    ),
    examFollowThrough: clamp(
      input.examFollowThrough ?? exam.probeFloor,
      0,
      1,
    ),
    assayReadout: clamp(assay.assayReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - pattern.cardiacFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    imagingBias:
      input.imagingBias ?? input.bias ?? state().org.defaultImagingBias,
    profile: "cardiac_pocus_copd",
  };

  const cardiac = scoreCardiacPocusCopd({
    ...pocusInput,
    profile: "cardiac_pocus_copd",
  });
  const lung = scoreLungUltrasoundBaseline({
    ...pocusInput,
    profile: "lung_ultrasound_baseline",
  });
  const gap = Math.abs(cardiac.overall - lung.overall);
  let winner: PocusCompare["winner"] = "tie";
  if (cardiac.overall > lung.overall + 0.5) {
    winner = "cardiac_pocus_copd";
  } else if (lung.overall > cardiac.overall + 0.5) {
    winner = "lung_ultrasound_baseline";
  }

  const compare: PocusCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    examId: exam.id,
    patternId: pattern.id,
    assayId: assay.id,
    input: pocusInput,
    cardiac,
    lung,
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

export function getScoreboard(): PocusCompare[] {
  return [...state().compares].sort(
    (a, b) => b.cardiac.overall - a.cardiac.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      exams: state().exams,
      patterns: state().patterns,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,cardiacOverall,lungOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.cardiac.overall},${c.lung.overall},${c.createdAt}`,
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
    { id: "packs", label: "Exam pack registry CRUD" },
    { id: "exams", label: "Exam workspace" },
    { id: "patterns", label: "Cardiac POCUS pattern specs" },
    { id: "assays", label: "Detection assay runs" },
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
    { id: "search", label: "Pack/exam search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "cardiac_pocus_copd scorer" },
    { id: "scorer-b", label: "lung_ultrasound_baseline scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "imaging-bias", label: "Imaging bias controls" },
    { id: "archive", label: "Archive packs/exams/patterns" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "exam-kinds", label: "Exam window kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
