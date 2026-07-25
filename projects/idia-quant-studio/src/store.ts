import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreInformedDiaQuant, scoreNaiveDiaBaseline } from "./domain/idia";
import {
  clamp,
  readinessFromQuality,
  round2,
  type SpectrumKind,
  type QuantBias,
  type ScoreMode,
  type QuantInput,
  type QuantQuality,
} from "./domain/types";

export type {
  SpectrumKind,
  QuantBias,
  ScoreMode,
  QuantInput,
  QuantQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type QuantPack = {
  id: string;
  label: string;
  version: string;
  cohortTarget: string;
  spectrumBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SpectrumStatus = "draft" | "active" | "archived";

export type SpectrumConfig = {
  id: string;
  packId: string;
  label: string;
  kind: SpectrumKind;
  windowHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: SpectrumStatus;
  notes: string;
  createdAt: string;
};

export type TargetStatus = "draft" | "open" | "scored" | "archived";

export type TargetPanel = {
  id: string;
  packId?: string;
  label: string;
  targetText: string;
  successCondition: string;
  proteinChannel: string;
  status: TargetStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type QuantRun = {
  id: string;
  targetId: string;
  spectrumId: string;
  targetCoverage: number;
  spectrumInformedness: number;
  proteinDetectability: number;
  quantPrecision: number;
  reviewerNotes: string;
  status: RunStatus;
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
  defaultQuantBias: QuantBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type QuantCompare = {
  id: string;
  name: string;
  targetId: string;
  spectrumId: string;
  runId: string;
  input: QuantInput;
  informedDia: QuantQuality;
  naiveBaseline: QuantQuality;
  winner: "informed_dia_quant" | "naive_dia_baseline" | "tie";
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
  packs: QuantPack[];
  spectra: SpectrumConfig[];
  targets: TargetPanel[];
  runs: QuantRun[];
  audits: AuditEntry[];
  compares: QuantCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __idiaQuantStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const spectrumId = "spectrum-demo";
  const targetId = "target-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Idia Quant Org",
      webhookUrl: "",
      webhookSecret: "idia-quant-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultQuantBias: "balanced",
      defaultMode: "informed_dia_quant",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@idia-quant.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Informed DIA Soft-Sim Quant Pack",
        version: "2026.1",
        cohortTarget: "Single-cell regulatory protein soft-sim",
        spectrumBudget: 36,
        status: "active",
        notes:
          "Seed pack for informed DIA vs naive DIA baseline soft-sim",
        createdAt: now(),
      },
    ],
    spectra: [
      {
        id: spectrumId,
        packId,
        label: "Informed DIA spectrum windows",
        kind: "informed_dia",
        windowHint:
          "target_coverage,spectrum_informedness,protein_detectability,quant_precision",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "Informed DIA windows for regulatory-protein soft-sim honesty",
        status: "active",
        notes: "Soft-sim spectra — not wet-lab validated / not instrument write-back",
        createdAt: now(),
      },
    ],
    targets: [
      {
        id: targetId,
        packId,
        label: "Regulatory protein target panel",
        targetText:
          "Given informed DIA windows, quantify regulatory proteins soft-sim against the pack.",
        successCondition: "lock_soft_sim",
        proteinChannel: "soft_sim_regulatory_idia",
        status: "scored",
        notes: "Seed target panel for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        targetId,
        spectrumId,
        targetCoverage: 0.62,
        spectrumInformedness: 0.7,
        proteinDetectability: 0.74,
        quantPrecision: 0.68,
        reviewerNotes:
          "Informed windows look trustworthy but naive DIA needs regulatory protein depth",
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
        detail: "Demo pack, spectra, targets, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__idiaQuantStore) g.__idiaQuantStore = seed();
  return g.__idiaQuantStore;
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
  g.__idiaQuantStore = seed();
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
  if (patch.defaultQuantBias !== undefined) {
    org.defaultQuantBias = patch.defaultQuantBias;
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
  items: QuantPack[];
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
        p.cohortTarget.toLowerCase().includes(q) ||
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
  cohortTarget: string;
  spectrumBudget?: number;
  notes?: string;
}): QuantPack {
  const pack: QuantPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    cohortTarget: input.cohortTarget,
    spectrumBudget: input.spectrumBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): QuantPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listSpectra(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SpectrumConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().spectra];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.windowHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSpectrum(input: {
  packId: string;
  label: string;
  kind: SpectrumKind;
  windowHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): SpectrumConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: SpectrumConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    windowHint: input.windowHint,
    seriesCount: input.seriesCount,
    fidelityMin: input.fidelityMin,
    fidelityMax: input.fidelityMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().spectra.unshift(row);
  audit("evaluator", "spectrum.create", row.label);
  return row;
}

export function archiveSpectrum(id: string): SpectrumConfig | null {
  const row = state().spectra.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "spectrum.archive", id);
  return row;
}

export function listTargets(opts?: {
  q?: string;
  proteinChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TargetPanel[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().targets];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.targetText.toLowerCase().includes(q) ||
        c.proteinChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.proteinChannel) {
    items = items.filter((c) => c.proteinChannel === opts.proteinChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTarget(input: {
  packId?: string;
  label: string;
  targetText: string;
  successCondition: string;
  proteinChannel: string;
  notes?: string;
}): TargetPanel {
  const row: TargetPanel = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    targetText: input.targetText,
    successCondition: input.successCondition,
    proteinChannel: input.proteinChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().targets.unshift(row);
  audit("evaluator", "target.create", row.label);
  return row;
}

export function archiveTarget(id: string): TargetPanel | null {
  const row = state().targets.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "target.archive", id);
  return row;
}

export function listRuns(opts?: {
  targetId?: string;
  spectrumId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: QuantRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.targetId) {
    items = items.filter((r) => r.targetId === opts.targetId);
  }
  if (opts?.spectrumId) {
    items = items.filter((r) => r.spectrumId === opts.spectrumId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  targetId: string;
  spectrumId: string;
  targetCoverage: number;
  spectrumInformedness: number;
  proteinDetectability: number;
  quantPrecision: number;
  reviewerNotes?: string;
}): QuantRun | null {
  if (!state().targets.some((c) => c.id === input.targetId)) {
    return null;
  }
  if (!state().spectra.some((m) => m.id === input.spectrumId)) return null;
  const run: QuantRun = {
    id: randomUUID(),
    targetId: input.targetId,
    spectrumId: input.spectrumId,
    targetCoverage: clamp(input.targetCoverage, 0, 1),
    spectrumInformedness: clamp(input.spectrumInformedness, 0, 1),
    proteinDetectability: clamp(input.proteinDetectability, 0, 1),
    quantPrecision: clamp(input.quantPrecision, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().targets.find((c) => c.id === input.targetId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): QuantCompare[] {
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
  targetId: string;
  spectrumId: string;
  runId: string;
  quantBias?: QuantBias;
  bias?: QuantBias;
  naiveWindowBreadth?: number;
  baselineOptimism?: number;
  abundanceHardness?: number;
  overclaimRisk?: number;
}): QuantCompare | null {
  const target = state().targets.find((c) => c.id === input.targetId);
  const spectrum = state().spectra.find((m) => m.id === input.spectrumId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!target || !spectrum || !run) return null;

  const goldWeight = outcomeWeight(String(target.successCondition));
  const span = Math.max(0.05, spectrum.fidelityMax - spectrum.fidelityMin);
  const quantInput: QuantInput = {
    targetCoverage: clamp(run.targetCoverage, 0, 1),
    spectrumInformedness: clamp(run.spectrumInformedness, 0, 1),
    proteinDetectability: clamp(run.proteinDetectability, 0, 1),
    quantPrecision: clamp((run.quantPrecision + goldWeight) / 2, 0, 1),
    naiveWindowBreadth: input.naiveWindowBreadth ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    abundanceHardness:
      input.abundanceHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    quantBias:
      input.quantBias ?? input.bias ?? state().org.defaultQuantBias,
    profile: "informed_dia_quant",
  };

  const informedDia = scoreInformedDiaQuant({
    ...quantInput,
    profile: "informed_dia_quant",
  });
  const naiveBaseline = scoreNaiveDiaBaseline({
    ...quantInput,
    profile: "naive_dia_baseline",
  });
  const gap = Math.abs(informedDia.overall - naiveBaseline.overall);
  let winner: QuantCompare["winner"] = "tie";
  if (informedDia.overall > naiveBaseline.overall + 0.5) {
    winner = "informed_dia_quant";
  } else if (naiveBaseline.overall > informedDia.overall + 0.5) {
    winner = "naive_dia_baseline";
  }

  const compare: QuantCompare = {
    id: randomUUID(),
    name: input.name,
    targetId: target.id,
    spectrumId: spectrum.id,
    runId: run.id,
    input: quantInput,
    informedDia,
    naiveBaseline,
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

export function getScoreboard(): QuantCompare[] {
  return [...state().compares].sort(
    (a, b) => b.informedDia.overall - a.informedDia.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      spectra: state().spectra,
      targets: state().targets,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,informedOverall,naiveOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.informedDia.overall},${c.naiveBaseline.overall},${c.createdAt}`,
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
    { id: "quant-packs", name: "Quant pack registry" },
    { id: "pack-versions", name: "Versioned quant packs" },
    { id: "spectra", name: "Informed DIA spectrum configs" },
    { id: "spectrum-editor", name: "Spectrum window / fidelity editor" },
    { id: "spectrum-search", name: "Spectrum search and filter" },
    { id: "seed-packs", name: "Seed quant packs" },
    { id: "targets", name: "Regulatory protein target panels" },
    { id: "target-filters", name: "Target filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "quant-runs", name: "Quant soft-sim runs" },
    { id: "quant-bias", name: "Quant bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Informed DIA vs naive DIA baseline compare",
    },
    { id: "delta-view", name: "Quant delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not wet-lab validated / not instrument write-back / not authors' system",
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

export function scorePreview(input: QuantInput): {
  informedDia: QuantQuality;
  naiveBaseline: QuantQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const informedDia = scoreInformedDiaQuant({
    ...input,
    profile: "informed_dia_quant",
  });
  const naiveBaseline = scoreNaiveDiaBaseline({
    ...input,
    profile: "naive_dia_baseline",
  });
  return {
    informedDia,
    naiveBaseline,
    readiness: readinessFromQuality(informedDia.overall),
  };
}
