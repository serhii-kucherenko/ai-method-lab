import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreAiAssistedPheEscalation,
  scoreManualTriageBaseline,
} from "./domain/phe";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ClassificationKind,
  type EscalationBias,
  type ScoreMode,
  type PheInput,
  type PheQuality,
} from "./domain/types";

export type {
  ClassificationKind,
  EscalationBias,
  ScoreMode,
  PheInput,
  PheQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type EscalatePack = {
  id: string;
  label: string;
  version: string;
  escalateFocus: string;
  caseBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ClassificationStatus = "draft" | "active" | "archived";

export type ClassificationRule = {
  id: string;
  packId: string;
  label: string;
  kind: ClassificationKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: ClassificationStatus;
  notes: string;
  createdAt: string;
};

export type ThresholdStatus = "draft" | "open" | "scored" | "archived";

export type Threshold = {
  id: string;
  packId?: string;
  label: string;
  thresholdText: string;
  lockCondition: string;
  signalChannel: string;
  status: ThresholdStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type EscalateRun = {
  id: string;
  thresholdId: string;
  classificationId: string;
  signalClarity: number;
  caseVelocity: number;
  geoSpreadProxy: number;
  labConfirmProxy: number;
  reviewerNotes: string;
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
  defaultEscalationBias: EscalationBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type PheCompare = {
  id: string;
  name: string;
  thresholdId: string;
  classificationId: string;
  runId: string;
  input: PheInput;
  aiAssisted: PheQuality;
  manualTriage: PheQuality;
  winner:
    | "ai_assisted_phe_escalation"
    | "manual_triage_baseline"
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
  packs: EscalatePack[];
  classifications: ClassificationRule[];
  thresholds: Threshold[];
  runs: EscalateRun[];
  audits: AuditEvent[];
  compares: PheCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __pheEscalateStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const classificationId = "classification-demo";
  const thresholdId = "threshold-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Phe Escalate Org",
      webhookUrl: "",
      webhookSecret: "phe-escalate-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultEscalationBias: "balanced",
      defaultMode: "ai_assisted_phe_escalation",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@phe-escalate.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "PHE Escalate Soft-Sim Pack",
        version: "2026.1",
        escalateFocus: "AI-assisted outbreak classification & escalation soft-sim",
        caseBudget: 36,
        status: "active",
        notes:
          "Seed pack for AI-assisted escalation vs manual triage baseline soft-sim",
        createdAt: now(),
      },
    ],
    classifications: [
      {
        id: classificationId,
        packId,
        label: "Syndromic + lab hybrid signal",
        kind: "hybrid_signal",
        channelHint:
          "signal_clarity,case_velocity,geo_spread,lab_confirm",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "Case velocity, geo cluster, and lab confirm channels for PHE soft-sim honesty",
        status: "active",
        notes: "Soft-sim classification — not MoH authority / not clinical diagnosis",
        createdAt: now(),
      },
    ],
    thresholds: [
      {
        id: thresholdId,
        packId,
        label: "District outbreak soft-sim threshold",
        thresholdText:
          "Given AI-assisted classification context, run PHE soft-sim against the escalate pack.",
        lockCondition: "lock_soft_sim",
        signalChannel: "soft_sim_phe_signal",
        status: "scored",
        notes: "Seed threshold set for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        thresholdId,
        classificationId,
        signalClarity: 0.62,
        caseVelocity: 0.7,
        geoSpreadProxy: 0.74,
        labConfirmProxy: 0.68,
        reviewerNotes:
          "AI-assisted path looks trustworthy but manual triage needs escalation depth",
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
        detail: "Demo pack, classifications, thresholds, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pheEscalateStore) g.__pheEscalateStore = seed();
  return g.__pheEscalateStore;
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
  g.__pheEscalateStore = seed();
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
  if (patch.defaultEscalationBias !== undefined) {
    org.defaultEscalationBias = patch.defaultEscalationBias;
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
  items: EscalatePack[];
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
        p.escalateFocus.toLowerCase().includes(q) ||
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
  escalateFocus: string;
  caseBudget?: number;
  notes?: string;
}): EscalatePack {
  const pack: EscalatePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    escalateFocus: input.escalateFocus,
    caseBudget: input.caseBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): EscalatePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listClassifications(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ClassificationRule[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().classifications];
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

export function createClassification(input: {
  packId: string;
  label: string;
  kind: ClassificationKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): ClassificationRule | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: ClassificationRule = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    channelHint: input.channelHint,
    seriesCount: input.seriesCount,
    fidelityMin: input.fidelityMin,
    fidelityMax: input.fidelityMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().classifications.unshift(row);
  audit("evaluator", "classification.create", row.label);
  return row;
}

export function archiveClassification(id: string): ClassificationRule | null {
  const row = state().classifications.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "classification.archive", id);
  return row;
}

export function listThresholds(opts?: {
  q?: string;
  signalChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Threshold[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().thresholds];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.thresholdText.toLowerCase().includes(q) ||
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

export function createThreshold(input: {
  packId?: string;
  label: string;
  thresholdText: string;
  lockCondition: string;
  signalChannel: string;
  notes?: string;
}): Threshold {
  const row: Threshold = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    thresholdText: input.thresholdText,
    lockCondition: input.lockCondition,
    signalChannel: input.signalChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().thresholds.unshift(row);
  audit("evaluator", "threshold.create", row.label);
  return row;
}

export function archiveThreshold(id: string): Threshold | null {
  const row = state().thresholds.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "threshold.archive", id);
  return row;
}

export function listRuns(opts?: {
  thresholdId?: string;
  classificationId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: EscalateRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.thresholdId) {
    items = items.filter((r) => r.thresholdId === opts.thresholdId);
  }
  if (opts?.classificationId) {
    items = items.filter((r) => r.classificationId === opts.classificationId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  thresholdId: string;
  classificationId: string;
  signalClarity: number;
  caseVelocity: number;
  geoSpreadProxy: number;
  labConfirmProxy: number;
  reviewerNotes?: string;
}): EscalateRun | null {
  if (!state().thresholds.some((c) => c.id === input.thresholdId)) {
    return null;
  }
  if (!state().classifications.some((m) => m.id === input.classificationId)) {
    return null;
  }
  const run: EscalateRun = {
    id: randomUUID(),
    thresholdId: input.thresholdId,
    classificationId: input.classificationId,
    signalClarity: clamp(input.signalClarity, 0, 1),
    caseVelocity: clamp(input.caseVelocity, 0, 1),
    geoSpreadProxy: clamp(input.geoSpreadProxy, 0, 1),
    labConfirmProxy: clamp(input.labConfirmProxy, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().thresholds.find((c) => c.id === input.thresholdId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): PheCompare[] {
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
  thresholdId: string;
  classificationId: string;
  runId: string;
  escalationBias?: EscalationBias;
  bias?: EscalationBias;
  manualTriageBreadth?: number;
  baselineOptimism?: number;
  escalationHardness?: number;
  overclaimRisk?: number;
}): PheCompare | null {
  const threshold = state().thresholds.find((c) => c.id === input.thresholdId);
  const classification = state().classifications.find(
    (m) => m.id === input.classificationId,
  );
  const run = state().runs.find((r) => r.id === input.runId);
  if (!threshold || !classification || !run) return null;

  const goldWeight = outcomeWeight(String(threshold.lockCondition));
  const span = Math.max(
    0.05,
    classification.fidelityMax - classification.fidelityMin,
  );
  const pheInput: PheInput = {
    signalClarity: clamp(run.signalClarity, 0, 1),
    caseVelocity: clamp(run.caseVelocity, 0, 1),
    geoSpreadProxy: clamp(run.geoSpreadProxy, 0, 1),
    labConfirmProxy: clamp((run.labConfirmProxy + goldWeight) / 2, 0, 1),
    manualTriageBreadth: input.manualTriageBreadth ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    escalationHardness:
      input.escalationHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    escalationBias:
      input.escalationBias ?? input.bias ?? state().org.defaultEscalationBias,
    profile: "ai_assisted_phe_escalation",
  };

  const aiAssisted = scoreAiAssistedPheEscalation({
    ...pheInput,
    profile: "ai_assisted_phe_escalation",
  });
  const manualTriage = scoreManualTriageBaseline({
    ...pheInput,
    profile: "manual_triage_baseline",
  });
  const gap = Math.abs(aiAssisted.overall - manualTriage.overall);
  let winner: PheCompare["winner"] = "tie";
  if (aiAssisted.overall > manualTriage.overall + 0.5) {
    winner = "ai_assisted_phe_escalation";
  } else if (manualTriage.overall > aiAssisted.overall + 0.5) {
    winner = "manual_triage_baseline";
  }

  const compare: PheCompare = {
    id: randomUUID(),
    name: input.name,
    thresholdId: threshold.id,
    classificationId: classification.id,
    runId: run.id,
    input: pheInput,
    aiAssisted,
    manualTriage,
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

export function getScoreboard(): PheCompare[] {
  return [...state().compares].sort(
    (a, b) => b.aiAssisted.overall - a.aiAssisted.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      classifications: state().classifications,
      thresholds: state().thresholds,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,aiOverall,triageOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.aiAssisted.overall},${c.manualTriage.overall},${c.createdAt}`,
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
    { id: "escalate-packs", name: "Escalate pack registry" },
    { id: "pack-versions", name: "Versioned escalate packs" },
    { id: "classifications", name: "Classification rule workspace" },
    { id: "classification-editor", name: "Classification channel / fidelity editor" },
    { id: "classification-search", name: "Classification search and filter" },
    { id: "seed-packs", name: "Seed escalate packs" },
    { id: "thresholds", name: "Escalation thresholds" },
    { id: "threshold-filters", name: "Threshold filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "escalate-runs", name: "Escalation soft-sim runs" },
    { id: "escalation-bias", name: "Escalation bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "AI-assisted escalation vs manual triage baseline compare",
    },
    { id: "delta-view", name: "Escalation delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not MoH authority / not live write-back / not diagnosis / not authors' system",
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

export function scorePreview(input: PheInput): {
  aiAssisted: PheQuality;
  manualTriage: PheQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const aiAssisted = scoreAiAssistedPheEscalation({
    ...input,
    profile: "ai_assisted_phe_escalation",
  });
  const manualTriage = scoreManualTriageBaseline({
    ...input,
    profile: "manual_triage_baseline",
  });
  return {
    aiAssisted,
    manualTriage,
    readiness: readinessFromQuality(aiAssisted.overall),
  };
}
