import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreChemistInLoop, scoreOpenLoop } from "./domain/reaction";
import {
  clamp,
  readinessFromQuality,
  round2,
  type LoopBias,
  type ReactionFamily,
  type ReactionInput,
  type ReactionQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  LoopBias,
  ReactionFamily,
  ReactionInput,
  ReactionQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CampaignPack = {
  id: string;
  label: string;
  version: string;
  reactionFocus: string;
  loopBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ReagentStatus = "draft" | "active" | "archived";

export type ReagentSpace = {
  id: string;
  packId: string;
  label: string;
  family: ReactionFamily;
  solventSet: string;
  catalystSet: string;
  tempMinC: number;
  tempMaxC: number;
  metricHint: string;
  status: ReagentStatus;
  notes: string;
  createdAt: string;
};

export type LoopStatus = "draft" | "open" | "scored" | "archived";

export type LoopPolicy = {
  id: string;
  packId?: string;
  label: string;
  policySummary: string;
  successCondition: string;
  gateChannel: string;
  status: LoopStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type ReactionRun = {
  id: string;
  loopId: string;
  reagentId: string;
  packCoverage: number;
  reagentFidelity: number;
  loopClarity: number;
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
  defaultLoopBias: LoopBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ReactionCompare = {
  id: string;
  name: string;
  loopId: string;
  reagentId: string;
  runId: string;
  input: ReactionInput;
  chemistInLoop: ReactionQuality;
  openLoop: ReactionQuality;
  winner: "chemist_in_loop_vlm" | "open_loop_vlm" | "tie";
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
  packs: CampaignPack[];
  reagents: ReagentSpace[];
  loops: LoopPolicy[];
  runs: ReactionRun[];
  audits: AuditEntry[];
  compares: ReactionCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __reactionLoopStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const reagentId = "reagent-demo";
  const loopId = "loop-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Reaction Loop Org",
      webhookUrl: "",
      webhookSecret: "reaction-loop-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultLoopBias: "balanced",
      defaultMode: "chemist_in_loop_vlm",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@reaction-loop.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Suzuki Soft-Sim Campaign Pack",
        version: "2026.1",
        reactionFocus: "Suzuki with chemist-in-the-loop VLM",
        loopBudget: 36,
        status: "active",
        notes: "Seed pack for chemist-in-loop vs open-loop compare",
        createdAt: now(),
      },
    ],
    reagents: [
      {
        id: reagentId,
        packId,
        label: "Pd / aryl halide solvent space (soft-sim)",
        family: "suzuki",
        solventSet: "toluene,dioxane,DMF",
        catalystSet: "Pd(PPh3)4,Pd(dppf)Cl2",
        tempMinC: 60,
        tempMaxC: 110,
        metricHint: "Yield + chemoselectivity under chemist gate",
        status: "active",
        notes: "Soft-sim reagent space — not live wet-lab",
        createdAt: now(),
      },
    ],
    loops: [
      {
        id: loopId,
        packId,
        label: "Chemist-in-the-loop policy",
        policySummary:
          "Soft-sim chemist gate on VLM condition proposals vs open-loop baseline.",
        successCondition: "lock_soft_sim",
        gateChannel: "soft_sim_chemist",
        status: "scored",
        notes: "Seed loop for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        loopId,
        reagentId,
        packCoverage: 0.62,
        reagentFidelity: 0.7,
        loopClarity: 0.74,
        runStability: 0.68,
        reviewerNotes:
          "Chemist-in-loop path looks informative but open-loop drifts under sparse condition spaces",
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
        detail: "Demo pack, reagent, loop, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__reactionLoopStore) g.__reactionLoopStore = seed();
  return g.__reactionLoopStore;
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
  g.__reactionLoopStore = seed();
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
  if (patch.defaultLoopBias !== undefined) {
    org.defaultLoopBias = patch.defaultLoopBias;
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
  items: CampaignPack[];
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
        p.reactionFocus.toLowerCase().includes(q) ||
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
  reactionFocus: string;
  loopBudget?: number;
  notes?: string;
}): CampaignPack {
  const pack: CampaignPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    reactionFocus: input.reactionFocus,
    loopBudget: input.loopBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CampaignPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listReagents(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ReagentSpace[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().reagents];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.family.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.solventSet.toLowerCase().includes(q) ||
        m.catalystSet.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createReagent(input: {
  packId: string;
  label: string;
  family: ReactionFamily;
  solventSet: string;
  catalystSet: string;
  tempMinC: number;
  tempMaxC: number;
  metricHint?: string;
  notes?: string;
}): ReagentSpace | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const reagent: ReagentSpace = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    family: input.family,
    solventSet: input.solventSet,
    catalystSet: input.catalystSet,
    tempMinC: input.tempMinC,
    tempMaxC: input.tempMaxC,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().reagents.unshift(reagent);
  audit("evaluator", "reagent.create", reagent.label);
  return reagent;
}

export function archiveReagent(id: string): ReagentSpace | null {
  const reagent = state().reagents.find((m) => m.id === id);
  if (!reagent) return null;
  reagent.status = "archived";
  audit("evaluator", "reagent.archive", id);
  return reagent;
}

export function listLoops(opts?: {
  q?: string;
  gateChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: LoopPolicy[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().loops];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.policySummary.toLowerCase().includes(q) ||
        c.gateChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.gateChannel) {
    items = items.filter((c) => c.gateChannel === opts.gateChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createLoop(input: {
  packId?: string;
  label: string;
  policySummary: string;
  successCondition: string;
  gateChannel: string;
  notes?: string;
}): LoopPolicy {
  const loop: LoopPolicy = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    policySummary: input.policySummary,
    successCondition: input.successCondition,
    gateChannel: input.gateChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().loops.unshift(loop);
  audit("evaluator", "loop.create", loop.label);
  return loop;
}

export function archiveLoop(id: string): LoopPolicy | null {
  const loop = state().loops.find((c) => c.id === id);
  if (!loop) return null;
  loop.status = "archived";
  audit("evaluator", "loop.archive", id);
  return loop;
}

export function listRuns(opts?: {
  loopId?: string;
  reagentId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ReactionRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.loopId) {
    items = items.filter((r) => r.loopId === opts.loopId);
  }
  if (opts?.reagentId) {
    items = items.filter((r) => r.reagentId === opts.reagentId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  loopId: string;
  reagentId: string;
  packCoverage: number;
  reagentFidelity: number;
  loopClarity: number;
  runStability: number;
  reviewerNotes?: string;
}): ReactionRun | null {
  if (!state().loops.some((c) => c.id === input.loopId)) {
    return null;
  }
  if (!state().reagents.some((m) => m.id === input.reagentId)) return null;
  const run: ReactionRun = {
    id: randomUUID(),
    loopId: input.loopId,
    reagentId: input.reagentId,
    packCoverage: clamp(input.packCoverage, 0, 1),
    reagentFidelity: clamp(input.reagentFidelity, 0, 1),
    loopClarity: clamp(input.loopClarity, 0, 1),
    runStability: clamp(input.runStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const loop = state().loops.find((c) => c.id === input.loopId);
  if (loop) loop.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ReactionCompare[] {
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
  loopId: string;
  reagentId: string;
  runId: string;
  loopBias?: LoopBias;
  bias?: LoopBias;
  openLoopPassRate?: number;
  skipOptimism?: number;
  conditionHardness?: number;
  overclaimRisk?: number;
}): ReactionCompare | null {
  const loop = state().loops.find((c) => c.id === input.loopId);
  const reagent = state().reagents.find((m) => m.id === input.reagentId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!loop || !reagent || !run) return null;

  const goldWeight = outcomeWeight(String(loop.successCondition));
  const span =
    Math.max(1, reagent.tempMaxC - reagent.tempMinC) / 120;
  const reactionInput: ReactionInput = {
    packCoverage: clamp(run.packCoverage, 0, 1),
    reagentFidelity: clamp(run.reagentFidelity, 0, 1),
    loopClarity: clamp(run.loopClarity, 0, 1),
    runStability: clamp((run.runStability + goldWeight) / 2, 0, 1),
    openLoopPassRate: input.openLoopPassRate ?? 0.82,
    skipOptimism: input.skipOptimism ?? 0.7,
    conditionHardness:
      input.conditionHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    loopBias: input.loopBias ?? input.bias ?? state().org.defaultLoopBias,
    profile: "chemist_in_loop_vlm",
  };

  const chemistInLoop = scoreChemistInLoop({
    ...reactionInput,
    profile: "chemist_in_loop_vlm",
  });
  const openLoop = scoreOpenLoop({
    ...reactionInput,
    profile: "open_loop_vlm",
  });
  const gap = Math.abs(chemistInLoop.overall - openLoop.overall);
  let winner: ReactionCompare["winner"] = "tie";
  if (chemistInLoop.overall > openLoop.overall + 0.5) {
    winner = "chemist_in_loop_vlm";
  } else if (openLoop.overall > chemistInLoop.overall + 0.5) {
    winner = "open_loop_vlm";
  }

  const compare: ReactionCompare = {
    id: randomUUID(),
    name: input.name,
    loopId: loop.id,
    reagentId: reagent.id,
    runId: run.id,
    input: reactionInput,
    chemistInLoop,
    openLoop,
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

export function getScoreboard(): ReactionCompare[] {
  return [...state().compares].sort(
    (a, b) => b.chemistInLoop.overall - a.chemistInLoop.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      reagents: state().reagents,
      loops: state().loops,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,chemistInLoopOverall,openLoopOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.chemistInLoop.overall},${c.openLoop.overall},${c.createdAt}`,
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
    { id: "campaign-packs", name: "Campaign pack registry" },
    { id: "pack-versions", name: "Versioned campaign packs" },
    { id: "reagent-spaces", name: "Reagent-space definitions" },
    { id: "condition-editor", name: "Solvent / catalyst / temp editor" },
    { id: "reagent-search", name: "Reagent search and filter" },
    { id: "seed-packs", name: "Seed campaign packs" },
    { id: "loop-policies", name: "Chemist-in-the-loop policy workspace" },
    { id: "loop-filters", name: "Loop policy filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "reaction-runs", name: "Reaction soft-sim runs" },
    { id: "loop-bias", name: "Loop bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Chemist-in-loop vs open-loop compare" },
    { id: "delta-view", name: "Condition delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not wet-lab / not manufacturing notes" },
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

export function scorePreview(input: ReactionInput): {
  chemistInLoop: ReactionQuality;
  openLoop: ReactionQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const chemistInLoop = scoreChemistInLoop({
    ...input,
    profile: "chemist_in_loop_vlm",
  });
  const openLoop = scoreOpenLoop({
    ...input,
    profile: "open_loop_vlm",
  });
  return {
    chemistInLoop,
    openLoop,
    readiness: readinessFromQuality(chemistInLoop.overall),
  };
}
