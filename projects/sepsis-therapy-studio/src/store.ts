import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreCtHmmTherapyEffectiveness,
  scoreStaticGuidelineBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type RegimenKind,
  type TherapyBias,
  type ScoreMode,
  type SepsisTherapyInput,
  type SepsisTherapyQuality,
} from "./domain/types";

export type {
  RegimenKind,
  TherapyBias,
  ScoreMode,
  SepsisTherapyInput,
  SepsisTherapyQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type TherapyPack = {
  id: string;
  label: string;
  version: string;
  therapyFocus: string;
  regimenBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type RegimenStatus = "draft" | "active" | "archived";

export type Regimen = {
  id: string;
  packId: string;
  label: string;
  kind: RegimenKind;
  antibioticHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: RegimenStatus;
  notes: string;
  createdAt: string;
};

export type OnsetStatus = "draft" | "open" | "scored" | "archived";

export type OnsetWindow = {
  id: string;
  packId?: string;
  label: string;
  windowHours: string;
  lockCondition: string;
  therapyChannel: string;
  status: OnsetStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type TherapyRun = {
  id: string;
  onsetId: string;
  regimenId: string;
  onsetCoverage: number;
  regimenFidelity: number;
  hmmStateClarity: number;
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
  defaultTherapyBias: TherapyBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type SepsisTherapyCompare = {
  id: string;
  name: string;
  onsetId: string;
  regimenId: string;
  runId: string;
  input: SepsisTherapyInput;
  ctHmm: SepsisTherapyQuality;
  guideline: SepsisTherapyQuality;
  winner:
    | "ct_hmm_therapy_effectiveness"
    | "static_guideline_baseline"
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
  packs: TherapyPack[];
  regimens: Regimen[];
  onsets: OnsetWindow[];
  runs: TherapyRun[];
  audits: AuditEvent[];
  compares: SepsisTherapyCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __sepsisTherapyStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const regimenId = "regimen-demo";
  const onsetId = "onset-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Sepsis Therapy Org",
      webhookUrl: "",
      webhookSecret: "sepsis-therapy-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultTherapyBias: "balanced",
      defaultMode: "ct_hmm_therapy_effectiveness",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@sepsis-therapy.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Early Empiric Sepsis Soft-Sim Pack",
        version: "2026.1",
        therapyFocus:
          "Continuous-time HMM therapy effectiveness vs static guideline baseline",
        regimenBudget: 36,
        status: "active",
        notes:
          "Seed pack for CT-HMM vs static guideline antibiotic soft-sim",
        createdAt: now(),
      },
    ],
    regimens: [
      {
        id: regimenId,
        packId,
        label: "Broad-spectrum empiric regimen",
        kind: "broad_spectrum_empiric",
        antibioticHint:
          "onset_coverage,regimen_fidelity,hmm_state_clarity,pack_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Onset, regimen, HMM clarity, and completeness for sepsis soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim regimen — not clinical diagnostic use / not live EHR write-back",
        createdAt: now(),
      },
    ],
    onsets: [
      {
        id: onsetId,
        packId,
        label: "First-hour onset window",
        windowHours: "0–1h empiric window before culture return",
        lockCondition: "lock_soft_sim",
        therapyChannel: "soft_sim_ct_hmm_therapy",
        status: "scored",
        notes: "Seed onset for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        onsetId,
        regimenId,
        onsetCoverage: 0.62,
        regimenFidelity: 0.7,
        hmmStateClarity: 0.74,
        packCompleteness: 0.68,
        runNotes:
          "CT-HMM looks strong but static guideline baseline still leads on culture-lag optimism",
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
        detail: "Demo pack, regimens, onsets, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__sepsisTherapyStore) g.__sepsisTherapyStore = seed();
  return g.__sepsisTherapyStore;
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
  g.__sepsisTherapyStore = seed();
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
  if (patch.defaultTherapyBias !== undefined) {
    org.defaultTherapyBias = patch.defaultTherapyBias;
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
  items: TherapyPack[];
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
        p.therapyFocus.toLowerCase().includes(q) ||
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
  therapyFocus: string;
  regimenBudget?: number;
  notes?: string;
}): TherapyPack {
  const pack: TherapyPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    therapyFocus: input.therapyFocus,
    regimenBudget: input.regimenBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): TherapyPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listRegimens(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Regimen[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().regimens];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.antibioticHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRegimen(input: {
  packId: string;
  label: string;
  kind: RegimenKind;
  antibioticHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): Regimen | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Regimen = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    antibioticHint: input.antibioticHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().regimens.unshift(row);
  audit("evaluator", "regimen.create", row.label);
  return row;
}

export function archiveRegimen(id: string): Regimen | null {
  const row = state().regimens.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "regimen.archive", id);
  return row;
}

export function listOnsets(opts?: {
  q?: string;
  therapyChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: OnsetWindow[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().onsets];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.windowHours.toLowerCase().includes(q) ||
        c.therapyChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.therapyChannel) {
    items = items.filter((c) => c.therapyChannel === opts.therapyChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createOnset(input: {
  packId?: string;
  label: string;
  windowHours: string;
  lockCondition: string;
  therapyChannel: string;
  notes?: string;
}): OnsetWindow {
  const row: OnsetWindow = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    windowHours: input.windowHours,
    lockCondition: input.lockCondition,
    therapyChannel: input.therapyChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().onsets.unshift(row);
  audit("evaluator", "onset.create", row.label);
  return row;
}

export function archiveOnset(id: string): OnsetWindow | null {
  const row = state().onsets.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "onset.archive", id);
  return row;
}

export function listRuns(opts?: {
  onsetId?: string;
  regimenId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TherapyRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.onsetId) {
    items = items.filter((r) => r.onsetId === opts.onsetId);
  }
  if (opts?.regimenId) {
    items = items.filter((r) => r.regimenId === opts.regimenId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  onsetId: string;
  regimenId: string;
  onsetCoverage: number;
  regimenFidelity: number;
  hmmStateClarity: number;
  packCompleteness: number;
  runNotes?: string;
}): TherapyRun | null {
  if (!state().onsets.some((c) => c.id === input.onsetId)) {
    return null;
  }
  if (!state().regimens.some((m) => m.id === input.regimenId)) {
    return null;
  }
  const run: TherapyRun = {
    id: randomUUID(),
    onsetId: input.onsetId,
    regimenId: input.regimenId,
    onsetCoverage: clamp(input.onsetCoverage, 0, 1),
    regimenFidelity: clamp(input.regimenFidelity, 0, 1),
    hmmStateClarity: clamp(input.hmmStateClarity, 0, 1),
    packCompleteness: clamp(input.packCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().onsets.find((c) => c.id === input.onsetId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): SepsisTherapyCompare[] {
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
  onsetId: string;
  regimenId: string;
  runId: string;
  therapyBias?: TherapyBias;
  bias?: TherapyBias;
  guidelineAdherence?: number;
  cultureLagOptimism?: number;
  sepsisHardness?: number;
  overclaimRisk?: number;
}): SepsisTherapyCompare | null {
  const onset = state().onsets.find((c) => c.id === input.onsetId);
  const regimen = state().regimens.find((m) => m.id === input.regimenId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!onset || !regimen || !run) return null;

  const goldWeight = outcomeWeight(String(onset.lockCondition));
  const span = Math.max(0.05, regimen.hardnessMax - regimen.hardnessMin);
  const stInput: SepsisTherapyInput = {
    onsetCoverage: clamp(run.onsetCoverage, 0, 1),
    regimenFidelity: clamp(run.regimenFidelity, 0, 1),
    hmmStateClarity: clamp(run.hmmStateClarity, 0, 1),
    packCompleteness: clamp((run.packCompleteness + goldWeight) / 2, 0, 1),
    guidelineAdherence: input.guidelineAdherence ?? 0.82,
    cultureLagOptimism: input.cultureLagOptimism ?? 0.7,
    sepsisHardness: input.sepsisHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    therapyBias:
      input.therapyBias ?? input.bias ?? state().org.defaultTherapyBias,
    profile: "ct_hmm_therapy_effectiveness",
  };

  const ctHmm = scoreCtHmmTherapyEffectiveness({
    ...stInput,
    profile: "ct_hmm_therapy_effectiveness",
  });
  const guideline = scoreStaticGuidelineBaseline({
    ...stInput,
    profile: "static_guideline_baseline",
  });
  const gap = Math.abs(ctHmm.overall - guideline.overall);
  let winner: SepsisTherapyCompare["winner"] = "tie";
  if (ctHmm.overall > guideline.overall + 0.5) {
    winner = "ct_hmm_therapy_effectiveness";
  } else if (guideline.overall > ctHmm.overall + 0.5) {
    winner = "static_guideline_baseline";
  }

  const compare: SepsisTherapyCompare = {
    id: randomUUID(),
    name: input.name,
    onsetId: onset.id,
    regimenId: regimen.id,
    runId: run.id,
    input: stInput,
    ctHmm,
    guideline,
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

export function getScoreboard(): SepsisTherapyCompare[] {
  return [...state().compares].sort(
    (a, b) => b.ctHmm.overall - a.ctHmm.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      regimens: state().regimens,
      onsets: state().onsets,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,ctHmmOverall,guidelineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.ctHmm.overall},${c.guideline.overall},${c.createdAt}`,
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
    { id: "therapy-packs", name: "Therapy pack registry" },
    { id: "pack-versions", name: "Versioned therapy packs" },
    { id: "regimens", name: "Regimen configs" },
    { id: "regimen-editor", name: "Regimen / antibiotic editor" },
    { id: "regimen-search", name: "Regimen search and filter" },
    { id: "seed-packs", name: "Seed therapy packs" },
    { id: "onsets", name: "Onset window registry" },
    { id: "onset-filters", name: "Onset filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "therapy-runs", name: "Therapy soft-sim runs" },
    { id: "therapy-bias", name: "Therapy bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "CT-HMM therapy effectiveness vs static guideline baseline compare",
    },
    { id: "delta-view", name: "Therapy delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not diagnostic / not live EHR write-back / not FDA / not authors' system",
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

export function scorePreview(input: SepsisTherapyInput): {
  ctHmm: SepsisTherapyQuality;
  guideline: SepsisTherapyQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const ctHmm = scoreCtHmmTherapyEffectiveness({
    ...input,
    profile: "ct_hmm_therapy_effectiveness",
  });
  const guideline = scoreStaticGuidelineBaseline({
    ...input,
    profile: "static_guideline_baseline",
  });
  return {
    ctHmm,
    guideline,
    readiness: readinessFromQuality(ctHmm.overall),
  };
}
