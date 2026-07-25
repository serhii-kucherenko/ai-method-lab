import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreScaffoldedAuthoring,
  scoreNaiveLinear,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AuthorBias,
  type AuthorInput,
  type AuthorQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  AuthorBias,
  AuthorInput,
  AuthorQuality,
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

export type ExperiencePack = {
  id: string;
  label: string;
  version: string;
  experienceScope: string;
  branchBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SkeletonStatus = "draft" | "active" | "archived";

export type NavSkeleton = {
  id: string;
  packId: string;
  label: string;
  nodeCount: number;
  nodes: string[];
  scaffoldWeight: number;
  linearWeight: number;
  status: SkeletonStatus;
  notes: string;
  createdAt: string;
};

export type LabelStatus = "draft" | "open" | "scored" | "archived";

export type LabelTemplate = {
  id: string;
  packId?: string;
  label: string;
  templateSummary: string;
  successCondition: OutcomeLabel | string;
  labelChannel: string;
  status: LabelStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type AuthorRun = {
  id: string;
  labelId: string;
  skeletonId: string;
  skeletonCoverage: number;
  scaffoldConfidence: number;
  labelFit: number;
  navIntegrity: number;
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
  defaultAuthorBias: AuthorBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type AuthorCompare = {
  id: string;
  name: string;
  labelId: string;
  skeletonId: string;
  runId: string;
  input: AuthorInput;
  scaffoldedAuthoring: AuthorQuality;
  naiveLinear: AuthorQuality;
  winner: "scaffolded_authoring" | "naive_linear" | "tie";
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
  packs: ExperiencePack[];
  skeletons: NavSkeleton[];
  labels: LabelTemplate[];
  runs: AuthorRun[];
  audits: AuditEntry[];
  compares: AuthorCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __skeletonStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const skeletonId = "skeleton-demo";
  const labelId = "label-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Skeleton Author Org",
      webhookUrl: "",
      webhookSecret: "skeleton-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultAuthorBias: "balanced",
      defaultMode: "scaffolded_authoring",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@skeleton-author.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Census Soft-Sim Experience Pack",
        version: "2026.1",
        experienceScope: "Non-visual census chart exploration (soft-sim)",
        branchBudget: 48,
        status: "active",
        notes: "Seed pack for demo scaffolded vs naive linear compare",
        createdAt: now(),
      },
    ],
    skeletons: [
      {
        id: skeletonId,
        packId,
        label: "Hierarchical nav skeleton",
        nodeCount: 8,
        nodes: [
          "Overview root",
          "Region branch",
          "Metric drill",
          "Compare fork",
          "Trend leaf",
          "Detail leaf",
          "Summary return",
          "Exit cue",
        ],
        scaffoldWeight: 0.62,
        linearWeight: 0.38,
        status: "active",
        notes: "Soft-sim skeleton without WCAG certification claim",
        createdAt: now(),
      },
    ],
    labels: [
      {
        id: labelId,
        packId,
        label: "Spoken label template set",
        templateSummary:
          "Soft-sim scaffolded authoring labels vs naive linear dump.",
        successCondition: "lock_soft_sim",
        labelChannel: "soft_sim_labels",
        status: "scored",
        notes: "Seed labels for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        labelId,
        skeletonId,
        skeletonCoverage: 0.58,
        scaffoldConfidence: 0.7,
        labelFit: 0.74,
        navIntegrity: 0.68,
        reviewerNotes:
          "Scaffolded path looks informative but naive linear flattens structure under soft-sim load",
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
        detail: "Demo pack, skeleton, labels, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__skeletonStore) g.__skeletonStore = seed();
  return g.__skeletonStore;
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
  g.__skeletonStore = seed();
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
  if (patch.defaultAuthorBias !== undefined) {
    org.defaultAuthorBias = patch.defaultAuthorBias;
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
  items: ExperiencePack[];
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
        p.experienceScope.toLowerCase().includes(q) ||
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
  experienceScope: string;
  branchBudget?: number;
  notes?: string;
}): ExperiencePack {
  const pack: ExperiencePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    experienceScope: input.experienceScope,
    branchBudget: input.branchBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ExperiencePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listSkeletons(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: NavSkeleton[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().skeletons];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.nodes.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSkeleton(input: {
  packId: string;
  label: string;
  nodes: string[];
  nodeCount: number;
  scaffoldWeight: number;
  linearWeight?: number;
  notes?: string;
}): NavSkeleton | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const skeleton: NavSkeleton = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    nodes: input.nodes,
    nodeCount: Math.max(0, Math.floor(input.nodeCount)),
    scaffoldWeight: clamp(input.scaffoldWeight, 0, 1),
    linearWeight: clamp(input.linearWeight ?? 1 - input.scaffoldWeight, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().skeletons.unshift(skeleton);
  audit("evaluator", "skeleton.create", skeleton.label);
  return skeleton;
}

export function archiveSkeleton(id: string): NavSkeleton | null {
  const skeleton = state().skeletons.find((m) => m.id === id);
  if (!skeleton) return null;
  skeleton.status = "archived";
  audit("evaluator", "skeleton.archive", id);
  return skeleton;
}

export function listLabels(opts?: {
  q?: string;
  labelChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: LabelTemplate[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().labels];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.templateSummary.toLowerCase().includes(q) ||
        c.labelChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.labelChannel) {
    items = items.filter((c) => c.labelChannel === opts.labelChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createLabel(input: {
  packId?: string;
  label: string;
  templateSummary: string;
  successCondition: string;
  labelChannel: string;
  notes?: string;
}): LabelTemplate {
  const label: LabelTemplate = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    templateSummary: input.templateSummary,
    successCondition: input.successCondition,
    labelChannel: input.labelChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().labels.unshift(label);
  audit("evaluator", "label.create", label.label);
  return label;
}

export function archiveLabel(id: string): LabelTemplate | null {
  const label = state().labels.find((c) => c.id === id);
  if (!label) return null;
  label.status = "archived";
  audit("evaluator", "label.archive", id);
  return label;
}

export function listRuns(opts?: {
  labelId?: string;
  skeletonId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AuthorRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.labelId) {
    items = items.filter((r) => r.labelId === opts.labelId);
  }
  if (opts?.skeletonId) {
    items = items.filter((r) => r.skeletonId === opts.skeletonId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  labelId: string;
  skeletonId: string;
  skeletonCoverage: number;
  scaffoldConfidence: number;
  labelFit: number;
  navIntegrity: number;
  reviewerNotes?: string;
}): AuthorRun | null {
  if (!state().labels.some((c) => c.id === input.labelId)) {
    return null;
  }
  if (!state().skeletons.some((m) => m.id === input.skeletonId)) return null;
  const run: AuthorRun = {
    id: randomUUID(),
    labelId: input.labelId,
    skeletonId: input.skeletonId,
    skeletonCoverage: clamp(input.skeletonCoverage, 0, 1),
    scaffoldConfidence: clamp(input.scaffoldConfidence, 0, 1),
    labelFit: clamp(input.labelFit, 0, 1),
    navIntegrity: clamp(input.navIntegrity, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const label = state().labels.find((c) => c.id === input.labelId);
  if (label) label.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): AuthorCompare[] {
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
  labelId: string;
  skeletonId: string;
  runId: string;
  authorBias?: AuthorBias;
  bias?: AuthorBias;
  linearPassRate?: number;
  flattenOptimism?: number;
  experienceHardness?: number;
  leakageRisk?: number;
}): AuthorCompare | null {
  const label = state().labels.find((c) => c.id === input.labelId);
  const skeleton = state().skeletons.find((m) => m.id === input.skeletonId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!label || !skeleton || !run) return null;

  const goldWeight = outcomeWeight(String(label.successCondition));
  const authorInput: AuthorInput = {
    skeletonCoverage: clamp(run.skeletonCoverage, 0, 1),
    scaffoldFidelity: clamp(run.scaffoldConfidence, 0, 1),
    labelFit: clamp(run.labelFit, 0, 1),
    navIntegrity: clamp((run.navIntegrity + goldWeight) / 2, 0, 1),
    linearPassRate: input.linearPassRate ?? 0.82,
    flattenOptimism: input.flattenOptimism ?? 0.7,
    experienceHardness:
      input.experienceHardness ??
      clamp(1 - skeleton.scaffoldWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ?? clamp(skeleton.nodeCount > 12 ? 0.55 : 0.28, 0, 1),
    authorBias: input.authorBias ?? input.bias ?? state().org.defaultAuthorBias,
    profile: "scaffolded_authoring",
  };

  const scaffoldedAuthoring = scoreScaffoldedAuthoring({
    ...authorInput,
    profile: "scaffolded_authoring",
  });
  const naiveLinear = scoreNaiveLinear({
    ...authorInput,
    profile: "naive_linear",
  });
  const gap = Math.abs(scaffoldedAuthoring.overall - naiveLinear.overall);
  let winner: AuthorCompare["winner"] = "tie";
  if (scaffoldedAuthoring.overall > naiveLinear.overall + 0.5) {
    winner = "scaffolded_authoring";
  } else if (naiveLinear.overall > scaffoldedAuthoring.overall + 0.5) {
    winner = "naive_linear";
  }

  const compare: AuthorCompare = {
    id: randomUUID(),
    name: input.name,
    labelId: label.id,
    skeletonId: skeleton.id,
    runId: run.id,
    input: authorInput,
    scaffoldedAuthoring,
    naiveLinear,
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

export function getScoreboard(): AuthorCompare[] {
  return [...state().compares].sort(
    (a, b) => b.scaffoldedAuthoring.overall - a.scaffoldedAuthoring.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      skeletons: state().skeletons,
      labels: state().labels,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,scaffoldedOverall,naiveOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.scaffoldedAuthoring.overall},${c.naiveLinear.overall},${c.createdAt}`,
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
    { id: "experience-packs", name: "Experience pack registry" },
    { id: "pack-versions", name: "Versioned experience packs" },
    { id: "nav-skeletons", name: "Navigation skeleton registry" },
    { id: "skeleton-editor", name: "Scaffold vs linear weight editor" },
    { id: "skeleton-search", name: "Skeleton search and filter" },
    { id: "seed-packs", name: "Seed experience packs" },
    { id: "label-templates", name: "Label template workspace" },
    { id: "label-filters", name: "Label template filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "author-runs", name: "Author soft-sim runs" },
    { id: "author-bias", name: "Author bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Scaffolded vs naive linear compare" },
    { id: "delta-view", name: "Authoring delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-WCAG notes" },
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

export function scorePreview(input: AuthorInput): {
  scaffoldedAuthoring: AuthorQuality;
  naiveLinear: AuthorQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const scaffoldedAuthoring = scoreScaffoldedAuthoring({
    ...input,
    profile: "scaffolded_authoring",
  });
  const naiveLinear = scoreNaiveLinear({
    ...input,
    profile: "naive_linear",
  });
  return {
    scaffoldedAuthoring,
    naiveLinear,
    readiness: readinessFromQuality(scaffoldedAuthoring.overall),
  };
}
