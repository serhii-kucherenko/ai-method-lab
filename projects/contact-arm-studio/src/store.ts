import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreContactCentric,
  scoreVisionOnlyBaseline,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ContactArmInput,
  type ContactArmQuality,
  type ContactBias,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  ContactArmInput,
  ContactArmQuality,
  ContactBias,
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

export type ManipulatorPack = {
  id: string;
  label: string;
  version: string;
  armModel: string;
  contactCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ContactStatus = "draft" | "active" | "archived";

export type ContactDefinition = {
  id: string;
  packId: string;
  label: string;
  contactPoints: string[];
  contactCoverage: number;
  tactilePriority: number;
  status: ContactStatus;
  notes: string;
  createdAt: string;
};

export type PlanStatus = "draft" | "open" | "scored" | "archived";

export type ContactPlan = {
  id: string;
  packId?: string;
  label: string;
  planSummary: string;
  successCondition: OutcomeLabel | string;
  workspace: string;
  status: PlanStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type SensingRun = {
  id: string;
  planId: string;
  contactId: string;
  contactCoverage: number;
  tactileConfidence: number;
  visionConfidence: number;
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
  defaultContactBias: ContactBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ArmCompare = {
  id: string;
  name: string;
  planId: string;
  contactId: string;
  sensingRunId: string;
  input: ContactArmInput;
  contactCentric: ContactArmQuality;
  visionOnly: ContactArmQuality;
  winner: "contact_centric" | "vision_only" | "tie";
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
  packs: ManipulatorPack[];
  contacts: ContactDefinition[];
  plans: ContactPlan[];
  sensingRuns: SensingRun[];
  audits: AuditEntry[];
  compares: ArmCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __casStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const contactId = "contact-demo";
  const planId = "plan-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Contact Arm Org",
      webhookUrl: "",
      webhookSecret: "cas-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultContactBias: "balanced",
      defaultMode: "contact_centric",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "eval-lead@contact-arm.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Whole-arm Contact Pack",
        version: "2026.1",
        armModel: "7-axis research arm",
        contactCount: 8,
        status: "active",
        notes: "Seed pack for demo contact compare",
        createdAt: now(),
      },
    ],
    contacts: [
      {
        id: contactId,
        packId,
        label: "Forearm + palm contact",
        contactPoints: ["forearm", "palm", "fingertip"],
        contactCoverage: 0.42,
        tactilePriority: 0.68,
        status: "active",
        notes: "Partial contact without full-link tactile array",
        createdAt: now(),
      },
    ],
    plans: [
      {
        id: planId,
        packId,
        label: "Slide-and-press along rail",
        planSummary:
          "Approach from above, establish forearm contact, then palm press while vision tracks the rail edge.",
        successCondition: "stable_contact",
        workspace: "bench_top",
        status: "scored",
        notes: "Seed plan for demo compare",
        createdAt: now(),
      },
    ],
    sensingRuns: [
      {
        id: runId,
        planId,
        contactId,
        contactCoverage: 0.42,
        tactileConfidence: 0.7,
        visionConfidence: 0.74,
        cueAgreement: 0.68,
        reviewerNotes:
          "Tactile cues look informative but vision alone misses shear",
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
        detail: "Demo pack, contact, plan, and sensing run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__casStore) g.__casStore = seed();
  return g.__casStore;
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
  g.__casStore = seed();
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
  if (patch.defaultContactBias !== undefined) {
    org.defaultContactBias = patch.defaultContactBias;
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
  items: ManipulatorPack[];
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
        p.armModel.toLowerCase().includes(q) ||
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
  armModel: string;
  contactCount?: number;
  notes?: string;
}): ManipulatorPack {
  const pack: ManipulatorPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    armModel: input.armModel,
    contactCount: input.contactCount ?? 8,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ManipulatorPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listContacts(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ContactDefinition[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().contacts];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.contactPoints.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createContact(input: {
  packId: string;
  label: string;
  contactPoints: string[];
  contactCoverage: number;
  tactilePriority?: number;
  notes?: string;
}): ContactDefinition | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const contact: ContactDefinition = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    contactPoints: input.contactPoints,
    contactCoverage: clamp(input.contactCoverage, 0, 1),
    tactilePriority: clamp(input.tactilePriority ?? 0.5, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().contacts.unshift(contact);
  audit("evaluator", "contact.create", contact.label);
  return contact;
}

export function archiveContact(id: string): ContactDefinition | null {
  const contact = state().contacts.find((m) => m.id === id);
  if (!contact) return null;
  contact.status = "archived";
  audit("evaluator", "contact.archive", id);
  return contact;
}

export function listPlans(opts?: {
  q?: string;
  workspace?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): { items: ContactPlan[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().plans];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.planSummary.toLowerCase().includes(q) ||
        c.workspace.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.workspace) {
    items = items.filter((c) => c.workspace === opts.workspace);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPlan(input: {
  packId?: string;
  label: string;
  planSummary: string;
  successCondition: string;
  workspace: string;
  notes?: string;
}): ContactPlan {
  const plan: ContactPlan = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    planSummary: input.planSummary,
    successCondition: input.successCondition,
    workspace: input.workspace,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().plans.unshift(plan);
  audit("evaluator", "plan.create", plan.label);
  return plan;
}

export function archivePlan(id: string): ContactPlan | null {
  const plan = state().plans.find((c) => c.id === id);
  if (!plan) return null;
  plan.status = "archived";
  audit("evaluator", "plan.archive", id);
  return plan;
}

export function listSensingRuns(opts?: {
  planId?: string;
  contactId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SensingRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().sensingRuns];
  if (opts?.planId) items = items.filter((r) => r.planId === opts.planId);
  if (opts?.contactId)
    items = items.filter((r) => r.contactId === opts.contactId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSensingRun(input: {
  planId: string;
  contactId: string;
  contactCoverage: number;
  tactileConfidence: number;
  visionConfidence: number;
  cueAgreement: number;
  reviewerNotes?: string;
}): SensingRun | null {
  if (!state().plans.some((c) => c.id === input.planId)) return null;
  if (!state().contacts.some((m) => m.id === input.contactId)) return null;
  const run: SensingRun = {
    id: randomUUID(),
    planId: input.planId,
    contactId: input.contactId,
    contactCoverage: clamp(input.contactCoverage, 0, 1),
    tactileConfidence: clamp(input.tactileConfidence, 0, 1),
    visionConfidence: clamp(input.visionConfidence, 0, 1),
    cueAgreement: clamp(input.cueAgreement, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().sensingRuns.unshift(run);
  const plan = state().plans.find((c) => c.id === input.planId);
  if (plan) plan.status = "scored";
  audit("evaluator", "sensing_run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ArmCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "negative":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "positive":
    case "stable_contact":
      return 0.7;
    case "critical":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  planId: string;
  contactId: string;
  sensingRunId: string;
  contactBias?: ContactBias;
  bias?: ContactBias;
  visionOnlyAccuracy?: number;
  visionOptimism?: number;
  contactPressure?: number;
  leakageRisk?: number;
}): ArmCompare | null {
  const plan = state().plans.find((c) => c.id === input.planId);
  const contact = state().contacts.find((m) => m.id === input.contactId);
  const run = state().sensingRuns.find((r) => r.id === input.sensingRunId);
  if (!plan || !contact || !run) return null;

  const goldWeight = outcomeWeight(String(plan.successCondition));
  const contactInput: ContactArmInput = {
    contactCoverage: clamp(run.contactCoverage, 0, 1),
    tactileSalience: clamp(run.tactileConfidence, 0, 1),
    planFit: clamp(run.visionConfidence, 0, 1),
    sensingAgreement: clamp((run.cueAgreement + goldWeight) / 2, 0, 1),
    visionOnlyAccuracy: input.visionOnlyAccuracy ?? 0.82,
    visionOptimism: input.visionOptimism ?? 0.7,
    contactPressure:
      input.contactPressure ??
      clamp(1 - contact.contactCoverage + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(contact.contactPoints.length > 6 ? 0.55 : 0.28, 0, 1),
    contactBias:
      input.contactBias ??
      input.bias ??
      state().org.defaultContactBias,
    profile: "contact_centric",
  };

  const contactCentric = scoreContactCentric({
    ...contactInput,
    profile: "contact_centric",
  });
  const visionOnly = scoreVisionOnlyBaseline({
    ...contactInput,
    profile: "vision_only",
  });
  const gap = Math.abs(contactCentric.overall - visionOnly.overall);
  let winner: ArmCompare["winner"] = "tie";
  if (contactCentric.overall > visionOnly.overall + 0.5) {
    winner = "contact_centric";
  } else if (visionOnly.overall > contactCentric.overall + 0.5) {
    winner = "vision_only";
  }

  const compare: ArmCompare = {
    id: randomUUID(),
    name: input.name,
    planId: plan.id,
    contactId: contact.id,
    sensingRunId: run.id,
    input: contactInput,
    contactCentric,
    visionOnly,
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

export function getScoreboard(): ArmCompare[] {
  return [...state().compares].sort(
    (a, b) => b.contactCentric.overall - a.contactCentric.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      contacts: state().contacts,
      plans: state().plans,
      sensingRuns: state().sensingRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,contactOverall,visionOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.contactCentric.overall},${c.visionOnly.overall},${c.createdAt}`,
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
    { id: "manipulator-packs", name: "Manipulator pack registry" },
    { id: "pack-versions", name: "Versioned manipulator packs" },
    { id: "contacts", name: "Contact point registry" },
    { id: "contact-editor", name: "Contact point editor" },
    { id: "contact-search", name: "Contact search and filter" },
    { id: "seed-packs", name: "Seed manipulator packs" },
    { id: "plans", name: "Contact plan workspace" },
    { id: "plan-filters", name: "Plan workspace filters" },
    { id: "success-conditions", name: "Plan success conditions" },
    { id: "sensing-runs", name: "Tactile+vision sensing runs" },
    { id: "contact-bias", name: "Contact bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Contact-centric vs vision-only compare" },
    { id: "delta-view", name: "Contact delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-live-robot notes" },
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

export function scorePreview(input: ContactArmInput): {
  contactCentric: ContactArmQuality;
  visionOnly: ContactArmQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const contactCentric = scoreContactCentric({
    ...input,
    profile: "contact_centric",
  });
  const visionOnly = scoreVisionOnlyBaseline({
    ...input,
    profile: "vision_only",
  });
  return {
    contactCentric,
    visionOnly,
    readiness: readinessFromQuality(contactCentric.overall),
  };
}
