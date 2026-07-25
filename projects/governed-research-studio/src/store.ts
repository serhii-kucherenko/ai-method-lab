import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreGoverned, scoreUngated } from "./domain/governed";
import {
  clamp,
  readinessFromQuality,
  round2,
  type StudyDomain,
  type ResearchBias,
  type ResearchInput,
  type ResearchQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  StudyDomain,
  ResearchBias,
  ResearchInput,
  ResearchQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type StudyPack = {
  id: string;
  label: string;
  version: string;
  domainFocus: string;
  gateBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type GateStatus = "draft" | "active" | "archived";

export type GovernanceGate = {
  id: string;
  packId: string;
  label: string;
  domain: StudyDomain;
  checkpointCount: number;
  privacyWeight: number;
  workflowWeight: number;
  status: GateStatus;
  notes: string;
  createdAt: string;
};

export type WorkflowStatus = "draft" | "open" | "scored" | "archived";

export type WorkflowConfig = {
  id: string;
  packId?: string;
  label: string;
  workflowSummary: string;
  successCondition: string;
  researchChannel: string;
  status: WorkflowStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type ResearchRun = {
  id: string;
  workflowId: string;
  gateId: string;
  gateCoverage: number;
  workflowIntegrity: number;
  evidenceProvenance: number;
  privacyControl: number;
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
  defaultResearchBias: ResearchBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ResearchCompare = {
  id: string;
  name: string;
  workflowId: string;
  gateId: string;
  runId: string;
  input: ResearchInput;
  governed: ResearchQuality;
  ungated: ResearchQuality;
  winner: "governed" | "ungated" | "tie";
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
  packs: StudyPack[];
  gates: GovernanceGate[];
  workflows: WorkflowConfig[];
  runs: ResearchRun[];
  audits: AuditEntry[];
  compares: ResearchCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __governedResearchStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const gateId = "gate-demo";
  const workflowId = "workflow-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Governed Research Org",
      webhookUrl: "",
      webhookSecret: "governed-research-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultResearchBias: "balanced",
      defaultMode: "governed",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@governed-research.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Hypertension GWAS Soft-Sim Pack",
        version: "2026.1",
        domainFocus: "hypertension GWAS with governance gates",
        gateBudget: 36,
        status: "active",
        notes: "Seed pack for governed vs ungated compare",
        createdAt: now(),
      },
    ],
    gates: [
      {
        id: gateId,
        packId,
        label: "IRB-shaped privacy gate (soft-sim)",
        domain: "hypertension",
        checkpointCount: 14,
        privacyWeight: 0.64,
        workflowWeight: 0.36,
        status: "active",
        notes: "Soft-sim gate — not IRB cleared, not live PHI",
        createdAt: now(),
      },
    ],
    workflows: [
      {
        id: workflowId,
        packId,
        label: "Governed end-to-end research workflow",
        workflowSummary:
          "Soft-sim governed research stages vs ungated agent baseline.",
        successCondition: "lock_soft_sim",
        researchChannel: "soft_sim_research",
        status: "scored",
        notes: "Seed workflow for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        workflowId,
        gateId,
        gateCoverage: 0.62,
        workflowIntegrity: 0.7,
        evidenceProvenance: 0.74,
        privacyControl: 0.68,
        reviewerNotes:
          "Governed path looks informative but ungated agent skips privacy checkpoints under soft-sim load",
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
        detail: "Demo pack, gate, workflow, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__governedResearchStore) g.__governedResearchStore = seed();
  return g.__governedResearchStore;
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
  g.__governedResearchStore = seed();
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
  if (patch.defaultResearchBias !== undefined) {
    org.defaultResearchBias = patch.defaultResearchBias;
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
  items: StudyPack[];
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
        p.domainFocus.toLowerCase().includes(q) ||
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
  domainFocus: string;
  gateBudget?: number;
  notes?: string;
}): StudyPack {
  const pack: StudyPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    domainFocus: input.domainFocus,
    gateBudget: input.gateBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): StudyPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listGates(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: GovernanceGate[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().gates];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createGate(input: {
  packId: string;
  label: string;
  domain: StudyDomain;
  checkpointCount: number;
  privacyWeight: number;
  workflowWeight?: number;
  notes?: string;
}): GovernanceGate | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const gate: GovernanceGate = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    domain: input.domain,
    checkpointCount: Math.max(1, Math.floor(input.checkpointCount)),
    privacyWeight: clamp(input.privacyWeight, 0, 1),
    workflowWeight: clamp(input.workflowWeight ?? 1 - input.privacyWeight, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().gates.unshift(gate);
  audit("evaluator", "gate.create", gate.label);
  return gate;
}

export function archiveGate(id: string): GovernanceGate | null {
  const gate = state().gates.find((m) => m.id === id);
  if (!gate) return null;
  gate.status = "archived";
  audit("evaluator", "gate.archive", id);
  return gate;
}

export function listWorkflows(opts?: {
  q?: string;
  researchChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: WorkflowConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().workflows];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.workflowSummary.toLowerCase().includes(q) ||
        c.researchChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.researchChannel) {
    items = items.filter((c) => c.researchChannel === opts.researchChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createWorkflow(input: {
  packId?: string;
  label: string;
  workflowSummary: string;
  successCondition: string;
  researchChannel: string;
  notes?: string;
}): WorkflowConfig {
  const workflow: WorkflowConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    workflowSummary: input.workflowSummary,
    successCondition: input.successCondition,
    researchChannel: input.researchChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().workflows.unshift(workflow);
  audit("evaluator", "workflow.create", workflow.label);
  return workflow;
}

export function archiveWorkflow(id: string): WorkflowConfig | null {
  const workflow = state().workflows.find((c) => c.id === id);
  if (!workflow) return null;
  workflow.status = "archived";
  audit("evaluator", "workflow.archive", id);
  return workflow;
}

export function listRuns(opts?: {
  workflowId?: string;
  gateId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ResearchRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.workflowId) {
    items = items.filter((r) => r.workflowId === opts.workflowId);
  }
  if (opts?.gateId) {
    items = items.filter((r) => r.gateId === opts.gateId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  workflowId: string;
  gateId: string;
  gateCoverage: number;
  workflowIntegrity: number;
  evidenceProvenance: number;
  privacyControl: number;
  reviewerNotes?: string;
}): ResearchRun | null {
  if (!state().workflows.some((c) => c.id === input.workflowId)) {
    return null;
  }
  if (!state().gates.some((m) => m.id === input.gateId)) return null;
  const run: ResearchRun = {
    id: randomUUID(),
    workflowId: input.workflowId,
    gateId: input.gateId,
    gateCoverage: clamp(input.gateCoverage, 0, 1),
    workflowIntegrity: clamp(input.workflowIntegrity, 0, 1),
    evidenceProvenance: clamp(input.evidenceProvenance, 0, 1),
    privacyControl: clamp(input.privacyControl, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const workflow = state().workflows.find((c) => c.id === input.workflowId);
  if (workflow) workflow.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ResearchCompare[] {
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
  workflowId: string;
  gateId: string;
  runId: string;
  researchBias?: ResearchBias;
  bias?: ResearchBias;
  ungatedPassRate?: number;
  agentOptimism?: number;
  studyHardness?: number;
  leakageRisk?: number;
}): ResearchCompare | null {
  const workflow = state().workflows.find((c) => c.id === input.workflowId);
  const gate = state().gates.find((m) => m.id === input.gateId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!workflow || !gate || !run) return null;

  const goldWeight = outcomeWeight(String(workflow.successCondition));
  const researchInput: ResearchInput = {
    gateCoverage: clamp(run.gateCoverage, 0, 1),
    workflowIntegrity: clamp(run.workflowIntegrity, 0, 1),
    evidenceProvenance: clamp(run.evidenceProvenance, 0, 1),
    privacyControl: clamp((run.privacyControl + goldWeight) / 2, 0, 1),
    ungatedPassRate: input.ungatedPassRate ?? 0.82,
    agentOptimism: input.agentOptimism ?? 0.7,
    studyHardness:
      input.studyHardness ?? clamp(1 - gate.privacyWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(gate.checkpointCount > 16 ? 0.55 : 0.28, 0, 1),
    researchBias:
      input.researchBias ?? input.bias ?? state().org.defaultResearchBias,
    profile: "governed",
  };

  const governed = scoreGoverned({
    ...researchInput,
    profile: "governed",
  });
  const ungated = scoreUngated({
    ...researchInput,
    profile: "ungated",
  });
  const gap = Math.abs(governed.overall - ungated.overall);
  let winner: ResearchCompare["winner"] = "tie";
  if (governed.overall > ungated.overall + 0.5) {
    winner = "governed";
  } else if (ungated.overall > governed.overall + 0.5) {
    winner = "ungated";
  }

  const compare: ResearchCompare = {
    id: randomUUID(),
    name: input.name,
    workflowId: workflow.id,
    gateId: gate.id,
    runId: run.id,
    input: researchInput,
    governed,
    ungated,
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

export function getScoreboard(): ResearchCompare[] {
  return [...state().compares].sort(
    (a, b) => b.governed.overall - a.governed.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      gates: state().gates,
      workflows: state().workflows,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,governedOverall,ungatedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.governed.overall},${c.ungated.overall},${c.createdAt}`,
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
    { id: "study-packs", name: "Study pack registry" },
    { id: "pack-versions", name: "Versioned study packs" },
    { id: "governance-gates", name: "Governance gate configs" },
    { id: "gate-editor", name: "Privacy vs workflow weight editor" },
    { id: "gate-search", name: "Gate search and filter" },
    { id: "seed-packs", name: "Seed study packs" },
    { id: "workflows", name: "Research workflow workspace" },
    { id: "workflow-filters", name: "Workflow filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "research-runs", name: "Research soft-sim runs" },
    { id: "research-bias", name: "Research bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Governed vs ungated compare" },
    { id: "delta-view", name: "Research delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-IRB / not-PHI notes" },
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

export function scorePreview(input: ResearchInput): {
  governed: ResearchQuality;
  ungated: ResearchQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const governed = scoreGoverned({
    ...input,
    profile: "governed",
  });
  const ungated = scoreUngated({
    ...input,
    profile: "ungated",
  });
  return {
    governed,
    ungated,
    readiness: readinessFromQuality(governed.overall),
  };
}
