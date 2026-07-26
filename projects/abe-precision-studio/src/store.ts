import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreBaselineAbe,
  scoreDomainInsertionAbe,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type EditorKind,
  type AbePrecisionInput,
  type AbePrecisionQuality,
  type InsertionKind,
  type ScoreMode,
  type ScoringBias,
} from "./domain/types";

export type {
  AssayKind,
  EditorKind,
  AbePrecisionInput,
  AbePrecisionQuality,
  InsertionKind,
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

export type EditorPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  editorBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type EditorSpec = {
  id: string;
  packId: string;
  label: string;
  kind: EditorKind;
  locusHint: string;
  insertionFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type InsertionSpec = {
  id: string;
  packId: string;
  label: string;
  kind: InsertionKind;
  modelHint: string;
  precisionFloor: number;
  evidenceFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  editorId: string;
  insertionId: string;
  label: string;
  kind: AssayKind;
  windowNarrowing: number;
  baselineWindowBreadth: number;
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

export type PrecisionCompare = {
  id: string;
  name: string;
  packId: string;
  editorId: string;
  insertionId: string;
  assayId: string;
  input: AbePrecisionInput;
  insertion: AbePrecisionQuality;
  baseline: AbePrecisionQuality;
  winner: "domain_insertion_abe" | "baseline_abe" | "tie";
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
  packs: EditorPack[];
  editors: EditorSpec[];
  insertions: InsertionSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: PrecisionCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __abePrecisionStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const editorId = "editor-demo";
  const insertionId = "insertion-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Abe Precision Org",
      webhookUrl: "",
      webhookSecret: "abe-precision-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultScoringBias: "balanced",
      defaultMode: "domain_insertion_abe",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@abe-precision.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Adenine Editor Pack",
        version: "2026.1",
        programFocus:
          "Domain-insertion ABE vs baseline ABE soft-sim",
        editorBudget: 36,
        status: "active",
        notes: "Seed pack for editors, insertions, and assay runs",
        createdAt: now(),
      },
    ],
    editors: [
      {
        id: editorId,
        packId,
        label: "Therapeutic ABE candidate draft",
        kind: "therapeutic_candidate",
        locusHint: "locus-panel-a",
        insertionFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Editor soft-sim",
        status: "active",
        notes: "Soft-sim editor panel — not wet-lab validated",
        createdAt: now(),
      },
    ],
    insertions: [
      {
        id: insertionId,
        packId,
        label: "Domain-insertion ABE draft",
        kind: "domain_insertion_abe",
        modelHint: "domain-insertion-abe",
        precisionFloor: 0.4,
        evidenceFloor: 0.35,
        metricHint: "Insertion soft-sim",
        status: "active",
        notes: "Soft-sim insertion — not IND/NDA ready",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        editorId,
        insertionId,
        label: "Window precision / dual-gate soft-sim",
        kind: "dual_gate_soft_sim",
        windowNarrowing: 0.42,
        baselineWindowBreadth: 0.32,
        assayFidelity: 0.7,
        assayReadout: 0.68,
        runNotes:
          "Domain-insertion path looks strong on window narrowing but baseline ABE still leads when insertion fidelity is ignored",
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
        detail: "Demo pack, editors, insertions, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__abePrecisionStore) g.__abePrecisionStore = seed();
  return g.__abePrecisionStore;
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
  g.__abePrecisionStore = seed();
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
  items: EditorPack[];
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
  editorBudget?: number;
  notes?: string;
}): EditorPack {
  const pack: EditorPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    editorBudget: input.editorBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): EditorPack | null {
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

export function listEditors(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().editors, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.locusHint.toLowerCase().includes(q),
  });
}

export function createEditor(input: {
  packId: string;
  label: string;
  kind: EditorKind;
  locusHint: string;
  insertionFloor: number;
  fidelityFloor: number;
  metricHint?: string;
  notes?: string;
}): EditorSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: EditorSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    locusHint: input.locusHint,
    insertionFloor: input.insertionFloor,
    fidelityFloor: input.fidelityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().editors.unshift(row);
  audit("evaluator", "editor.create", row.label);
  return row;
}

export function archiveEditor(id: string): EditorSpec | null {
  const row = state().editors.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "editor.archive", id);
  return row;
}

