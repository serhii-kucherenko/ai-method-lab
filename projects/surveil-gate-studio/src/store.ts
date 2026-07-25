import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreTrustGphSixPillar,
  scoreExplainabilityOnlyBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type PillarKind,
  type PolicyKind,
  type GovernanceBias,
  type ScoreMode,
  type SurveilGateInput,
  type SurveilGateQuality,
} from "./domain/types";

export type {
  PillarKind,
  PolicyKind,
  GovernanceBias,
  ScoreMode,
  SurveilGateInput,
  SurveilGateQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type SurveilPack = {
  id: string;
  label: string;
  version: string;
  surveillanceFocus: string;
  signalBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type PillarStatus = "draft" | "active" | "archived";

export type Pillar = {
  id: string;
  packId: string;
  label: string;
  kind: PillarKind;
  coverageHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: PillarStatus;
  notes: string;
  createdAt: string;
};

export type PolicyStatus = "draft" | "active" | "archived";

export type Policy = {
  id: string;
  packId: string;
  label: string;
  kind: PolicyKind;
  recipeHint: string;
  controlCount: number;
  severityFloor: number;
  metricHint: string;
  status: PolicyStatus;
  notes: string;
  createdAt: string;
};

export type SignalStatus = "draft" | "open" | "scored" | "archived";

export type SignalBatch = {
  id: string;
  packId?: string;
  label: string;
  signalNotes: string;
  lockCondition: string;
  feedChannel: string;
  status: SignalStatus;
  notes: string;
  createdAt: string;
};

export type AuditRunStatus = "draft" | "active" | "archived";

export type AuditRun = {
  id: string;
  signalId: string;
  pillarId: string;
  policyId: string;
  pillarCoverage: number;
  policyCompleteness: number;
  signalIntegrity: number;
  packReadiness: number;
  runNotes: string;
  status: AuditRunStatus;
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
  defaultGovernanceBias: GovernanceBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type SurveilGateCompare = {
  id: string;
  name: string;
  signalId: string;
  pillarId: string;
  policyId: string;
  auditId: string;
  input: SurveilGateInput;
  trust: SurveilGateQuality;
  explain: SurveilGateQuality;
  winner:
    | "trust_gph_six_pillar"
    | "explainability_only_baseline"
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
  packs: SurveilPack[];
  pillars: Pillar[];
  policies: Policy[];
  signals: SignalBatch[];
  audits: AuditRun[];
  auditEvents: AuditEvent[];
  compares: SurveilGateCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __surveilGateStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const pillarId = "pillar-demo";
  const policyId = "policy-demo";
  const signalId = "signal-demo";
  const auditId = "audit-demo";
  return {
    org: {
      name: "Surveil Gate Org",
      webhookUrl: "",
      webhookSecret: "surveil-gate-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultGovernanceBias: "balanced",
      defaultMode: "trust_gph_six_pillar",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@surveil-gate.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Digital Surveillance Soft-Sim Pack",
        version: "2026.1",
        surveillanceFocus:
          "Six-pillar trust governance vs explainability-only baseline",
        signalBudget: 36,
        status: "active",
        notes:
          "Seed pack for six-pillar trust vs explainability-only soft-sim",
        createdAt: now(),
      },
    ],
    pillars: [
      {
        id: pillarId,
        packId,
        label: "Public-trust + equity pillar set",
        kind: "public_trust",
        coverageHint: "pillar_coverage,equity,public_trust",
        caseCount: 6,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Pillar coverage and hallucination hardness for surveillance soft-sim",
        status: "active",
        notes:
          "Soft-sim pillars — not live national surveillance / not TRUST-GPH brand",
        createdAt: now(),
      },
    ],
    policies: [
      {
        id: policyId,
        packId,
        label: "Audit recipe + escalation",
        kind: "audit_recipe",
        recipeHint: "policy_completeness,escalation,disclosure",
        controlCount: 4,
        severityFloor: 0.35,
        metricHint: "Policy completeness and trust-erosion controls",
        status: "active",
        notes:
          "Soft-sim policy — not regulatory certification / not clinical diagnostic",
        createdAt: now(),
      },
    ],
    signals: [
      {
        id: signalId,
        packId,
        label: "Syndromic feed batch",
        signalNotes: "Noisy genAI outbreak summaries under dual governance",
        lockCondition: "lock_soft_sim",
        feedChannel: "soft_sim_surveillance_feed",
        status: "scored",
        notes: "Seed signal batch for demo compare",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: auditId,
        signalId,
        pillarId,
        policyId,
        pillarCoverage: 0.62,
        policyCompleteness: 0.7,
        signalIntegrity: 0.74,
        packReadiness: 0.68,
        runNotes:
          "Six-pillar looks strong but explain-only still leads when policies are thin",
        status: "active",
        createdAt: now(),
      },
    ],
    auditEvents: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, pillars, policies, signals, and audit seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__surveilGateStore) g.__surveilGateStore = seed();
  return g.__surveilGateStore;
}

function audit(actor: string, action: string, detail: string): void {
  state().auditEvents.unshift({
    id: randomUUID(),
    at: now(),
    actor,
    action,
    detail,
  });
}

export function resetStore(): void {
  g.__surveilGateStore = seed();
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
  if (patch.defaultGovernanceBias !== undefined) {
    org.defaultGovernanceBias = patch.defaultGovernanceBias;
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
  items: SurveilPack[];
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
        p.surveillanceFocus.toLowerCase().includes(q) ||
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
  surveillanceFocus: string;
  signalBudget?: number;
  notes?: string;
}): SurveilPack {
  const pack: SurveilPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    surveillanceFocus: input.surveillanceFocus,
    signalBudget: input.signalBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): SurveilPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listPillars(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Pillar[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().pillars];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.coverageHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPillar(input: {
  packId: string;
  label: string;
  kind: PillarKind;
  coverageHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): Pillar | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Pillar = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    coverageHint: input.coverageHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().pillars.unshift(row);
  audit("evaluator", "pillar.create", row.label);
  return row;
}

export function archivePillar(id: string): Pillar | null {
  const row = state().pillars.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "pillar.archive", id);
  return row;
}

export function listPolicies(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Policy[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().policies];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.recipeHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPolicy(input: {
  packId: string;
  label: string;
  kind: PolicyKind;
  recipeHint: string;
  controlCount: number;
  severityFloor: number;
  metricHint?: string;
  notes?: string;
}): Policy | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Policy = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    recipeHint: input.recipeHint,
    controlCount: input.controlCount,
    severityFloor: input.severityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().policies.unshift(row);
  audit("evaluator", "policy.create", row.label);
  return row;
}

export function archivePolicy(id: string): Policy | null {
  const row = state().policies.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "policy.archive", id);
  return row;
}

export function listSignals(opts?: {
  q?: string;
  feedChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SignalBatch[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().signals];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.signalNotes.toLowerCase().includes(q) ||
        c.feedChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.feedChannel) {
    items = items.filter((c) => c.feedChannel === opts.feedChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSignal(input: {
  packId?: string;
  label: string;
  signalNotes: string;
  lockCondition: string;
  feedChannel: string;
  notes?: string;
}): SignalBatch {
  const row: SignalBatch = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    signalNotes: input.signalNotes,
    lockCondition: input.lockCondition,
    feedChannel: input.feedChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().signals.unshift(row);
  audit("evaluator", "signal.create", row.label);
  return row;
}

export function archiveSignal(id: string): SignalBatch | null {
  const row = state().signals.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "signal.archive", id);
  return row;
}

export function listAuditRuns(opts?: {
  signalId?: string;
  pillarId?: string;
  policyId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AuditRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().audits];
  if (opts?.signalId) {
    items = items.filter((r) => r.signalId === opts.signalId);
  }
  if (opts?.pillarId) {
    items = items.filter((r) => r.pillarId === opts.pillarId);
  }
  if (opts?.policyId) {
    items = items.filter((r) => r.policyId === opts.policyId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAuditRun(input: {
  signalId: string;
  pillarId: string;
  policyId: string;
  pillarCoverage: number;
  policyCompleteness: number;
  signalIntegrity: number;
  packReadiness: number;
  runNotes?: string;
}): AuditRun | null {
  if (!state().signals.some((c) => c.id === input.signalId)) {
    return null;
  }
  if (!state().pillars.some((m) => m.id === input.pillarId)) {
    return null;
  }
  if (!state().policies.some((m) => m.id === input.policyId)) {
    return null;
  }
  const run: AuditRun = {
    id: randomUUID(),
    signalId: input.signalId,
    pillarId: input.pillarId,
    policyId: input.policyId,
    pillarCoverage: clamp(input.pillarCoverage, 0, 1),
    policyCompleteness: clamp(input.policyCompleteness, 0, 1),
    signalIntegrity: clamp(input.signalIntegrity, 0, 1),
    packReadiness: clamp(input.packReadiness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().audits.unshift(run);
  const row = state().signals.find((c) => c.id === input.signalId);
  if (row) row.status = "scored";
  audit("evaluator", "audit.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): SurveilGateCompare[] {
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
  signalId: string;
  pillarId: string;
  policyId: string;
  auditId: string;
  governanceBias?: GovernanceBias;
  bias?: GovernanceBias;
  explainOnlyAdherence?: number;
  trustErosionRisk?: number;
  hallucinationHardness?: number;
  overclaimRisk?: number;
}): SurveilGateCompare | null {
  const signal = state().signals.find((c) => c.id === input.signalId);
  const pillar = state().pillars.find((m) => m.id === input.pillarId);
  const policy = state().policies.find((m) => m.id === input.policyId);
  const auditRun = state().audits.find((r) => r.id === input.auditId);
  if (!signal || !pillar || !policy || !auditRun) return null;

  const goldWeight = outcomeWeight(String(signal.lockCondition));
  const span = Math.max(0.05, pillar.hardnessMax - pillar.hardnessMin);
  const sgInput: SurveilGateInput = {
    pillarCoverage: clamp(auditRun.pillarCoverage, 0, 1),
    policyCompleteness: clamp(auditRun.policyCompleteness, 0, 1),
    signalIntegrity: clamp(auditRun.signalIntegrity, 0, 1),
    packReadiness: clamp((auditRun.packReadiness + goldWeight) / 2, 0, 1),
    explainOnlyAdherence: input.explainOnlyAdherence ?? 0.82,
    trustErosionRisk: input.trustErosionRisk ?? 0.7,
    hallucinationHardness:
      input.hallucinationHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    governanceBias:
      input.governanceBias ?? input.bias ?? state().org.defaultGovernanceBias,
    profile: "trust_gph_six_pillar",
  };

  const trust = scoreTrustGphSixPillar({
    ...sgInput,
    profile: "trust_gph_six_pillar",
  });
  const explain = scoreExplainabilityOnlyBaseline({
    ...sgInput,
    profile: "explainability_only_baseline",
  });
  const gap = Math.abs(trust.overall - explain.overall);
  let winner: SurveilGateCompare["winner"] = "tie";
  if (trust.overall > explain.overall + 0.5) {
    winner = "trust_gph_six_pillar";
  } else if (explain.overall > trust.overall + 0.5) {
    winner = "explainability_only_baseline";
  }

  const compare: SurveilGateCompare = {
    id: randomUUID(),
    name: input.name,
    signalId: signal.id,
    pillarId: pillar.id,
    policyId: policy.id,
    auditId: auditRun.id,
    input: sgInput,
    trust,
    explain,
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

export function getScoreboard(): SurveilGateCompare[] {
  return [...state().compares].sort(
    (a, b) => b.trust.overall - a.trust.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      pillars: state().pillars,
      policies: state().policies,
      signals: state().signals,
      audits: state().audits,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,trustOverall,explainOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.trust.overall},${c.explain.overall},${c.createdAt}`,
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
    { id: "surveil-packs", name: "Surveillance pack registry" },
    { id: "pack-versions", name: "Versioned surveillance packs" },
    { id: "pillars", name: "Governance pillar configs" },
    { id: "pillar-editor", name: "Six-pillar editor" },
    { id: "pillar-search", name: "Pillar search and filter" },
    { id: "policies", name: "Policy recipe configs" },
    { id: "policy-editor", name: "Audit recipe editor" },
    { id: "signals", name: "Signal batch registry" },
    { id: "signal-filters", name: "Signal filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "audit-runs", name: "Governance audit soft-sim runs" },
    { id: "governance-bias", name: "Governance bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Six-pillar trust vs explainability-only compare",
    },
    { id: "delta-view", name: "Governance delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not live national surveillance / not clinical diagnostic / not certification / not TRUST-GPH",
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

export function scorePreview(input: SurveilGateInput): {
  trust: SurveilGateQuality;
  explain: SurveilGateQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const trust = scoreTrustGphSixPillar({
    ...input,
    profile: "trust_gph_six_pillar",
  });
  const explain = scoreExplainabilityOnlyBaseline({
    ...input,
    profile: "explainability_only_baseline",
  });
  return {
    trust,
    explain,
    readiness: readinessFromQuality(trust.overall),
  };
}
