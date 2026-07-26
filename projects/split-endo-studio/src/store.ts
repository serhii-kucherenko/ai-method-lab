import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreOneHoleSplit,
  scoreOpenLaminectomy,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ApproachBias,
  type ApproachKind,
  type CaseKind,
  type EndoInput,
  type EndoQuality,
  type OutcomeKind,
  type ScoreMode,
} from "./domain/types";

export type {
  ApproachBias,
  ApproachKind,
  CaseKind,
  EndoInput,
  EndoQuality,
  OutcomeKind,
  ScoreMode,
};

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
  programFocus: string;
  caseBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type CaseSpec = {
  id: string;
  packId: string;
  label: string;
  kind: CaseKind;
  levelHint: string;
  bloodLossCeiling: number;
  stayCeiling: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type ApproachSpec = {
  id: string;
  packId: string;
  label: string;
  kind: ApproachKind;
  portalHint: string;
  bloodLossFloor: number;
  recoveryFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type OutcomeRun = {
  id: string;
  packId: string;
  caseId: string;
  approachId: string;
  label: string;
  kind: OutcomeKind;
  bloodLoss: number;
  hospitalStay: number;
  complicationRate: number;
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
  defaultApproachBias: ApproachBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type EndoCompare = {
  id: string;
  name: string;
  packId: string;
  caseId: string;
  approachId: string;
  outcomeId: string;
  input: EndoInput;
  ose: EndoQuality;
  openLam: EndoQuality;
  winner:
    | "one_hole_split_endoscopy"
    | "open_laminectomy"
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
  packs: CasePack[];
  cases: CaseSpec[];
  approaches: ApproachSpec[];
  outcomes: OutcomeRun[];
  auditEvents: AuditEvent[];
  compares: EndoCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __splitEndoStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const caseId = "case-demo";
  const approachId = "approach-demo";
  const outcomeId = "outcome-demo";
  return {
    org: {
      name: "Split Endo Org",
      webhookUrl: "",
      webhookSecret: "split-endo-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultApproachBias: "balanced",
      defaultMode: "one_hole_split_endoscopy",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@split-endo.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Thoracic OLF Soft-Sim Case Pack",
        version: "2026.1",
        programFocus:
          "One-hole split endoscopy vs open laminectomy for single-level thoracic OLF",
        caseBudget: 36,
        status: "active",
        notes:
          "Seed pack for cases, approaches, and outcome soft-sims vs open laminectomy",
        createdAt: now(),
      },
    ],
    cases: [
      {
        id: caseId,
        packId,
        label: "T10–T11 OLF draft",
        kind: "thoracic_olf_t10_11",
        levelHint: "t10-t11",
        bloodLossCeiling: 0.45,
        stayCeiling: 0.4,
        metricHint: "Case soft-sim",
        status: "active",
        notes: "Soft-sim case panel — not live OR control",
        createdAt: now(),
      },
    ],
    approaches: [
      {
        id: approachId,
        packId,
        label: "OSE portal draft",
        kind: "one_hole_split",
        portalHint: "one-hole-split",
        bloodLossFloor: 0.4,
        recoveryFloor: 0.35,
        metricHint: "Approach soft-sim",
        status: "active",
        notes: "Soft-sim approach — not device clearance",
        createdAt: now(),
      },
    ],
    outcomes: [
      {
        id: outcomeId,
        packId,
        caseId,
        approachId,
        label: "Blood loss + stay soft-sim",
        kind: "blood_loss",
        bloodLoss: 0.28,
        hospitalStay: 0.32,
        complicationRate: 0.22,
        assaySignal: 0.7,
        runNotes:
          "OSE looks strong on stay but open laminectomy still leads when recovery is ignored",
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
        detail: "Demo pack, cases, approaches, and outcomes seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__splitEndoStore) g.__splitEndoStore = seed();
  return g.__splitEndoStore;
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
  g.__splitEndoStore = seed();
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
  if (patch.defaultApproachBias !== undefined) {
    org.defaultApproachBias = patch.defaultApproachBias;
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
  items: CasePack[];
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
  caseBudget?: number;
  notes?: string;
}): CasePack {
  const pack: CasePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    caseBudget: input.caseBudget ?? 24,
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

export function listCases(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().cases, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.levelHint.toLowerCase().includes(q),
  });
}

export function createCase(input: {
  packId: string;
  label: string;
  kind: CaseKind;
  levelHint: string;
  bloodLossCeiling: number;
  stayCeiling: number;
  metricHint?: string;
  notes?: string;
}): CaseSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: CaseSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    levelHint: input.levelHint,
    bloodLossCeiling: input.bloodLossCeiling,
    stayCeiling: input.stayCeiling,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().cases.unshift(row);
  audit("evaluator", "case.create", row.label);
  return row;
}

export function archiveCase(id: string): CaseSpec | null {
  const row = state().cases.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "case.archive", id);
  return row;
}

export function listApproaches(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().approaches, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.portalHint.toLowerCase().includes(q),
  });
}

