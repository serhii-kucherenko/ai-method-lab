import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreStageValidated, scoreNaiveOffload } from "./domain/infer";
import {
  readinessFromQuality,
  type InferInput,
  type InferQuality,
  type InferReadiness,
  type InferStageKind,
  type PlanKind,
  type ScoreMode,
} from "./domain/types";

export type {
  InferInput,
  InferQuality,
  InferReadiness,
  InferStageKind,
  PlanKind,
  ScoreMode,
};

export type MemberRole = "owner" | "engineer" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type DeviceArch = "fermi" | "kepler" | "maxwell" | "pascal_edge";

export type LegacyDevice = {
  id: string;
  name: string;
  arch: DeviceArch;
  vramGb: number;
  usableVramGb: number;
  computeCapability: string;
  notes: string;
  createdAt: string;
};

export type StageStatus = "draft" | "gated" | "passed" | "failed";

export type InferStage = {
  id: string;
  deviceId: string;
  name: string;
  kind: InferStageKind;
  status: StageStatus;
  agreement: number;
  notes: string;
  createdAt: string;
};

export type KernelOp =
  | "sgemm"
  | "delta_scan"
  | "attention"
  | "dequant"
  | "vision_attn";

export type KernelBudget = {
  id: string;
  deviceId: string;
  name: string;
  op: KernelOp;
  vramMb: number;
  efficiency: number;
  notes: string;
  createdAt: string;
};

export type KernelNote = {
  id: string;
  deviceId: string;
  name: string;
  op: KernelOp;
  rewriteSummary: string;
  speedupHint: number;
  notes: string;
  createdAt: string;
};

export type RunStatus = "queued" | "running" | "passed" | "oom" | "failed";

export type ValidationRun = {
  id: string;
  deviceId: string;
  name: string;
  mode: ScoreMode;
  plan: PlanKind;
  status: RunStatus;
  quality?: InferQuality;
  readiness?: InferReadiness;
  createdAt: string;
  updatedAt: string;
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
  defaultPlan: PlanKind;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  deviceId: string;
  input: InferInput;
  stageValidated: InferQuality;
  naiveOffload: InferQuality;
  winner: "stage_validated" | "naive_offload" | "tie";
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
  devices: LegacyDevice[];
  stages: InferStage[];
  budgets: KernelBudget[];
  kernels: KernelNote[];
  runs: ValidationRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __lisStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): InferInput {
  return {
    vramGb: 5.3,
    residentGb: 4.3,
    stageAgreement: 0.88,
    kernelEfficiency: 0.74,
    hostSpill: 0.08,
    prefillThroughput: 0.72,
    decodeThroughput: 0.68,
    visionPortFit: 0.86,
    contextK: 2.0,
    stage: "prefill",
    plan: "stage_validated",
  };
}

