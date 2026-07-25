import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreEntropyConstrained,
  scoreFullRateBaseline,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type KineticsBias,
  type KineticsInput,
  type KineticsQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  KineticsBias,
  KineticsInput,
  KineticsQuality,
  OutcomeLabel,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ChemistryPack = {
  id: string;
  label: string;
  version: string;
  mechanismFamily: string;
  speciesCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type RateStatus = "draft" | "active" | "archived";

export type RateTable = {
  id: string;
  packId: string;
  label: string;
  reactionCount: number;
  species: string[];
  surrogateWeight: number;
  fullRateWeight: number;
  status: RateStatus;
  notes: string;
  createdAt: string;
};

export type SurrogateStatus = "draft" | "open" | "scored" | "archived";

export type SurrogateConfig = {
  id: string;
  packId?: string;
  label: string;
  surrogateSummary: string;
  successCondition: OutcomeLabel | string;
  simChannel: string;
  status: SurrogateStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type KineticsRun = {
  id: string;
  surrogateId: string;
  rateTableId: string;
  rateCoverage: number;
  entropyConfidence: number;
  mechanismConfidence: number;
  rateAgreement: number;
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
  defaultKineticsBias: KineticsBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type KineticsCompare = {
  id: string;
  name: string;
  surrogateId: string;
  rateTableId: string;
  kineticsRunId: string;
  input: KineticsInput;
  entropyConstrained: KineticsQuality;
  fullRateBaseline: KineticsQuality;
  winner: "entropy_constrained" | "full_rate_baseline" | "tie";
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
  packs: ChemistryPack[];
  rateTables: RateTable[];
  surrogates: SurrogateConfig[];
  kineticsRuns: KineticsRun[];
  audits: AuditEntry[];
  compares: KineticsCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __ksStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const rateTableId = "rate-demo";
  const surrogateId = "surrogate-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Kinetics Surrogate Org",
      webhookUrl: "",
      webhookSecret: "ks-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultKineticsBias: "balanced",
      defaultMode: "entropy_constrained",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "combustion-lead@kinetics-surrogate.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "GRI-Mech Soft-Sim Pack",
        version: "2026.1",
        mechanismFamily: "Hydrocarbon oxidation (soft-sim)",
        speciesCount: 53,
        status: "active",
        notes: "Seed pack for demo entropy-constrained compare",
        createdAt: now(),
      },
    ],
    rateTables: [
      {
        id: rateTableId,
        packId,
        label: "Primary oxidation rate table",
        reactionCount: 325,
        species: ["CH4", "O2", "CO2", "H2O", "N2"],
        surrogateWeight: 0.62,
        fullRateWeight: 0.38,
        status: "active",
        notes: "Soft-sim rates without certified CFD claim",
        createdAt: now(),
      },
    ],
    surrogates: [
      {
        id: surrogateId,
        packId,
        label: "Entropy-constrained ML surrogate",
        surrogateSummary:
          "Soft-sim entropy-constrained kinetics surrogate vs full-rate baseline for turbulent combustion packs.",
        successCondition: "kinetics_positive",
        simChannel: "soft_sim_kinetics",
        status: "scored",
        notes: "Seed surrogate for demo compare",
        createdAt: now(),
      },
    ],
    kineticsRuns: [
      {
        id: runId,
        surrogateId,
        rateTableId,
        rateCoverage: 0.58,
        entropyConfidence: 0.7,
        mechanismConfidence: 0.74,
        rateAgreement: 0.68,
        reviewerNotes:
          "Entropy cues look informative but full-rate alone is stiff under soft-sim load",
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
        detail: "Demo pack, rate table, surrogate, and kinetics run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__ksStore) g.__ksStore = seed();
  return g.__ksStore;
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
  g.__ksStore = seed();
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
  if (patch.defaultKineticsBias !== undefined) {
    org.defaultKineticsBias = patch.defaultKineticsBias;
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
  items: ChemistryPack[];
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
        p.mechanismFamily.toLowerCase().includes(q) ||
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
  mechanismFamily: string;
  speciesCount?: number;
  notes?: string;
}): ChemistryPack {
  const pack: ChemistryPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    mechanismFamily: input.mechanismFamily,
    speciesCount: input.speciesCount ?? 50,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ChemistryPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listRateTables(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: RateTable[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().rateTables];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.species.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRateTable(input: {
  packId: string;
  label: string;
  species: string[];
  reactionCount: number;
  surrogateWeight: number;
  fullRateWeight?: number;
  notes?: string;
}): RateTable | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const rateTable: RateTable = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    species: input.species,
    reactionCount: Math.max(0, Math.floor(input.reactionCount)),
    surrogateWeight: clamp(input.surrogateWeight, 0, 1),
    fullRateWeight: clamp(
      input.fullRateWeight ?? 1 - input.surrogateWeight,
      0,
      1,
    ),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().rateTables.unshift(rateTable);
  audit("evaluator", "rate_table.create", rateTable.label);
  return rateTable;
}

export function archiveRateTable(id: string): RateTable | null {
  const rateTable = state().rateTables.find((m) => m.id === id);
  if (!rateTable) return null;
  rateTable.status = "archived";
  audit("evaluator", "rate_table.archive", id);
  return rateTable;
}

export function listSurrogates(opts?: {
  q?: string;
  simChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SurrogateConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().surrogates];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.surrogateSummary.toLowerCase().includes(q) ||
        c.simChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.simChannel) {
    items = items.filter((c) => c.simChannel === opts.simChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSurrogate(input: {
  packId?: string;
  label: string;
  surrogateSummary: string;
  successCondition: string;
  simChannel: string;
  notes?: string;
}): SurrogateConfig {
  const surrogate: SurrogateConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    surrogateSummary: input.surrogateSummary,
    successCondition: input.successCondition,
    simChannel: input.simChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().surrogates.unshift(surrogate);
  audit("evaluator", "surrogate.create", surrogate.label);
  return surrogate;
}

export function archiveSurrogate(id: string): SurrogateConfig | null {
  const surrogate = state().surrogates.find((c) => c.id === id);
  if (!surrogate) return null;
  surrogate.status = "archived";
  audit("evaluator", "surrogate.archive", id);
  return surrogate;
}

export function listKineticsRuns(opts?: {
  surrogateId?: string;
  rateTableId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: KineticsRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().kineticsRuns];
  if (opts?.surrogateId) {
    items = items.filter((r) => r.surrogateId === opts.surrogateId);
  }
  if (opts?.rateTableId) {
    items = items.filter((r) => r.rateTableId === opts.rateTableId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createKineticsRun(input: {
  surrogateId: string;
  rateTableId: string;
  rateCoverage: number;
  entropyConfidence: number;
  mechanismConfidence: number;
  rateAgreement: number;
  reviewerNotes?: string;
}): KineticsRun | null {
  if (!state().surrogates.some((c) => c.id === input.surrogateId)) return null;
  if (!state().rateTables.some((m) => m.id === input.rateTableId)) return null;
  const run: KineticsRun = {
    id: randomUUID(),
    surrogateId: input.surrogateId,
    rateTableId: input.rateTableId,
    rateCoverage: clamp(input.rateCoverage, 0, 1),
    entropyConfidence: clamp(input.entropyConfidence, 0, 1),
    mechanismConfidence: clamp(input.mechanismConfidence, 0, 1),
    rateAgreement: clamp(input.rateAgreement, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().kineticsRuns.unshift(run);
  const surrogate = state().surrogates.find((c) => c.id === input.surrogateId);
  if (surrogate) surrogate.status = "scored";
  audit("evaluator", "kinetics_run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): KineticsCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "negative":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "positive":
    case "kinetics_positive":
      return 0.7;
    case "critical":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  surrogateId: string;
  rateTableId: string;
  kineticsRunId: string;
  kineticsBias?: KineticsBias;
  bias?: KineticsBias;
  fullRateAccuracy?: number;
  unconstrainedOptimism?: number;
  stiffnessHardness?: number;
  leakageRisk?: number;
}): KineticsCompare | null {
  const surrogate = state().surrogates.find((c) => c.id === input.surrogateId);
  const rateTable = state().rateTables.find((m) => m.id === input.rateTableId);
  const run = state().kineticsRuns.find((r) => r.id === input.kineticsRunId);
  if (!surrogate || !rateTable || !run) return null;

  const goldWeight = outcomeWeight(String(surrogate.successCondition));
  const ksInput: KineticsInput = {
    rateCoverage: clamp(run.rateCoverage, 0, 1),
    entropyFidelity: clamp(run.entropyConfidence, 0, 1),
    mechanismFit: clamp(run.mechanismConfidence, 0, 1),
    rateAgreement: clamp((run.rateAgreement + goldWeight) / 2, 0, 1),
    fullRateAccuracy: input.fullRateAccuracy ?? 0.82,
    unconstrainedOptimism: input.unconstrainedOptimism ?? 0.7,
    stiffnessHardness:
      input.stiffnessHardness ??
      clamp(1 - rateTable.surrogateWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(rateTable.reactionCount > 500 ? 0.55 : 0.28, 0, 1),
    kineticsBias:
      input.kineticsBias ?? input.bias ?? state().org.defaultKineticsBias,
    profile: "entropy_constrained",
  };

  const entropyConstrained = scoreEntropyConstrained({
    ...ksInput,
    profile: "entropy_constrained",
  });
  const fullRateBaseline = scoreFullRateBaseline({
    ...ksInput,
    profile: "full_rate_baseline",
  });
  const gap = Math.abs(entropyConstrained.overall - fullRateBaseline.overall);
  let winner: KineticsCompare["winner"] = "tie";
  if (entropyConstrained.overall > fullRateBaseline.overall + 0.5) {
    winner = "entropy_constrained";
  } else if (fullRateBaseline.overall > entropyConstrained.overall + 0.5) {
    winner = "full_rate_baseline";
  }

  const compare: KineticsCompare = {
    id: randomUUID(),
    name: input.name,
    surrogateId: surrogate.id,
    rateTableId: rateTable.id,
    kineticsRunId: run.id,
    input: ksInput,
    entropyConstrained,
    fullRateBaseline,
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

export function getScoreboard(): KineticsCompare[] {
  return [...state().compares].sort(
    (a, b) => b.entropyConstrained.overall - a.entropyConstrained.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      rateTables: state().rateTables,
      surrogates: state().surrogates,
      kineticsRuns: state().kineticsRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,entropyOverall,fullRateOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.entropyConstrained.overall},${c.fullRateBaseline.overall},${c.createdAt}`,
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
    { id: "chemistry-packs", name: "Chemistry pack registry" },
    { id: "pack-versions", name: "Versioned chemistry packs" },
    { id: "rate-tables", name: "Rate table registry" },
    { id: "rate-editor", name: "Surrogate vs full-rate weight editor" },
    { id: "rate-search", name: "Rate table search and filter" },
    { id: "seed-packs", name: "Seed chemistry packs" },
    { id: "surrogates", name: "Surrogate config workspace" },
    { id: "surrogate-filters", name: "Surrogate config filters" },
    { id: "success-conditions", name: "Kinetics success conditions" },
    { id: "kinetics-runs", name: "Kinetics soft-sim runs" },
    { id: "kinetics-bias", name: "Kinetics bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Entropy surrogate vs full-rate compare" },
    { id: "delta-view", name: "Kinetics delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-CFD notes" },
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

export function scorePreview(input: KineticsInput): {
  entropyConstrained: KineticsQuality;
  fullRateBaseline: KineticsQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const entropyConstrained = scoreEntropyConstrained({
    ...input,
    profile: "entropy_constrained",
  });
  const fullRateBaseline = scoreFullRateBaseline({
    ...input,
    profile: "full_rate_baseline",
  });
  return {
    entropyConstrained,
    fullRateBaseline,
    readiness: readinessFromQuality(entropyConstrained.overall),
  };
}
