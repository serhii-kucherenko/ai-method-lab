import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreOrderedCoload, scoreSimultaneousLoad } from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type CarrierKind,
  type ColoadInput,
  type ColoadQuality,
  type LoadBias,
  type LoadOrderKind,
  type ScoreMode,
} from "./domain/types";

export type {
  AssayKind,
  CarrierKind,
  ColoadInput,
  ColoadQuality,
  LoadBias,
  LoadOrderKind,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CarrierPack = {
  id: string;
  label: string;
  version: string;
  formulationFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type CarrierSpec = {
  id: string;
  packId: string;
  label: string;
  kind: CarrierKind;
  poreHint: string;
  orderFloor: number;
  chemoFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type LoadSequence = {
  id: string;
  packId: string;
  label: string;
  kind: LoadOrderKind;
  orderHint: string;
  photoFloor: number;
  leakCeiling: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  carrierId: string;
  loadId: string;
  label: string;
  kind: AssayKind;
  orderFidelity: number;
  chemoEncapsulation: number;
  photoEncapsulation: number;
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
  defaultLoadBias: LoadBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ColoadCompare = {
  id: string;
  name: string;
  packId: string;
  carrierId: string;
  loadId: string;
  assayRunId: string;
  input: ColoadInput;
  ordered: ColoadQuality;
  simultaneous: ColoadQuality;
  winner:
    | "ordered_coload_sequence"
    | "simultaneous_load_baseline"
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
  packs: CarrierPack[];
  carriers: CarrierSpec[];
  loads: LoadSequence[];
  assayRuns: AssayRun[];
  auditEvents: AuditEvent[];
  compares: ColoadCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __coloadOrderStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const carrierId = "carrier-demo";
  const loadId = "load-demo";
  const assayRunId = "assay-demo";
  return {
    org: {
      name: "Coload Order Org",
      webhookUrl: "",
      webhookSecret: "coload-order-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultLoadBias: "balanced",
      defaultMode: "ordered_coload_sequence",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@coload-order.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "HSN Chemo-Photothermal Soft-Sim Pack",
        version: "2026.1",
        formulationFocus:
          "Ordered co-load sequence vs simultaneous-load baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for carriers, load sequences, and assay soft-sim vs simultaneous baseline",
        createdAt: now(),
      },
    ],
    carriers: [
      {
        id: carrierId,
        packId,
        label: "Hollow mesoporous silica draft",
        kind: "hollow_mesoporous_silica",
        poreHint: "mesopore-shell,hollow-core",
        orderFloor: 0.45,
        chemoFloor: 0.4,
        metricHint: "Carrier soft-sim",
        status: "active",
        notes: "Soft-sim carriers — not wet-lab validated GMP nanomedicine",
        createdAt: now(),
      },
    ],
    loads: [
      {
        id: loadId,
        packId,
        label: "DTX then ICG draft",
        kind: "dtx_then_icg",
        orderHint: "docetaxel-first,icg-second",
        photoFloor: 0.4,
        leakCeiling: 0.35,
        metricHint: "Load-sequence soft-sim",
        status: "active",
        notes: "Soft-sim load order — not live patient dosing",
        createdAt: now(),
      },
    ],
    assayRuns: [
      {
        id: assayRunId,
        packId,
        carrierId,
        loadId,
        label: "Encapsulation soft-sim",
        kind: "encapsulation_efficiency",
        orderFidelity: 0.72,
        chemoEncapsulation: 0.68,
        photoEncapsulation: 0.74,
        assaySignal: 0.7,
        runNotes:
          "Ordered load looks strong but simultaneous still leads when pore competition is high",
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
        detail: "Demo pack, carriers, loads, and assay seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__coloadOrderStore) g.__coloadOrderStore = seed();
  return g.__coloadOrderStore;
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
  g.__coloadOrderStore = seed();
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
  if (patch.defaultLoadBias !== undefined) {
    org.defaultLoadBias = patch.defaultLoadBias;
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
  items: CarrierPack[];
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
        p.formulationFocus.toLowerCase().includes(q) ||
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
  formulationFocus: string;
  sessionBudget?: number;
  notes?: string;
}): CarrierPack {
  const pack: CarrierPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    formulationFocus: input.formulationFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CarrierPack | null {
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

export function listCarriers(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().carriers, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.poreHint.toLowerCase().includes(q),
  });
}

export function createCarrier(input: {
  packId: string;
  label: string;
  kind: CarrierKind;
  poreHint: string;
  orderFloor: number;
  chemoFloor: number;
  metricHint?: string;
  notes?: string;
}): CarrierSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: CarrierSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    poreHint: input.poreHint,
    orderFloor: input.orderFloor,
    chemoFloor: input.chemoFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().carriers.unshift(row);
  audit("evaluator", "carrier.create", row.label);
  return row;
}

export function archiveCarrier(id: string): CarrierSpec | null {
  const row = state().carriers.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "carrier.archive", id);
  return row;
}

export function listLoads(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().loads, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.orderHint.toLowerCase().includes(q),
  });
}

export function createLoad(input: {
  packId: string;
  label: string;
  kind: LoadOrderKind;
  orderHint: string;
  photoFloor: number;
  leakCeiling: number;
  metricHint?: string;
  notes?: string;
}): LoadSequence | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: LoadSequence = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    orderHint: input.orderHint,
    photoFloor: input.photoFloor,
    leakCeiling: input.leakCeiling,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().loads.unshift(row);
  audit("evaluator", "load.create", row.label);
  return row;
}

export function archiveLoad(id: string): LoadSequence | null {
  const row = state().loads.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "load.archive", id);
  return row;
}

