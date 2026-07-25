import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMulticellularHlo,
  scoreSingleLineageHlc,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type LineageBias,
  type LineageKind,
  type ModelKind,
  type OrganoidInput,
  type OrganoidQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  AssayKind,
  LineageBias,
  LineageKind,
  ModelKind,
  OrganoidInput,
  OrganoidQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ModelPack = {
  id: string;
  label: string;
  version: string;
  masldFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type ModelSpec = {
  id: string;
  packId: string;
  label: string;
  kind: ModelKind;
  protocolHint: string;
  complexityFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type LineageSpec = {
  id: string;
  packId: string;
  label: string;
  kind: LineageKind;
  mixHint: string;
  stellateFloor: number;
  cholangiocyteFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  modelId: string;
  lineageId: string;
  label: string;
  kind: AssayKind;
  multicellularComplexity: number;
  hepatocyteLikeFidelity: number;
  differentiationDay: number;
  runNotes: string;
  status: EntityStatus;
  createdAt: string;
};

export type MasldCase = {
  id: string;
  packId: string;
  label: string;
  lipidAccumulation: number;
  inflammationCue: number;
  phenotypeHint: string;
  metricHint: string;
  status: EntityStatus;
  notes: string;
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
  defaultLineageBias: LineageBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type OrganoidCompare = {
  id: string;
  name: string;
  packId: string;
  modelId: string;
  lineageId: string;
  assayRunId: string;
  masldCaseId: string;
  input: OrganoidInput;
  hlo: OrganoidQuality;
  hlc: OrganoidQuality;
  winner:
    | "multicellular_hlo_model"
    | "single_lineage_hlc_baseline"
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
  packs: ModelPack[];
  models: ModelSpec[];
  lineages: LineageSpec[];
  assayRuns: AssayRun[];
  masldCases: MasldCase[];
  auditEvents: AuditEvent[];
  compares: OrganoidCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __liverOrganoidStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const modelId = "model-demo";
  const lineageId = "lineage-demo";
  const assayRunId = "assay-demo";
  const masldCaseId = "masld-demo";
  return {
    org: {
      name: "Liver Organoid Org",
      webhookUrl: "",
      webhookSecret: "liver-organoid-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultLineageBias: "balanced",
      defaultMode: "multicellular_hlo_model",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@liver-organoid.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "MASLD HLO Soft-Sim Pack",
        version: "2026.1",
        masldFocus: "Multicellular HLO vs single-lineage HLC baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for models, lineages, assays, and MASLD cases vs HLC soft-sim",
        createdAt: now(),
      },
    ],
    models: [
      {
        id: modelId,
        packId,
        label: "Multicellular HLO draft",
        kind: "multicellular_hlo",
        protocolHint: "10-day,hepatic,HLO",
        complexityFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Multicellular organoid complexity soft-sim",
        status: "active",
        notes:
          "Soft-sim models — not wet-lab validated organoid GMP manufacture",
        createdAt: now(),
      },
    ],
    lineages: [
      {
        id: lineageId,
        packId,
        label: "Hepatocyte + stellate mix",
        kind: "stellate_include",
        mixHint: "hepatocyte,stellate,cholangiocyte",
        stellateFloor: 0.35,
        cholangiocyteFloor: 0.25,
        metricHint: "Lineage mix soft-sim",
        status: "active",
        notes: "Soft-sim lineages — not live patient transplant",
        createdAt: now(),
      },
    ],
    assayRuns: [
      {
        id: assayRunId,
        packId,
        modelId,
        lineageId,
        label: "Differentiation day soft-sim",
        kind: "differentiation_day",
        multicellularComplexity: 0.68,
        hepatocyteLikeFidelity: 0.72,
        differentiationDay: 0.74,
        runNotes:
          "HLO mix looks strong but HLC still leads when stellate presence is thin",
        status: "active",
        createdAt: now(),
      },
    ],
    masldCases: [
      {
        id: masldCaseId,
        packId,
        label: "Lipid + inflammation MASLD draft",
        lipidAccumulation: 0.58,
        inflammationCue: 0.42,
        phenotypeHint: "lipid,inflammation,MASLD",
        metricHint: "MASLD phenotype soft-sim",
        status: "active",
        notes:
          "Soft-sim MASLD — not clinical MASLD diagnosis / not authors’ organoid system",
        createdAt: now(),
      },
    ],
    auditEvents: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail:
          "Demo pack, models, lineages, assays, and MASLD case seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__liverOrganoidStore) g.__liverOrganoidStore = seed();
  return g.__liverOrganoidStore;
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
  g.__liverOrganoidStore = seed();
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
  if (patch.defaultLineageBias !== undefined) {
    org.defaultLineageBias = patch.defaultLineageBias;
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
  items: ModelPack[];
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
        p.masldFocus.toLowerCase().includes(q) ||
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
  masldFocus: string;
  sessionBudget?: number;
  notes?: string;
}): ModelPack {
  const pack: ModelPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    masldFocus: input.masldFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ModelPack | null {
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

export function listModels(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().models, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.protocolHint.toLowerCase().includes(q),
  });
}

export function createModel(input: {
  packId: string;
  label: string;
  kind: ModelKind;
  protocolHint: string;
  complexityFloor: number;
  fidelityFloor: number;
  metricHint?: string;
  notes?: string;
}): ModelSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ModelSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    protocolHint: input.protocolHint,
    complexityFloor: input.complexityFloor,
    fidelityFloor: input.fidelityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().models.unshift(row);
  audit("evaluator", "model.create", row.label);
  return row;
}

export function archiveModel(id: string): ModelSpec | null {
  const row = state().models.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "model.archive", id);
  return row;
}

export function listLineages(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().lineages, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.mixHint.toLowerCase().includes(q),
  });
}

