import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreGenericDisasterHq,
  scorePediatricPerinatalLiaison,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type EventKind,
  type HandoffKind,
  type LiaisonBias,
  type LiaisonInput,
  type LiaisonKind,
  type LiaisonQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  EventKind,
  HandoffKind,
  LiaisonBias,
  LiaisonInput,
  LiaisonKind,
  LiaisonQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ResponsePack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  eventBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type EventSpec = {
  id: string;
  packId: string;
  label: string;
  kind: EventKind;
  hazardHint: string;
  pediatricCeiling: number;
  surgeCeiling: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type LiaisonSpec = {
  id: string;
  packId: string;
  label: string;
  kind: LiaisonKind;
  specialtyHint: string;
  coverageFloor: number;
  handoffFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type HandoffRun = {
  id: string;
  packId: string;
  eventId: string;
  liaisonId: string;
  label: string;
  kind: HandoffKind;
  pediatricLoad: number;
  handoffLatency: number;
  perinatalRisk: number;
  assaySignal: number;
  runNotes: string;
  status: EntityStatus;
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
  defaultLiaisonBias: LiaisonBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type LiaisonCompare = {
  id: string;
  name: string;
  packId: string;
  eventId: string;
  liaisonId: string;
  handoffId: string;
  input: LiaisonInput;
  pediatric: LiaisonQuality;
  genericHq: LiaisonQuality;
  winner:
    | "pediatric_perinatal_liaison"
    | "generic_disaster_hq"
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
  packs: ResponsePack[];
  events: EventSpec[];
  liaisons: LiaisonSpec[];
  handoffs: HandoffRun[];
  auditEvents: AuditEvent[];
  compares: LiaisonCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __disasterLiaisonStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const eventId = "event-demo";
  const liaisonId = "liaison-demo";
  const handoffId = "handoff-demo";
  return {
    org: {
      name: "Disaster Liaison Org",
      webhookUrl: "",
      webhookSecret: "disaster-liaison-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultLiaisonBias: "balanced",
      defaultMode: "pediatric_perinatal_liaison",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@disaster-liaison.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Pediatric-Perinatal Response Pack",
        version: "2026.1",
        programFocus:
          "Pediatric-perinatal liaison vs generic disaster HQ soft-sim",
        eventBudget: 36,
        status: "active",
        notes:
          "Seed pack for events, liaisons, and handoff soft-sims vs generic HQ",
        createdAt: now(),
      },
    ],
    events: [
      {
        id: eventId,
        packId,
        label: "Coastal earthquake surge draft",
        kind: "earthquake_surge",
        hazardHint: "earthquake-noto-style",
        pediatricCeiling: 0.45,
        surgeCeiling: 0.4,
        metricHint: "Event soft-sim",
        status: "active",
        notes: "Soft-sim event panel — not live emergency dispatch",
        createdAt: now(),
      },
    ],
    liaisons: [
      {
        id: liaisonId,
        packId,
        label: "Pediatric-perinatal liaison draft",
        kind: "pediatric_perinatal",
        specialtyHint: "pediatric-perinatal",
        coverageFloor: 0.4,
        handoffFloor: 0.35,
        metricHint: "Liaison soft-sim",
        status: "active",
        notes: "Soft-sim liaison — not clinical triage authority",
        createdAt: now(),
      },
    ],
    handoffs: [
      {
        id: handoffId,
        packId,
        eventId,
        liaisonId,
        label: "Specialty → HQ handoff soft-sim",
        kind: "specialty_to_hq",
        pediatricLoad: 0.28,
        handoffLatency: 0.32,
        perinatalRisk: 0.22,
        assaySignal: 0.7,
        runNotes:
          "Liaison looks strong on coverage but generic HQ still leads when specialty is ignored",
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
        detail: "Demo pack, events, liaisons, and handoffs seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__disasterLiaisonStore) g.__disasterLiaisonStore = seed();
  return g.__disasterLiaisonStore;
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
  g.__disasterLiaisonStore = seed();
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
  if (patch.defaultLiaisonBias !== undefined) {
    org.defaultLiaisonBias = patch.defaultLiaisonBias;
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
  items: ResponsePack[];
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
        p.programFocus.toLowerCase().includes(q) ||
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
  programFocus: string;
  eventBudget?: number;
  notes?: string;
}): ResponsePack {
  const pack: ResponsePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    eventBudget: input.eventBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ResponsePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

function listEntity<
  T extends {
    label: string;
    id: string;
    packId: string;
    status: string;
    metricHint?: string;
  },
>(
  rows: T[],
  opts?: {
    q?: string;
    packId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    extra?: (row: T, q: string) => boolean;
  },
): { items: T[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...rows];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        (m.metricHint?.toLowerCase().includes(q) ?? false) ||
        m.id.includes(q) ||
        (opts.extra?.(m, q) ?? false),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function listEvents(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().events, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.hazardHint.toLowerCase().includes(q),
  });
}

export function createEvent(input: {
  packId: string;
  label: string;
  kind: EventKind;
  hazardHint: string;
  pediatricCeiling: number;
  surgeCeiling: number;
  metricHint?: string;
  notes?: string;
}): EventSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: EventSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    hazardHint: input.hazardHint,
    pediatricCeiling: input.pediatricCeiling,
    surgeCeiling: input.surgeCeiling,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().events.unshift(row);
  audit("evaluator", "event.create", row.label);
  return row;
}

export function archiveEvent(id: string): EventSpec | null {
  const row = state().events.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "event.archive", id);
  return row;
}

export function listLiaisons(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().liaisons, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.specialtyHint.toLowerCase().includes(q),
  });
}

export function createLiaison(input: {
  packId: string;
  label: string;
  kind: LiaisonKind;
  specialtyHint: string;
  coverageFloor: number;
  handoffFloor: number;
  metricHint?: string;
  notes?: string;
}): LiaisonSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: LiaisonSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    specialtyHint: input.specialtyHint,
    coverageFloor: input.coverageFloor,
    handoffFloor: input.handoffFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().liaisons.unshift(row);
  audit("evaluator", "liaison.create", row.label);
  return row;
}

