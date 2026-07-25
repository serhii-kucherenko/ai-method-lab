import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreChemgnnSurrogate,
  scoreClassicalPhysicsBaseline,
} from "./domain/membrane";
import {
  clamp,
  readinessFromQuality,
  round2,
  type GraphKind,
  type MembraneBias,
  type ScoreMode,
  type MembraneInput,
  type MembraneQuality,
} from "./domain/types";

export type {
  GraphKind,
  MembraneBias,
  ScoreMode,
  MembraneInput,
  MembraneQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type MembranePack = {
  id: string;
  label: string;
  version: string;
  membraneFocus: string;
  graphBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type GraphStatus = "draft" | "active" | "archived";

export type GraphConfig = {
  id: string;
  packId: string;
  label: string;
  kind: GraphKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: GraphStatus;
  notes: string;
  createdAt: string;
};

export type SurrogateStatus = "draft" | "open" | "scored" | "archived";

export type SurrogateSpec = {
  id: string;
  packId?: string;
  label: string;
  surrogateText: string;
  successCondition: string;
  membraneChannel: string;
  status: SurrogateStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type MembraneRun = {
  id: string;
  surrogateId: string;
  graphId: string;
  graphCoverage: number;
  poreGeometryFidelity: number;
  saltRejectionProxy: number;
  waterFluxProxy: number;
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
  defaultMembraneBias: MembraneBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type MembraneCompare = {
  id: string;
  name: string;
  surrogateId: string;
  graphId: string;
  runId: string;
  input: MembraneInput;
  chemgnnSurrogate: MembraneQuality;
  classicalPhysicsBaseline: MembraneQuality;
  winner: "chemgnn_surrogate" | "classical_physics_baseline" | "tie";
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
  packs: MembranePack[];
  graphs: GraphConfig[];
  surrogates: SurrogateSpec[];
  runs: MembraneRun[];
  audits: AuditEvent[];
  compares: MembraneCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __chemgnnMembraneStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const graphId = "graph-demo";
  const surrogateId = "surrogate-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Chemgnn Membrane Org",
      webhookUrl: "",
      webhookSecret: "chemgnn-membrane-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultMembraneBias: "balanced",
      defaultMode: "chemgnn_surrogate",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@chemgnn-membrane.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "ChemGNN CNT Membrane Soft-Sim Pack",
        version: "2026.1",
        membraneFocus: "CNT desalination membrane graph soft-sim",
        graphBudget: 36,
        status: "active",
        notes:
          "Seed pack for ChemGNN surrogate vs classical physics baseline soft-sim",
        createdAt: now(),
      },
    ],
    graphs: [
      {
        id: graphId,
        packId,
        label: "Aligned CNT bundle graph",
        kind: "aligned_cnt",
        channelHint:
          "graph_coverage,pore_geometry_fidelity,salt_rejection,water_flux",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "Chirality + pore + flux channels for ChemGNN soft-sim honesty",
        status: "active",
        notes: "Soft-sim graphs — not wet-lab validated / not live plant",
        createdAt: now(),
      },
    ],
    surrogates: [
      {
        id: surrogateId,
        packId,
        label: "ChemGNN CNT surrogate set",
        surrogateText:
          "Given CNT membrane graph context, run ChemGNN soft-sim against the membrane pack.",
        successCondition: "lock_soft_sim",
        membraneChannel: "soft_sim_chemgnn_cnt",
        status: "scored",
        notes: "Seed surrogate set for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        surrogateId,
        graphId,
        graphCoverage: 0.62,
        poreGeometryFidelity: 0.7,
        saltRejectionProxy: 0.74,
        waterFluxProxy: 0.68,
        reviewerNotes:
          "CNT graph looks trustworthy but classical physics needs membrane depth",
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
        detail: "Demo pack, graphs, surrogates, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__chemgnnMembraneStore) g.__chemgnnMembraneStore = seed();
  return g.__chemgnnMembraneStore;
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
  g.__chemgnnMembraneStore = seed();
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
  if (patch.defaultMembraneBias !== undefined) {
    org.defaultMembraneBias = patch.defaultMembraneBias;
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
  items: MembranePack[];
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
        p.membraneFocus.toLowerCase().includes(q) ||
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
  membraneFocus: string;
  graphBudget?: number;
  notes?: string;
}): MembranePack {
  const pack: MembranePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    membraneFocus: input.membraneFocus,
    graphBudget: input.graphBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): MembranePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listGraphs(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: GraphConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().graphs];
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

export function createGraph(input: {
  packId: string;
  label: string;
  kind: GraphKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): GraphConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: GraphConfig = {
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
  state().graphs.unshift(row);
  audit("evaluator", "graph.create", row.label);
  return row;
}

export function archiveGraph(id: string): GraphConfig | null {
  const row = state().graphs.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "graph.archive", id);
  return row;
}

export function listSurrogates(opts?: {
  q?: string;
  membraneChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SurrogateSpec[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().surrogates];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.surrogateText.toLowerCase().includes(q) ||
        c.membraneChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.membraneChannel) {
    items = items.filter((c) => c.membraneChannel === opts.membraneChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSurrogate(input: {
  packId?: string;
  label: string;
  surrogateText: string;
  successCondition: string;
  membraneChannel: string;
  notes?: string;
}): SurrogateSpec {
  const row: SurrogateSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    surrogateText: input.surrogateText,
    successCondition: input.successCondition,
    membraneChannel: input.membraneChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().surrogates.unshift(row);
  audit("evaluator", "surrogate.create", row.label);
  return row;
}

export function archiveSurrogate(id: string): SurrogateSpec | null {
  const row = state().surrogates.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "surrogate.archive", id);
  return row;
}

export function listRuns(opts?: {
  surrogateId?: string;
  graphId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: MembraneRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.surrogateId) {
    items = items.filter((r) => r.surrogateId === opts.surrogateId);
  }
  if (opts?.graphId) {
    items = items.filter((r) => r.graphId === opts.graphId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  surrogateId: string;
  graphId: string;
  graphCoverage: number;
  poreGeometryFidelity: number;
  saltRejectionProxy: number;
  waterFluxProxy: number;
  reviewerNotes?: string;
}): MembraneRun | null {
  if (!state().surrogates.some((c) => c.id === input.surrogateId)) {
    return null;
  }
  if (!state().graphs.some((m) => m.id === input.graphId)) return null;
  const run: MembraneRun = {
    id: randomUUID(),
    surrogateId: input.surrogateId,
    graphId: input.graphId,
    graphCoverage: clamp(input.graphCoverage, 0, 1),
    poreGeometryFidelity: clamp(input.poreGeometryFidelity, 0, 1),
    saltRejectionProxy: clamp(input.saltRejectionProxy, 0, 1),
    waterFluxProxy: clamp(input.waterFluxProxy, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().surrogates.find((c) => c.id === input.surrogateId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): MembraneCompare[] {
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
  surrogateId: string;
  graphId: string;
  runId: string;
  membraneBias?: MembraneBias;
  bias?: MembraneBias;
  classicalPhysicsBreadth?: number;
  baselineOptimism?: number;
  membraneHardness?: number;
  overclaimRisk?: number;
}): MembraneCompare | null {
  const surrogate = state().surrogates.find((c) => c.id === input.surrogateId);
  const graph = state().graphs.find((m) => m.id === input.graphId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!surrogate || !graph || !run) return null;

  const goldWeight = outcomeWeight(String(surrogate.successCondition));
  const span = Math.max(0.05, graph.fidelityMax - graph.fidelityMin);
  const membraneInput: MembraneInput = {
    graphCoverage: clamp(run.graphCoverage, 0, 1),
    poreGeometryFidelity: clamp(run.poreGeometryFidelity, 0, 1),
    saltRejectionProxy: clamp(run.saltRejectionProxy, 0, 1),
    waterFluxProxy: clamp((run.waterFluxProxy + goldWeight) / 2, 0, 1),
    classicalPhysicsBreadth: input.classicalPhysicsBreadth ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    membraneHardness:
      input.membraneHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    membraneBias:
      input.membraneBias ?? input.bias ?? state().org.defaultMembraneBias,
    profile: "chemgnn_surrogate",
  };

  const chemgnnSurrogate = scoreChemgnnSurrogate({
    ...membraneInput,
    profile: "chemgnn_surrogate",
  });
  const classicalPhysicsBaseline = scoreClassicalPhysicsBaseline({
    ...membraneInput,
    profile: "classical_physics_baseline",
  });
  const gap = Math.abs(
    chemgnnSurrogate.overall - classicalPhysicsBaseline.overall,
  );
  let winner: MembraneCompare["winner"] = "tie";
  if (chemgnnSurrogate.overall > classicalPhysicsBaseline.overall + 0.5) {
    winner = "chemgnn_surrogate";
  } else if (
    classicalPhysicsBaseline.overall >
    chemgnnSurrogate.overall + 0.5
  ) {
    winner = "classical_physics_baseline";
  }

  const compare: MembraneCompare = {
    id: randomUUID(),
    name: input.name,
    surrogateId: surrogate.id,
    graphId: graph.id,
    runId: run.id,
    input: membraneInput,
    chemgnnSurrogate,
    classicalPhysicsBaseline,
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

export function getScoreboard(): MembraneCompare[] {
  return [...state().compares].sort(
    (a, b) => b.chemgnnSurrogate.overall - a.chemgnnSurrogate.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      graphs: state().graphs,
      surrogates: state().surrogates,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,chemgnnOverall,classicalOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.chemgnnSurrogate.overall},${c.classicalPhysicsBaseline.overall},${c.createdAt}`,
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
    { id: "membrane-packs", name: "Membrane pack registry" },
    { id: "pack-versions", name: "Versioned membrane packs" },
    { id: "graphs", name: "CNT graph configs" },
    { id: "graph-editor", name: "Graph channel / fidelity editor" },
    { id: "graph-search", name: "Graph search and filter" },
    { id: "seed-packs", name: "Seed membrane packs" },
    { id: "surrogates", name: "ChemGNN surrogate specs" },
    { id: "surrogate-filters", name: "Surrogate filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "membrane-runs", name: "Membrane soft-sim runs" },
    { id: "membrane-bias", name: "Membrane bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "ChemGNN surrogate vs classical physics baseline compare",
    },
    { id: "delta-view", name: "Membrane delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not wet-lab validated / not live plant / not authors' system",
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

export function scorePreview(input: MembraneInput): {
  chemgnnSurrogate: MembraneQuality;
  classicalPhysicsBaseline: MembraneQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const chemgnnSurrogate = scoreChemgnnSurrogate({
    ...input,
    profile: "chemgnn_surrogate",
  });
  const classicalPhysicsBaseline = scoreClassicalPhysicsBaseline({
    ...input,
    profile: "classical_physics_baseline",
  });
  return {
    chemgnnSurrogate,
    classicalPhysicsBaseline,
    readiness: readinessFromQuality(chemgnnSurrogate.overall),
  };
}