export function createLineage(input: {
  packId: string;
  label: string;
  kind: LineageKind;
  mixHint: string;
  stellateFloor: number;
  cholangiocyteFloor: number;
  metricHint?: string;
  notes?: string;
}): LineageSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: LineageSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    mixHint: input.mixHint,
    stellateFloor: input.stellateFloor,
    cholangiocyteFloor: input.cholangiocyteFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().lineages.unshift(row);
  audit("evaluator", "lineage.create", row.label);
  return row;
}

export function archiveLineage(id: string): LineageSpec | null {
  const row = state().lineages.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "lineage.archive", id);
  return row;
}

export function listAssayRuns(opts?: {
  packId?: string;
  modelId?: string;
  lineageId?: string;
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
  let items = [...state().assayRuns];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.modelId) items = items.filter((r) => r.modelId === opts.modelId);
  if (opts?.lineageId)
    items = items.filter((r) => r.lineageId === opts.lineageId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssayRun(input: {
  packId: string;
  modelId: string;
  lineageId: string;
  label: string;
  kind: AssayKind;
  multicellularComplexity: number;
  hepatocyteLikeFidelity: number;
  differentiationDay: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().models.some((m) => m.id === input.modelId)) return null;
  if (!state().lineages.some((m) => m.id === input.lineageId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    modelId: input.modelId,
    lineageId: input.lineageId,
    label: input.label,
    kind: input.kind,
    multicellularComplexity: clamp(input.multicellularComplexity, 0, 1),
    hepatocyteLikeFidelity: clamp(input.hepatocyteLikeFidelity, 0, 1),
    differentiationDay: clamp(input.differentiationDay, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().assayRuns.unshift(run);
  audit("evaluator", "assay.create", run.id);
  return run;
}

export function listMasldCases(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().masldCases, {
    ...opts,
    extra: (m, q) => m.phenotypeHint.toLowerCase().includes(q),
  });
}

export function createMasldCase(input: {
  packId: string;
  label: string;
  lipidAccumulation: number;
  inflammationCue: number;
  phenotypeHint: string;
  metricHint?: string;
  notes?: string;
}): MasldCase | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: MasldCase = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    lipidAccumulation: clamp(input.lipidAccumulation, 0, 1),
    inflammationCue: clamp(input.inflammationCue, 0, 1),
    phenotypeHint: input.phenotypeHint,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().masldCases.unshift(row);
  audit("evaluator", "masld.create", row.label);
  return row;
}

export function archiveMasldCase(id: string): MasldCase | null {
  const row = state().masldCases.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "masld.archive", id);
  return row;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): OrganoidCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  modelId: string;
  lineageId: string;
  assayRunId: string;
  masldCaseId: string;
  lineageBias?: LineageBias;
  bias?: LineageBias;
  overclaimRisk?: number;
}): OrganoidCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const model = state().models.find((m) => m.id === input.modelId);
  const lineage = state().lineages.find((m) => m.id === input.lineageId);
  const assayRun = state().assayRuns.find((r) => r.id === input.assayRunId);
  const masld = state().masldCases.find((m) => m.id === input.masldCaseId);
  if (!pack || !model || !lineage || !assayRun || !masld) return null;

  const organoidInput: OrganoidInput = {
    multicellularComplexity: clamp(assayRun.multicellularComplexity, 0, 1),
    hepatocyteLikeFidelity: clamp(assayRun.hepatocyteLikeFidelity, 0, 1),
    stellatePresence: clamp(lineage.stellateFloor, 0, 1),
    cholangiocyteMix: clamp(lineage.cholangiocyteFloor, 0, 1),
    lipidAccumulation: clamp(masld.lipidAccumulation, 0, 1),
    inflammationCue: clamp(masld.inflammationCue, 0, 1),
    differentiationDay: clamp(assayRun.differentiationDay, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - model.complexityFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    lineageBias:
      input.lineageBias ?? input.bias ?? state().org.defaultLineageBias,
    profile: "multicellular_hlo_model",
  };

  const hlo = scoreMulticellularHlo({
    ...organoidInput,
    profile: "multicellular_hlo_model",
  });
  const hlc = scoreSingleLineageHlc({
    ...organoidInput,
    profile: "single_lineage_hlc_baseline",
  });
  const gap = Math.abs(hlo.overall - hlc.overall);
  let winner: OrganoidCompare["winner"] = "tie";
  if (hlo.overall > hlc.overall + 0.5) {
    winner = "multicellular_hlo_model";
  } else if (hlc.overall > hlo.overall + 0.5) {
    winner = "single_lineage_hlc_baseline";
  }

  const compare: OrganoidCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    modelId: model.id,
    lineageId: lineage.id,
    assayRunId: assayRun.id,
    masldCaseId: masld.id,
    input: organoidInput,
    hlo,
    hlc,
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

export function getScoreboard(): OrganoidCompare[] {
  return [...state().compares].sort((a, b) => b.hlo.overall - a.hlo.overall);
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      models: state().models,
      lineages: state().lineages,
      assayRuns: state().assayRuns,
      masldCases: state().masldCases,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,hloOverall,hlcOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.hlo.overall},${c.hlc.overall},${c.createdAt}`,
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
  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
  };
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
    { id: "model-packs", name: "Model pack registry" },
    { id: "pack-versions", name: "Versioned model packs" },
    { id: "models", name: "HLO/HLC model registry" },
    { id: "model-editor", name: "Model protocol editor" },
    { id: "model-search", name: "Model search and filter" },
    { id: "lineages", name: "Lineage mix configs" },
    { id: "lineage-editor", name: "Lineage mix editor" },
    { id: "assays", name: "Assay run soft-sim" },
    { id: "assay-filters", name: "Assay filters" },
    { id: "masld", name: "MASLD phenotype cases" },
    { id: "lineage-bias", name: "Lineage bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Multicellular HLO vs single-lineage HLC compare",
    },
    { id: "delta-view", name: "Organoid delta view" },
    { id: "scoreboard", name: "Organoid scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not organoid GMP / not transplant / not clinical MASLD diagnosis",
    },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "HMAC webhook ingest" },
    { id: "export-json", name: "Export packs JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "pagination", name: "Pagination on list APIs" },
    { id: "search", name: "Search across packs and models" },
    { id: "assays-page", name: "Assay runs workspace" },
  ];
}

export function scorePreview(input: OrganoidInput): {
  hlo: OrganoidQuality;
  hlc: OrganoidQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const hlo = scoreMulticellularHlo({
    ...input,
    profile: "multicellular_hlo_model",
  });
  const hlc = scoreSingleLineageHlc({
    ...input,
    profile: "single_lineage_hlc_baseline",
  });
  return {
    hlo,
    hlc,
    readiness: readinessFromQuality(hlo.overall),
  };
}
