import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreAlignmentFreePpgEcg,
  scoreAlignmentDependentPpgEcgBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type PpgKind,
  type InpaintBias,
  type ScoreMode,
  type NicuEcgInput,
  type NicuEcgQuality,
} from "./domain/types";

export type {
  PpgKind,
  InpaintBias,
  ScoreMode,
  NicuEcgInput,
  NicuEcgQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type EcgPack = {
  id: string;
  label: string;
  version: string;
  signalFocus: string;
  channelBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type PpgStatus = "draft" | "active" | "archived";

export type PpgChannel = {
  id: string;
  packId: string;
  label: string;
  kind: PpgKind;
  channelHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: PpgStatus;
  notes: string;
  createdAt: string;
};

export type InpaintStatus = "draft" | "open" | "scored" | "archived";

export type InpaintRecipe = {
  id: string;
  packId?: string;
  label: string;
  recipe: string;
  lockCondition: string;
  signalChannel: string;
  status: InpaintStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type EcgRun = {
  id: string;
  inpaintId: string;
  ppgChannelId: string;
  ppgCoverage: number;
  inpaintFidelity: number;
  ecgRecovery: number;
  packCompleteness: number;
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
  defaultInpaintBias: InpaintBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type NicuEcgCompare = {
  id: string;
  name: string;
  inpaintId: string;
  ppgChannelId: string;
  runId: string;
  input: NicuEcgInput;
  alignmentFree: NicuEcgQuality;
  alignmentDependent: NicuEcgQuality;
  winner:
    | "alignment_free_ppg_ecg"
    | "alignment_dependent_ppg_ecg_baseline"
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
  packs: EcgPack[];
  ppgChannels: PpgChannel[];
  inpaints: InpaintRecipe[];
  runs: EcgRun[];
  audits: AuditEvent[];
  compares: NicuEcgCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __nicuEcgStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const ppgChannelId = "ppg-demo";
  const inpaintId = "inpaint-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Nicu Ecg Org",
      webhookUrl: "",
      webhookSecret: "nicu-ecg-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultInpaintBias: "balanced",
      defaultMode: "alignment_free_ppg_ecg",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@nicu-ecg.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Neonatal PPG–ECG Soft-Sim Pack",
        version: "2026.1",
        signalFocus:
          "Alignment-free PPG-guided ECG soft-sim vs alignment-dependent baseline",
        channelBudget: 36,
        status: "active",
        notes:
          "Seed pack for alignment-free vs alignment-dependent PPG–ECG soft-sim",
        createdAt: now(),
      },
    ],
    ppgChannels: [
      {
        id: ppgChannelId,
        packId,
        label: "Dual-stream neonatal PPG",
        kind: "dual_stream",
        channelHint:
          "ppg_coverage,ecg_recovery,inpaint_fidelity,pack_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "PPG, ECG recovery, fidelity, and completeness for inpaint soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim PPG channel — not diagnostic / not live device write-back",
        createdAt: now(),
      },
    ],
    inpaints: [
      {
        id: inpaintId,
        packId,
        label: "Segment gap inpaint recipe",
        recipe:
          "Comparative PPG-guided soft-sim (alignment-free vs alignment-dependent)",
        lockCondition: "lock_soft_sim",
        signalChannel: "soft_sim_nicu_ecg_signal",
        status: "scored",
        notes: "Seed inpaint recipe for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        inpaintId,
        ppgChannelId,
        ppgCoverage: 0.62,
        inpaintFidelity: 0.7,
        ecgRecovery: 0.74,
        packCompleteness: 0.68,
        runNotes:
          "Alignment-free looks strong but alignment-dependent baseline still leads on hard neonatal gaps",
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
        detail: "Demo pack, PPG channels, inpaints, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__nicuEcgStore) g.__nicuEcgStore = seed();
  return g.__nicuEcgStore;
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
  g.__nicuEcgStore = seed();
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
  if (patch.defaultInpaintBias !== undefined) {
    org.defaultInpaintBias = patch.defaultInpaintBias;
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
  items: EcgPack[];
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
        p.signalFocus.toLowerCase().includes(q) ||
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
  signalFocus: string;
  channelBudget?: number;
  notes?: string;
}): EcgPack {
  const pack: EcgPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    signalFocus: input.signalFocus,
    channelBudget: input.channelBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): EcgPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listPpgChannels(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PpgChannel[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().ppgChannels];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.channelHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPpgChannel(input: {
  packId: string;
  label: string;
  kind: PpgKind;
  channelHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): PpgChannel | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: PpgChannel = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    channelHint: input.channelHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().ppgChannels.unshift(row);
  audit("evaluator", "ppg.create", row.label);
  return row;
}

export function archivePpgChannel(id: string): PpgChannel | null {
  const row = state().ppgChannels.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "ppg.archive", id);
  return row;
}

export function listInpaints(opts?: {
  q?: string;
  signalChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: InpaintRecipe[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().inpaints];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.recipe.toLowerCase().includes(q) ||
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

export function createInpaint(input: {
  packId?: string;
  label: string;
  recipe: string;
  lockCondition: string;
  signalChannel: string;
  notes?: string;
}): InpaintRecipe {
  const row: InpaintRecipe = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    recipe: input.recipe,
    lockCondition: input.lockCondition,
    signalChannel: input.signalChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().inpaints.unshift(row);
  audit("evaluator", "inpaint.create", row.label);
  return row;
}

export function archiveInpaint(id: string): InpaintRecipe | null {
  const row = state().inpaints.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "inpaint.archive", id);
  return row;
}

export function listRuns(opts?: {
  inpaintId?: string;
  ppgChannelId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: EcgRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.inpaintId) {
    items = items.filter((r) => r.inpaintId === opts.inpaintId);
  }
  if (opts?.ppgChannelId) {
    items = items.filter((r) => r.ppgChannelId === opts.ppgChannelId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  inpaintId: string;
  ppgChannelId: string;
  ppgCoverage: number;
  inpaintFidelity: number;
  ecgRecovery: number;
  packCompleteness: number;
  runNotes?: string;
}): EcgRun | null {
  if (!state().inpaints.some((c) => c.id === input.inpaintId)) {
    return null;
  }
  if (!state().ppgChannels.some((m) => m.id === input.ppgChannelId)) {
    return null;
  }
  const run: EcgRun = {
    id: randomUUID(),
    inpaintId: input.inpaintId,
    ppgChannelId: input.ppgChannelId,
    ppgCoverage: clamp(input.ppgCoverage, 0, 1),
    inpaintFidelity: clamp(input.inpaintFidelity, 0, 1),
    ecgRecovery: clamp(input.ecgRecovery, 0, 1),
    packCompleteness: clamp(input.packCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().inpaints.find((c) => c.id === input.inpaintId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): NicuEcgCompare[] {
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
    default: {
      const _exhaustive: string = label;
      void _exhaustive;
      return 0.55;
    }
  }
}

export function runCompare(input: {
  name: string;
  inpaintId: string;
  ppgChannelId: string;
  runId: string;
  inpaintBias?: InpaintBias;
  bias?: InpaintBias;
  alignmentConfidence?: number;
  alignmentOptimism?: number;
  segmentHardness?: number;
  overclaimRisk?: number;
}): NicuEcgCompare | null {
  const inpaint = state().inpaints.find((c) => c.id === input.inpaintId);
  const ppg = state().ppgChannels.find((m) => m.id === input.ppgChannelId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!inpaint || !ppg || !run) return null;

  const goldWeight = outcomeWeight(String(inpaint.lockCondition));
  const span = Math.max(0.05, ppg.hardnessMax - ppg.hardnessMin);
  const nicuInput: NicuEcgInput = {
    ppgCoverage: clamp(run.ppgCoverage, 0, 1),
    inpaintFidelity: clamp(run.inpaintFidelity, 0, 1),
    ecgRecovery: clamp(run.ecgRecovery, 0, 1),
    packCompleteness: clamp((run.packCompleteness + goldWeight) / 2, 0, 1),
    alignmentConfidence: input.alignmentConfidence ?? 0.82,
    alignmentOptimism: input.alignmentOptimism ?? 0.7,
    segmentHardness: input.segmentHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    inpaintBias:
      input.inpaintBias ?? input.bias ?? state().org.defaultInpaintBias,
    profile: "alignment_free_ppg_ecg",
  };

  const alignmentFree = scoreAlignmentFreePpgEcg({
    ...nicuInput,
    profile: "alignment_free_ppg_ecg",
  });
  const alignmentDependent = scoreAlignmentDependentPpgEcgBaseline({
    ...nicuInput,
    profile: "alignment_dependent_ppg_ecg_baseline",
  });
  const gap = Math.abs(alignmentFree.overall - alignmentDependent.overall);
  let winner: NicuEcgCompare["winner"] = "tie";
  if (alignmentFree.overall > alignmentDependent.overall + 0.5) {
    winner = "alignment_free_ppg_ecg";
  } else if (alignmentDependent.overall > alignmentFree.overall + 0.5) {
    winner = "alignment_dependent_ppg_ecg_baseline";
  }

  const compare: NicuEcgCompare = {
    id: randomUUID(),
    name: input.name,
    inpaintId: inpaint.id,
    ppgChannelId: ppg.id,
    runId: run.id,
    input: nicuInput,
    alignmentFree,
    alignmentDependent,
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

export function getScoreboard(): NicuEcgCompare[] {
  return [...state().compares].sort(
    (a, b) => b.alignmentFree.overall - a.alignmentFree.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      ppgChannels: state().ppgChannels,
      inpaints: state().inpaints,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,alignmentFreeOverall,alignmentDependentOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.alignmentFree.overall},${c.alignmentDependent.overall},${c.createdAt}`,
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
    { id: "ecg-packs", name: "Ecg pack registry" },
    { id: "pack-versions", name: "Versioned ecg packs" },
    { id: "ppg", name: "PPG channel configs" },
    { id: "ppg-editor", name: "PPG channel / case editor" },
    { id: "ppg-search", name: "PPG search and filter" },
    { id: "seed-packs", name: "Seed ecg packs" },
    { id: "inpaints", name: "Inpaint recipe registry" },
    { id: "inpaint-filters", name: "Inpaint filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "ecg-runs", name: "Ecg soft-sim runs" },
    { id: "inpaint-bias", name: "Inpaint bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Alignment-free PPG-ECG vs alignment-dependent baseline compare",
    },
    { id: "delta-view", name: "Inpaint delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not diagnostic / not live device write-back / not FDA / not authors' system",
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

export function scorePreview(input: NicuEcgInput): {
  alignmentFree: NicuEcgQuality;
  alignmentDependent: NicuEcgQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const alignmentFree = scoreAlignmentFreePpgEcg({
    ...input,
    profile: "alignment_free_ppg_ecg",
  });
  const alignmentDependent = scoreAlignmentDependentPpgEcgBaseline({
    ...input,
    profile: "alignment_dependent_ppg_ecg_baseline",
  });
  return {
    alignmentFree,
    alignmentDependent,
    readiness: readinessFromQuality(alignmentFree.overall),
  };
}