export function listAssayRuns(opts?: {
  packId?: string;
  carrierId?: string;
  loadId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AssayRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().assayRuns];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.carrierId)
    items = items.filter((r) => r.carrierId === opts.carrierId);
  if (opts?.loadId) items = items.filter((r) => r.loadId === opts.loadId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssayRun(input: {
  packId: string;
  carrierId: string;
  loadId: string;
  label: string;
  kind: AssayKind;
  orderFidelity: number;
  chemoEncapsulation: number;
  photoEncapsulation: number;
  assaySignal: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().carriers.some((m) => m.id === input.carrierId)) return null;
  if (!state().loads.some((m) => m.id === input.loadId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    carrierId: input.carrierId,
    loadId: input.loadId,
    label: input.label,
    kind: input.kind,
    orderFidelity: clamp(input.orderFidelity, 0, 1),
    chemoEncapsulation: clamp(input.chemoEncapsulation, 0, 1),
    photoEncapsulation: clamp(input.photoEncapsulation, 0, 1),
    assaySignal: clamp(input.assaySignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().assayRuns.unshift(run);
  audit("evaluator", "assay.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): ColoadCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  carrierId: string;
  loadId: string;
  assayRunId: string;
  loadBias?: LoadBias;
  bias?: LoadBias;
  overclaimRisk?: number;
  poreFillUniformity?: number;
  photothermalResponse?: number;
  burstLeakRisk?: number;
}): ColoadCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const carrier = state().carriers.find((m) => m.id === input.carrierId);
  const load = state().loads.find((m) => m.id === input.loadId);
  const assayRun = state().assayRuns.find((r) => r.id === input.assayRunId);
  if (!pack || !carrier || !load || !assayRun) return null;

  const coloadInput: ColoadInput = {
    orderFidelity: clamp(assayRun.orderFidelity, 0, 1),
    chemoEncapsulation: clamp(assayRun.chemoEncapsulation, 0, 1),
    photoEncapsulation: clamp(assayRun.photoEncapsulation, 0, 1),
    poreFillUniformity: clamp(
      input.poreFillUniformity ?? carrier.orderFloor,
      0,
      1,
    ),
    photothermalResponse: clamp(
      input.photothermalResponse ?? load.photoFloor,
      0,
      1,
    ),
    burstLeakRisk: clamp(input.burstLeakRisk ?? load.leakCeiling, 0, 1),
    assaySignal: clamp(assayRun.assaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - carrier.chemoFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    loadBias: input.loadBias ?? input.bias ?? state().org.defaultLoadBias,
    profile: "ordered_coload_sequence",
  };

  const ordered = scoreOrderedCoload({
    ...coloadInput,
    profile: "ordered_coload_sequence",
  });
  const simultaneous = scoreSimultaneousLoad({
    ...coloadInput,
    profile: "simultaneous_load_baseline",
  });
  const gap = Math.abs(ordered.overall - simultaneous.overall);
  let winner: ColoadCompare["winner"] = "tie";
  if (ordered.overall > simultaneous.overall + 0.5) {
    winner = "ordered_coload_sequence";
  } else if (simultaneous.overall > ordered.overall + 0.5) {
    winner = "simultaneous_load_baseline";
  }

  const compare: ColoadCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    carrierId: carrier.id,
    loadId: load.id,
    assayRunId: assayRun.id,
    input: coloadInput,
    ordered,
    simultaneous,
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

export function getScoreboard(): ColoadCompare[] {
  return [...state().compares].sort(
    (a, b) => b.ordered.overall - a.ordered.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      carriers: state().carriers,
      loads: state().loads,
      assayRuns: state().assayRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,orderedOverall,simultaneousOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.ordered.overall},${c.simultaneous.overall},${c.createdAt}`,
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
    { id: "carrier-packs", name: "Carrier pack registry" },
    { id: "pack-versions", name: "Versioned carrier packs" },
    { id: "carriers", name: "Carrier registry" },
    { id: "carrier-editor", name: "Carrier pore editor" },
    { id: "carrier-search", name: "Carrier search and filter" },
    { id: "loads", name: "Load sequence configs" },
    { id: "load-editor", name: "Load order editor" },
    { id: "assays", name: "Assay run soft-sim" },
    { id: "assay-filters", name: "Assay filters" },
    { id: "load-bias", name: "Load bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Ordered co-load vs simultaneous-load compare",
    },
    { id: "delta-view", name: "Encapsulation delta view" },
    { id: "scoreboard", name: "Coload scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not GMP / not live dosing / not clinical oncology clearance",
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
    { id: "search", name: "Search across packs and carriers" },
    { id: "assays-page", name: "Assay runs workspace" },
  ];
}

export function scorePreview(input: ColoadInput): {
  ordered: ColoadQuality;
  simultaneous: ColoadQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const ordered = scoreOrderedCoload({
    ...input,
    profile: "ordered_coload_sequence",
  });
  const simultaneous = scoreSimultaneousLoad({
    ...input,
    profile: "simultaneous_load_baseline",
  });
  return {
    ordered,
    simultaneous,
    readiness: readinessFromQuality(ordered.overall),
  };
}
