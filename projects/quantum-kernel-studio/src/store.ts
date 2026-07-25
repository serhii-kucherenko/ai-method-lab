import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreClassicalKernel,
  scoreQuantumMultiKernel,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type KernelBias,
  type QuantumKernelInput,
  type QuantumKernelQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  KernelBias,
  QuantumKernelInput,
  QuantumKernelQuality,
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

export type MoleculePack = {
  id: string;
  label: string;
  version: string;
  chemSpace: string;
  moleculeCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type KernelStatus = "draft" | "active" | "archived";

export type KernelConfig = {
  id: string;
  packId: string;
  label: string;
  kernelFamilies: string[];
  quantumWeight: number;
  classicalWeight: number;
  status: KernelStatus;
  notes: string;
  createdAt: string;
};

export type TargetStatus = "draft" | "open" | "scored" | "archived";

export type TargetCase = {
  id: string;
  packId?: string;
  label: string;
  bindingSummary: string;
  successCondition: OutcomeLabel | string;
  assayChannel: string;
  status: TargetStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type QsarRun = {
  id: string;
  targetId: string;
  kernelId: string;
  fingerprintCoverage: number;
  kernelConfidence: number;
  targetConfidence: number;
  multiKernelAgreement: number;
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
  defaultKernelBias: KernelBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type QsarCompare = {
  id: string;
  name: string;
  targetId: string;
  kernelId: string;
  qsarRunId: string;
  input: QuantumKernelInput;
  quantumMultiKernel: QuantumKernelQuality;
  classicalKernel: QuantumKernelQuality;
  winner: "quantum_multi_kernel" | "classical_kernel" | "tie";
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
  packs: MoleculePack[];
  kernels: KernelConfig[];
  targets: TargetCase[];
  qsarRuns: QsarRun[];
  audits: AuditEntry[];
  compares: QsarCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __qksStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const kernelId = "kernel-demo";
  const targetId = "target-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Quantum Kernel Org",
      webhookUrl: "",
      webhookSecret: "qks-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultKernelBias: "balanced",
      defaultMode: "quantum_multi_kernel",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "eval-lead@quantum-kernel.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Kinase Binding Pack",
        version: "2026.1",
        chemSpace: "kinase hinge scaffold library",
        moleculeCount: 128,
        status: "active",
        notes: "Seed pack for demo QSAR compare",
        createdAt: now(),
      },
    ],
    kernels: [
      {
        id: kernelId,
        packId,
        label: "Quantum multi-kernel plan",
        kernelFamilies: ["tanimoto_rbf", "quantum_fidelity", "graph_walk"],
        quantumWeight: 0.62,
        classicalWeight: 0.38,
        status: "active",
        notes: "Mixed quantum + classical families without hardware claim",
        createdAt: now(),
      },
    ],
    targets: [
      {
        id: targetId,
        packId,
        label: "EGFR hinge binder case",
        bindingSummary:
          "Soft-sim EGFR hinge pocket with fingerprint-rich actives and classical decoys.",
        successCondition: "binding_positive",
        assayChannel: "soft_sim_qsar",
        status: "scored",
        notes: "Seed target for demo compare",
        createdAt: now(),
      },
    ],
    qsarRuns: [
      {
        id: runId,
        targetId,
        kernelId,
        fingerprintCoverage: 0.58,
        kernelConfidence: 0.7,
        targetConfidence: 0.74,
        multiKernelAgreement: 0.68,
        reviewerNotes:
          "Quantum multi-kernel cues look informative but classical alone misses hard binders",
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
        detail: "Demo pack, kernel, target, and QSAR run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__qksStore) g.__qksStore = seed();
  return g.__qksStore;
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
  g.__qksStore = seed();
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
  if (patch.defaultKernelBias !== undefined) {
    org.defaultKernelBias = patch.defaultKernelBias;
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
  items: MoleculePack[];
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
        p.chemSpace.toLowerCase().includes(q) ||
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
  chemSpace: string;
  moleculeCount?: number;
  notes?: string;
}): MoleculePack {
  const pack: MoleculePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    chemSpace: input.chemSpace,
    moleculeCount: input.moleculeCount ?? 64,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): MoleculePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listKernels(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: KernelConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().kernels];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kernelFamilies.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createKernel(input: {
  packId: string;
  label: string;
  kernelFamilies: string[];
  quantumWeight: number;
  classicalWeight?: number;
  notes?: string;
}): KernelConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const kernel: KernelConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kernelFamilies: input.kernelFamilies,
    quantumWeight: clamp(input.quantumWeight, 0, 1),
    classicalWeight: clamp(
      input.classicalWeight ?? 1 - input.quantumWeight,
      0,
      1,
    ),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().kernels.unshift(kernel);
  audit("evaluator", "kernel.create", kernel.label);
  return kernel;
}

export function archiveKernel(id: string): KernelConfig | null {
  const kernel = state().kernels.find((m) => m.id === id);
  if (!kernel) return null;
  kernel.status = "archived";
  audit("evaluator", "kernel.archive", id);
  return kernel;
}

export function listTargets(opts?: {
  q?: string;
  assayChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): { items: TargetCase[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().targets];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.bindingSummary.toLowerCase().includes(q) ||
        c.assayChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.assayChannel) {
    items = items.filter((c) => c.assayChannel === opts.assayChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTarget(input: {
  packId?: string;
  label: string;
  bindingSummary: string;
  successCondition: string;
  assayChannel: string;
  notes?: string;
}): TargetCase {
  const target: TargetCase = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    bindingSummary: input.bindingSummary,
    successCondition: input.successCondition,
    assayChannel: input.assayChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().targets.unshift(target);
  audit("evaluator", "target.create", target.label);
  return target;
}

export function archiveTarget(id: string): TargetCase | null {
  const target = state().targets.find((c) => c.id === id);
  if (!target) return null;
  target.status = "archived";
  audit("evaluator", "target.archive", id);
  return target;
}

export function listQsarRuns(opts?: {
  targetId?: string;
  kernelId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: QsarRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().qsarRuns];
  if (opts?.targetId) items = items.filter((r) => r.targetId === opts.targetId);
  if (opts?.kernelId) items = items.filter((r) => r.kernelId === opts.kernelId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createQsarRun(input: {
  targetId: string;
  kernelId: string;
  fingerprintCoverage: number;
  kernelConfidence: number;
  targetConfidence: number;
  multiKernelAgreement: number;
  reviewerNotes?: string;
}): QsarRun | null {
  if (!state().targets.some((c) => c.id === input.targetId)) return null;
  if (!state().kernels.some((m) => m.id === input.kernelId)) return null;
  const run: QsarRun = {
    id: randomUUID(),
    targetId: input.targetId,
    kernelId: input.kernelId,
    fingerprintCoverage: clamp(input.fingerprintCoverage, 0, 1),
    kernelConfidence: clamp(input.kernelConfidence, 0, 1),
    targetConfidence: clamp(input.targetConfidence, 0, 1),
    multiKernelAgreement: clamp(input.multiKernelAgreement, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().qsarRuns.unshift(run);
  const target = state().targets.find((c) => c.id === input.targetId);
  if (target) target.status = "scored";
  audit("evaluator", "qsar_run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): QsarCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "negative":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "positive":
    case "binding_positive":
      return 0.7;
    case "critical":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  targetId: string;
  kernelId: string;
  qsarRunId: string;
  kernelBias?: KernelBias;
  bias?: KernelBias;
  classicalAccuracy?: number;
  classicalOptimism?: number;
  bindingHardness?: number;
  leakageRisk?: number;
}): QsarCompare | null {
  const target = state().targets.find((c) => c.id === input.targetId);
  const kernel = state().kernels.find((m) => m.id === input.kernelId);
  const run = state().qsarRuns.find((r) => r.id === input.qsarRunId);
  if (!target || !kernel || !run) return null;

  const goldWeight = outcomeWeight(String(target.successCondition));
  const qkInput: QuantumKernelInput = {
    fingerprintCoverage: clamp(run.fingerprintCoverage, 0, 1),
    kernelFidelity: clamp(run.kernelConfidence, 0, 1),
    targetFit: clamp(run.targetConfidence, 0, 1),
    multiKernelAgreement: clamp((run.multiKernelAgreement + goldWeight) / 2, 0, 1),
    classicalAccuracy: input.classicalAccuracy ?? 0.82,
    classicalOptimism: input.classicalOptimism ?? 0.7,
    bindingHardness:
      input.bindingHardness ??
      clamp(1 - kernel.quantumWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(kernel.kernelFamilies.length > 6 ? 0.55 : 0.28, 0, 1),
    kernelBias:
      input.kernelBias ??
      input.bias ??
      state().org.defaultKernelBias,
    profile: "quantum_multi_kernel",
  };

  const quantumMultiKernel = scoreQuantumMultiKernel({
    ...qkInput,
    profile: "quantum_multi_kernel",
  });
  const classicalKernel = scoreClassicalKernel({
    ...qkInput,
    profile: "classical_kernel",
  });
  const gap = Math.abs(quantumMultiKernel.overall - classicalKernel.overall);
  let winner: QsarCompare["winner"] = "tie";
  if (quantumMultiKernel.overall > classicalKernel.overall + 0.5) {
    winner = "quantum_multi_kernel";
  } else if (classicalKernel.overall > quantumMultiKernel.overall + 0.5) {
    winner = "classical_kernel";
  }

  const compare: QsarCompare = {
    id: randomUUID(),
    name: input.name,
    targetId: target.id,
    kernelId: kernel.id,
    qsarRunId: run.id,
    input: qkInput,
    quantumMultiKernel,
    classicalKernel,
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

export function getScoreboard(): QsarCompare[] {
  return [...state().compares].sort(
    (a, b) => b.quantumMultiKernel.overall - a.quantumMultiKernel.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      kernels: state().kernels,
      targets: state().targets,
      qsarRuns: state().qsarRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,quantumOverall,classicalOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.quantumMultiKernel.overall},${c.classicalKernel.overall},${c.createdAt}`,
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
    { id: "molecule-packs", name: "Molecule pack registry" },
    { id: "pack-versions", name: "Versioned molecule packs" },
    { id: "kernels", name: "Kernel config registry" },
    { id: "kernel-editor", name: "Quantum vs classical kernel editor" },
    { id: "kernel-search", name: "Kernel search and filter" },
    { id: "seed-packs", name: "Seed molecule packs" },
    { id: "targets", name: "Target case workspace" },
    { id: "target-filters", name: "Target case filters" },
    { id: "success-conditions", name: "Binding success conditions" },
    { id: "qsar-runs", name: "QSAR soft-sim runs" },
    { id: "kernel-bias", name: "Kernel bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Quantum multi-kernel vs classical compare" },
    { id: "delta-view", name: "QSAR delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-wet-lab notes" },
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

export function scorePreview(input: QuantumKernelInput): {
  quantumMultiKernel: QuantumKernelQuality;
  classicalKernel: QuantumKernelQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const quantumMultiKernel = scoreQuantumMultiKernel({
    ...input,
    profile: "quantum_multi_kernel",
  });
  const classicalKernel = scoreClassicalKernel({
    ...input,
    profile: "classical_kernel",
  });
  return {
    quantumMultiKernel,
    classicalKernel,
    readiness: readinessFromQuality(quantumMultiKernel.overall),
  };
}