export function listInsertions(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().insertions, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createInsertion(input: {
  packId: string;
  label: string;
  kind: InsertionKind;
  modelHint: string;
  precisionFloor: number;
  evidenceFloor: number;
  metricHint?: string;
  notes?: string;
}): InsertionSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: InsertionSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    precisionFloor: input.precisionFloor,
    evidenceFloor: input.evidenceFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().insertions.unshift(row);
  audit("evaluator", "insertion.create", row.label);
  return row;
}

export function archiveInsertion(id: string): InsertionSpec | null {
  const row = state().insertions.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "insertion.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  editorId?: string;
  insertionId?: string;
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
  if (opts?.editorId) items = items.filter((r) => r.editorId === opts.editorId);
  if (opts?.insertionId)
    items = items.filter((r) => r.insertionId === opts.insertionId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  editorId: string;
  insertionId: string;
  label: string;
  kind: AssayKind;
  windowNarrowing: number;
  baselineWindowBreadth: number;
  assayFidelity: number;
  assayReadout: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().editors.some((m) => m.id === input.editorId)) return null;
  if (!state().insertions.some((m) => m.id === input.insertionId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    editorId: input.editorId,
    insertionId: input.insertionId,
    label: input.label,
    kind: input.kind,
    windowNarrowing: clamp(input.windowNarrowing, 0, 1),
    baselineWindowBreadth: clamp(input.baselineWindowBreadth, 0, 1),
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

export function listCompares(): PrecisionCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  editorId: string;
  insertionId: string;
  assayId: string;
  scoringBias?: ScoringBias;
  bias?: ScoringBias;
  overclaimRisk?: number;
  insertionCompleteness?: number;
  evidenceStrength?: number;
  editorFollowThrough?: number;
}): PrecisionCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const editor = state().editors.find((m) => m.id === input.editorId);
  const insertion = state().insertions.find((m) => m.id === input.insertionId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !editor || !insertion || !assay) return null;

  const precisionInput: AbePrecisionInput = {
    windowNarrowing: clamp(assay.windowNarrowing, 0, 1),
    baselineWindowBreadth: clamp(assay.baselineWindowBreadth, 0, 1),
    assayFidelity: clamp(assay.assayFidelity, 0, 1),
    insertionCompleteness: clamp(
      input.insertionCompleteness ?? editor.insertionFloor,
      0,
      1,
    ),
    evidenceStrength: clamp(
      input.evidenceStrength ?? insertion.evidenceFloor,
      0,
      1,
    ),
    editorFollowThrough: clamp(
      input.editorFollowThrough ?? editor.fidelityFloor,
      0,
      1,
    ),
    assayReadout: clamp(assay.assayReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - insertion.precisionFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    scoringBias:
      input.scoringBias ?? input.bias ?? state().org.defaultScoringBias,
    profile: "domain_insertion_abe",
  };

  const insertionScore = scoreDomainInsertionAbe({
    ...precisionInput,
    profile: "domain_insertion_abe",
  });
  const baselineScore = scoreBaselineAbe({
    ...precisionInput,
    profile: "baseline_abe",
  });
  const gap = Math.abs(insertionScore.overall - baselineScore.overall);
  let winner: PrecisionCompare["winner"] = "tie";
  if (insertionScore.overall > baselineScore.overall + 0.5) {
    winner = "domain_insertion_abe";
  } else if (baselineScore.overall > insertionScore.overall + 0.5) {
    winner = "baseline_abe";
  }

  const compare: PrecisionCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    editorId: editor.id,
    insertionId: insertion.id,
    assayId: assay.id,
    input: precisionInput,
    insertion: insertionScore,
    baseline: baselineScore,
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

export function getScoreboard(): PrecisionCompare[] {
  return [...state().compares].sort(
    (a, b) => b.insertion.overall - a.insertion.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      editors: state().editors,
      insertions: state().insertions,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,insertionOverall,baselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.insertion.overall},${c.baseline.overall},${c.createdAt}`,
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
    { id: "packs", label: "Editor pack registry CRUD" },
    { id: "editors", label: "Editor workspace" },
    { id: "insertions", label: "Domain-insertion ABE specs" },
    { id: "assays", label: "Precision assay runs" },
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
    { id: "search", label: "Pack/editor search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "domain_insertion_abe scorer" },
    { id: "scorer-b", label: "baseline_abe scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "scoring-bias", label: "Scoring bias controls" },
    { id: "archive", label: "Archive packs/editors/insertions" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "editor-kinds", label: "Recorded editor kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
