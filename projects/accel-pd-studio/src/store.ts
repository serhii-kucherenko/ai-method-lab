import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMultichannelPaTransformer,
  scoreHandcraftedPaBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ChannelKind,
  type PaBias,
  type ScoreMode,
  type AccelPdInput,
  type AccelPdQuality,
} from "./domain/types";

export type {
  ChannelKind,
  PaBias,
  ScoreMode,
  AccelPdInput,
  AccelPdQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type AccelPack = {
  id: string;
  label: string;
  version: string;
  riskFocus: string;
  channelBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ChannelStatus = "draft" | "active" | "archived";

export type ChannelSet = {
  id: string;
  packId: string;
  label: string;
  kind: ChannelKind;
  placementHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: ChannelStatus;
  notes: string;
  createdAt: string;
};

export type ReprStatus = "draft" | "open" | "scored" | "archived";

export type PaRepresentation = {
  id: string;
  packId?: string;
  label: string;
  architecture: string;
  lockCondition: string;
  signalChannel: string;
  status: ReprStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type AccelRun = {
  id: string;
  representationId: string;
  channelId: string;
  channelCoverage: number;
  transformerFidelity: number;
  activityGrounding: number;
  representationCompleteness: number;
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
  defaultPaBias: PaBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type AccelPdCompare = {
  id: string;
  name: string;
  representationId: string;
  channelId: string;
  runId: string;
  input: AccelPdInput;
  transformer: AccelPdQuality;
  baseline: AccelPdQuality;
  winner:
    | "multichannel_pa_transformer"
    | "handcrafted_pa_baseline"
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
  packs: AccelPack[];
  channels: ChannelSet[];
  representations: PaRepresentation[];
  runs: AccelRun[];
  audits: AuditEvent[];
  compares: AccelPdCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __accelPdStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const channelId = "channel-demo";
  const representationId = "repr-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Accel PD Org",
      webhookUrl: "",
      webhookSecret: "accel-pd-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPaBias: "balanced",
      defaultMode: "multichannel_pa_transformer",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@accel-pd.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Free-Living Accel Soft-Sim Pack",
        version: "2026.1",
        riskFocus:
          "Multi-channel wearable PA representation soft-sim vs handcrafted PA-feature baseline",
        channelBudget: 36,
        status: "active",
        notes:
          "Seed pack for multi-channel PA transformer vs handcrafted PA-feature baseline soft-sim",
        createdAt: now(),
      },
    ],
    channels: [
      {
        id: channelId,
        packId,
        label: "Wrist + hip multi-channel set",
        kind: "multi",
        placementHint:
          "channel_coverage,activity_grounding,transformer_fidelity,representation_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Channel, activity grounding, fidelity, and completeness for accel soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim wearable channels — not diagnostic / not PABformer / not live device write-back",
        createdAt: now(),
      },
    ],
    representations: [
      {
        id: representationId,
        packId,
        label: "PA representation set",
        architecture:
          "Comparative multi-channel PA soft-sim (transformer vs handcrafted)",
        lockCondition: "lock_soft_sim",
        signalChannel: "soft_sim_accel_pa_signal",
        status: "scored",
        notes: "Seed representations for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        representationId,
        channelId,
        channelCoverage: 0.62,
        transformerFidelity: 0.7,
        activityGrounding: 0.74,
        representationCompleteness: 0.68,
        runNotes:
          "Transformer pack looks strong but handcrafted PA baseline still leads on hard free-living signals",
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
        detail: "Demo pack, channels, representations, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__accelPdStore) g.__accelPdStore = seed();
  return g.__accelPdStore;
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
  g.__accelPdStore = seed();
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
  if (patch.defaultPaBias !== undefined) {
    org.defaultPaBias = patch.defaultPaBias;
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
  items: AccelPack[];
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
  channelBudget?: number;
  notes?: string;
}): AccelPack {
  const pack: AccelPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    riskFocus: input.riskFocus,
    channelBudget: input.channelBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): AccelPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listChannels(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ChannelSet[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().channels];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.placementHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createChannel(input: {
  packId: string;
  label: string;
  kind: ChannelKind;
  placementHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): ChannelSet | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: ChannelSet = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    placementHint: input.placementHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().channels.unshift(row);
  audit("evaluator", "channel.create", row.label);
  return row;
}

export function archiveChannel(id: string): ChannelSet | null {
  const row = state().channels.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "channel.archive", id);
  return row;
}

export function listRepresentations(opts?: {
  q?: string;
  signalChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PaRepresentation[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().representations];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.architecture.toLowerCase().includes(q) ||
        c.signalChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.signalChannel) {
    items = items.filter((c) => c.signalChannel === opts.signalChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRepresentation(input: {
  packId?: string;
  label: string;
  architecture: string;
  lockCondition: string;
  signalChannel: string;
  notes?: string;
}): PaRepresentation {
  const row: PaRepresentation = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    architecture: input.architecture,
    lockCondition: input.lockCondition,
    signalChannel: input.signalChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().representations.unshift(row);
  audit("evaluator", "representation.create", row.label);
  return row;
}

export function archiveRepresentation(id: string): PaRepresentation | null {
  const row = state().representations.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "representation.archive", id);
  return row;
}

export function listRuns(opts?: {
  representationId?: string;
  channelId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AccelRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.representationId) {
    items = items.filter((r) => r.representationId === opts.representationId);
  }
  if (opts?.channelId) {
    items = items.filter((r) => r.channelId === opts.channelId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  representationId: string;
  channelId: string;
  channelCoverage: number;
  transformerFidelity: number;
  activityGrounding: number;
  representationCompleteness: number;
  runNotes?: string;
}): AccelRun | null {
  if (!state().representations.some((c) => c.id === input.representationId)) {
    return null;
  }
  if (!state().channels.some((m) => m.id === input.channelId)) {
    return null;
  }
  const run: AccelRun = {
    id: randomUUID(),
    representationId: input.representationId,
    channelId: input.channelId,
    channelCoverage: clamp(input.channelCoverage, 0, 1),
    transformerFidelity: clamp(input.transformerFidelity, 0, 1),
    activityGrounding: clamp(input.activityGrounding, 0, 1),
    representationCompleteness: clamp(input.representationCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().representations.find((c) => c.id === input.representationId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): AccelPdCompare[] {
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
  representationId: string;
  channelId: string;
  runId: string;
  paBias?: PaBias;
  bias?: PaBias;
  baselineConfidence?: number;
  baselineOptimism?: number;
  signalHardness?: number;
  overclaimRisk?: number;
}): AccelPdCompare | null {
  const representation = state().representations.find(
    (c) => c.id === input.representationId,
  );
  const channel = state().channels.find((m) => m.id === input.channelId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!representation || !channel || !run) return null;

  const goldWeight = outcomeWeight(String(representation.lockCondition));
  const span = Math.max(0.05, channel.hardnessMax - channel.hardnessMin);
  const accelInput: AccelPdInput = {
    channelCoverage: clamp(run.channelCoverage, 0, 1),
    transformerFidelity: clamp(run.transformerFidelity, 0, 1),
    activityGrounding: clamp(run.activityGrounding, 0, 1),
    representationCompleteness: clamp(
      (run.representationCompleteness + goldWeight) / 2,
      0,
      1,
    ),
    baselineConfidence: input.baselineConfidence ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    signalHardness: input.signalHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    paBias: input.paBias ?? input.bias ?? state().org.defaultPaBias,
    profile: "multichannel_pa_transformer",
  };

  const transformer = scoreMultichannelPaTransformer({
    ...accelInput,
    profile: "multichannel_pa_transformer",
  });
  const baseline = scoreHandcraftedPaBaseline({
    ...accelInput,
    profile: "handcrafted_pa_baseline",
  });
  const gap = Math.abs(transformer.overall - baseline.overall);
  let winner: AccelPdCompare["winner"] = "tie";
  if (transformer.overall > baseline.overall + 0.5) {
    winner = "multichannel_pa_transformer";
  } else if (baseline.overall > transformer.overall + 0.5) {
    winner = "handcrafted_pa_baseline";
  }

  const compare: AccelPdCompare = {
    id: randomUUID(),
    name: input.name,
    representationId: representation.id,
    channelId: channel.id,
    runId: run.id,
    input: accelInput,
    transformer,
    baseline,
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

export function getScoreboard(): AccelPdCompare[] {
  return [...state().compares].sort(
    (a, b) => b.transformer.overall - a.transformer.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      channels: state().channels,
      representations: state().representations,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,transformerOverall,baselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.transformer.overall},${c.baseline.overall},${c.createdAt}`,
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
    { id: "accel-packs", name: "Accel pack registry" },
    { id: "pack-versions", name: "Versioned accel packs" },
    { id: "channels", name: "Wearable channel sets" },
    { id: "channel-editor", name: "Channel placement / case editor" },
    { id: "channel-search", name: "Channel search and filter" },
    { id: "seed-packs", name: "Seed accel packs" },
    { id: "representations", name: "PA representation registry" },
    { id: "repr-filters", name: "PA representation filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "accel-runs", name: "Accel soft-sim runs" },
    { id: "pa-bias", name: "PA bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Multi-channel PA transformer vs handcrafted PA-feature baseline compare",
    },
    { id: "delta-view", name: "Accel-PD delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not diagnostic / not live device / not FDA / not PABformer / not authors' system",
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

export function scorePreview(input: AccelPdInput): {
  transformer: AccelPdQuality;
  baseline: AccelPdQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const transformer = scoreMultichannelPaTransformer({
    ...input,
    profile: "multichannel_pa_transformer",
  });
  const baseline = scoreHandcraftedPaBaseline({
    ...input,
    profile: "handcrafted_pa_baseline",
  });
  return {
    transformer,
    baseline,
    readiness: readinessFromQuality(transformer.overall),
  };
}