export function createApproach(input: {
  packId: string;
  label: string;
  kind: ApproachKind;
  portalHint: string;
  bloodLossFloor: number;
  recoveryFloor: number;
  metricHint?: string;
  notes?: string;
}): ApproachSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ApproachSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    portalHint: input.portalHint,
    bloodLossFloor: input.bloodLossFloor,
    recoveryFloor: input.recoveryFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().approaches.unshift(row);
  audit("evaluator", "approach.create", row.label);
  return row;
}

export function archiveApproach(id: string): ApproachSpec | null {
  const row = state().approaches.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "approach.archive", id);
  return row;
}

export function listOutcomes(opts?: {
  packId?: string;
  caseId?: string;
  approachId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: OutcomeRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().outcomes];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.caseId) items = items.filter((r) => r.caseId === opts.caseId);
  if (opts?.approachId)
    items = items.filter((r) => r.approachId === opts.approachId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createOutcome(input: {
  packId: string;
  caseId: string;
  approachId: string;
  label: string;
  kind: OutcomeKind;
  bloodLoss: number;
  hospitalStay: number;
  complicationRate: number;
  assaySignal: number;
  runNotes?: string;
}): OutcomeRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().cases.some((m) => m.id === input.caseId)) return null;
  if (!state().approaches.some((m) => m.id === input.approachId)) return null;
  const run: OutcomeRun = {
    id: randomUUID(),
    packId: input.packId,
    caseId: input.caseId,
    approachId: input.approachId,
    label: input.label,
    kind: input.kind,
    bloodLoss: clamp(input.bloodLoss, 0, 1),
    hospitalStay: clamp(input.hospitalStay, 0, 1),
    complicationRate: clamp(input.complicationRate, 0, 1),
    assaySignal: clamp(input.assaySignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().outcomes.unshift(run);
  audit("evaluator", "outcome.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): EndoCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  caseId: string;
  approachId: string;
  outcomeId: string;
  approachBias?: ApproachBias;
  bias?: ApproachBias;
  overclaimRisk?: number;
  operativeTime?: number;
  decompressionQuality?: number;
  recoverySignal?: number;
}): EndoCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const caseRow = state().cases.find((m) => m.id === input.caseId);
  const approach = state().approaches.find((m) => m.id === input.approachId);
  const outcome = state().outcomes.find((r) => r.id === input.outcomeId);
  if (!pack || !caseRow || !approach || !outcome) return null;

  const endoInput: EndoInput = {
    bloodLoss: clamp(outcome.bloodLoss, 0, 1),
    operativeTime: clamp(
      input.operativeTime ?? caseRow.stayCeiling * 0.9,
      0,
      1,
    ),
    hospitalStay: clamp(outcome.hospitalStay, 0, 1),
    complicationRate: clamp(outcome.complicationRate, 0, 1),
    decompressionQuality: clamp(
      input.decompressionQuality ?? approach.recoveryFloor,
      0,
      1,
    ),
    recoverySignal: clamp(
      input.recoverySignal ?? approach.recoveryFloor,
      0,
      1,
    ),
    assaySignal: clamp(outcome.assaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - approach.bloodLossFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    approachBias:
      input.approachBias ?? input.bias ?? state().org.defaultApproachBias,
    profile: "one_hole_split_endoscopy",
  };

  const ose = scoreOneHoleSplit({
    ...endoInput,
    profile: "one_hole_split_endoscopy",
  });
  const openLam = scoreOpenLaminectomy({
    ...endoInput,
    profile: "open_laminectomy",
  });
  const gap = Math.abs(ose.overall - openLam.overall);
  let winner: EndoCompare["winner"] = "tie";
  if (ose.overall > openLam.overall + 0.5) {
    winner = "one_hole_split_endoscopy";
  } else if (openLam.overall > ose.overall + 0.5) {
    winner = "open_laminectomy";
  }

  const compare: EndoCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    caseId: caseRow.id,
    approachId: approach.id,
    outcomeId: outcome.id,
    input: endoInput,
    ose,
    openLam,
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

export function getScoreboard(): EndoCompare[] {
  return [...state().compares].sort((a, b) => b.ose.overall - a.ose.overall);
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      cases: state().cases,
      approaches: state().approaches,
      outcomes: state().outcomes,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,oseOverall,openLamOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.ose.overall},${c.openLam.overall},${c.createdAt}`,
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
    { id: "packs", label: "Case pack registry CRUD" },
    { id: "cases", label: "Thoracic OLF case workspace" },
    { id: "approaches", label: "OSE / open approach specs" },
    { id: "outcomes", label: "Blood loss / stay outcome runs" },
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
    { id: "search", label: "Pack/case search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "one_hole_split_endoscopy scorer" },
    { id: "scorer-b", label: "open_laminectomy scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "approach-bias", label: "Approach bias controls" },
    { id: "archive", label: "Archive packs/cases/approaches" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "olf-kinds", label: "Thoracic OLF case kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
