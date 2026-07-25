import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scorePriorsInformedTransformer,
  scorePriorsFreeOmicsBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type PriorKind,
  type PriorBias,
  type ScoreMode,
  type OmicPriorInput,
  type OmicPriorQuality,
} from "./domain/types";

export type {
  PriorKind,
  PriorBias,
  ScoreMode,
  OmicPriorInput,
  OmicPriorQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type OmicPack = {
  id: string;
  label: string;
  version: string;
  riskFocus: string;
  traitBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type PriorStatus = "draft" | "active" | "archived";

export type PriorSet = {
  id: string;
  packId: string;
  label: string;
  kind: PriorKind;
  priorHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: PriorStatus;
  notes: string;
  createdAt: string;
};

export type TraitStatus = "draft" | "open" | "scored" | "archived";

export type TraitPanel = {
  id: string;
  packId?: string;
  label: string;
  panel: string;
  lockCondition: string;
  assayChannel: string;
  status: TraitStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type OmicRun = {
  id: string;
  traitPanelId: string;
  priorSetId: string;
  priorCoverage: number;
  transformerFidelity: number;
  traitGrounding: number;
  packCompleteness: number;
  runNotes: string;
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
  defaultPriorBias: PriorBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type OmicPriorCompare = {
  id: string;
  name: string;
  traitPanelId: string;
  priorSetId: string;
  runId: string;
  input: OmicPriorInput;
  priorsInformed: OmicPriorQuality;
  priorsFree: OmicPriorQuality;
  winner:
    | "priors_informed_transformer"
    | "priors_free_omics_baseline"
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
  packs: OmicPack[];
  priors: PriorSet[];
  traits: TraitPanel[];
  runs: OmicRun[];
  audits: AuditEvent[];
  compares: OmicPriorCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __omicPriorStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const priorSetId = "prior-demo";
  const traitPanelId = "trait-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Omic Prior Org",
      webhookUrl: "",
      webhookSecret: "omic-prior-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPriorBias: "balanced",
      defaultMode: "priors_informed_transformer",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@omic-prior.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Disease + Complex Trait Soft-Sim Pack",
        version: "2026.1",
        riskFocus:
          "Priors-informed transformer soft-sim vs priors-free omics baseline",
        traitBudget: 36,
        status: "active",
        notes:
          "Seed pack for priors-informed transformer vs priors-free baseline soft-sim",
        createdAt: now(),
      },
    ],
    priors: [
      {
        id: priorSetId,
        packId,
        label: "Pathway + eQTL prior set",
        kind: "pathway_graph",
        priorHint:
          "prior_coverage,trait_grounding,transformer_fidelity,pack_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Prior, trait grounding, fidelity, and completeness for omic soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim prior set — not diagnostic / not OmicFormer / not live EHR write-back",
        createdAt: now(),
      },
    ],
    traits: [
      {
        id: traitPanelId,
        packId,
        label: "Complex trait panel",
        panel:
          "Comparative multi-omics soft-sim (priors-informed vs priors-free)",
        lockCondition: "lock_soft_sim",
        assayChannel: "soft_sim_omic_prior_signal",
        status: "scored",
        notes: "Seed traits for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        traitPanelId,
        priorSetId,
        priorCoverage: 0.62,
        transformerFidelity: 0.7,
        traitGrounding: 0.74,
        packCompleteness: 0.68,
        runNotes:
          "Priors-informed pack looks strong but priors-free baseline still leads on hard traits",
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
        detail: "Demo pack, priors, traits, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__omicPriorStore) g.__omicPriorStore = seed();
  return g.__omicPriorStore;
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
  g.__omicPriorStore = seed();
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
  if (patch.defaultPriorBias !== undefined) {
    org.defaultPriorBias = patch.defaultPriorBias;
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
  items: OmicPack[];
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
        p.riskFocus.toLowerCase().includes(q) ||
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
  riskFocus: string;
  traitBudget?: number;
  notes?: string;
}): OmicPack {
  const pack: OmicPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    riskFocus: input.riskFocus,
    traitBudget: input.traitBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): OmicPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listPriors(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PriorSet[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().priors];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.priorHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPrior(input: {
  packId: string;
  label: string;
  kind: PriorKind;
  priorHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): PriorSet | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: PriorSet = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    priorHint: input.priorHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().priors.unshift(row);
  audit("evaluator", "prior.create", row.label);
  return row;
}

export function archivePrior(id: string): PriorSet | null {
  const row = state().priors.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "prior.archive", id);
  return row;
}

export function listTraits(opts?: {
  q?: string;
  assayChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TraitPanel[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().traits];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.panel.toLowerCase().includes(q) ||
        c.assayChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.assayChannel) {
    items = items.filter((c) => c.assayChannel === opts.assayChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTrait(input: {
  packId?: string;
  label: string;
  panel: string;
  lockCondition: string;
  assayChannel: string;
  notes?: string;
}): TraitPanel {
  const row: TraitPanel = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    panel: input.panel,
    lockCondition: input.lockCondition,
    assayChannel: input.assayChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().traits.unshift(row);
  audit("evaluator", "trait.create", row.label);
  return row;
}

export function archiveTrait(id: string): TraitPanel | null {
  const row = state().traits.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "trait.archive", id);
  return row;
}

export function listRuns(opts?: {
  traitPanelId?: string;
  priorSetId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: OmicRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.traitPanelId) {
    items = items.filter((r) => r.traitPanelId === opts.traitPanelId);
  }
  if (opts?.priorSetId) {
    items = items.filter((r) => r.priorSetId === opts.priorSetId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  traitPanelId: string;
  priorSetId: string;
  priorCoverage: number;
  transformerFidelity: number;
  traitGrounding: number;
  packCompleteness: number;
  runNotes?: string;
}): OmicRun | null {
  if (!state().traits.some((c) => c.id === input.traitPanelId)) {
    return null;
  }
  if (!state().priors.some((m) => m.id === input.priorSetId)) {
    return null;
  }
  const run: OmicRun = {
    id: randomUUID(),
    traitPanelId: input.traitPanelId,
    priorSetId: input.priorSetId,
    priorCoverage: clamp(input.priorCoverage, 0, 1),
    transformerFidelity: clamp(input.transformerFidelity, 0, 1),
    traitGrounding: clamp(input.traitGrounding, 0, 1),
    packCompleteness: clamp(input.packCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().traits.find((c) => c.id === input.traitPanelId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): OmicPriorCompare[] {
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
  traitPanelId: string;
  priorSetId: string;
  runId: string;
  priorBias?: PriorBias;
  bias?: PriorBias;
  baselineConfidence?: number;
  baselineOptimism?: number;
  traitHardness?: number;
  overclaimRisk?: number;
}): OmicPriorCompare | null {
  const trait = state().traits.find((c) => c.id === input.traitPanelId);
  const prior = state().priors.find((m) => m.id === input.priorSetId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!trait || !prior || !run) return null;

  const goldWeight = outcomeWeight(String(trait.lockCondition));
  const span = Math.max(0.05, prior.hardnessMax - prior.hardnessMin);
  const omicInput: OmicPriorInput = {
    priorCoverage: clamp(run.priorCoverage, 0, 1),
    transformerFidelity: clamp(run.transformerFidelity, 0, 1),
    traitGrounding: clamp(run.traitGrounding, 0, 1),
    packCompleteness: clamp(
      (run.packCompleteness + goldWeight) / 2,
      0,
      1,
    ),
    baselineConfidence: input.baselineConfidence ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    traitHardness: input.traitHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    priorBias: input.priorBias ?? input.bias ?? state().org.defaultPriorBias,
    profile: "priors_informed_transformer",
  };

  const priorsInformed = scorePriorsInformedTransformer({
    ...omicInput,
    profile: "priors_informed_transformer",
  });
  const priorsFree = scorePriorsFreeOmicsBaseline({
    ...omicInput,
    profile: "priors_free_omics_baseline",
  });
  const gap = Math.abs(priorsInformed.overall - priorsFree.overall);
  let winner: OmicPriorCompare["winner"] = "tie";
  if (priorsInformed.overall > priorsFree.overall + 0.5) {
    winner = "priors_informed_transformer";
  } else if (priorsFree.overall > priorsInformed.overall + 0.5) {
    winner = "priors_free_omics_baseline";
  }

  const compare: OmicPriorCompare = {
    id: randomUUID(),
    name: input.name,
    traitPanelId: trait.id,
    priorSetId: prior.id,
    runId: run.id,
    input: omicInput,
    priorsInformed,
    priorsFree,
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

export function getScoreboard(): OmicPriorCompare[] {
  return [...state().compares].sort(
    (a, b) => b.priorsInformed.overall - a.priorsInformed.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      priors: state().priors,
      traits: state().traits,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,priorsInformedOverall,priorsFreeOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.priorsInformed.overall},${c.priorsFree.overall},${c.createdAt}`,
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
    { id: "omic-packs", name: "Omic pack registry" },
    { id: "pack-versions", name: "Versioned omic packs" },
    { id: "priors", name: "Statistical prior configs" },
    { id: "prior-editor", name: "Prior set / case editor" },
    { id: "prior-search", name: "Prior search and filter" },
    { id: "seed-packs", name: "Seed omic packs" },
    { id: "traits", name: "Trait panel registry" },
    { id: "trait-filters", name: "Trait panel filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "omic-runs", name: "Omic soft-sim runs" },
    { id: "prior-bias", name: "Prior bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Priors-informed transformer vs priors-free baseline compare",
    },
    { id: "delta-view", name: "Omic prior delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not diagnostic / not live EHR / not FDA / not OmicFormer / not authors' system",
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

export function scorePreview(input: OmicPriorInput): {
  priorsInformed: OmicPriorQuality;
  priorsFree: OmicPriorQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const priorsInformed = scorePriorsInformedTransformer({
    ...input,
    profile: "priors_informed_transformer",
  });
  const priorsFree = scorePriorsFreeOmicsBaseline({
    ...input,
    profile: "priors_free_omics_baseline",
  });
  return {
    priorsInformed,
    priorsFree,
    readiness: readinessFromQuality(priorsInformed.overall),
  };
}
