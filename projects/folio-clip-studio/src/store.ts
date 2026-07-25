import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMultimodalWearableStress,
  scoreSingleSensorBaseline,
} from "./domain/clip";
import {
  clamp,
  readinessFromQuality,
  round2,
  type SensorKind,
  type StressBias,
  type ScoreMode,
  type ClipInput,
  type ClipQuality,
} from "./domain/types";

export type {
  SensorKind,
  StressBias,
  ScoreMode,
  ClipInput,
  ClipQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ClipPack = {
  id: string;
  label: string;
  version: string;
  cropTarget: string;
  sensorBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SensorStatus = "draft" | "active" | "archived";

export type SensorConfig = {
  id: string;
  packId: string;
  label: string;
  kind: SensorKind;
  channels: string;
  channelCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: SensorStatus;
  notes: string;
  createdAt: string;
};

export type StressStatus = "draft" | "open" | "scored" | "archived";

export type StressSignal = {
  id: string;
  packId?: string;
  label: string;
  stressText: string;
  successCondition: string;
  stressChannel: string;
  status: StressStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type ClipRun = {
  id: string;
  stressId: string;
  sensorId: string;
  clipCoverage: number;
  multimodalFidelity: number;
  sensorClarity: number;
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
  defaultStressBias: StressBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ClipCompare = {
  id: string;
  name: string;
  stressId: string;
  sensorId: string;
  runId: string;
  input: ClipInput;
  multimodal: ClipQuality;
  singleBaseline: ClipQuality;
  winner:
    | "multimodal_wearable_stress"
    | "single_sensor_baseline"
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
  packs: ClipPack[];
  sensors: SensorConfig[];
  stresses: StressSignal[];
  runs: ClipRun[];
  audits: AuditEntry[];
  compares: ClipCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __folioClipStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const sensorId = "sensor-demo";
  const stressId = "stress-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Folio Clip Org",
      webhookUrl: "",
      webhookSecret: "folio-clip-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultStressBias: "balanced",
      defaultMode: "multimodal_wearable_stress",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@folio-clip.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Tomato Drought Soft-Sim Clip Pack",
        version: "2026.1",
        cropTarget: "Greenhouse tomato — early drought stress",
        sensorBudget: 36,
        status: "active",
        notes: "Seed pack for multimodal vs single-sensor compare",
        createdAt: now(),
      },
    ],
    sensors: [
      {
        id: sensorId,
        packId,
        label: "FolioClip multimodal leaf clip",
        kind: "leaf_clip",
        channels: "temp,humidity,spectral,impedance",
        channelCount: 4,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint: "Multimodal wearable stress under soft-sim honesty",
        status: "active",
        notes: "Soft-sim sensor — not field-validated",
        createdAt: now(),
      },
    ],
    stresses: [
      {
        id: stressId,
        packId,
        label: "Early drought stress gate",
        stressText:
          "Does multimodal wearable sensing catch early drought before a single channel?",
        successCondition: "lock_soft_sim",
        stressChannel: "soft_sim_drought",
        status: "scored",
        notes: "Seed stress signal for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        stressId,
        sensorId,
        clipCoverage: 0.62,
        multimodalFidelity: 0.7,
        sensorClarity: 0.74,
        runStability: 0.68,
        reviewerNotes:
          "Multimodal clip looks trustworthy but single-sensor baseline drifts under hard drought",
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
        detail: "Demo pack, sensor, stress, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__folioClipStore) g.__folioClipStore = seed();
  return g.__folioClipStore;
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
  g.__folioClipStore = seed();
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
  if (patch.defaultStressBias !== undefined) {
    org.defaultStressBias = patch.defaultStressBias;
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
  items: ClipPack[];
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
        p.cropTarget.toLowerCase().includes(q) ||
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
  cropTarget: string;
  sensorBudget?: number;
  notes?: string;
}): ClipPack {
  const pack: ClipPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    cropTarget: input.cropTarget,
    sensorBudget: input.sensorBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ClipPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listSensors(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SensorConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().sensors];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.channels.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSensor(input: {
  packId: string;
  label: string;
  kind: SensorKind;
  channels: string;
  channelCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): SensorConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const sensor: SensorConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    channels: input.channels,
    channelCount: input.channelCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().sensors.unshift(sensor);
  audit("evaluator", "sensor.create", sensor.label);
  return sensor;
}

export function archiveSensor(id: string): SensorConfig | null {
  const sensor = state().sensors.find((m) => m.id === id);
  if (!sensor) return null;
  sensor.status = "archived";
  audit("evaluator", "sensor.archive", id);
  return sensor;
}

export function listStresses(opts?: {
  q?: string;
  stressChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: StressSignal[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().stresses];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.stressText.toLowerCase().includes(q) ||
        c.stressChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.stressChannel) {
    items = items.filter((c) => c.stressChannel === opts.stressChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createStress(input: {
  packId?: string;
  label: string;
  stressText: string;
  successCondition: string;
  stressChannel: string;
  notes?: string;
}): StressSignal {
  const stress: StressSignal = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    stressText: input.stressText,
    successCondition: input.successCondition,
    stressChannel: input.stressChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().stresses.unshift(stress);
  audit("evaluator", "stress.create", stress.label);
  return stress;
}

export function archiveStress(id: string): StressSignal | null {
  const stress = state().stresses.find((c) => c.id === id);
  if (!stress) return null;
  stress.status = "archived";
  audit("evaluator", "stress.archive", id);
  return stress;
}

export function listRuns(opts?: {
  stressId?: string;
  sensorId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ClipRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.stressId) {
    items = items.filter((r) => r.stressId === opts.stressId);
  }
  if (opts?.sensorId) {
    items = items.filter((r) => r.sensorId === opts.sensorId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  stressId: string;
  sensorId: string;
  clipCoverage: number;
  multimodalFidelity: number;
  sensorClarity: number;
  runStability: number;
  reviewerNotes?: string;
}): ClipRun | null {
  if (!state().stresses.some((c) => c.id === input.stressId)) {
    return null;
  }
  if (!state().sensors.some((m) => m.id === input.sensorId)) return null;
  const run: ClipRun = {
    id: randomUUID(),
    stressId: input.stressId,
    sensorId: input.sensorId,
    clipCoverage: clamp(input.clipCoverage, 0, 1),
    multimodalFidelity: clamp(input.multimodalFidelity, 0, 1),
    sensorClarity: clamp(input.sensorClarity, 0, 1),
    runStability: clamp(input.runStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const stress = state().stresses.find((c) => c.id === input.stressId);
  if (stress) stress.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ClipCompare[] {
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
  stressId: string;
  sensorId: string;
  runId: string;
  stressBias?: StressBias;
  bias?: StressBias;
  singleSensorRate?: number;
  channelOptimism?: number;
  stressHardness?: number;
  overclaimRisk?: number;
}): ClipCompare | null {
  const stress = state().stresses.find((c) => c.id === input.stressId);
  const sensor = state().sensors.find((m) => m.id === input.sensorId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!stress || !sensor || !run) return null;

  const goldWeight = outcomeWeight(String(stress.successCondition));
  const span = Math.max(0.05, sensor.coverageMax - sensor.coverageMin);
  const clipInput: ClipInput = {
    clipCoverage: clamp(run.clipCoverage, 0, 1),
    multimodalFidelity: clamp(run.multimodalFidelity, 0, 1),
    sensorClarity: clamp(run.sensorClarity, 0, 1),
    runStability: clamp((run.runStability + goldWeight) / 2, 0, 1),
    singleSensorRate: input.singleSensorRate ?? 0.82,
    channelOptimism: input.channelOptimism ?? 0.7,
    stressHardness: input.stressHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    stressBias: input.stressBias ?? input.bias ?? state().org.defaultStressBias,
    profile: "multimodal_wearable_stress",
  };

  const multimodal = scoreMultimodalWearableStress({
    ...clipInput,
    profile: "multimodal_wearable_stress",
  });
  const singleBaseline = scoreSingleSensorBaseline({
    ...clipInput,
    profile: "single_sensor_baseline",
  });
  const gap = Math.abs(multimodal.overall - singleBaseline.overall);
  let winner: ClipCompare["winner"] = "tie";
  if (multimodal.overall > singleBaseline.overall + 0.5) {
    winner = "multimodal_wearable_stress";
  } else if (singleBaseline.overall > multimodal.overall + 0.5) {
    winner = "single_sensor_baseline";
  }

  const compare: ClipCompare = {
    id: randomUUID(),
    name: input.name,
    stressId: stress.id,
    sensorId: sensor.id,
    runId: run.id,
    input: clipInput,
    multimodal,
    singleBaseline,
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

export function getScoreboard(): ClipCompare[] {
  return [...state().compares].sort(
    (a, b) => b.multimodal.overall - a.multimodal.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      sensors: state().sensors,
      stresses: state().stresses,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,multimodalOverall,baselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.multimodal.overall},${c.singleBaseline.overall},${c.createdAt}`,
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
    { id: "clip-packs", name: "Clip pack registry" },
    { id: "pack-versions", name: "Versioned clip packs" },
    { id: "sensor-configs", name: "Multimodal sensor configs" },
    { id: "sensor-editor", name: "Channel / coverage editor" },
    { id: "sensor-search", name: "Sensor search and filter" },
    { id: "seed-packs", name: "Seed clip packs" },
    { id: "stress-signals", name: "Plant stress signal workspace" },
    { id: "stress-filters", name: "Stress signal filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "clip-runs", name: "Clip soft-sim runs" },
    { id: "stress-bias", name: "Stress bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Multimodal vs single-sensor compare" },
    { id: "delta-view", name: "Stress delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not field / not greenhouse notes" },
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

export function scorePreview(input: ClipInput): {
  multimodal: ClipQuality;
  singleBaseline: ClipQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const multimodal = scoreMultimodalWearableStress({
    ...input,
    profile: "multimodal_wearable_stress",
  });
  const singleBaseline = scoreSingleSensorBaseline({
    ...input,
    profile: "single_sensor_baseline",
  });
  return {
    multimodal,
    singleBaseline,
    readiness: readinessFromQuality(multimodal.overall),
  };
}
