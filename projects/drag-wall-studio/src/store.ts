import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreEsClosedLoop,
  scoreOpenLoopGradient,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ControlBias,
  type DragWallInput,
  type DragWallQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  ControlBias,
  DragWallInput,
  DragWallQuality,
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

export type ChannelPack = {
  id: string;
  label: string;
  version: string;
  channelModel: string;
  actuatorCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ActuatorStatus = "draft" | "active" | "archived";

export type ActuatorPlan = {
  id: string;
  packId: string;
  label: string;
  wallZones: string[];
  wallCoverage: number;
  actuationPriority: number;
  status: ActuatorStatus;
  notes: string;
  createdAt: string;
};

export type SensorStatus = "draft" | "open" | "scored" | "archived";

export type SensorLayout = {
  id: string;
  packId?: string;
  label: string;
  layoutSummary: string;
  successCondition: OutcomeLabel | string;
  channel: string;
  status: SensorStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type ControllerRun = {
  id: string;
  sensorId: string;
  actuatorId: string;
  wallCoverage: number;
  sensorConfidence: number;
  channelConfidence: number;
  cueAgreement: number;
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
  defaultControlBias: ControlBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type WallCompare = {
  id: string;
  name: string;
  sensorId: string;
  actuatorId: string;
  controllerRunId: string;
  input: DragWallInput;
  esClosedLoop: DragWallQuality;
  openLoopGradient: DragWallQuality;
  winner: "es_closed_loop" | "open_loop_gradient" | "tie";
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
  packs: ChannelPack[];
  actuators: ActuatorPlan[];
  sensors: SensorLayout[];
  controllerRuns: ControllerRun[];
  audits: AuditEntry[];
  compares: WallCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __dwsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const actuatorId = "actuator-demo";
  const sensorId = "sensor-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Drag Wall Org",
      webhookUrl: "",
      webhookSecret: "dws-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultControlBias: "balanced",
      defaultMode: "es_closed_loop",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "eval-lead@drag-wall.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Turbulent Channel Pack",
        version: "2026.1",
        channelModel: "periodic half-channel Re_tau 180",
        actuatorCount: 8,
        status: "active",
        notes: "Seed pack for demo drag compare",
        createdAt: now(),
      },
    ],
    actuators: [
      {
        id: actuatorId,
        packId,
        label: "Opposed wall blowing plan",
        wallZones: ["lower_wall", "upper_wall", "spanwise_mid"],
        wallCoverage: 0.42,
        actuationPriority: 0.68,
        status: "active",
        notes: "Partial wall actuation without full-span array",
        createdAt: now(),
      },
    ],
    sensors: [
      {
        id: sensorId,
        packId,
        label: "Shear + pressure sensor layout",
        layoutSummary:
          "Wall shear probes on both walls with sparse pressure taps along the channel midplane.",
        successCondition: "drag_cut_positive",
        channel: "half_channel",
        status: "scored",
        notes: "Seed sensor layout for demo compare",
        createdAt: now(),
      },
    ],
    controllerRuns: [
      {
        id: runId,
        sensorId,
        actuatorId,
        wallCoverage: 0.42,
        sensorConfidence: 0.7,
        channelConfidence: 0.74,
        cueAgreement: 0.68,
        reviewerNotes:
          "ES closed-loop cues look informative but open-loop alone misses shear phase",
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
        detail: "Demo pack, actuator, sensor, and controller run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__dwsStore) g.__dwsStore = seed();
  return g.__dwsStore;
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
  g.__dwsStore = seed();
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
  if (patch.defaultControlBias !== undefined) {
    org.defaultControlBias = patch.defaultControlBias;
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
  items: ChannelPack[];
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
        p.channelModel.toLowerCase().includes(q) ||
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
  channelModel: string;
  actuatorCount?: number;
  notes?: string;
}): ChannelPack {
  const pack: ChannelPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    channelModel: input.channelModel,
    actuatorCount: input.actuatorCount ?? 8,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ChannelPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listActuators(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ActuatorPlan[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().actuators];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.wallZones.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createActuator(input: {
  packId: string;
  label: string;
  wallZones: string[];
  wallCoverage: number;
  actuationPriority?: number;
  notes?: string;
}): ActuatorPlan | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const actuator: ActuatorPlan = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    wallZones: input.wallZones,
    wallCoverage: clamp(input.wallCoverage, 0, 1),
    actuationPriority: clamp(input.actuationPriority ?? 0.5, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().actuators.unshift(actuator);
  audit("evaluator", "actuator.create", actuator.label);
  return actuator;
}

export function archiveActuator(id: string): ActuatorPlan | null {
  const actuator = state().actuators.find((m) => m.id === id);
  if (!actuator) return null;
  actuator.status = "archived";
  audit("evaluator", "actuator.archive", id);
  return actuator;
}

export function listSensors(opts?: {
  q?: string;
  channel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): { items: SensorLayout[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().sensors];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.layoutSummary.toLowerCase().includes(q) ||
        c.channel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.channel) {
    items = items.filter((c) => c.channel === opts.channel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSensor(input: {
  packId?: string;
  label: string;
  layoutSummary: string;
  successCondition: string;
  channel: string;
  notes?: string;
}): SensorLayout {
  const sensor: SensorLayout = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    layoutSummary: input.layoutSummary,
    successCondition: input.successCondition,
    channel: input.channel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().sensors.unshift(sensor);
  audit("evaluator", "sensor.create", sensor.label);
  return sensor;
}

export function archiveSensor(id: string): SensorLayout | null {
  const sensor = state().sensors.find((c) => c.id === id);
  if (!sensor) return null;
  sensor.status = "archived";
  audit("evaluator", "sensor.archive", id);
  return sensor;
}

export function listControllerRuns(opts?: {
  sensorId?: string;
  actuatorId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ControllerRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().controllerRuns];
  if (opts?.sensorId) items = items.filter((r) => r.sensorId === opts.sensorId);
  if (opts?.actuatorId)
    items = items.filter((r) => r.actuatorId === opts.actuatorId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createControllerRun(input: {
  sensorId: string;
  actuatorId: string;
  wallCoverage: number;
  sensorConfidence: number;
  channelConfidence: number;
  cueAgreement: number;
  reviewerNotes?: string;
}): ControllerRun | null {
  if (!state().sensors.some((c) => c.id === input.sensorId)) return null;
  if (!state().actuators.some((m) => m.id === input.actuatorId)) return null;
  const run: ControllerRun = {
    id: randomUUID(),
    sensorId: input.sensorId,
    actuatorId: input.actuatorId,
    wallCoverage: clamp(input.wallCoverage, 0, 1),
    sensorConfidence: clamp(input.sensorConfidence, 0, 1),
    channelConfidence: clamp(input.channelConfidence, 0, 1),
    cueAgreement: clamp(input.cueAgreement, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().controllerRuns.unshift(run);
  const sensor = state().sensors.find((c) => c.id === input.sensorId);
  if (sensor) sensor.status = "scored";
  audit("evaluator", "controller_run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): WallCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "negative":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "positive":
    case "drag_cut_positive":
      return 0.7;
    case "critical":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  sensorId: string;
  actuatorId: string;
  controllerRunId: string;
  controlBias?: ControlBias;
  bias?: ControlBias;
  openLoopAccuracy?: number;
  openLoopOptimism?: number;
  dragPressure?: number;
  leakageRisk?: number;
}): WallCompare | null {
  const sensor = state().sensors.find((c) => c.id === input.sensorId);
  const actuator = state().actuators.find((m) => m.id === input.actuatorId);
  const run = state().controllerRuns.find((r) => r.id === input.controllerRunId);
  if (!sensor || !actuator || !run) return null;

  const goldWeight = outcomeWeight(String(sensor.successCondition));
  const dragInput: DragWallInput = {
    wallCoverage: clamp(run.wallCoverage, 0, 1),
    sensorFidelity: clamp(run.sensorConfidence, 0, 1),
    channelFit: clamp(run.channelConfidence, 0, 1),
    closedLoopAgreement: clamp((run.cueAgreement + goldWeight) / 2, 0, 1),
    openLoopAccuracy: input.openLoopAccuracy ?? 0.82,
    openLoopOptimism: input.openLoopOptimism ?? 0.7,
    dragPressure:
      input.dragPressure ??
      clamp(1 - actuator.wallCoverage + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(actuator.wallZones.length > 6 ? 0.55 : 0.28, 0, 1),
    controlBias:
      input.controlBias ??
      input.bias ??
      state().org.defaultControlBias,
    profile: "es_closed_loop",
  };

  const esClosedLoop = scoreEsClosedLoop({
    ...dragInput,
    profile: "es_closed_loop",
  });
  const openLoopGradient = scoreOpenLoopGradient({
    ...dragInput,
    profile: "open_loop_gradient",
  });
  const gap = Math.abs(esClosedLoop.overall - openLoopGradient.overall);
  let winner: WallCompare["winner"] = "tie";
  if (esClosedLoop.overall > openLoopGradient.overall + 0.5) {
    winner = "es_closed_loop";
  } else if (openLoopGradient.overall > esClosedLoop.overall + 0.5) {
    winner = "open_loop_gradient";
  }

  const compare: WallCompare = {
    id: randomUUID(),
    name: input.name,
    sensorId: sensor.id,
    actuatorId: actuator.id,
    controllerRunId: run.id,
    input: dragInput,
    esClosedLoop,
    openLoopGradient,
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

export function getScoreboard(): WallCompare[] {
  return [...state().compares].sort(
    (a, b) => b.esClosedLoop.overall - a.esClosedLoop.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      actuators: state().actuators,
      sensors: state().sensors,
      controllerRuns: state().controllerRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,esOverall,openLoopOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.esClosedLoop.overall},${c.openLoopGradient.overall},${c.createdAt}`,
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
    { id: "channel-packs", name: "Channel pack registry" },
    { id: "pack-versions", name: "Versioned channel packs" },
    { id: "actuators", name: "Wall actuator plan registry" },
    { id: "actuator-editor", name: "Actuator zone editor" },
    { id: "actuator-search", name: "Actuator search and filter" },
    { id: "seed-packs", name: "Seed channel packs" },
    { id: "sensors", name: "Sensor layout workspace" },
    { id: "sensor-filters", name: "Sensor layout filters" },
    { id: "success-conditions", name: "Drag-cut success conditions" },
    { id: "controller-runs", name: "ES closed-loop controller runs" },
    { id: "control-bias", name: "Control bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "ES closed-loop vs open-loop compare" },
    { id: "delta-view", name: "Drag delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-live-plant notes" },
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

export function scorePreview(input: DragWallInput): {
  esClosedLoop: DragWallQuality;
  openLoopGradient: DragWallQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const esClosedLoop = scoreEsClosedLoop({
    ...input,
    profile: "es_closed_loop",
  });
  const openLoopGradient = scoreOpenLoopGradient({
    ...input,
    profile: "open_loop_gradient",
  });
  return {
    esClosedLoop,
    openLoopGradient,
    readiness: readinessFromQuality(esClosedLoop.overall),
  };
}
