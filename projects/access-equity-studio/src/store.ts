import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreEquityAccessTaskSharing,
  scoreAccuracyOnlyClassifier,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type EquityBias,
  type ScreenKind,
  type ScoreMode,
  type CohortKind,
  type PathwayStage,
  type AccessEquityInput,
  type AccessEquityQuality,
} from "./domain/types";

export type {
  EquityBias,
  ScreenKind,
  ScoreMode,
  CohortKind,
  PathwayStage,
  AccessEquityInput,
  AccessEquityQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type PathwayPack = {
  id: string;
  label: string;
  version: string;
  studyFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type CohortStatus = "draft" | "active" | "archived";

export type Cohort = {
  id: string;
  packId: string;
  label: string;
  kind: CohortKind;
  regionHint: string;
  strataCount: number;
  accessMin: number;
  accessMax: number;
  metricHint: string;
  status: CohortStatus;
  notes: string;
  createdAt: string;
};

export type PathwayStatus = "draft" | "active" | "archived";

export type Pathway = {
  id: string;
  packId: string;
  label: string;
  stage: PathwayStage;
  referralHint: string;
  stepCount: number;
  waitDaysFloor: number;
  metricHint: string;
  status: PathwayStatus;
  notes: string;
  createdAt: string;
};

export type ScreenStatus = "draft" | "active" | "archived";

export type ScreenRecipe = {
  id: string;
  packId: string;
  label: string;
  kind: ScreenKind;
  fidelityHint: string;
  itemCount: number;
  sensitivityFloor: number;
  metricHint: string;
  status: ScreenStatus;
  notes: string;
  createdAt: string;
};

export type EquityGateStatus = "draft" | "open" | "scored" | "archived";

export type EquityGate = {
  id: string;
  packId?: string;
  label: string;
  gateNotes: string;
  lockCondition: string;
  equityChannel: string;
  status: EquityGateStatus;
  notes: string;
  createdAt: string;
};

export type AccessRunStatus = "draft" | "active" | "archived";

export type AccessRun = {
  id: string;
  equityGateId: string;
  cohortId: string;
  screenId: string;
  pathwayId: string;
  accessReach: number;
  equityGapClosure: number;
  taskSharingFidelity: number;
  packReadiness: number;
  runNotes: string;
  status: AccessRunStatus;
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
  defaultEquityBias: EquityBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type AccessEquityCompare = {
  id: string;
  name: string;
  equityGateId: string;
  cohortId: string;
  screenId: string;
  pathwayId: string;
  accessRunId: string;
  input: AccessEquityInput;
  equityAccess: AccessEquityQuality;
  accuracyOnly: AccessEquityQuality;
  winner:
    | "equity_access_task_sharing"
    | "accuracy_only_classifier"
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
  packs: PathwayPack[];
  cohorts: Cohort[];
  pathways: Pathway[];
  screens: ScreenRecipe[];
  equityGates: EquityGate[];
  accessRuns: AccessRun[];
  auditEvents: AuditEvent[];
  compares: AccessEquityCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __accessEquityStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const cohortId = "cohort-demo";
  const pathwayId = "pathway-demo";
  const screenId = "screen-demo";
  const equityGateId = "equity-demo";
  const accessRunId = "run-demo";
  return {
    org: {
      name: "Access Equity Org",
      webhookUrl: "",
      webhookSecret: "access-equity-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultEquityBias: "balanced",
      defaultMode: "equity_access_task_sharing",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@access-equity.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Autism Equity-Access Soft-Sim Pack",
        version: "2026.1",
        studyFocus:
          "Equity-access task-sharing vs accuracy-only classifier",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for equity-access pathways vs accuracy-only soft-sim",
        createdAt: now(),
      },
    ],
    cohorts: [
      {
        id: cohortId,
        packId,
        label: "Community + clinic screen cohort",
        kind: "community",
        regionHint: "multi_strata,community_clinic,autism_screen",
        strataCount: 4,
        accessMin: 0.4,
        accessMax: 0.95,
        metricHint:
          "Strata coverage and access reach for equity soft-sim",
        status: "active",
        notes:
          "Soft-sim cohorts — not clinical diagnostic / not autism diagnosis",
        createdAt: now(),
      },
    ],
    pathways: [
      {
        id: pathwayId,
        packId,
        label: "Screen-to-referral pathway",
        stage: "screen",
        referralHint: "community_navigator,clinic_triage",
        stepCount: 5,
        waitDaysFloor: 7,
        metricHint: "Pathway step clarity and wait floors",
        status: "active",
        notes:
          "Soft-sim pathways — not live EHR write-back / not FDA cleared",
        createdAt: now(),
      },
    ],
    screens: [
      {
        id: screenId,
        packId,
        label: "Task-shared brief screen",
        kind: "task_shared",
        fidelityHint: "caregiver,navigator,brief_probe",
        itemCount: 12,
        sensitivityFloor: 0.35,
        metricHint: "Screen fidelity and noise controls",
        status: "active",
        notes:
          "Soft-sim screens — not autism diagnosis / not clinical diagnostic",
        createdAt: now(),
      },
    ],
    equityGates: [
      {
        id: equityGateId,
        packId,
        label: "Equity gate",
        gateNotes: "Access and equity under dual methods",
        lockCondition: "lock_soft_sim",
        equityChannel: "soft_sim_access_equity",
        status: "scored",
        notes: "Seed equity gate for demo compare",
        createdAt: now(),
      },
    ],
    accessRuns: [
      {
        id: accessRunId,
        equityGateId,
        cohortId,
        screenId,
        pathwayId,
        accessReach: 0.62,
        equityGapClosure: 0.7,
        taskSharingFidelity: 0.74,
        packReadiness: 0.68,
        runNotes:
          "Equity-access looks strong but accuracy-only still leads when sharing is thin",
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
        detail:
          "Demo pack, cohorts, pathways, screens, equity gates, and access run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__accessEquityStore) g.__accessEquityStore = seed();
  return g.__accessEquityStore;
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
  g.__accessEquityStore = seed();
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
  if (patch.defaultEquityBias !== undefined) {
    org.defaultEquityBias = patch.defaultEquityBias;
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
  items: PathwayPack[];
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
        p.studyFocus.toLowerCase().includes(q) ||
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
  studyFocus: string;
  sessionBudget?: number;
  notes?: string;
}): PathwayPack {
  const pack: PathwayPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    studyFocus: input.studyFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): PathwayPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listCohorts(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Cohort[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().cohorts];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.regionHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCohort(input: {
  packId: string;
  label: string;
  kind: CohortKind;
  regionHint: string;
  strataCount: number;
  accessMin: number;
  accessMax: number;
  metricHint?: string;
  notes?: string;
}): Cohort | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Cohort = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    regionHint: input.regionHint,
    strataCount: input.strataCount,
    accessMin: input.accessMin,
    accessMax: input.accessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().cohorts.unshift(row);
  audit("evaluator", "cohort.create", row.label);
  return row;
}

export function archiveCohort(id: string): Cohort | null {
  const row = state().cohorts.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "cohort.archive", id);
  return row;
}

export function listPathways(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Pathway[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().pathways];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.stage.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.referralHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPathway(input: {
  packId: string;
  label: string;
  stage: PathwayStage;
  referralHint: string;
  stepCount: number;
  waitDaysFloor: number;
  metricHint?: string;
  notes?: string;
}): Pathway | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Pathway = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    stage: input.stage,
    referralHint: input.referralHint,
    stepCount: input.stepCount,
    waitDaysFloor: input.waitDaysFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().pathways.unshift(row);
  audit("evaluator", "pathway.create", row.label);
  return row;
}

export function archivePathway(id: string): Pathway | null {
  const row = state().pathways.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "pathway.archive", id);
  return row;
}

export function listScreens(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ScreenRecipe[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().screens];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.fidelityHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createScreen(input: {
  packId: string;
  label: string;
  kind: ScreenKind;
  fidelityHint: string;
  itemCount: number;
  sensitivityFloor: number;
  metricHint?: string;
  notes?: string;
}): ScreenRecipe | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: ScreenRecipe = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    fidelityHint: input.fidelityHint,
    itemCount: input.itemCount,
    sensitivityFloor: input.sensitivityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().screens.unshift(row);
  audit("evaluator", "screen.create", row.label);
  return row;
}

export function archiveScreen(id: string): ScreenRecipe | null {
  const row = state().screens.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "screen.archive", id);
  return row;
}

export function listEquityGates(opts?: {
  q?: string;
  equityChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: EquityGate[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().equityGates];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.gateNotes.toLowerCase().includes(q) ||
        c.equityChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.equityChannel) {
    items = items.filter((c) => c.equityChannel === opts.equityChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createEquityGate(input: {
  packId?: string;
  label: string;
  gateNotes: string;
  lockCondition: string;
  equityChannel: string;
  notes?: string;
}): EquityGate {
  const row: EquityGate = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    gateNotes: input.gateNotes,
    lockCondition: input.lockCondition,
    equityChannel: input.equityChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().equityGates.unshift(row);
  audit("evaluator", "equity.create", row.label);
  return row;
}

export function archiveEquityGate(id: string): EquityGate | null {
  const row = state().equityGates.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "equity.archive", id);
  return row;
}

export function listAccessRuns(opts?: {
  equityGateId?: string;
  cohortId?: string;
  screenId?: string;
  pathwayId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AccessRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().accessRuns];
  if (opts?.equityGateId) {
    items = items.filter((r) => r.equityGateId === opts.equityGateId);
  }
  if (opts?.cohortId) {
    items = items.filter((r) => r.cohortId === opts.cohortId);
  }
  if (opts?.screenId) {
    items = items.filter((r) => r.screenId === opts.screenId);
  }
  if (opts?.pathwayId) {
    items = items.filter((r) => r.pathwayId === opts.pathwayId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAccessRun(input: {
  equityGateId: string;
  cohortId: string;
  screenId: string;
  pathwayId: string;
  accessReach: number;
  equityGapClosure: number;
  taskSharingFidelity: number;
  packReadiness: number;
  runNotes?: string;
}): AccessRun | null {
  if (!state().equityGates.some((c) => c.id === input.equityGateId)) {
    return null;
  }
  if (!state().cohorts.some((m) => m.id === input.cohortId)) {
    return null;
  }
  if (!state().screens.some((m) => m.id === input.screenId)) {
    return null;
  }
  if (!state().pathways.some((m) => m.id === input.pathwayId)) {
    return null;
  }
  const run: AccessRun = {
    id: randomUUID(),
    equityGateId: input.equityGateId,
    cohortId: input.cohortId,
    screenId: input.screenId,
    pathwayId: input.pathwayId,
    accessReach: clamp(input.accessReach, 0, 1),
    equityGapClosure: clamp(input.equityGapClosure, 0, 1),
    taskSharingFidelity: clamp(input.taskSharingFidelity, 0, 1),
    packReadiness: clamp(input.packReadiness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().accessRuns.unshift(run);
  const row = state().equityGates.find((c) => c.id === input.equityGateId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): AccessEquityCompare[] {
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
  equityGateId: string;
  cohortId: string;
  screenId: string;
  pathwayId: string;
  accessRunId: string;
  equityBias?: EquityBias;
  bias?: EquityBias;
  accuracyAdherence?: number;
  accuracyTunnel?: number;
  screenNoise?: number;
  overclaimRisk?: number;
}): AccessEquityCompare | null {
  const gate = state().equityGates.find((c) => c.id === input.equityGateId);
  const cohort = state().cohorts.find((m) => m.id === input.cohortId);
  const screen = state().screens.find((m) => m.id === input.screenId);
  const pathway = state().pathways.find((m) => m.id === input.pathwayId);
  const accessRun = state().accessRuns.find((r) => r.id === input.accessRunId);
  if (!gate || !cohort || !screen || !pathway || !accessRun) return null;

  const goldWeight = outcomeWeight(String(gate.lockCondition));
  const span = Math.max(0.05, cohort.accessMax - cohort.accessMin);
  const aeInput: AccessEquityInput = {
    accessReach: clamp(accessRun.accessReach, 0, 1),
    equityGapClosure: clamp(accessRun.equityGapClosure, 0, 1),
    taskSharingFidelity: clamp(accessRun.taskSharingFidelity, 0, 1),
    packReadiness: clamp((accessRun.packReadiness + goldWeight) / 2, 0, 1),
    accuracyAdherence: input.accuracyAdherence ?? 0.82,
    accuracyTunnel: input.accuracyTunnel ?? 0.7,
    screenNoise: input.screenNoise ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    equityBias: input.equityBias ?? input.bias ?? state().org.defaultEquityBias,
    profile: "equity_access_task_sharing",
  };

  const equityAccess = scoreEquityAccessTaskSharing({
    ...aeInput,
    profile: "equity_access_task_sharing",
  });
  const accuracyOnly = scoreAccuracyOnlyClassifier({
    ...aeInput,
    profile: "accuracy_only_classifier",
  });
  const gap = Math.abs(equityAccess.overall - accuracyOnly.overall);
  let winner: AccessEquityCompare["winner"] = "tie";
  if (equityAccess.overall > accuracyOnly.overall + 0.5) {
    winner = "equity_access_task_sharing";
  } else if (accuracyOnly.overall > equityAccess.overall + 0.5) {
    winner = "accuracy_only_classifier";
  }

  const compare: AccessEquityCompare = {
    id: randomUUID(),
    name: input.name,
    equityGateId: gate.id,
    cohortId: cohort.id,
    screenId: screen.id,
    pathwayId: pathway.id,
    accessRunId: accessRun.id,
    input: aeInput,
    equityAccess,
    accuracyOnly,
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

export function getScoreboard(): AccessEquityCompare[] {
  return [...state().compares].sort(
    (a, b) => b.equityAccess.overall - a.equityAccess.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      cohorts: state().cohorts,
      pathways: state().pathways,
      screens: state().screens,
      equityGates: state().equityGates,
      accessRuns: state().accessRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,equityAccessOverall,accuracyOnlyOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.equityAccess.overall},${c.accuracyOnly.overall},${c.createdAt}`,
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
    { id: "pathway-packs", name: "Pathway pack registry" },
    { id: "pack-versions", name: "Versioned pathway packs" },
    { id: "cohorts", name: "Cohort configs" },
    { id: "cohort-editor", name: "Multi-strata cohort editor" },
    { id: "cohort-search", name: "Cohort search and filter" },
    { id: "pathways", name: "Pathway stage configs" },
    { id: "pathway-editor", name: "Screen-to-referral pathway editor" },
    { id: "screens", name: "Screen recipe registry" },
    { id: "screen-filters", name: "Screen recipe filters" },
    { id: "equity-gates", name: "Equity gate registry" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "access-runs", name: "Access run soft-sim" },
    { id: "equity-bias", name: "Equity bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Equity-access task-sharing vs accuracy-only compare",
    },
    { id: "delta-view", name: "Equity delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not clinical / not EHR write-back / not FDA / not autism diagnosis",
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

export function scorePreview(input: AccessEquityInput): {
  equityAccess: AccessEquityQuality;
  accuracyOnly: AccessEquityQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const equityAccess = scoreEquityAccessTaskSharing({
    ...input,
    profile: "equity_access_task_sharing",
  });
  const accuracyOnly = scoreAccuracyOnlyClassifier({
    ...input,
    profile: "accuracy_only_classifier",
  });
  return {
    equityAccess,
    accuracyOnly,
    readiness: readinessFromQuality(equityAccess.overall),
  };
}
