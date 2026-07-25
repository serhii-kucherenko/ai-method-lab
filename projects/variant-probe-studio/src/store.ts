import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreInterpretableFmProbe,
  scoreOpaquePathogenicity,
} from "./domain/probe";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ProbeBias,
  type ProbeInput,
  type ProbeKind,
  type ProbeQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  ProbeBias,
  ProbeInput,
  ProbeKind,
  ProbeQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type PanelPack = {
  id: string;
  label: string;
  version: string;
  genePanel: string;
  probeBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ProbeStatus = "draft" | "active" | "archived";

export type ProbeConfig = {
  id: string;
  packId: string;
  label: string;
  kind: ProbeKind;
  embeddingAxis: string;
  interpretLayer: string;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: ProbeStatus;
  notes: string;
  createdAt: string;
};

export type MechanismStatus = "draft" | "open" | "scored" | "archived";

export type MechanismLink = {
  id: string;
  packId?: string;
  label: string;
  mechanismText: string;
  successCondition: string;
  pathwayChannel: string;
  status: MechanismStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type VariantRun = {
  id: string;
  mechanismId: string;
  probeId: string;
  panelCoverage: number;
  probeFidelity: number;
  mechanismClarity: number;
  runStability: number;
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
  defaultProbeBias: ProbeBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ProbeCompare = {
  id: string;
  name: string;
  mechanismId: string;
  probeId: string;
  runId: string;
  input: ProbeInput;
  interpretableFmProbe: ProbeQuality;
  opaquePathogenicity: ProbeQuality;
  winner:
    | "interpretable_fm_probe"
    | "opaque_pathogenicity_baseline"
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
  packs: PanelPack[];
  probes: ProbeConfig[];
  mechanisms: MechanismLink[];
  runs: VariantRun[];
  audits: AuditEntry[];
  compares: ProbeCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __variantProbeStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const probeId = "probe-demo";
  const mechanismId = "mechanism-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Variant Probe Org",
      webhookUrl: "",
      webhookSecret: "variant-probe-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProbeBias: "balanced",
      defaultMode: "interpretable_fm_probe",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@variant-probe.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Cardiomyopathy Soft-Sim Panel Pack",
        version: "2026.1",
        genePanel: "MYH7 + TTN + LMNA interpretable probe panel",
        probeBudget: 36,
        status: "active",
        notes: "Seed pack for interpretable vs opaque compare",
        createdAt: now(),
      },
    ],
    probes: [
      {
        id: probeId,
        packId,
        label: "Layer-12 FM embedding probe",
        kind: "embedding",
        embeddingAxis: "splice_disruption,missense_severity",
        interpretLayer: "layer_12_linear",
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint: "Interpretable probe AUROC under soft-sim honesty",
        status: "active",
        notes: "Soft-sim probe config — not live LIMS",
        createdAt: now(),
      },
    ],
    mechanisms: [
      {
        id: mechanismId,
        packId,
        label: "Splice disruption mechanism link",
        mechanismText:
          "Does the probe attribute score mass to splice-site disruption for this variant class?",
        successCondition: "lock_soft_sim",
        pathwayChannel: "soft_sim_splice",
        status: "scored",
        notes: "Seed mechanism for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        mechanismId,
        probeId,
        panelCoverage: 0.62,
        probeFidelity: 0.7,
        mechanismClarity: 0.74,
        runStability: 0.68,
        reviewerNotes:
          "Interpretable probe looks informative but opaque baseline drifts under sparse panels",
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
        detail: "Demo pack, probe, mechanism, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__variantProbeStore) g.__variantProbeStore = seed();
  return g.__variantProbeStore;
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
  g.__variantProbeStore = seed();
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
  if (patch.defaultProbeBias !== undefined) {
    org.defaultProbeBias = patch.defaultProbeBias;
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
  items: PanelPack[];
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
        p.genePanel.toLowerCase().includes(q) ||
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
  genePanel: string;
  probeBudget?: number;
  notes?: string;
}): PanelPack {
  const pack: PanelPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    genePanel: input.genePanel,
    probeBudget: input.probeBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): PanelPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listProbes(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ProbeConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().probes];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.embeddingAxis.toLowerCase().includes(q) ||
        m.interpretLayer.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createProbe(input: {
  packId: string;
  label: string;
  kind: ProbeKind;
  embeddingAxis: string;
  interpretLayer: string;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): ProbeConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const probe: ProbeConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    embeddingAxis: input.embeddingAxis,
    interpretLayer: input.interpretLayer,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().probes.unshift(probe);
  audit("evaluator", "probe.create", probe.label);
  return probe;
}

export function archiveProbe(id: string): ProbeConfig | null {
  const probe = state().probes.find((m) => m.id === id);
  if (!probe) return null;
  probe.status = "archived";
  audit("evaluator", "probe.archive", id);
  return probe;
}

export function listMechanisms(opts?: {
  q?: string;
  pathwayChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: MechanismLink[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().mechanisms];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.mechanismText.toLowerCase().includes(q) ||
        c.pathwayChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.pathwayChannel) {
    items = items.filter((c) => c.pathwayChannel === opts.pathwayChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createMechanism(input: {
  packId?: string;
  label: string;
  mechanismText: string;
  successCondition: string;
  pathwayChannel: string;
  notes?: string;
}): MechanismLink {
  const mechanism: MechanismLink = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    mechanismText: input.mechanismText,
    successCondition: input.successCondition,
    pathwayChannel: input.pathwayChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().mechanisms.unshift(mechanism);
  audit("evaluator", "mechanism.create", mechanism.label);
  return mechanism;
}

export function archiveMechanism(id: string): MechanismLink | null {
  const mechanism = state().mechanisms.find((c) => c.id === id);
  if (!mechanism) return null;
  mechanism.status = "archived";
  audit("evaluator", "mechanism.archive", id);
  return mechanism;
}

export function listRuns(opts?: {
  mechanismId?: string;
  probeId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: VariantRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.mechanismId) {
    items = items.filter((r) => r.mechanismId === opts.mechanismId);
  }
  if (opts?.probeId) {
    items = items.filter((r) => r.probeId === opts.probeId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  mechanismId: string;
  probeId: string;
  panelCoverage: number;
  probeFidelity: number;
  mechanismClarity: number;
  runStability: number;
  reviewerNotes?: string;
}): VariantRun | null {
  if (!state().mechanisms.some((c) => c.id === input.mechanismId)) {
    return null;
  }
  if (!state().probes.some((m) => m.id === input.probeId)) return null;
  const run: VariantRun = {
    id: randomUUID(),
    mechanismId: input.mechanismId,
    probeId: input.probeId,
    panelCoverage: clamp(input.panelCoverage, 0, 1),
    probeFidelity: clamp(input.probeFidelity, 0, 1),
    mechanismClarity: clamp(input.mechanismClarity, 0, 1),
    runStability: clamp(input.runStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const mechanism = state().mechanisms.find((c) => c.id === input.mechanismId);
  if (mechanism) mechanism.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ProbeCompare[] {
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
  mechanismId: string;
  probeId: string;
  runId: string;
  probeBias?: ProbeBias;
  bias?: ProbeBias;
  opaqueBaselineRate?: number;
  skipOptimism?: number;
  mechanismHardness?: number;
  overclaimRisk?: number;
}): ProbeCompare | null {
  const mechanism = state().mechanisms.find((c) => c.id === input.mechanismId);
  const probe = state().probes.find((m) => m.id === input.probeId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!mechanism || !probe || !run) return null;

  const goldWeight = outcomeWeight(String(mechanism.successCondition));
  const span = Math.max(0.05, probe.coverageMax - probe.coverageMin);
  const probeInput: ProbeInput = {
    panelCoverage: clamp(run.panelCoverage, 0, 1),
    probeFidelity: clamp(run.probeFidelity, 0, 1),
    mechanismClarity: clamp(run.mechanismClarity, 0, 1),
    runStability: clamp((run.runStability + goldWeight) / 2, 0, 1),
    opaqueBaselineRate: input.opaqueBaselineRate ?? 0.82,
    skipOptimism: input.skipOptimism ?? 0.7,
    mechanismHardness:
      input.mechanismHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    probeBias: input.probeBias ?? input.bias ?? state().org.defaultProbeBias,
    profile: "interpretable_fm_probe",
  };

  const interpretableFmProbe = scoreInterpretableFmProbe({
    ...probeInput,
    profile: "interpretable_fm_probe",
  });
  const opaquePathogenicity = scoreOpaquePathogenicity({
    ...probeInput,
    profile: "opaque_pathogenicity_baseline",
  });
  const gap = Math.abs(
    interpretableFmProbe.overall - opaquePathogenicity.overall,
  );
  let winner: ProbeCompare["winner"] = "tie";
  if (interpretableFmProbe.overall > opaquePathogenicity.overall + 0.5) {
    winner = "interpretable_fm_probe";
  } else if (opaquePathogenicity.overall > interpretableFmProbe.overall + 0.5) {
    winner = "opaque_pathogenicity_baseline";
  }

  const compare: ProbeCompare = {
    id: randomUUID(),
    name: input.name,
    mechanismId: mechanism.id,
    probeId: probe.id,
    runId: run.id,
    input: probeInput,
    interpretableFmProbe,
    opaquePathogenicity,
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

export function getScoreboard(): ProbeCompare[] {
  return [...state().compares].sort(
    (a, b) =>
      b.interpretableFmProbe.overall - a.interpretableFmProbe.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      probes: state().probes,
      mechanisms: state().mechanisms,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,probeOverall,opaqueOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.interpretableFmProbe.overall},${c.opaquePathogenicity.overall},${c.createdAt}`,
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
    { id: "panel-packs", name: "Panel pack registry" },
    { id: "pack-versions", name: "Versioned panel packs" },
    { id: "probe-configs", name: "Probe-config definitions" },
    { id: "probe-editor", name: "Embedding / layer editor" },
    { id: "probe-search", name: "Probe search and filter" },
    { id: "seed-packs", name: "Seed panel packs" },
    { id: "mechanism-links", name: "Mechanism-link workspace" },
    { id: "mechanism-filters", name: "Mechanism filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "variant-runs", name: "Variant soft-sim runs" },
    { id: "probe-bias", name: "Probe bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Interpretable vs opaque compare" },
    { id: "delta-view", name: "Probe delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not diagnostic / not live LIMS notes" },
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

export function scorePreview(input: ProbeInput): {
  interpretableFmProbe: ProbeQuality;
  opaquePathogenicity: ProbeQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const interpretableFmProbe = scoreInterpretableFmProbe({
    ...input,
    profile: "interpretable_fm_probe",
  });
  const opaquePathogenicity = scoreOpaquePathogenicity({
    ...input,
    profile: "opaque_pathogenicity_baseline",
  });
  return {
    interpretableFmProbe,
    opaquePathogenicity,
    readiness: readinessFromQuality(interpretableFmProbe.overall),
  };
}
