import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreAssayAware,
  scoreNaiveProtocolRunner,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayBias,
  type AssayInput,
  type AssayQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  AssayBias,
  AssayInput,
  AssayQuality,
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

export type DeckPack = {
  id: string;
  label: string;
  version: string;
  protocolScope: string;
  tipBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type AssayStatus = "draft" | "active" | "archived";

export type AssayRule = {
  id: string;
  packId: string;
  label: string;
  ruleCount: number;
  rules: string[];
  assayWeight: number;
  runnerWeight: number;
  status: AssayStatus;
  notes: string;
  createdAt: string;
};

export type MonitorStatus = "draft" | "open" | "scored" | "archived";

export type MonitorConfig = {
  id: string;
  packId?: string;
  label: string;
  monitorSummary: string;
  successCondition: OutcomeLabel | string;
  monitorChannel: string;
  status: MonitorStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type GuardRun = {
  id: string;
  monitorId: string;
  assayId: string;
  deckCoverage: number;
  assayConfidence: number;
  assayFit: number;
  protocolIntegrity: number;
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
  defaultAssayBias: AssayBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type AssayCompare = {
  id: string;
  name: string;
  monitorId: string;
  assayId: string;
  runId: string;
  input: AssayInput;
  assayAware: AssayQuality;
  naiveProtocolRunner: AssayQuality;
  winner: "assay_aware" | "naive_protocol_runner" | "tie";
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
  packs: DeckPack[];
  assays: AssayRule[];
  monitors: MonitorConfig[];
  runs: GuardRun[];
  audits: AuditEntry[];
  compares: AssayCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __assayStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const assayId = "assay-demo";
  const monitorId = "monitor-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Assay Guard Org",
      webhookUrl: "",
      webhookSecret: "assay-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultAssayBias: "balanced",
      defaultMode: "assay_aware",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@assay-guard.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "ELISA Soft-Sim Deck Pack",
        version: "2026.1",
        protocolScope: "96-well ELISA transfer protocol (soft-sim)",
        tipBudget: 2400,
        status: "active",
        notes: "Seed pack for demo assay-aware vs naive compare",
        createdAt: now(),
      },
    ],
    assays: [
      {
        id: assayId,
        packId,
        label: "Volume and dwell assay rules",
        ruleCount: 8,
        rules: [
          "Min tip volume",
          "Max aspirate rate",
          "Dwell time floor",
          "Well order lock",
          "Tip reuse ban",
          "Cross-contam window",
          "Temperature band",
          "Wash cycle count",
        ],
        assayWeight: 0.62,
        runnerWeight: 0.38,
        status: "active",
        notes: "Soft-sim rules without certified compliance claim",
        createdAt: now(),
      },
    ],
    monitors: [
      {
        id: monitorId,
        packId,
        label: "Runtime assay monitor ring",
        monitorSummary:
          "Soft-sim assay-aware protocol validation vs naive protocol runner.",
        successCondition: "lock_soft_sim",
        monitorChannel: "soft_sim_monitor",
        status: "scored",
        notes: "Seed monitor for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        monitorId,
        assayId,
        deckCoverage: 0.58,
        assayConfidence: 0.7,
        assayFit: 0.74,
        protocolIntegrity: 0.68,
        reviewerNotes:
          "Assay-aware path looks informative but naive runner skips rules under soft-sim load",
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
        detail: "Demo pack, assay, monitor, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__assayStore) g.__assayStore = seed();
  return g.__assayStore;
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
  g.__assayStore = seed();
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
  if (patch.defaultAssayBias !== undefined) {
    org.defaultAssayBias = patch.defaultAssayBias;
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
  items: DeckPack[];
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
        p.protocolScope.toLowerCase().includes(q) ||
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
  protocolScope: string;
  tipBudget?: number;
  notes?: string;
}): DeckPack {
  const pack: DeckPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    protocolScope: input.protocolScope,
    tipBudget: input.tipBudget ?? 1000,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): DeckPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listAssays(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AssayRule[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().assays];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.rules.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssay(input: {
  packId: string;
  label: string;
  rules: string[];
  ruleCount: number;
  assayWeight: number;
  runnerWeight?: number;
  notes?: string;
}): AssayRule | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const assay: AssayRule = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    rules: input.rules,
    ruleCount: Math.max(0, Math.floor(input.ruleCount)),
    assayWeight: clamp(input.assayWeight, 0, 1),
    runnerWeight: clamp(input.runnerWeight ?? 1 - input.assayWeight, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().assays.unshift(assay);
  audit("evaluator", "assay.create", assay.label);
  return assay;
}

export function archiveAssay(id: string): AssayRule | null {
  const assay = state().assays.find((m) => m.id === id);
  if (!assay) return null;
  assay.status = "archived";
  audit("evaluator", "assay.archive", id);
  return assay;
}

export function listMonitors(opts?: {
  q?: string;
  monitorChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: MonitorConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().monitors];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.monitorSummary.toLowerCase().includes(q) ||
        c.monitorChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.monitorChannel) {
    items = items.filter((c) => c.monitorChannel === opts.monitorChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createMonitor(input: {
  packId?: string;
  label: string;
  monitorSummary: string;
  successCondition: string;
  monitorChannel: string;
  notes?: string;
}): MonitorConfig {
  const monitor: MonitorConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    monitorSummary: input.monitorSummary,
    successCondition: input.successCondition,
    monitorChannel: input.monitorChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().monitors.unshift(monitor);
  audit("evaluator", "monitor.create", monitor.label);
  return monitor;
}

export function archiveMonitor(id: string): MonitorConfig | null {
  const monitor = state().monitors.find((c) => c.id === id);
  if (!monitor) return null;
  monitor.status = "archived";
  audit("evaluator", "monitor.archive", id);
  return monitor;
}

export function listRuns(opts?: {
  monitorId?: string;
  assayId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: GuardRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.monitorId) {
    items = items.filter((r) => r.monitorId === opts.monitorId);
  }
  if (opts?.assayId) {
    items = items.filter((r) => r.assayId === opts.assayId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  monitorId: string;
  assayId: string;
  deckCoverage: number;
  assayConfidence: number;
  assayFit: number;
  protocolIntegrity: number;
  reviewerNotes?: string;
}): GuardRun | null {
  if (!state().monitors.some((c) => c.id === input.monitorId)) {
    return null;
  }
  if (!state().assays.some((m) => m.id === input.assayId)) return null;
  const run: GuardRun = {
    id: randomUUID(),
    monitorId: input.monitorId,
    assayId: input.assayId,
    deckCoverage: clamp(input.deckCoverage, 0, 1),
    assayConfidence: clamp(input.assayConfidence, 0, 1),
    assayFit: clamp(input.assayFit, 0, 1),
    protocolIntegrity: clamp(input.protocolIntegrity, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const monitor = state().monitors.find((c) => c.id === input.monitorId);
  if (monitor) monitor.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): AssayCompare[] {
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
  monitorId: string;
  assayId: string;
  runId: string;
  assayBias?: AssayBias;
  bias?: AssayBias;
  naivePassRate?: number;
  skipOptimism?: number;
  protocolHardness?: number;
  leakageRisk?: number;
}): AssayCompare | null {
  const monitor = state().monitors.find((c) => c.id === input.monitorId);
  const assay = state().assays.find((m) => m.id === input.assayId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!monitor || !assay || !run) return null;

  const goldWeight = outcomeWeight(String(monitor.successCondition));
  const assayInput: AssayInput = {
    deckCoverage: clamp(run.deckCoverage, 0, 1),
    assayFidelity: clamp(run.assayConfidence, 0, 1),
    assayFit: clamp(run.assayFit, 0, 1),
    protocolIntegrity: clamp((run.protocolIntegrity + goldWeight) / 2, 0, 1),
    naivePassRate: input.naivePassRate ?? 0.82,
    skipOptimism: input.skipOptimism ?? 0.7,
    protocolHardness:
      input.protocolHardness ??
      clamp(1 - assay.assayWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ?? clamp(assay.ruleCount > 12 ? 0.55 : 0.28, 0, 1),
    assayBias: input.assayBias ?? input.bias ?? state().org.defaultAssayBias,
    profile: "assay_aware",
  };

  const assayAware = scoreAssayAware({
    ...assayInput,
    profile: "assay_aware",
  });
  const naiveProtocolRunner = scoreNaiveProtocolRunner({
    ...assayInput,
    profile: "naive_protocol_runner",
  });
  const gap = Math.abs(assayAware.overall - naiveProtocolRunner.overall);
  let winner: AssayCompare["winner"] = "tie";
  if (assayAware.overall > naiveProtocolRunner.overall + 0.5) {
    winner = "assay_aware";
  } else if (naiveProtocolRunner.overall > assayAware.overall + 0.5) {
    winner = "naive_protocol_runner";
  }

  const compare: AssayCompare = {
    id: randomUUID(),
    name: input.name,
    monitorId: monitor.id,
    assayId: assay.id,
    runId: run.id,
    input: assayInput,
    assayAware,
    naiveProtocolRunner,
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

export function getScoreboard(): AssayCompare[] {
  return [...state().compares].sort(
    (a, b) => b.assayAware.overall - a.assayAware.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      assays: state().assays,
      monitors: state().monitors,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,assayAwareOverall,naiveOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.assayAware.overall},${c.naiveProtocolRunner.overall},${c.createdAt}`,
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
    { id: "deck-packs", name: "Deck pack registry" },
    { id: "pack-versions", name: "Versioned deck packs" },
    { id: "assay-rules", name: "Assay rule registry" },
    { id: "assay-editor", name: "Assay vs runner weight editor" },
    { id: "assay-search", name: "Assay search and filter" },
    { id: "seed-packs", name: "Seed deck packs" },
    { id: "monitors", name: "Runtime monitor workspace" },
    { id: "monitor-filters", name: "Monitor config filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "guard-runs", name: "Guard soft-sim runs" },
    { id: "assay-bias", name: "Assay bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Assay-aware vs naive compare" },
    { id: "delta-view", name: "Assay delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-compliance notes" },
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

export function scorePreview(input: AssayInput): {
  assayAware: AssayQuality;
  naiveProtocolRunner: AssayQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const assayAware = scoreAssayAware({
    ...input,
    profile: "assay_aware",
  });
  const naiveProtocolRunner = scoreNaiveProtocolRunner({
    ...input,
    profile: "naive_protocol_runner",
  });
  return {
    assayAware,
    naiveProtocolRunner,
    readiness: readinessFromQuality(assayAware.overall),
  };
}
