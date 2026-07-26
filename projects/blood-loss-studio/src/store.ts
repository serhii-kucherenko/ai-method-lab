import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreHaemoglobinCalculated,
  scoreWeighedSwabMeasured,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type BirthKind,
  type BloodLossInput,
  type BloodLossQuality,
  type MethodKind,
  type ScoreMode,
  type ScoringBias,
} from "./domain/types";

export type {
  AssayKind,
  BirthKind,
  BloodLossInput,
  BloodLossQuality,
  MethodKind,
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

export type BirthPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  birthBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type BirthSpec = {
  id: string;
  packId: string;
  label: string;
  kind: BirthKind;
  siteHint: string;
  methodFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type MethodSpec = {
  id: string;
  packId: string;
  label: string;
  kind: MethodKind;
  modelHint: string;
  swabFloor: number;
  evidenceFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  birthId: string;
  methodId: string;
  label: string;
  kind: AssayKind;
  swabMassFidelity: number;
  hbDeltaCoverage: number;
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

export type LossCompare = {
  id: string;
  name: string;
  packId: string;
  birthId: string;
  methodId: string;
  assayId: string;
  input: BloodLossInput;
  measured: BloodLossQuality;
  calculated: BloodLossQuality;
  winner:
    | "weighed_swab_measured"
    | "haemoglobin_calculated"
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
  packs: BirthPack[];
  births: BirthSpec[];
  methods: MethodSpec[];
  assays: AssayRun[];
  auditEvents: AuditEvent[];
  compares: LossCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __bloodLossStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const birthId = "birth-demo";
  const methodId = "method-demo";
  const assayId = "assay-demo";
  return {
    org: {
      name: "Blood Loss Org",
      webhookUrl: "",
      webhookSecret: "blood-loss-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultScoringBias: "balanced",
      defaultMode: "weighed_swab_measured",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@blood-loss.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Caesarean Birth Pack",
        version: "2026.1",
        programFocus:
          "Weighed-swab measured vs haemoglobin-calculated soft-sim",
        birthBudget: 36,
        status: "active",
        notes: "Seed pack for births, methods, and assay runs",
        createdAt: now(),
      },
    ],
    births: [
      {
        id: birthId,
        packId,
        label: "Elective caesarean draft",
        kind: "elective_caesarean",
        siteHint: "site-perinatal-a",
        methodFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Birth soft-sim",
        status: "active",
        notes: "Soft-sim birth panel — not live clinical advice",
        createdAt: now(),
      },
    ],
    methods: [
      {
        id: methodId,
        packId,
        label: "Weighed swab and pad method draft",
        kind: "weighed_swab_pad",
        modelHint: "weighed-swab-measured",
        swabFloor: 0.4,
        evidenceFloor: 0.35,
        metricHint: "Method soft-sim",
        status: "active",
        notes: "Soft-sim method — not device clearance",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        birthId,
        methodId,
        label: "Haemoglobin delta / dual-gate soft-sim",
        kind: "dual_gate_soft_sim",
        swabMassFidelity: 0.42,
        hbDeltaCoverage: 0.32,
        assayFidelity: 0.7,
        assayReadout: 0.68,
        runNotes:
          "Weighed-swab path looks strong on mass fidelity but haemoglobin calc still leads when swabs are ignored",
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
        detail: "Demo pack, births, methods, and assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__bloodLossStore) g.__bloodLossStore = seed();
  return g.__bloodLossStore;
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
  g.__bloodLossStore = seed();
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
  items: BirthPack[];
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
  birthBudget?: number;
  notes?: string;
}): BirthPack {
  const pack: BirthPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    birthBudget: input.birthBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): BirthPack | null {
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

export function listBirths(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().births, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.siteHint.toLowerCase().includes(q),
  });
}

export function createBirth(input: {
  packId: string;
  label: string;
  kind: BirthKind;
  siteHint: string;
  methodFloor: number;
  fidelityFloor: number;
  metricHint?: string;
  notes?: string;
}): BirthSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: BirthSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    siteHint: input.siteHint,
    methodFloor: input.methodFloor,
    fidelityFloor: input.fidelityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().births.unshift(row);
  audit("evaluator", "birth.create", row.label);
  return row;
}

export function archiveBirth(id: string): BirthSpec | null {
  const row = state().births.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "birth.archive", id);
  return row;
}

export function listMethods(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().methods, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createMethod(input: {
  packId: string;
  label: string;
  kind: MethodKind;
  modelHint: string;
  swabFloor: number;
  evidenceFloor: number;
  metricHint?: string;
  notes?: string;
}): MethodSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: MethodSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    swabFloor: input.swabFloor,
    evidenceFloor: input.evidenceFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().methods.unshift(row);
  audit("evaluator", "method.create", row.label);
  return row;
}

export function archiveMethod(id: string): MethodSpec | null {
  const row = state().methods.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "method.archive", id);
  return row;
}