export function archiveLiaison(id: string): LiaisonSpec | null {
  const row = state().liaisons.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "liaison.archive", id);
  return row;
}

export function listHandoffs(opts?: {
  packId?: string;
  eventId?: string;
  liaisonId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: HandoffRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().handoffs];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.eventId) items = items.filter((r) => r.eventId === opts.eventId);
  if (opts?.liaisonId)
    items = items.filter((r) => r.liaisonId === opts.liaisonId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createHandoff(input: {
  packId: string;
  eventId: string;
  liaisonId: string;
  label: string;
  kind: HandoffKind;
  pediatricLoad: number;
  handoffLatency: number;
  perinatalRisk: number;
  assaySignal: number;
  runNotes?: string;
}): HandoffRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().events.some((m) => m.id === input.eventId)) return null;
  if (!state().liaisons.some((m) => m.id === input.liaisonId)) return null;
  const run: HandoffRun = {
    id: randomUUID(),
    packId: input.packId,
    eventId: input.eventId,
    liaisonId: input.liaisonId,
    label: input.label,
    kind: input.kind,
    pediatricLoad: clamp(input.pediatricLoad, 0, 1),
    handoffLatency: clamp(input.handoffLatency, 0, 1),
    perinatalRisk: clamp(input.perinatalRisk, 0, 1),
    assaySignal: clamp(input.assaySignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().handoffs.unshift(run);
  audit("evaluator", "handoff.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): LiaisonCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  eventId: string;
  liaisonId: string;
  handoffId: string;
  liaisonBias?: LiaisonBias;
  bias?: LiaisonBias;
  overclaimRisk?: number;
  hqCoordination?: number;
  surgePressure?: number;
  liaisonCoverage?: number;
}): LiaisonCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const eventRow = state().events.find((m) => m.id === input.eventId);
  const liaison = state().liaisons.find((m) => m.id === input.liaisonId);
  const handoff = state().handoffs.find((r) => r.id === input.handoffId);
  if (!pack || !eventRow || !liaison || !handoff) return null;

  const liaisonInput: LiaisonInput = {
    pediatricLoad: clamp(handoff.pediatricLoad, 0, 1),
    perinatalRisk: clamp(handoff.perinatalRisk, 0, 1),
    liaisonCoverage: clamp(
      input.liaisonCoverage ?? liaison.coverageFloor,
      0,
      1,
    ),
    handoffLatency: clamp(handoff.handoffLatency, 0, 1),
    hqCoordination: clamp(
      input.hqCoordination ?? eventRow.surgeCeiling * 0.9,
      0,
      1,
    ),
    surgePressure: clamp(
      input.surgePressure ?? eventRow.surgeCeiling,
      0,
      1,
    ),
    assaySignal: clamp(handoff.assaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - liaison.coverageFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    liaisonBias:
      input.liaisonBias ?? input.bias ?? state().org.defaultLiaisonBias,
    profile: "pediatric_perinatal_liaison",
  };

  const pediatric = scorePediatricPerinatalLiaison({
    ...liaisonInput,
    profile: "pediatric_perinatal_liaison",
  });
  const genericHq = scoreGenericDisasterHq({
    ...liaisonInput,
    profile: "generic_disaster_hq",
  });
  const gap = Math.abs(pediatric.overall - genericHq.overall);
  let winner: LiaisonCompare["winner"] = "tie";
  if (pediatric.overall > genericHq.overall + 0.5) {
    winner = "pediatric_perinatal_liaison";
  } else if (genericHq.overall > pediatric.overall + 0.5) {
    winner = "generic_disaster_hq";
  }

  const compare: LiaisonCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    eventId: eventRow.id,
    liaisonId: liaison.id,
    handoffId: handoff.id,
    input: liaisonInput,
    pediatric,
    genericHq,
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

export function getScoreboard(): LiaisonCompare[] {
  return [...state().compares].sort(
    (a, b) => b.pediatric.overall - a.pediatric.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      events: state().events,
      liaisons: state().liaisons,
      handoffs: state().handoffs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,pediatricOverall,genericHqOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.pediatric.overall},${c.genericHq.overall},${c.createdAt}`,
    ),
  ];
  return rows.join("\n");
}

export function checkBearer(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice("Bearer ".length).trim();
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
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  if (signature) {
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const provided = signature.replace(/^sha256=/, "");
    try {
      const a = Buffer.from(expected);
      const b = Buffer.from(provided);
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return { ok: false, error: "bad_signature" };
      }
    } catch {
      return { ok: false, error: "bad_signature" };
    }
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) {
    return { ok: true, duplicate: true, id: existing.id };
  }
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

export function featureInventory(): { id: string; label: string }[] {
  return [
    { id: "landing", label: "Marketing landing with buyer outcome" },
    { id: "pricing", label: "Pricing tiers" },
    { id: "demo", label: "Step-by-step guided demo" },
    { id: "onboarding", label: "Onboarding checklist" },
    { id: "flows", label: "Multi-flow index (≥5)" },
    { id: "honesty", label: "Honesty fence" },
    { id: "packs", label: "Response pack registry CRUD" },
    { id: "events", label: "Disaster event workspace" },
    { id: "liaisons", label: "Pediatric-perinatal liaison specs" },
    { id: "handoffs", label: "Specialty / HQ handoff runs" },
    { id: "compare", label: "Dual A/B compare" },
    { id: "scoreboard", label: "Compare scoreboard" },
    { id: "settings", label: "Org settings" },
    { id: "members", label: "Member invite" },
    { id: "audit", label: "Audit trail" },
    { id: "export-json", label: "JSON pack export" },
    { id: "export-csv", label: "CSV compare export" },
    { id: "webhook", label: "Idempotent webhook ingest" },
    { id: "auth", label: "Bearer token auth" },
    { id: "rate-limit", label: "Rate-limit feedback" },
    { id: "search", label: "Pack/event search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "pediatric_perinatal_liaison scorer" },
    { id: "scorer-b", label: "generic_disaster_hq scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "liaison-bias", label: "Liaison bias controls" },
    { id: "archive", label: "Archive packs/events/liaisons" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "event-kinds", label: "Disaster event kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
