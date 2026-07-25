import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreIdealizedPatient, scoreStyleAware } from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type PersonaTriageInput,
  type PersonaTriageQuality,
  type ScoreMode,
  type StyleBias,
  type UrgencyLevel,
} from "./domain/types";

export type {
  PersonaTriageInput,
  PersonaTriageQuality,
  ScoreMode,
  StyleBias,
  UrgencyLevel,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type PersonaPack = {
  id: string;
  label: string;
  version: string;
  specialtyFocus: string;
  personaCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type PersonaStatus = "draft" | "active" | "archived";

export type Persona = {
  id: string;
  packId: string;
  label: string;
  emotionalTag: string;
  strategyTag: string;
  styleAxes: string[];
  verbosity: number;
  hedging: number;
  status: PersonaStatus;
  notes: string;
  createdAt: string;
};

export type CaseStatus = "draft" | "open" | "scored" | "archived";

export type ConversationCase = {
  id: string;
  packId?: string;
  label: string;
  clinicalContent: string;
  goldUrgency: UrgencyLevel;
  specialty: string;
  status: CaseStatus;
  notes: string;
  createdAt: string;
};

export type StyleAxisStatus = "draft" | "active" | "archived";

export type StyleAxis = {
  id: string;
  packId: string;
  name: string;
  lowPole: string;
  highPole: string;
  weight: number;
  status: StyleAxisStatus;
  notes: string;
  createdAt: string;
};

export type UrgencyRunStatus = "draft" | "active" | "archived";

export type UrgencyRun = {
  id: string;
  caseId: string;
  personaId: string;
  styleFit: number;
  personaCoherence: number;
  urgencyAlignment: number;
  diversityCoverage: number;
  reviewerNotes: string;
  status: UrgencyRunStatus;
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
  defaultStyleBias: StyleBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type TriageCompare = {
  id: string;
  name: string;
  caseId: string;
  personaId: string;
  urgencyRunId: string;
  input: PersonaTriageInput;
  styleAware: PersonaTriageQuality;
  idealizedPatient: PersonaTriageQuality;
  winner: "style_aware" | "idealized_patient" | "tie";
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
  packs: PersonaPack[];
  personae: Persona[];
  conversations: ConversationCase[];
  styleAxes: StyleAxis[];
  urgencyRuns: UrgencyRun[];
  audits: AuditEntry[];
  compares: TriageCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __ptsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const personaId = "persona-demo";
  const caseId = "case-demo";
  const axisId = "axis-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Persona Triage Org",
      webhookUrl: "",
      webhookSecret: "pts-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultStyleBias: "balanced",
      defaultMode: "style_aware",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "eval-lead@persona-triage.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Communication Diversity Pack",
        version: "2026.1",
        specialtyFocus: "urgent_care",
        personaCount: 1,
        status: "active",
        notes: "Seed pack for demo compare",
        createdAt: now(),
      },
    ],
    personae: [
      {
        id: personaId,
        packId,
        label: "Anxious hedge-speaker",
        emotionalTag: "anxious",
        strategyTag: "hedging",
        styleAxes: ["verbosity", "hedging", "affect"],
        verbosity: 0.72,
        hedging: 0.8,
        status: "active",
        notes: "Seed persona with high hedging",
        createdAt: now(),
      },
    ],
    conversations: [
      {
        id: caseId,
        packId,
        label: "Chest tightness after stairs",
        clinicalContent:
          "I mean… maybe it's nothing? My chest feels weird after the stairs, not sure if I should wait.",
        goldUrgency: "urgent",
        specialty: "urgent_care",
        status: "scored",
        notes: "Seed conversation for demo compare",
        createdAt: now(),
      },
    ],
    styleAxes: [
      {
        id: axisId,
        packId,
        name: "Hedging vs direct",
        lowPole: "direct",
        highPole: "hedging",
        weight: 0.85,
        status: "active",
        notes: "Primary style axis for demo",
        createdAt: now(),
      },
    ],
    urgencyRuns: [
      {
        id: runId,
        caseId,
        personaId,
        styleFit: 0.78,
        personaCoherence: 0.74,
        urgencyAlignment: 0.7,
        diversityCoverage: 0.72,
        reviewerNotes: "Style-aware signals coherent with hedging persona",
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
        detail: "Demo pack, persona, case, style axis, and urgency run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__ptsStore) g.__ptsStore = seed();
  return g.__ptsStore;
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
  g.__ptsStore = seed();
}

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  const org = state().org;
  Object.assign(org, patch);
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
}): { items: PersonaPack[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.specialtyFocus.toLowerCase().includes(q) ||
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
  specialtyFocus: string;
  notes?: string;
}): PersonaPack {
  const pack: PersonaPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    specialtyFocus: input.specialtyFocus,
    personaCount: 0,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): PersonaPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listPersonae(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): { items: Persona[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().personae];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.emotionalTag.toLowerCase().includes(q) ||
        p.strategyTag.toLowerCase().includes(q) ||
        p.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((p) => p.packId === opts.packId);
  if (opts?.status) items = items.filter((p) => p.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPersona(input: {
  packId: string;
  label: string;
  emotionalTag: string;
  strategyTag: string;
  styleAxes?: string[];
  verbosity?: number;
  hedging?: number;
  notes?: string;
}): Persona | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const persona: Persona = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    emotionalTag: input.emotionalTag,
    strategyTag: input.strategyTag,
    styleAxes: input.styleAxes ?? ["verbosity", "hedging"],
    verbosity: input.verbosity ?? 0.5,
    hedging: input.hedging ?? 0.5,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().personae.unshift(persona);
  pack.personaCount += 1;
  audit("evaluator", "persona.create", persona.label);
  return persona;
}

export function archivePersona(id: string): Persona | null {
  const persona = state().personae.find((p) => p.id === id);
  if (!persona) return null;
  persona.status = "archived";
  audit("evaluator", "persona.archive", id);
  return persona;
}

export function listConversations(opts?: {
  q?: string;
  specialty?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ConversationCase[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().conversations];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.clinicalContent.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.specialty) {
    items = items.filter((c) => c.specialty === opts.specialty);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createConversation(input: {
  packId?: string;
  label: string;
  clinicalContent: string;
  goldUrgency: UrgencyLevel;
  specialty: string;
  notes?: string;
}): ConversationCase {
  const conversation: ConversationCase = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    clinicalContent: input.clinicalContent,
    goldUrgency: input.goldUrgency,
    specialty: input.specialty,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().conversations.unshift(conversation);
  audit("evaluator", "conversation.create", conversation.label);
  return conversation;
}

export function archiveConversation(id: string): ConversationCase | null {
  const conversation = state().conversations.find((c) => c.id === id);
  if (!conversation) return null;
  conversation.status = "archived";
  audit("evaluator", "conversation.archive", id);
  return conversation;
}

export function listStyleAxes(opts?: {
  packId?: string;
  page?: number;
  pageSize?: number;
}): { items: StyleAxis[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().styleAxes];
  if (opts?.packId) items = items.filter((a) => a.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createStyleAxis(input: {
  packId: string;
  name: string;
  lowPole: string;
  highPole: string;
  weight: number;
  notes?: string;
}): StyleAxis | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const axis: StyleAxis = {
    id: randomUUID(),
    packId: input.packId,
    name: input.name,
    lowPole: input.lowPole,
    highPole: input.highPole,
    weight: clamp(input.weight, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().styleAxes.unshift(axis);
  audit("evaluator", "style_axis.create", axis.name);
  return axis;
}

export function listUrgencyRuns(opts?: {
  caseId?: string;
  personaId?: string;
  page?: number;
  pageSize?: number;
}): { items: UrgencyRun[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().urgencyRuns];
  if (opts?.caseId) items = items.filter((r) => r.caseId === opts.caseId);
  if (opts?.personaId) {
    items = items.filter((r) => r.personaId === opts.personaId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createUrgencyRun(input: {
  caseId: string;
  personaId: string;
  styleFit: number;
  personaCoherence: number;
  urgencyAlignment: number;
  diversityCoverage: number;
  reviewerNotes?: string;
}): UrgencyRun | null {
  if (!state().conversations.some((c) => c.id === input.caseId)) return null;
  if (!state().personae.some((p) => p.id === input.personaId)) return null;
  const run: UrgencyRun = {
    id: randomUUID(),
    caseId: input.caseId,
    personaId: input.personaId,
    styleFit: clamp(input.styleFit, 0, 1),
    personaCoherence: clamp(input.personaCoherence, 0, 1),
    urgencyAlignment: clamp(input.urgencyAlignment, 0, 1),
    diversityCoverage: clamp(input.diversityCoverage, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().urgencyRuns.unshift(run);
  const conversation = state().conversations.find((c) => c.id === input.caseId);
  if (conversation) conversation.status = "scored";
  audit("evaluator", "urgency_run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): TriageCompare[] {
  return [...state().compares];
}

function urgencyWeight(level: UrgencyLevel): number {
  switch (level) {
    case "self_care":
      return 0.2;
    case "primary_care":
      return 0.45;
    case "urgent":
      return 0.7;
    case "emergency":
      return 0.92;
    default: {
      const exhaustive: never = level;
      return exhaustive;
    }
  }
}

export function runCompare(input: {
  name: string;
  caseId: string;
  personaId: string;
  urgencyRunId: string;
  styleBias?: StyleBias;
  articulationScore?: number;
  cooperationScore?: number;
  ambiguityPressure?: number;
  affectPressure?: number;
}): TriageCompare | null {
  const conversation = state().conversations.find((c) => c.id === input.caseId);
  const persona = state().personae.find((p) => p.id === input.personaId);
  const run = state().urgencyRuns.find((r) => r.id === input.urgencyRunId);
  if (!conversation || !persona || !run) return null;

  const goldWeight = urgencyWeight(conversation.goldUrgency);
  const triageInput: PersonaTriageInput = {
    styleFit: clamp(run.styleFit, 0, 1),
    personaCoherence: clamp(run.personaCoherence, 0, 1),
    urgencyAlignment: clamp(
      (run.urgencyAlignment + goldWeight) / 2,
      0,
      1,
    ),
    diversityCoverage: clamp(run.diversityCoverage, 0, 1),
    articulationScore: input.articulationScore ?? 0.78,
    cooperationScore: input.cooperationScore ?? 0.72,
    ambiguityPressure:
      input.ambiguityPressure ??
      clamp((persona.hedging + (1 - persona.verbosity) + 0.2) / 2, 0, 1),
    affectPressure:
      input.affectPressure ??
      clamp(persona.emotionalTag === "anxious" ? 0.65 : 0.35, 0, 1),
    styleBias: input.styleBias ?? state().org.defaultStyleBias,
    profile: "style_aware",
  };

  const styleAware = scoreStyleAware({
    ...triageInput,
    profile: "style_aware",
  });
  const idealizedPatient = scoreIdealizedPatient({
    ...triageInput,
    profile: "idealized_patient",
  });
  const gap = Math.abs(styleAware.overall - idealizedPatient.overall);
  let winner: TriageCompare["winner"] = "tie";
  if (styleAware.overall > idealizedPatient.overall + 0.5) {
    winner = "style_aware";
  } else if (idealizedPatient.overall > styleAware.overall + 0.5) {
    winner = "idealized_patient";
  }

  const compare: TriageCompare = {
    id: randomUUID(),
    name: input.name,
    caseId: conversation.id,
    personaId: persona.id,
    urgencyRunId: run.id,
    input: triageInput,
    styleAware,
    idealizedPatient,
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

export function getScoreboard(): TriageCompare[] {
  return [...state().compares].sort(
    (a, b) => b.styleAware.overall - a.styleAware.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      personae: state().personae,
      conversations: state().conversations,
      styleAxes: state().styleAxes,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,styleAwareOverall,idealizedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.styleAware.overall},${c.idealizedPatient.overall},${c.createdAt}`,
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
    { id: "packs", name: "Persona pack registry" },
    { id: "pack-versions", name: "Versioned persona packs" },
    { id: "personae", name: "Persona registry" },
    { id: "persona-search", name: "Persona search and filter" },
    { id: "persona-seed", name: "Seed persona packs" },
    { id: "conversations", name: "Conversation case workspace" },
    { id: "case-filters", name: "Conversation specialty filters" },
    { id: "gold-urgency", name: "Gold urgency labels" },
    { id: "style-axes", name: "Style-axis workspace" },
    { id: "style-bias", name: "Style bias controls" },
    { id: "urgency-runs", name: "Urgency assessment runs" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Style-aware vs idealized compare" },
    { id: "disparity-delta", name: "Disparity delta view" },
    { id: "scoreboard", name: "Disparity scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-clinical-advice notes" },
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

export function scorePreview(input: PersonaTriageInput): {
  styleAware: PersonaTriageQuality;
  idealizedPatient: PersonaTriageQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const styleAware = scoreStyleAware({ ...input, profile: "style_aware" });
  const idealizedPatient = scoreIdealizedPatient({
    ...input,
    profile: "idealized_patient",
  });
  return {
    styleAware,
    idealizedPatient,
    readiness: readinessFromQuality(styleAware.overall),
  };
}
