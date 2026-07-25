import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMultimodalChemicl,
  scoreTextOnlyIclBaseline,
} from "./domain/chemicl";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ModalityKind,
  type DiscoverBias,
  type ScoreMode,
  type DiscoverInput,
  type DiscoverQuality,
} from "./domain/types";

export type {
  ModalityKind,
  DiscoverBias,
  ScoreMode,
  DiscoverInput,
  DiscoverQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type DiscoverPack = {
  id: string;
  label: string;
  version: string;
  discoveryFocus: string;
  exemplarBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ModalityStatus = "draft" | "active" | "archived";

export type ModalityConfig = {
  id: string;
  packId: string;
  label: string;
  kind: ModalityKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: ModalityStatus;
  notes: string;
  createdAt: string;
};

export type ExemplarStatus = "draft" | "open" | "scored" | "archived";

export type ExemplarSet = {
  id: string;
  packId?: string;
  label: string;
  exemplarText: string;
  successCondition: string;
  chemistryChannel: string;
  status: ExemplarStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type DiscoverRun = {
  id: string;
  exemplarId: string;
  modalityId: string;
  multimodalCoverage: number;
  modalityFidelity: number;
  exemplarAlignment: number;
  iclPrecision: number;
  reviewerNotes: string;
  status: RunStatus;
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
  defaultDiscoverBias: DiscoverBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type DiscoverCompare = {
  id: string;
  name: string;
  exemplarId: string;
  modalityId: string;
  runId: string;
  input: DiscoverInput;
  multimodalChemicl: DiscoverQuality;
  textOnlyBaseline: DiscoverQuality;
  winner: "multimodal_chemicl" | "text_only_icl_baseline" | "tie";
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
  packs: DiscoverPack[];
  modalities: ModalityConfig[];
  exemplars: ExemplarSet[];
  runs: DiscoverRun[];
  audits: AuditEvent[];
  compares: DiscoverCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __chemiclDiscoverStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const modalityId = "modality-demo";
  const exemplarId = "exemplar-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Chemicl Discover Org",
      webhookUrl: "",
      webhookSecret: "chemicl-discover-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultDiscoverBias: "balanced",
      defaultMode: "multimodal_chemicl",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@chemicl-discover.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Multimodal ChemICL Soft-Sim Discover Pack",
        version: "2026.1",
        discoveryFocus: "Chemistry discovery multimodal ICL soft-sim",
        exemplarBudget: 36,
        status: "active",
        notes:
          "Seed pack for multimodal ChemICL vs text-only ICL baseline soft-sim",
        createdAt: now(),
      },
    ],
    modalities: [
      {
        id: modalityId,
        packId,
        label: "Hybrid multimodal chemistry channels",
        kind: "hybrid_multimodal",
        channelHint:
          "multimodal_coverage,modality_fidelity,exemplar_alignment,icl_precision",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "Structure + spectrum + scheme channels for ChemICL soft-sim honesty",
        status: "active",
        notes: "Soft-sim modalities — not wet-lab validated / not live ELN",
        createdAt: now(),
      },
    ],
    exemplars: [
      {
        id: exemplarId,
        packId,
        label: "Multimodal chemistry exemplar set",
        exemplarText:
          "Given multimodal chemistry context, run ChemICL soft-sim against the discover pack.",
        successCondition: "lock_soft_sim",
        chemistryChannel: "soft_sim_chemicl_multimodal",
        status: "scored",
        notes: "Seed exemplar set for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        exemplarId,
        modalityId,
        multimodalCoverage: 0.62,
        modalityFidelity: 0.7,
        exemplarAlignment: 0.74,
        iclPrecision: 0.68,
        reviewerNotes:
          "Multimodal channels look trustworthy but text-only ICL needs chemistry depth",
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
        detail: "Demo pack, modalities, exemplars, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__chemiclDiscoverStore) g.__chemiclDiscoverStore = seed();
  return g.__chemiclDiscoverStore;
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
  g.__chemiclDiscoverStore = seed();
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
  if (patch.defaultDiscoverBias !== undefined) {
    org.defaultDiscoverBias = patch.defaultDiscoverBias;
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
  items: DiscoverPack[];
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
        p.discoveryFocus.toLowerCase().includes(q) ||
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
  discoveryFocus: string;
  exemplarBudget?: number;
  notes?: string;
}): DiscoverPack {
  const pack: DiscoverPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    discoveryFocus: input.discoveryFocus,
    exemplarBudget: input.exemplarBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): DiscoverPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listModalities(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ModalityConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().modalities];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.channelHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createModality(input: {
  packId: string;
  label: string;
  kind: ModalityKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): ModalityConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: ModalityConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    channelHint: input.channelHint,
    seriesCount: input.seriesCount,
    fidelityMin: input.fidelityMin,
    fidelityMax: input.fidelityMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().modalities.unshift(row);
  audit("evaluator", "modality.create", row.label);
  return row;
}

export function archiveModality(id: string): ModalityConfig | null {
  const row = state().modalities.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "modality.archive", id);
  return row;
}

export function listExemplars(opts?: {
  q?: string;
  chemistryChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ExemplarSet[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().exemplars];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.exemplarText.toLowerCase().includes(q) ||
        c.chemistryChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.chemistryChannel) {
    items = items.filter((c) => c.chemistryChannel === opts.chemistryChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createExemplar(input: {
  packId?: string;
  label: string;
  exemplarText: string;
  successCondition: string;
  chemistryChannel: string;
  notes?: string;
}): ExemplarSet {
  const row: ExemplarSet = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    exemplarText: input.exemplarText,
    successCondition: input.successCondition,
    chemistryChannel: input.chemistryChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().exemplars.unshift(row);
  audit("evaluator", "exemplar.create", row.label);
  return row;
}

export function archiveExemplar(id: string): ExemplarSet | null {
  const row = state().exemplars.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "exemplar.archive", id);
  return row;
}

export function listRuns(opts?: {
  exemplarId?: string;
  modalityId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DiscoverRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.exemplarId) {
    items = items.filter((r) => r.exemplarId === opts.exemplarId);
  }
  if (opts?.modalityId) {
    items = items.filter((r) => r.modalityId === opts.modalityId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  exemplarId: string;
  modalityId: string;
  multimodalCoverage: number;
  modalityFidelity: number;
  exemplarAlignment: number;
  iclPrecision: number;
  reviewerNotes?: string;
}): DiscoverRun | null {
  if (!state().exemplars.some((c) => c.id === input.exemplarId)) {
    return null;
  }
  if (!state().modalities.some((m) => m.id === input.modalityId)) return null;
  const run: DiscoverRun = {
    id: randomUUID(),
    exemplarId: input.exemplarId,
    modalityId: input.modalityId,
    multimodalCoverage: clamp(input.multimodalCoverage, 0, 1),
    modalityFidelity: clamp(input.modalityFidelity, 0, 1),
    exemplarAlignment: clamp(input.exemplarAlignment, 0, 1),
    iclPrecision: clamp(input.iclPrecision, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().exemplars.find((c) => c.id === input.exemplarId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): DiscoverCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "hold_pack":
      return 0.2;
    case "review":
      return 0.45;
    case "lock_soft_sim":
      return 0.7;
    case "strong_lock":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  exemplarId: string;
  modalityId: string;
  runId: string;
  discoverBias?: DiscoverBias;
  bias?: DiscoverBias;
  textOnlyBreadth?: number;
  baselineOptimism?: number;
  chemistryHardness?: number;
  overclaimRisk?: number;
}): DiscoverCompare | null {
  const exemplar = state().exemplars.find((c) => c.id === input.exemplarId);
  const modality = state().modalities.find((m) => m.id === input.modalityId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!exemplar || !modality || !run) return null;

  const goldWeight = outcomeWeight(String(exemplar.successCondition));
  const span = Math.max(0.05, modality.fidelityMax - modality.fidelityMin);
  const discoverInput: DiscoverInput = {
    multimodalCoverage: clamp(run.multimodalCoverage, 0, 1),
    modalityFidelity: clamp(run.modalityFidelity, 0, 1),
    exemplarAlignment: clamp(run.exemplarAlignment, 0, 1),
    iclPrecision: clamp((run.iclPrecision + goldWeight) / 2, 0, 1),
    textOnlyBreadth: input.textOnlyBreadth ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    chemistryHardness:
      input.chemistryHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    discoverBias:
      input.discoverBias ?? input.bias ?? state().org.defaultDiscoverBias,
    profile: "multimodal_chemicl",
  };

  const multimodalChemicl = scoreMultimodalChemicl({
    ...discoverInput,
    profile: "multimodal_chemicl",
  });
  const textOnlyBaseline = scoreTextOnlyIclBaseline({
    ...discoverInput,
    profile: "text_only_icl_baseline",
  });
  const gap = Math.abs(multimodalChemicl.overall - textOnlyBaseline.overall);
  let winner: DiscoverCompare["winner"] = "tie";
  if (multimodalChemicl.overall > textOnlyBaseline.overall + 0.5) {
    winner = "multimodal_chemicl";
  } else if (textOnlyBaseline.overall > multimodalChemicl.overall + 0.5) {
    winner = "text_only_icl_baseline";
  }

  const compare: DiscoverCompare = {
    id: randomUUID(),
    name: input.name,
    exemplarId: exemplar.id,
    modalityId: modality.id,
    runId: run.id,
    input: discoverInput,
    multimodalChemicl,
    textOnlyBaseline,
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

export function getScoreboard(): DiscoverCompare[] {
  return [...state().compares].sort(
    (a, b) => b.multimodalChemicl.overall - a.multimodalChemicl.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      modalities: state().modalities,
      exemplars: state().exemplars,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,multimodalOverall,textOnlyOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.multimodalChemicl.overall},${c.textOnlyBaseline.overall},${c.createdAt}`,
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
    { id: "discover-packs", name: "Discover pack registry" },
    { id: "pack-versions", name: "Versioned discover packs" },
    { id: "modalities", name: "Multimodal chemistry modality configs" },
    { id: "modality-editor", name: "Modality channel / fidelity editor" },
    { id: "modality-search", name: "Modality search and filter" },
    { id: "seed-packs", name: "Seed discover packs" },
    { id: "exemplars", name: "Multimodal exemplar sets" },
    { id: "exemplar-filters", name: "Exemplar filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "discover-runs", name: "Discover soft-sim runs" },
    { id: "discover-bias", name: "Discover bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Multimodal ChemICL vs text-only ICL baseline compare",
    },
    { id: "delta-view", name: "Discover delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not wet-lab validated / not live ELN / not authors' system",
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
  ];
}

export function scorePreview(input: DiscoverInput): {
  multimodalChemicl: DiscoverQuality;
  textOnlyBaseline: DiscoverQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const multimodalChemicl = scoreMultimodalChemicl({
    ...input,
    profile: "multimodal_chemicl",
  });
  const textOnlyBaseline = scoreTextOnlyIclBaseline({
    ...input,
    profile: "text_only_icl_baseline",
  });
  return {
    multimodalChemicl,
    textOnlyBaseline,
    readiness: readinessFromQuality(multimodalChemicl.overall),
  };
}
