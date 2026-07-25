import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreClinicalReasoning,
  scoreNonReasoningBaseline,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type HccBias,
  type HccInput,
  type HccQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  HccBias,
  HccInput,
  HccQuality,
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

export type PathwayPack = {
  id: string;
  label: string;
  version: string;
  pathwayScope: string;
  caseCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SchemaStatus = "draft" | "active" | "archived";

export type RiskSchema = {
  id: string;
  packId: string;
  label: string;
  cueCount: number;
  cues: string[];
  reasoningWeight: number;
  baselineWeight: number;
  status: SchemaStatus;
  notes: string;
  createdAt: string;
};

export type ReasonerStatus = "draft" | "open" | "scored" | "archived";

export type ReasonerConfig = {
  id: string;
  packId?: string;
  label: string;
  reasonerSummary: string;
  successCondition: OutcomeLabel | string;
  reasonerChannel: string;
  status: ReasonerStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type HccRun = {
  id: string;
  reasonerId: string;
  schemaId: string;
  pathwayCoverage: number;
  cueConfidence: number;
  schemaConfidence: number;
  reasoningDepth: number;
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
  defaultHccBias: HccBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type HccCompare = {
  id: string;
  name: string;
  reasonerId: string;
  schemaId: string;
  runId: string;
  input: HccInput;
  clinicalReasoning: HccQuality;
  nonReasoningBaseline: HccQuality;
  winner: "clinical_reasoning" | "non_reasoning_baseline" | "tie";
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
  packs: PathwayPack[];
  schemas: RiskSchema[];
  reasoners: ReasonerConfig[];
  runs: HccRun[];
  audits: AuditEntry[];
  compares: HccCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __hccStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const schemaId = "schema-demo";
  const reasonerId = "reasoner-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "HCC Reason Org",
      webhookUrl: "",
      webhookSecret: "hcc-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultHccBias: "balanced",
      defaultMode: "clinical_reasoning",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "hep-lead@hcc-reason.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "HCC Soft-Sim Pathway Pack",
        version: "2026.1",
        pathwayScope: "Adult HCC risk pathway (soft-sim)",
        caseCount: 2400,
        status: "active",
        notes: "Seed pack for demo clinical-reasoning vs baseline compare",
        createdAt: now(),
      },
    ],
    schemas: [
      {
        id: schemaId,
        packId,
        label: "HCC risk cue schema",
        cueCount: 8,
        cues: [
          "AFP trend",
          "Lesion size",
          "Vascular invasion cue",
          "Child-Pugh class",
          "MELD proxy",
          "Prior ablation",
          "Imaging LI-RADS cue",
          "Comorbidity load",
        ],
        reasoningWeight: 0.62,
        baselineWeight: 0.38,
        status: "active",
        notes: "Soft-sim schema without CDS claim",
        createdAt: now(),
      },
    ],
    reasoners: [
      {
        id: reasonerId,
        packId,
        label: "Clinical reasoner ring",
        reasonerSummary:
          "Soft-sim clinical-reasoning LLM HCC risk vs non-reasoning baseline.",
        successCondition: "elevated",
        reasonerChannel: "soft_sim_reasoner",
        status: "scored",
        notes: "Seed reasoner for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        reasonerId,
        schemaId,
        pathwayCoverage: 0.58,
        cueConfidence: 0.7,
        schemaConfidence: 0.74,
        reasoningDepth: 0.68,
        reviewerNotes:
          "Reasoning cues look informative but baseline alone misses atypical presentation under soft-sim load",
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
        detail: "Demo pack, schema, reasoner, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__hccStore) g.__hccStore = seed();
  return g.__hccStore;
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
  g.__hccStore = seed();
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
  if (patch.defaultHccBias !== undefined) {
    org.defaultHccBias = patch.defaultHccBias;
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
  items: PathwayPack[];
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
        p.pathwayScope.toLowerCase().includes(q) ||
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
  pathwayScope: string;
  caseCount?: number;
  notes?: string;
}): PathwayPack {
  const pack: PathwayPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    pathwayScope: input.pathwayScope,
    caseCount: input.caseCount ?? 1000,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): PathwayPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listSchemas(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: RiskSchema[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().schemas];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.cues.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSchema(input: {
  packId: string;
  label: string;
  cues: string[];
  cueCount: number;
  reasoningWeight: number;
  baselineWeight?: number;
  notes?: string;
}): RiskSchema | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const schema: RiskSchema = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    cues: input.cues,
    cueCount: Math.max(0, Math.floor(input.cueCount)),
    reasoningWeight: clamp(input.reasoningWeight, 0, 1),
    baselineWeight: clamp(
      input.baselineWeight ?? 1 - input.reasoningWeight,
      0,
      1,
    ),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().schemas.unshift(schema);
  audit("evaluator", "schema.create", schema.label);
  return schema;
}

export function archiveSchema(id: string): RiskSchema | null {
  const schema = state().schemas.find((m) => m.id === id);
  if (!schema) return null;
  schema.status = "archived";
  audit("evaluator", "schema.archive", id);
  return schema;
}

export function listReasoners(opts?: {
  q?: string;
  reasonerChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ReasonerConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().reasoners];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.reasonerSummary.toLowerCase().includes(q) ||
        c.reasonerChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.reasonerChannel) {
    items = items.filter((c) => c.reasonerChannel === opts.reasonerChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createReasoner(input: {
  packId?: string;
  label: string;
  reasonerSummary: string;
  successCondition: string;
  reasonerChannel: string;
  notes?: string;
}): ReasonerConfig {
  const reasoner: ReasonerConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    reasonerSummary: input.reasonerSummary,
    successCondition: input.successCondition,
    reasonerChannel: input.reasonerChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().reasoners.unshift(reasoner);
  audit("evaluator", "reasoner.create", reasoner.label);
  return reasoner;
}

export function archiveReasoner(id: string): ReasonerConfig | null {
  const reasoner = state().reasoners.find((c) => c.id === id);
  if (!reasoner) return null;
  reasoner.status = "archived";
  audit("evaluator", "reasoner.archive", id);
  return reasoner;
}

export function listRuns(opts?: {
  reasonerId?: string;
  schemaId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: HccRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.reasonerId) {
    items = items.filter((r) => r.reasonerId === opts.reasonerId);
  }
  if (opts?.schemaId) {
    items = items.filter((r) => r.schemaId === opts.schemaId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  reasonerId: string;
  schemaId: string;
  pathwayCoverage: number;
  cueConfidence: number;
  schemaConfidence: number;
  reasoningDepth: number;
  reviewerNotes?: string;
}): HccRun | null {
  if (!state().reasoners.some((c) => c.id === input.reasonerId)) {
    return null;
  }
  if (!state().schemas.some((m) => m.id === input.schemaId)) return null;
  const run: HccRun = {
    id: randomUUID(),
    reasonerId: input.reasonerId,
    schemaId: input.schemaId,
    pathwayCoverage: clamp(input.pathwayCoverage, 0, 1),
    cueConfidence: clamp(input.cueConfidence, 0, 1),
    schemaConfidence: clamp(input.schemaConfidence, 0, 1),
    reasoningDepth: clamp(input.reasoningDepth, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const reasoner = state().reasoners.find((c) => c.id === input.reasonerId);
  if (reasoner) reasoner.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): HccCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "low_risk":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "elevated":
      return 0.7;
    case "critical":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  reasonerId: string;
  schemaId: string;
  runId: string;
  hccBias?: HccBias;
  bias?: HccBias;
  baselineAccuracy?: number;
  shortcutOptimism?: number;
  caseHardness?: number;
  leakageRisk?: number;
}): HccCompare | null {
  const reasoner = state().reasoners.find((c) => c.id === input.reasonerId);
  const schema = state().schemas.find((m) => m.id === input.schemaId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!reasoner || !schema || !run) return null;

  const goldWeight = outcomeWeight(String(reasoner.successCondition));
  const hccInput: HccInput = {
    pathwayCoverage: clamp(run.pathwayCoverage, 0, 1),
    clinicalCueFidelity: clamp(run.cueConfidence, 0, 1),
    schemaFit: clamp(run.schemaConfidence, 0, 1),
    reasoningDepth: clamp((run.reasoningDepth + goldWeight) / 2, 0, 1),
    baselineAccuracy: input.baselineAccuracy ?? 0.82,
    shortcutOptimism: input.shortcutOptimism ?? 0.7,
    caseHardness:
      input.caseHardness ??
      clamp(1 - schema.reasoningWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ?? clamp(schema.cueCount > 12 ? 0.55 : 0.28, 0, 1),
    hccBias: input.hccBias ?? input.bias ?? state().org.defaultHccBias,
    profile: "clinical_reasoning",
  };

  const clinicalReasoning = scoreClinicalReasoning({
    ...hccInput,
    profile: "clinical_reasoning",
  });
  const nonReasoningBaseline = scoreNonReasoningBaseline({
    ...hccInput,
    profile: "non_reasoning_baseline",
  });
  const gap = Math.abs(
    clinicalReasoning.overall - nonReasoningBaseline.overall,
  );
  let winner: HccCompare["winner"] = "tie";
  if (clinicalReasoning.overall > nonReasoningBaseline.overall + 0.5) {
    winner = "clinical_reasoning";
  } else if (nonReasoningBaseline.overall > clinicalReasoning.overall + 0.5) {
    winner = "non_reasoning_baseline";
  }

  const compare: HccCompare = {
    id: randomUUID(),
    name: input.name,
    reasonerId: reasoner.id,
    schemaId: schema.id,
    runId: run.id,
    input: hccInput,
    clinicalReasoning,
    nonReasoningBaseline,
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

export function getScoreboard(): HccCompare[] {
  return [...state().compares].sort(
    (a, b) => b.clinicalReasoning.overall - a.clinicalReasoning.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      schemas: state().schemas,
      reasoners: state().reasoners,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,clinicalOverall,baselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.clinicalReasoning.overall},${c.nonReasoningBaseline.overall},${c.createdAt}`,
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
    { id: "pathway-packs", name: "Pathway pack registry" },
    { id: "pack-versions", name: "Versioned pathway packs" },
    { id: "risk-schemas", name: "Risk schema registry" },
    { id: "schema-editor", name: "Reasoning vs baseline weight editor" },
    { id: "schema-search", name: "Schema search and filter" },
    { id: "seed-packs", name: "Seed pathway packs" },
    { id: "reasoners", name: "Clinical reasoner workspace" },
    { id: "reasoner-filters", name: "Reasoner config filters" },
    { id: "success-conditions", name: "HCC risk success conditions" },
    { id: "hcc-runs", name: "HCC soft-sim runs" },
    { id: "hcc-bias", name: "HCC bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Clinical-reasoning vs baseline compare" },
    { id: "delta-view", name: "Risk delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-CDS notes" },
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

export function scorePreview(input: HccInput): {
  clinicalReasoning: HccQuality;
  nonReasoningBaseline: HccQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const clinicalReasoning = scoreClinicalReasoning({
    ...input,
    profile: "clinical_reasoning",
  });
  const nonReasoningBaseline = scoreNonReasoningBaseline({
    ...input,
    profile: "non_reasoning_baseline",
  });
  return {
    clinicalReasoning,
    nonReasoningBaseline,
    readiness: readinessFromQuality(clinicalReasoning.overall),
  };
}