export function listAssays(opts?: {
  packId?: string;
  birthId?: string;
  methodId?: string;
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
  if (opts?.birthId) items = items.filter((r) => r.birthId === opts.birthId);
  if (opts?.methodId)
    items = items.filter((r) => r.methodId === opts.methodId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  birthId: string;
  methodId: string;
  label: string;
  kind: AssayKind;
  swabMassFidelity: number;
  hbDeltaCoverage: number;
  assayFidelity: number;
  assayReadout: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().births.some((m) => m.id === input.birthId)) return null;
  if (!state().methods.some((m) => m.id === input.methodId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    birthId: input.birthId,
    methodId: input.methodId,
    label: input.label,
    kind: input.kind,
    swabMassFidelity: clamp(input.swabMassFidelity, 0, 1),
    hbDeltaCoverage: clamp(input.hbDeltaCoverage, 0, 1),
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

export function listCompares(): LossCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  birthId: string;
  methodId: string;
  assayId: string;
  scoringBias?: ScoringBias;
  bias?: ScoringBias;
  overclaimRisk?: number;
  methodCompleteness?: number;
  evidenceStrength?: number;
  birthFollowThrough?: number;
}): LossCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const birth = state().births.find((m) => m.id === input.birthId);
  const method = state().methods.find((m) => m.id === input.methodId);
  const assay = state().assays.find((r) => r.id === input.assayId);
  if (!pack || !birth || !method || !assay) return null;

  const lossInput: BloodLossInput = {
    swabMassFidelity: clamp(assay.swabMassFidelity, 0, 1),
    hbDeltaCoverage: clamp(assay.hbDeltaCoverage, 0, 1),
    assayFidelity: clamp(assay.assayFidelity, 0, 1),
    methodCompleteness: clamp(
      input.methodCompleteness ?? birth.methodFloor,
      0,
      1,
    ),
    evidenceStrength: clamp(
      input.evidenceStrength ?? method.evidenceFloor,
      0,
      1,
    ),
    birthFollowThrough: clamp(
      input.birthFollowThrough ?? birth.fidelityFloor,
      0,
      1,
    ),
    assayReadout: clamp(assay.assayReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - method.swabFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    scoringBias:
      input.scoringBias ?? input.bias ?? state().org.defaultScoringBias,
    profile: "weighed_swab_measured",
  };

  const measured = scoreWeighedSwabMeasured({
    ...lossInput,
    profile: "weighed_swab_measured",
  });
  const calculated = scoreHaemoglobinCalculated({
    ...lossInput,
    profile: "haemoglobin_calculated",
  });
  const gap = Math.abs(measured.overall - calculated.overall);
  let winner: LossCompare["winner"] = "tie";
  if (measured.overall > calculated.overall + 0.5) {
    winner = "weighed_swab_measured";
  } else if (calculated.overall > measured.overall + 0.5) {
    winner = "haemoglobin_calculated";
  }

  const compare: LossCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    birthId: birth.id,
    methodId: method.id,
    assayId: assay.id,
    input: lossInput,
    measured,
    calculated,
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

export function getScoreboard(): LossCompare[] {
  return [...state().compares].sort(
    (a, b) => b.measured.overall - a.measured.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      births: state().births,
      methods: state().methods,
      assays: state().assays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,measuredOverall,calculatedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.measured.overall},${c.calculated.overall},${c.createdAt}`,
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
    { id: "packs", label: "Birth pack registry CRUD" },
    { id: "births", label: "Birth workspace" },
    { id: "methods", label: "Weighed-swab method specs" },
    { id: "assays", label: "Haemoglobin assay runs" },
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
    { id: "search", label: "Pack/birth search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "weighed_swab_measured scorer" },
    { id: "scorer-b", label: "haemoglobin_calculated scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "scoring-bias", label: "Scoring bias controls" },
    { id: "archive", label: "Archive packs/births/methods" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "birth-kinds", label: "Caesarean birth kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
