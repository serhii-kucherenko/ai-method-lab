import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreStructureOnly, scoreMeasuredLab } from "./domain/pbpk";
import {
  clamp,
  readinessFromQuality,
  round2,
  type CompoundDomain,
  type PbpkBias,
  type PbpkInput,
  type PbpkQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  CompoundDomain,
  PbpkBias,
  PbpkInput,
  PbpkQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CompoundPack = {
  id: string;
  label: string;
  version: string;
  indicationFocus: string;
  compoundBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type TopologyStatus = "draft" | "active" | "archived";

export type TopologyGraph = {
  id: string;
  packId: string;
  label: string;
  domain: CompoundDomain;
  organCount: number;
  structureWeight: number;
  topologyWeight: number;
  smilesHint: string;
  status: TopologyStatus;
  notes: string;
  createdAt: string;
};

export type AdmeStatus = "draft" | "open" | "scored" | "archived";

export type AdmeConfig = {
  id: string;
  packId?: string;
  label: string;
  admeSummary: string;
  successCondition: string;
  admeChannel: string;
  status: AdmeStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type PbpkRun = {
  id: string;
  admeId: string;
  topologyId: string;
  structureCoverage: number;
  topologyFidelity: number;
  admeClarity: number;
  compileStability: number;
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
  defaultPbpkBias: PbpkBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type PbpkCompare = {
  id: string;
  name: string;
  admeId: string;
  topologyId: string;
  runId: string;
  input: PbpkInput;
  structureOnly: PbpkQuality;
  measuredLab: PbpkQuality;
  winner: "structure_only" | "measured_lab" | "tie";
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
  packs: CompoundPack[];
  topologies: TopologyGraph[];
  admeConfigs: AdmeConfig[];
  runs: PbpkRun[];
  audits: AuditEntry[];
  compares: PbpkCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __pbpkStructureStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const topologyId = "topology-demo";
  const admeId = "adme-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "PBPK Structure Org",
      webhookUrl: "",
      webhookSecret: "pbpk-structure-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPbpkBias: "balanced",
      defaultMode: "structure_only",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@pbpk-structure.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "CNS Small-Molecule Soft-Sim Pack",
        version: "2026.1",
        indicationFocus: "CNS small molecule with structure-only PBPK",
        compoundBudget: 36,
        status: "active",
        notes: "Seed pack for structure-only vs measured-lab compare",
        createdAt: now(),
      },
    ],
    topologies: [
      {
        id: topologyId,
        packId,
        label: "Whole-body topology graph (soft-sim)",
        domain: "cns",
        organCount: 14,
        structureWeight: 0.58,
        topologyWeight: 0.42,
        smilesHint: "CC(=O)Oc1ccccc1C(=O)O",
        status: "active",
        notes: "Soft-sim topology — not regulatory filing, not live LIMS",
        createdAt: now(),
      },
    ],
    admeConfigs: [
      {
        id: admeId,
        packId,
        label: "Structure-only ADME compile config",
        admeSummary:
          "Soft-sim structure-only topology-compiled PBPK vs measured-lab baseline.",
        successCondition: "lock_soft_sim",
        admeChannel: "soft_sim_pbpk",
        status: "scored",
        notes: "Seed ADME for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        admeId,
        topologyId,
        structureCoverage: 0.62,
        topologyFidelity: 0.7,
        admeClarity: 0.74,
        compileStability: 0.68,
        reviewerNotes:
          "Structure-only path looks informative but lab baseline drifts under sparse early PK",
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
        detail: "Demo pack, topology, ADME, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pbpkStructureStore) g.__pbpkStructureStore = seed();
  return g.__pbpkStructureStore;
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
  g.__pbpkStructureStore = seed();
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
  if (patch.defaultPbpkBias !== undefined) {
    org.defaultPbpkBias = patch.defaultPbpkBias;
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
  items: CompoundPack[];
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
        p.indicationFocus.toLowerCase().includes(q) ||
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
  indicationFocus: string;
  compoundBudget?: number;
  notes?: string;
}): CompoundPack {
  const pack: CompoundPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    indicationFocus: input.indicationFocus,
    compoundBudget: input.compoundBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CompoundPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listTopologies(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TopologyGraph[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().topologies];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q) ||
        m.smilesHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTopology(input: {
  packId: string;
  label: string;
  domain: CompoundDomain;
  organCount: number;
  structureWeight: number;
  topologyWeight?: number;
  smilesHint?: string;
  notes?: string;
}): TopologyGraph | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const topology: TopologyGraph = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    domain: input.domain,
    organCount: Math.max(1, Math.floor(input.organCount)),
    structureWeight: clamp(input.structureWeight, 0, 1),
    topologyWeight: clamp(
      input.topologyWeight ?? 1 - input.structureWeight,
      0,
      1,
    ),
    smilesHint: input.smilesHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().topologies.unshift(topology);
  audit("evaluator", "topology.create", topology.label);
  return topology;
}

export function archiveTopology(id: string): TopologyGraph | null {
  const topology = state().topologies.find((m) => m.id === id);
  if (!topology) return null;
  topology.status = "archived";
  audit("evaluator", "topology.archive", id);
  return topology;
}

export function listAdmeConfigs(opts?: {
  q?: string;
  admeChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AdmeConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().admeConfigs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.admeSummary.toLowerCase().includes(q) ||
        c.admeChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.admeChannel) {
    items = items.filter((c) => c.admeChannel === opts.admeChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAdmeConfig(input: {
  packId?: string;
  label: string;
  admeSummary: string;
  successCondition: string;
  admeChannel: string;
  notes?: string;
}): AdmeConfig {
  const adme: AdmeConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    admeSummary: input.admeSummary,
    successCondition: input.successCondition,
    admeChannel: input.admeChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().admeConfigs.unshift(adme);
  audit("evaluator", "adme.create", adme.label);
  return adme;
}

export function archiveAdmeConfig(id: string): AdmeConfig | null {
  const adme = state().admeConfigs.find((c) => c.id === id);
  if (!adme) return null;
  adme.status = "archived";
  audit("evaluator", "adme.archive", id);
  return adme;
}

export function listRuns(opts?: {
  admeId?: string;
  topologyId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PbpkRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.admeId) {
    items = items.filter((r) => r.admeId === opts.admeId);
  }
  if (opts?.topologyId) {
    items = items.filter((r) => r.topologyId === opts.topologyId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  admeId: string;
  topologyId: string;
  structureCoverage: number;
  topologyFidelity: number;
  admeClarity: number;
  compileStability: number;
  reviewerNotes?: string;
}): PbpkRun | null {
  if (!state().admeConfigs.some((c) => c.id === input.admeId)) {
    return null;
  }
  if (!state().topologies.some((m) => m.id === input.topologyId)) return null;
  const run: PbpkRun = {
    id: randomUUID(),
    admeId: input.admeId,
    topologyId: input.topologyId,
    structureCoverage: clamp(input.structureCoverage, 0, 1),
    topologyFidelity: clamp(input.topologyFidelity, 0, 1),
    admeClarity: clamp(input.admeClarity, 0, 1),
    compileStability: clamp(input.compileStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const adme = state().admeConfigs.find((c) => c.id === input.admeId);
  if (adme) adme.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): PbpkCompare[] {
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
  admeId: string;
  topologyId: string;
  runId: string;
  pbpkBias?: PbpkBias;
  bias?: PbpkBias;
  labPassRate?: number;
  labOptimism?: number;
  topologyHardness?: number;
  overclaimRisk?: number;
}): PbpkCompare | null {
  const adme = state().admeConfigs.find((c) => c.id === input.admeId);
  const topology = state().topologies.find((m) => m.id === input.topologyId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!adme || !topology || !run) return null;

  const goldWeight = outcomeWeight(String(adme.successCondition));
  const pbpkInput: PbpkInput = {
    structureCoverage: clamp(run.structureCoverage, 0, 1),
    topologyFidelity: clamp(run.topologyFidelity, 0, 1),
    admeClarity: clamp(run.admeClarity, 0, 1),
    compileStability: clamp((run.compileStability + goldWeight) / 2, 0, 1),
    labPassRate: input.labPassRate ?? 0.82,
    labOptimism: input.labOptimism ?? 0.7,
    topologyHardness:
      input.topologyHardness ??
      clamp(1 - topology.structureWeight + 0.15, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(topology.organCount > 18 ? 0.55 : 0.28, 0, 1),
    pbpkBias: input.pbpkBias ?? input.bias ?? state().org.defaultPbpkBias,
    profile: "structure_only",
  };

  const structureOnly = scoreStructureOnly({
    ...pbpkInput,
    profile: "structure_only",
  });
  const measuredLab = scoreMeasuredLab({
    ...pbpkInput,
    profile: "measured_lab",
  });
  const gap = Math.abs(structureOnly.overall - measuredLab.overall);
  let winner: PbpkCompare["winner"] = "tie";
  if (structureOnly.overall > measuredLab.overall + 0.5) {
    winner = "structure_only";
  } else if (measuredLab.overall > structureOnly.overall + 0.5) {
    winner = "measured_lab";
  }

  const compare: PbpkCompare = {
    id: randomUUID(),
    name: input.name,
    admeId: adme.id,
    topologyId: topology.id,
    runId: run.id,
    input: pbpkInput,
    structureOnly,
    measuredLab,
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

export function getScoreboard(): PbpkCompare[] {
  return [...state().compares].sort(
    (a, b) => b.structureOnly.overall - a.structureOnly.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      topologies: state().topologies,
      admeConfigs: state().admeConfigs,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,structureOnlyOverall,measuredLabOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.structureOnly.overall},${c.measuredLab.overall},${c.createdAt}`,
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
    { id: "compound-packs", name: "Compound pack registry" },
    { id: "pack-versions", name: "Versioned compound packs" },
    { id: "topology-graphs", name: "Topology graph compile" },
    { id: "structure-editor", name: "Structure vs topology weight editor" },
    { id: "topology-search", name: "Topology search and filter" },
    { id: "seed-packs", name: "Seed compound packs" },
    { id: "adme-configs", name: "ADME config workspace" },
    { id: "adme-filters", name: "ADME filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "pbpk-runs", name: "PBPK soft-sim runs" },
    { id: "pbpk-bias", name: "PBPK bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Structure-only vs measured-lab compare" },
    { id: "delta-view", name: "PK delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-filing / not-LIMS notes" },
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

export function scorePreview(input: PbpkInput): {
  structureOnly: PbpkQuality;
  measuredLab: PbpkQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const structureOnly = scoreStructureOnly({
    ...input,
    profile: "structure_only",
  });
  const measuredLab = scoreMeasuredLab({
    ...input,
    profile: "measured_lab",
  });
  return {
    structureOnly,
    measuredLab,
    readiness: readinessFromQuality(structureOnly.overall),
  };
}
