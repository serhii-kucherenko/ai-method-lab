import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreNaiveExemplarBaseline,
  scoreOptimizedIncontextExemplars,
} from "./domain/exemplar";
import {
  clamp,
  readinessFromQuality,
  round2,
  type RoiKind,
  type ExemplarBias,
  type ScoreMode,
  type ExemplarInput,
  type ExemplarQuality,
} from "./domain/types";

export type {
  RoiKind,
  ExemplarBias,
  ScoreMode,
  ExemplarInput,
  ExemplarQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ExemplarPack = {
  id: string;
  label: string;
  version: string;
  modalityTarget: string;
  exemplarBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type RoiStatus = "draft" | "active" | "archived";

export type RoiConfig = {
  id: string;
  packId: string;
  label: string;
  kind: RoiKind;
  cues: string;
  cueCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: RoiStatus;
  notes: string;
  createdAt: string;
};

export type PromptStatus = "draft" | "open" | "scored" | "archived";

export type PromptSet = {
  id: string;
  packId?: string;
  label: string;
  promptText: string;
  successCondition: string;
  taskChannel: string;
  status: PromptStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type ExemplarRun = {
  id: string;
  promptId: string;
  roiId: string;
  localizationPrecision: number;
  coverageBreadth: number;
  exemplarDiversity: number;
  promptFit: number;
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
  defaultExemplarBias: ExemplarBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ExemplarCompare = {
  id: string;
  name: string;
  promptId: string;
  roiId: string;
  runId: string;
  input: ExemplarInput;
  optimizedIncontext: ExemplarQuality;
  naiveBaseline: ExemplarQuality;
  winner:
    | "optimized_incontext_exemplars"
    | "naive_exemplar_baseline"
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
  packs: ExemplarPack[];
  rois: RoiConfig[];
  prompts: PromptSet[];
  runs: ExemplarRun[];
  audits: AuditEntry[];
  compares: ExemplarCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __roiExemplarStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const roiId = "roi-demo";
  const promptId = "prompt-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Roi Exemplar Org",
      webhookUrl: "",
      webhookSecret: "roi-exemplar-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultExemplarBias: "balanced",
      defaultMode: "optimized_incontext_exemplars",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@roi-exemplar.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Chest CT ROI Soft-Sim Exemplar Pack",
        version: "2026.1",
        modalityTarget: "Chest CT soft-sim slices + VLM in-context ROI cues",
        exemplarBudget: 36,
        status: "active",
        notes:
          "Seed pack for optimized in-context exemplars vs naive exemplar baseline compare",
        createdAt: now(),
      },
    ],
    rois: [
      {
        id: roiId,
        packId,
        label: "Focal lesion ROI cue set",
        kind: "focal",
        cues: "localization,coverage,diversity,prompt_fit",
        cueCount: 4,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint:
          "Optimized in-context exemplars for ROI selection under soft-sim honesty",
        status: "active",
        notes: "Soft-sim ROI config — not clinical diagnostic use",
        createdAt: now(),
      },
    ],
    prompts: [
      {
        id: promptId,
        packId,
        label: "In-context ROI selection prompt",
        promptText:
          "Given curated exemplars, select the region of interest that matches the lesion morphology.",
        successCondition: "lock_soft_sim",
        taskChannel: "soft_sim_roi_vlm",
        status: "scored",
        notes: "Seed prompt set for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        promptId,
        roiId,
        localizationPrecision: 0.62,
        coverageBreadth: 0.7,
        exemplarDiversity: 0.74,
        promptFit: 0.68,
        reviewerNotes:
          "Optimized exemplars look trustworthy but naive dumps miss localization cues",
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
        detail: "Demo pack, ROI config, prompt set, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__roiExemplarStore) g.__roiExemplarStore = seed();
  return g.__roiExemplarStore;
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
  g.__roiExemplarStore = seed();
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
  if (patch.defaultExemplarBias !== undefined) {
    org.defaultExemplarBias = patch.defaultExemplarBias;
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
  items: ExemplarPack[];
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
        p.modalityTarget.toLowerCase().includes(q) ||
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
  modalityTarget: string;
  exemplarBudget?: number;
  notes?: string;
}): ExemplarPack {
  const pack: ExemplarPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    modalityTarget: input.modalityTarget,
    exemplarBudget: input.exemplarBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ExemplarPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listRois(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: RoiConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().rois];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.cues.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRoi(input: {
  packId: string;
  label: string;
  kind: RoiKind;
  cues: string;
  cueCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): RoiConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const roi: RoiConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    cues: input.cues,
    cueCount: input.cueCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().rois.unshift(roi);
  audit("evaluator", "roi.create", roi.label);
  return roi;
}

export function archiveRoi(id: string): RoiConfig | null {
  const roi = state().rois.find((m) => m.id === id);
  if (!roi) return null;
  roi.status = "archived";
  audit("evaluator", "roi.archive", id);
  return roi;
}

export function listPrompts(opts?: {
  q?: string;
  taskChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PromptSet[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().prompts];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.promptText.toLowerCase().includes(q) ||
        c.taskChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.taskChannel) {
    items = items.filter((c) => c.taskChannel === opts.taskChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPrompt(input: {
  packId?: string;
  label: string;
  promptText: string;
  successCondition: string;
  taskChannel: string;
  notes?: string;
}): PromptSet {
  const row: PromptSet = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    promptText: input.promptText,
    successCondition: input.successCondition,
    taskChannel: input.taskChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().prompts.unshift(row);
  audit("evaluator", "prompt.create", row.label);
  return row;
}

export function archivePrompt(id: string): PromptSet | null {
  const row = state().prompts.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "prompt.archive", id);
  return row;
}

export function listRuns(opts?: {
  promptId?: string;
  roiId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ExemplarRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.promptId) {
    items = items.filter((r) => r.promptId === opts.promptId);
  }
  if (opts?.roiId) {
    items = items.filter((r) => r.roiId === opts.roiId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  promptId: string;
  roiId: string;
  localizationPrecision: number;
  coverageBreadth: number;
  exemplarDiversity: number;
  promptFit: number;
  reviewerNotes?: string;
}): ExemplarRun | null {
  if (!state().prompts.some((c) => c.id === input.promptId)) {
    return null;
  }
  if (!state().rois.some((m) => m.id === input.roiId)) return null;
  const run: ExemplarRun = {
    id: randomUUID(),
    promptId: input.promptId,
    roiId: input.roiId,
    localizationPrecision: clamp(input.localizationPrecision, 0, 1),
    coverageBreadth: clamp(input.coverageBreadth, 0, 1),
    exemplarDiversity: clamp(input.exemplarDiversity, 0, 1),
    promptFit: clamp(input.promptFit, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().prompts.find((c) => c.id === input.promptId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ExemplarCompare[] {
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
  promptId: string;
  roiId: string;
  runId: string;
  exemplarBias?: ExemplarBias;
  bias?: ExemplarBias;
  naiveDumpRate?: number;
  naiveOptimism?: number;
  roiHardness?: number;
  overclaimRisk?: number;
}): ExemplarCompare | null {
  const prompt = state().prompts.find((c) => c.id === input.promptId);
  const roi = state().rois.find((m) => m.id === input.roiId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!prompt || !roi || !run) return null;

  const goldWeight = outcomeWeight(String(prompt.successCondition));
  const span = Math.max(0.05, roi.coverageMax - roi.coverageMin);
  const exemplarInput: ExemplarInput = {
    localizationPrecision: clamp(run.localizationPrecision, 0, 1),
    coverageBreadth: clamp(run.coverageBreadth, 0, 1),
    exemplarDiversity: clamp(run.exemplarDiversity, 0, 1),
    promptFit: clamp((run.promptFit + goldWeight) / 2, 0, 1),
    naiveDumpRate: input.naiveDumpRate ?? 0.82,
    naiveOptimism: input.naiveOptimism ?? 0.7,
    roiHardness: input.roiHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    exemplarBias:
      input.exemplarBias ?? input.bias ?? state().org.defaultExemplarBias,
    profile: "optimized_incontext_exemplars",
  };

  const optimizedIncontext = scoreOptimizedIncontextExemplars({
    ...exemplarInput,
    profile: "optimized_incontext_exemplars",
  });
  const naiveBaseline = scoreNaiveExemplarBaseline({
    ...exemplarInput,
    profile: "naive_exemplar_baseline",
  });
  const gap = Math.abs(optimizedIncontext.overall - naiveBaseline.overall);
  let winner: ExemplarCompare["winner"] = "tie";
  if (optimizedIncontext.overall > naiveBaseline.overall + 0.5) {
    winner = "optimized_incontext_exemplars";
  } else if (naiveBaseline.overall > optimizedIncontext.overall + 0.5) {
    winner = "naive_exemplar_baseline";
  }

  const compare: ExemplarCompare = {
    id: randomUUID(),
    name: input.name,
    promptId: prompt.id,
    roiId: roi.id,
    runId: run.id,
    input: exemplarInput,
    optimizedIncontext,
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

export function getScoreboard(): ExemplarCompare[] {
  return [...state().compares].sort(
    (a, b) => b.optimizedIncontext.overall - a.optimizedIncontext.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      rois: state().rois,
      prompts: state().prompts,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,optimizedOverall,naiveOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.optimizedIncontext.overall},${c.naiveBaseline.overall},${c.createdAt}`,
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
    { id: "exemplar-packs", name: "Exemplar pack registry" },
    { id: "pack-versions", name: "Versioned exemplar packs" },
    { id: "roi-configs", name: "ROI selection configs" },
    { id: "roi-editor", name: "ROI cue / coverage editor" },
    { id: "roi-search", name: "ROI search and filter" },
    { id: "seed-packs", name: "Seed exemplar packs" },
    { id: "prompts", name: "In-context prompt workspace" },
    { id: "prompt-filters", name: "Prompt filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "exemplar-runs", name: "Exemplar soft-sim runs" },
    { id: "exemplar-bias", name: "Exemplar bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Optimized in-context exemplars vs naive exemplar baseline compare",
    },
    { id: "delta-view", name: "Exemplar delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not clinical diagnostic / not live PACS / not authors' system",
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

export function scorePreview(input: ExemplarInput): {
  optimizedIncontext: ExemplarQuality;
  naiveBaseline: ExemplarQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const optimizedIncontext = scoreOptimizedIncontextExemplars({
    ...input,
    profile: "optimized_incontext_exemplars",
  });
  const naiveBaseline = scoreNaiveExemplarBaseline({
    ...input,
    profile: "naive_exemplar_baseline",
  });
  return {
    optimizedIncontext,
    naiveBaseline,
    readiness: readinessFromQuality(optimizedIncontext.overall),
  };
}