function seed(): StoreState {
  const deviceId = "dev-demo";
  const input = seedInput();
  const quality = scoreStageValidated(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Legacy Infer Org",
      webhookUrl: "",
      webhookSecret: "lis-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "stage_validated",
      defaultMode: "stage_validated",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@legacy-infer.local", role: "owner" },
      { id: "m2", email: "engineer@legacy-infer.local", role: "engineer" },
      { id: "m3", email: "viewer@legacy-infer.local", role: "viewer" },
    ],
    devices: [
      {
        id: deviceId,
        name: "Edge Fermi · 6 GB lab card",
        arch: "fermi",
        vramGb: 6,
        usableVramGb: 5.3,
        computeCapability: "sm_20",
        notes: "Demo legacy device — simulated VRAM only",
        createdAt: now(),
      },
    ],
    stages: [
      {
        id: "st-demo",
        deviceId,
        name: "Vision encode gate",
        kind: "vision_encode",
        status: "passed",
        agreement: 0.91,
        notes: "Stage-validated against reference forward (simulated)",
        createdAt: now(),
      },
      {
        id: "st-demo-2",
        deviceId,
        name: "Prefill all-GPU gate",
        kind: "prefill",
        status: "gated",
        agreement: 0.84,
        notes: "Pending long-context GEMM rewrite check",
        createdAt: now(),
      },
    ],
    budgets: [
      {
        id: "kb-demo",
        deviceId,
        name: "8-bit LM + FP32 vision",
        op: "dequant",
        vramMb: 4300,
        efficiency: 0.78,
        notes: "Resident footprint budget vs usable VRAM",
        createdAt: now(),
      },
    ],
    kernels: [
      {
        id: "kn-demo",
        deviceId,
        name: "Dequant + vendor SGEMM",
        op: "sgemm",
        rewriteSummary:
          "Dequantize 8-bit once into FP32 scratch, then call vendor sgemm",
        speedupHint: 7.2,
        notes: "Measured vs per-token GEMV (simulated)",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: "run-demo",
        deviceId,
        name: "All-GPU stage-validated pass",
        mode: "stage_validated",
        plan: "stage_validated",
        status: "passed",
        quality,
        readiness,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo device, stages, budgets, kernels, run loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__lisStore) g.__lisStore = seed();
  return g.__lisStore;
}

export function resetStore(): void {
  g.__lisStore = seed();
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

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  Object.assign(state().org, patch);
  audit("owner", "settings.update", JSON.stringify(patch));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole): Member {
  const m: Member = { id: randomUUID(), email, role };
  state().members.push(m);
  audit("owner", "member.invite", `${email} as ${role}`);
  return m;
}

export function listDevices(
  q?: string,
  page = 1,
  pageSize = 50,
): {
  items: LegacyDevice[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().devices].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.arch.toLowerCase().includes(needle) ||
        r.computeCapability.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  const total = rows.length;
  const start = Math.max(0, (page - 1) * pageSize);
  return {
    items: rows.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
}

export function createDevice(input: {
  name: string;
  arch: DeviceArch;
  vramGb: number;
  usableVramGb?: number;
  computeCapability: string;
  notes?: string;
}): LegacyDevice {
  const vram = Math.max(1, Math.min(24, input.vramGb));
  const row: LegacyDevice = {
    id: randomUUID(),
    name: input.name.trim(),
    arch: input.arch,
    vramGb: vram,
    usableVramGb: Math.max(
      0.5,
      Math.min(vram, input.usableVramGb ?? vram * 0.88),
    ),
    computeCapability: input.computeCapability.trim(),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().devices.unshift(row);
  audit("engineer", "device.create", row.name);
  return row;
}

export function getDevice(id: string): LegacyDevice | undefined {
  return state().devices.find((d) => d.id === id);
}

export function listStages(deviceId?: string, q?: string): InferStage[] {
  let rows = [...state().stages];
  if (deviceId) rows = rows.filter((r) => r.deviceId === deviceId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createStage(input: {
  deviceId: string;
  name: string;
  kind: InferStageKind;
  status?: StageStatus;
  agreement?: number;
  notes?: string;
}): InferStage {
  const device = getDevice(input.deviceId);
  if (!device) throw new Error("device_not_found");
  const row: InferStage = {
    id: randomUUID(),
    deviceId: input.deviceId,
    name: input.name.trim(),
    kind: input.kind,
    status: input.status ?? "draft",
    agreement: Math.max(0, Math.min(1, input.agreement ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().stages.unshift(row);
  audit("engineer", "stage.create", row.name);
  return row;
}

export function listBudgets(deviceId?: string, q?: string): KernelBudget[] {
  let rows = [...state().budgets];
  if (deviceId) rows = rows.filter((r) => r.deviceId === deviceId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.op.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createBudget(input: {
  deviceId: string;
  name: string;
  op: KernelOp;
  vramMb?: number;
  efficiency?: number;
  notes?: string;
}): KernelBudget {
  const device = getDevice(input.deviceId);
  if (!device) throw new Error("device_not_found");
  const row: KernelBudget = {
    id: randomUUID(),
    deviceId: input.deviceId,
    name: input.name.trim(),
    op: input.op,
    vramMb: Math.max(1, Math.round(input.vramMb ?? 1024)),
    efficiency: Math.max(0, Math.min(1, input.efficiency ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().budgets.unshift(row);
  audit("engineer", "budget.create", row.name);
  return row;
}

export function listKernels(deviceId?: string, q?: string): KernelNote[] {
  let rows = [...state().kernels];
  if (deviceId) rows = rows.filter((r) => r.deviceId === deviceId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.op.toLowerCase().includes(needle) ||
        r.rewriteSummary.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createKernel(input: {
  deviceId: string;
  name: string;
  op: KernelOp;
  rewriteSummary: string;
  speedupHint?: number;
  notes?: string;
}): KernelNote {
  const device = getDevice(input.deviceId);
  if (!device) throw new Error("device_not_found");
  const row: KernelNote = {
    id: randomUUID(),
    deviceId: input.deviceId,
    name: input.name.trim(),
    op: input.op,
    rewriteSummary: input.rewriteSummary.trim(),
    speedupHint: Math.max(0.1, Math.min(50, input.speedupHint ?? 1)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().kernels.unshift(row);
  audit("engineer", "kernel.create", row.name);
  return row;
}

export function listRuns(deviceId?: string): ValidationRun[] {
  let rows = [...state().runs];
  if (deviceId) rows = rows.filter((r) => r.deviceId === deviceId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createRun(input: {
  deviceId: string;
  name: string;
  mode?: ScoreMode;
  plan?: PlanKind;
}): ValidationRun {
  const device = getDevice(input.deviceId);
  if (!device) throw new Error("device_not_found");
  const plan = input.plan ?? state().org.defaultPlan;
  const mode = input.mode ?? state().org.defaultMode;
  const inferInput = inputFromDevice(input.deviceId, undefined, plan);
  const quality =
    mode === "stage_validated"
      ? scoreStageValidated(inferInput)
      : scoreNaiveOffload(inferInput);
  const readiness = readinessFromQuality(quality, inferInput);
  const oom =
    mode === "naive_offload" &&
    (inferInput.hostSpill > 0.45 ||
      inferInput.residentGb > inferInput.vramGb * 0.95);
  const row: ValidationRun = {
    id: randomUUID(),
    deviceId: input.deviceId,
    name: input.name.trim(),
    mode,
    plan,
    status: oom ? "oom" : readiness.overallReady ? "passed" : "failed",
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().runs.unshift(row);
  audit("engineer", "run.create", `${row.name} → ${row.status}`);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromDevice(
  deviceId: string,
  patch?: Partial<InferInput>,
  planKind?: PlanKind,
): InferInput {
  const base = seedInput();
  const device = getDevice(deviceId);
  const stages = listStages(deviceId);
  const budgets = listBudgets(deviceId);
  const kernels = listKernels(deviceId);
  const avgAgree =
    stages.length > 0
      ? stages.reduce((s, r) => s + r.agreement, 0) / stages.length
      : 0.55;
  const avgEff =
    budgets.length > 0
      ? budgets.reduce((s, b) => s + b.efficiency, 0) / budgets.length
      : 0.5;
  const totalMb =
    budgets.length > 0
      ? budgets.reduce((s, b) => s + b.vramMb, 0)
      : base.residentGb * 1024;
  const avgSpeed =
    kernels.length > 0
      ? kernels.reduce((s, k) => s + Math.min(10, k.speedupHint), 0) /
        kernels.length
      : 2;
  const usable = device?.usableVramGb ?? base.vramGb;
  const resident =
    patch?.residentGb ??
    Math.max(1.5, Math.min(usable + 1.5, totalMb / 1024 || base.residentGb));
  return {
    ...base,
    ...patch,
    vramGb: patch?.vramGb ?? usable,
    residentGb: resident,
    stageAgreement:
      patch?.stageAgreement ??
      clamp01(0.35 + Math.min(0.4, stages.length * 0.1) + avgAgree * 0.35),
    kernelEfficiency:
      patch?.kernelEfficiency ??
      clamp01(0.3 + Math.min(0.35, kernels.length * 0.08) + avgEff * 0.35),
    hostSpill:
      patch?.hostSpill ??
      clamp01(
        Math.max(0, resident - usable * 0.9) * 0.35 +
          (planKind === "naive_offload" ? 0.35 : 0.06),
      ),
    prefillThroughput:
      patch?.prefillThroughput ?? clamp01(0.35 + avgSpeed * 0.05 + avgEff * 0.3),
    decodeThroughput:
      patch?.decodeThroughput ?? clamp01(0.32 + avgEff * 0.4 + avgAgree * 0.15),
    visionPortFit:
      patch?.visionPortFit ??
      clamp01(
        0.4 +
          avgAgree * 0.35 +
          (stages.some((s) => s.kind === "vision_encode") ? 0.15 : 0),
      ),
    contextK: patch?.contextK ?? base.contextK,
    stage:
      patch?.stage ??
      stages.find((s) => s.status === "gated" || s.status === "passed")?.kind ??
      "prefill",
    plan: planKind ?? state().org.defaultPlan,
  };
}

export function listCompares(): CompareResult[] {
  return [...state().compares].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function createCompare(input: {
  name: string;
  deviceId: string;
  patch?: Partial<InferInput>;
}): CompareResult {
  const device = getDevice(input.deviceId);
  if (!device) throw new Error("device_not_found");
  const inferInput = inputFromDevice(
    input.deviceId,
    input.patch,
    "stage_validated",
  );
  const naiveInput: InferInput = {
    ...inferInput,
    plan: "naive_offload",
    hostSpill: clamp01(inferInput.hostSpill + 0.35),
  };
  const stageValidated = scoreStageValidated({
    ...inferInput,
    plan: "stage_validated",
  });
  const naiveOffload = scoreNaiveOffload(naiveInput);
  const delta = stageValidated.overall - naiveOffload.overall;
  const winner =
    Math.abs(delta) < 0.5
      ? "tie"
      : delta > 0
        ? "stage_validated"
        : "naive_offload";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    deviceId: input.deviceId,
    input: inferInput,
    stageValidated,
    naiveOffload,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("engineer", "compare.create", `${row.name} → ${row.winner}`);
  return row;
}

export function listAudits(limit = 100): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function exportAuditsCsv(): string {
  const rows = listAudits(500);
  const header = "id,at,actor,action,detail";
  const body = rows
    .map((r) =>
      [r.id, r.at, r.actor, r.action, JSON.stringify(r.detail)].join(","),
    )
    .join("\n");
  return `${header}\n${body}\n`;
}

export function exportRunsJson(): string {
  return JSON.stringify({ items: listRuns() }, null, 2);
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === state().org.bearerToken;
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const org = state().org;
  const bucket = state().rateBucket;
  const nowMs = Date.now();
  if (nowMs - bucket.windowStart > 60_000) {
    bucket.windowStart = nowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  const remaining = Math.max(0, org.rateLimitPerMinute - bucket.count);
  return { ok: bucket.count <= org.rateLimitPerMinute, remaining };
}

export function ingestWebhook(
  idempotencyKey: string,
  signature: string | null,
  rawBody: string,
  payload: unknown,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = (signature ?? "").replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "bad_signature" };
    }
  } catch {
    return { ok: false, error: "bad_signature" };
  }
  const dup = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (dup) return { ok: true, duplicate: true, id: dup.id };
  const id = randomUUID();
  state().webhookEvents.push({
    id,
    idempotencyKey,
    receivedAt: now(),
    payload,
  });
  audit("webhook", "ingest", idempotencyKey);
  return { ok: true, id };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing for legacy GPU inference buyers",
    "Legacy device registry",
    "Device search and pagination",
    "Stage-validated inference plan gates",
    "Kernel / VRAM budget tracker",
    "Re-engineered kernel notes",
    "All-GPU validation runs",
    "Stage-validated vs naive-offload compare",
    "Dual score A stage-validated quality",
    "Dual score B naive offload / OOM baseline",
    "Org settings and bearer auth",
    "Member invite with roles",
    "Idempotent HMAC webhook",
    "Audit log",
    "CSV audit export",
    "JSON runs export",
    "Rate-limit feedback",
    "Features inventory API",
    "Goldens sample API",
    "Honesty fence and Sources",
    "Offline try.html demo",
    "In-app guide link",
    "Saved onboarding checklist on devices",
    "Filter stages by device and status",
  ];
}

export function sampleGoldenInput(): InferInput {
  return seedInput();
}
