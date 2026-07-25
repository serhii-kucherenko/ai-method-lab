import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreGanR2mapTranslation,
  scoreConventionalR2Baseline,
} from "./domain/r2map";
import {
  clamp,
  readinessFromQuality,
  round2,
  type InputKind,
  type TranslateBias,
  type ScoreMode,
  type R2Input,
  type R2Quality,
} from "./domain/types";

export type {
  InputKind,
  TranslateBias,
  ScoreMode,
  R2Input,
  R2Quality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type TranslatePack = {
  id: string;
  label: string;
  version: string;
  cohortTarget: string;
  inputBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type InputStatus = "draft" | "active" | "archived";

export type InputSeries = {
  id: string;
  packId: string;
  label: string;
  kind: InputKind;
  sequenceHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: InputStatus;
  notes: string;
  createdAt: string;
};

export type MapStatus = "draft" | "open" | "scored" | "archived";

export type R2MapConfig = {
  id: string;
  packId?: string;
  label: string;
  mapText: string;
  successCondition: string;
  taskChannel: string;
  status: MapStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type TranslateRun = {
  id: string;
  mapId: string;
  inputId: string;
  t1wFidelity: number;
  t2wFidelity: number;
  ganStability: number;
  mapCoherence: number;
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
  defaultTranslateBias: TranslateBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type R2Compare = {
  id: string;
  name: string;
  mapId: string;
  inputId: string;
  runId: string;
  input: R2Input;
  ganTranslation: R2Quality;
  conventionalBaseline: R2Quality;
  winner:
    | "gan_r2map_translation"
    | "conventional_r2_baseline"
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
  packs: TranslatePack[];
  inputs: InputSeries[];
  maps: R2MapConfig[];
  runs: TranslateRun[];
  audits: AuditEntry[];
  compares: R2Compare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __r2mapTranslateStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const inputId = "input-demo";
  const mapId = "map-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "R2map Translate Org",
      webhookUrl: "",
      webhookSecret: "r2map-translate-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultTranslateBias: "balanced",
      defaultMode: "gan_r2map_translation",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@r2map-translate.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Parkinson T1W/T2W Soft-Sim Translate Pack",
        version: "2026.1",
        cohortTarget: "Parkinson MRI soft-sim T1W/T2W → R2map",
        inputBudget: 36,
        status: "active",
        notes:
          "Seed pack for GAN R2map translation vs conventional R2 baseline compare",
        createdAt: now(),
      },
    ],
    inputs: [
      {
        id: inputId,
        packId,
        label: "Paired T1W/T2W series",
        kind: "paired_t1w_t2w",
        sequenceHint: "t1w_fidelity,t2w_fidelity,gan_stability,map_coherence",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "GAN T1W/T2W→R2map translation for Parkinson soft-sim honesty",
        status: "active",
        notes: "Soft-sim input series — not clinical diagnostic use",
        createdAt: now(),
      },
    ],
    maps: [
      {
        id: mapId,
        packId,
        label: "R2map generation config",
        mapText:
          "Given T1W/T2W inputs, generate an R2map soft-sim against the translate pack.",
        successCondition: "lock_soft_sim",
        taskChannel: "soft_sim_r2map_translate",
        status: "scored",
        notes: "Seed map config for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        mapId,
        inputId,
        t1wFidelity: 0.62,
        t2wFidelity: 0.7,
        ganStability: 0.74,
        mapCoherence: 0.68,
        reviewerNotes:
          "GAN translation looks trustworthy but conventional R2 needs dedicated sequences",
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
        detail: "Demo pack, input series, map, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__r2mapTranslateStore) g.__r2mapTranslateStore = seed();
  return g.__r2mapTranslateStore;
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
  g.__r2mapTranslateStore = seed();
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
  if (patch.defaultTranslateBias !== undefined) {
    org.defaultTranslateBias = patch.defaultTranslateBias;
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
  items: TranslatePack[];
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
        p.cohortTarget.toLowerCase().includes(q) ||
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
  cohortTarget: string;
  inputBudget?: number;
  notes?: string;
}): TranslatePack {
  const pack: TranslatePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    cohortTarget: input.cohortTarget,
    inputBudget: input.inputBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): TranslatePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listInputs(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: InputSeries[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().inputs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.sequenceHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createInput(input: {
  packId: string;
  label: string;
  kind: InputKind;
  sequenceHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): InputSeries | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: InputSeries = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    sequenceHint: input.sequenceHint,
    seriesCount: input.seriesCount,
    fidelityMin: input.fidelityMin,
    fidelityMax: input.fidelityMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().inputs.unshift(row);
  audit("evaluator", "input.create", row.label);
  return row;
}

export function archiveInput(id: string): InputSeries | null {
  const row = state().inputs.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "input.archive", id);
  return row;
}

export function listMaps(opts?: {
  q?: string;
  taskChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: R2MapConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().maps];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.mapText.toLowerCase().includes(q) ||
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

export function createMap(input: {
  packId?: string;
  label: string;
  mapText: string;
  successCondition: string;
  taskChannel: string;
  notes?: string;
}): R2MapConfig {
  const row: R2MapConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    mapText: input.mapText,
    successCondition: input.successCondition,
    taskChannel: input.taskChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().maps.unshift(row);
  audit("evaluator", "map.create", row.label);
  return row;
}

export function archiveMap(id: string): R2MapConfig | null {
  const row = state().maps.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "map.archive", id);
  return row;
}

export function listRuns(opts?: {
  mapId?: string;
  inputId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TranslateRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.mapId) {
    items = items.filter((r) => r.mapId === opts.mapId);
  }
  if (opts?.inputId) {
    items = items.filter((r) => r.inputId === opts.inputId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  mapId: string;
  inputId: string;
  t1wFidelity: number;
  t2wFidelity: number;
  ganStability: number;
  mapCoherence: number;
  reviewerNotes?: string;
}): TranslateRun | null {
  if (!state().maps.some((c) => c.id === input.mapId)) {
    return null;
  }
  if (!state().inputs.some((m) => m.id === input.inputId)) return null;
  const run: TranslateRun = {
    id: randomUUID(),
    mapId: input.mapId,
    inputId: input.inputId,
    t1wFidelity: clamp(input.t1wFidelity, 0, 1),
    t2wFidelity: clamp(input.t2wFidelity, 0, 1),
    ganStability: clamp(input.ganStability, 0, 1),
    mapCoherence: clamp(input.mapCoherence, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().maps.find((c) => c.id === input.mapId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): R2Compare[] {
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
  mapId: string;
  inputId: string;
  runId: string;
  translateBias?: TranslateBias;
  bias?: TranslateBias;
  conventionalMatchRate?: number;
  conventionalOptimism?: number;
  translationHardness?: number;
  overclaimRisk?: number;
}): R2Compare | null {
  const map = state().maps.find((c) => c.id === input.mapId);
  const series = state().inputs.find((m) => m.id === input.inputId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!map || !series || !run) return null;

  const goldWeight = outcomeWeight(String(map.successCondition));
  const span = Math.max(0.05, series.fidelityMax - series.fidelityMin);
  const r2Input: R2Input = {
    t1wFidelity: clamp(run.t1wFidelity, 0, 1),
    t2wFidelity: clamp(run.t2wFidelity, 0, 1),
    ganStability: clamp(run.ganStability, 0, 1),
    mapCoherence: clamp((run.mapCoherence + goldWeight) / 2, 0, 1),
    conventionalMatchRate: input.conventionalMatchRate ?? 0.82,
    conventionalOptimism: input.conventionalOptimism ?? 0.7,
    translationHardness:
      input.translationHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    translateBias:
      input.translateBias ?? input.bias ?? state().org.defaultTranslateBias,
    profile: "gan_r2map_translation",
  };

  const ganTranslation = scoreGanR2mapTranslation({
    ...r2Input,
    profile: "gan_r2map_translation",
  });
  const conventionalBaseline = scoreConventionalR2Baseline({
    ...r2Input,
    profile: "conventional_r2_baseline",
  });
  const gap = Math.abs(ganTranslation.overall - conventionalBaseline.overall);
  let winner: R2Compare["winner"] = "tie";
  if (ganTranslation.overall > conventionalBaseline.overall + 0.5) {
    winner = "gan_r2map_translation";
  } else if (conventionalBaseline.overall > ganTranslation.overall + 0.5) {
    winner = "conventional_r2_baseline";
  }

  const compare: R2Compare = {
    id: randomUUID(),
    name: input.name,
    mapId: map.id,
    inputId: series.id,
    runId: run.id,
    input: r2Input,
    ganTranslation,
    conventionalBaseline,
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

export function getScoreboard(): R2Compare[] {
  return [...state().compares].sort(
    (a, b) => b.ganTranslation.overall - a.ganTranslation.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      inputs: state().inputs,
      maps: state().maps,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,ganOverall,conventionalOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.ganTranslation.overall},${c.conventionalBaseline.overall},${c.createdAt}`,
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
    { id: "translate-packs", name: "Translate pack registry" },
    { id: "pack-versions", name: "Versioned translate packs" },
    { id: "input-series", name: "T1W/T2W input series" },
    { id: "input-editor", name: "Input fidelity / sequence editor" },
    { id: "input-search", name: "Input search and filter" },
    { id: "seed-packs", name: "Seed translate packs" },
    { id: "r2maps", name: "R2map workspace" },
    { id: "map-filters", name: "Map filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "translate-runs", name: "Translate soft-sim runs" },
    { id: "translate-bias", name: "Translate bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "GAN R2map translation vs conventional R2 baseline compare",
    },
    { id: "delta-view", name: "Translate delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not clinical / not live PACS / not FDA / not authors' system",
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

export function scorePreview(input: R2Input): {
  ganTranslation: R2Quality;
  conventionalBaseline: R2Quality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const ganTranslation = scoreGanR2mapTranslation({
    ...input,
    profile: "gan_r2map_translation",
  });
  const conventionalBaseline = scoreConventionalR2Baseline({
    ...input,
    profile: "conventional_r2_baseline",
  });
  return {
    ganTranslation,
    conventionalBaseline,
    readiness: readinessFromQuality(ganTranslation.overall),
  };
}
