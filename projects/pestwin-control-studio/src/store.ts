import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreModularMultiagentPestControl,
  scoreSingleSpeciesBaseline,
} from "./domain/pest";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ModuleKind,
  type ControlBias,
  type ScoreMode,
  type PestInput,
  type PestQuality,
} from "./domain/types";

export type {
  ModuleKind,
  ControlBias,
  ScoreMode,
  PestInput,
  PestQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ControlPack = {
  id: string;
  label: string;
  version: string;
  controlFocus: string;
  agentBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ModuleStatus = "draft" | "active" | "archived";

export type AgentModule = {
  id: string;
  packId: string;
  label: string;
  kind: ModuleKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: ModuleStatus;
  notes: string;
  createdAt: string;
};

export type PopulationStatus = "draft" | "open" | "scored" | "archived";

export type Population = {
  id: string;
  packId?: string;
  label: string;
  populationText: string;
  successCondition: string;
  vectorChannel: string;
  status: PopulationStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type ControlRun = {
  id: string;
  populationId: string;
  moduleId: string;
  agentCoverage: number;
  moduleCoordination: number;
  suppressionProxy: number;
  vectorPressureProxy: number;
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
  defaultControlBias: ControlBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type PestCompare = {
  id: string;
  name: string;
  populationId: string;
  moduleId: string;
  runId: string;
  input: PestInput;
  modularMultiagent: PestQuality;
  singleSpeciesBaseline: PestQuality;
  winner:
    | "modular_multiagent_pest_control"
    | "single_species_baseline"
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
  packs: ControlPack[];
  modules: AgentModule[];
  populations: Population[];
  runs: ControlRun[];
  audits: AuditEvent[];
  compares: PestCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __pestwinControlStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const moduleId = "module-demo";
  const populationId = "population-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Pestwin Control Org",
      webhookUrl: "",
      webhookSecret: "pestwin-control-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultControlBias: "balanced",
      defaultMode: "modular_multiagent_pest_control",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@pestwin-control.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "PesTwin Modular Control Soft-Sim Pack",
        version: "2026.1",
        controlFocus: "Multi-agent vector/pest population soft-sim",
        agentBudget: 36,
        status: "active",
        notes:
          "Seed pack for modular multi-agent vs single-species baseline soft-sim",
        createdAt: now(),
      },
    ],
    modules: [
      {
        id: moduleId,
        packId,
        label: "Scout + trap hybrid swarm",
        kind: "hybrid_swarm",
        channelHint:
          "agent_coverage,module_coordination,suppression,vector_pressure",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "Scout, trap, and predator channels for PesTwin soft-sim honesty",
        status: "active",
        notes: "Soft-sim modules — not field-validated / not live spray-fleet",
        createdAt: now(),
      },
    ],
    populations: [
      {
        id: populationId,
        packId,
        label: "Mosquito vector soft-sim set",
        populationText:
          "Given modular agent control context, run PesTwin soft-sim against the control pack.",
        successCondition: "lock_soft_sim",
        vectorChannel: "soft_sim_pestwin_vector",
        status: "scored",
        notes: "Seed population set for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        populationId,
        moduleId,
        agentCoverage: 0.62,
        moduleCoordination: 0.7,
        suppressionProxy: 0.74,
        vectorPressureProxy: 0.68,
        reviewerNotes:
          "Agent modules look trustworthy but single-species needs control depth",
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
        detail: "Demo pack, modules, populations, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pestwinControlStore) g.__pestwinControlStore = seed();
  return g.__pestwinControlStore;
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
  g.__pestwinControlStore = seed();
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
  if (patch.defaultControlBias !== undefined) {
    org.defaultControlBias = patch.defaultControlBias;
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
  items: ControlPack[];
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
        p.controlFocus.toLowerCase().includes(q) ||
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
  controlFocus: string;
  agentBudget?: number;
  notes?: string;
}): ControlPack {
  const pack: ControlPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    controlFocus: input.controlFocus,
    agentBudget: input.agentBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ControlPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listModules(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AgentModule[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().modules];
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

export function createModule(input: {
  packId: string;
  label: string;
  kind: ModuleKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): AgentModule | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: AgentModule = {
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
  state().modules.unshift(row);
  audit("evaluator", "module.create", row.label);
  return row;
}

export function archiveModule(id: string): AgentModule | null {
  const row = state().modules.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "module.archive", id);
  return row;
}

export function listPopulations(opts?: {
  q?: string;
  vectorChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Population[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().populations];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.populationText.toLowerCase().includes(q) ||
        c.vectorChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.vectorChannel) {
    items = items.filter((c) => c.vectorChannel === opts.vectorChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPopulation(input: {
  packId?: string;
  label: string;
  populationText: string;
  successCondition: string;
  vectorChannel: string;
  notes?: string;
}): Population {
  const row: Population = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    populationText: input.populationText,
    successCondition: input.successCondition,
    vectorChannel: input.vectorChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().populations.unshift(row);
  audit("evaluator", "population.create", row.label);
  return row;
}

export function archivePopulation(id: string): Population | null {
  const row = state().populations.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "population.archive", id);
  return row;
}

export function listRuns(opts?: {
  populationId?: string;
  moduleId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ControlRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.populationId) {
    items = items.filter((r) => r.populationId === opts.populationId);
  }
  if (opts?.moduleId) {
    items = items.filter((r) => r.moduleId === opts.moduleId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  populationId: string;
  moduleId: string;
  agentCoverage: number;
  moduleCoordination: number;
  suppressionProxy: number;
  vectorPressureProxy: number;
  reviewerNotes?: string;
}): ControlRun | null {
  if (!state().populations.some((c) => c.id === input.populationId)) {
    return null;
  }
  if (!state().modules.some((m) => m.id === input.moduleId)) return null;
  const run: ControlRun = {
    id: randomUUID(),
    populationId: input.populationId,
    moduleId: input.moduleId,
    agentCoverage: clamp(input.agentCoverage, 0, 1),
    moduleCoordination: clamp(input.moduleCoordination, 0, 1),
    suppressionProxy: clamp(input.suppressionProxy, 0, 1),
    vectorPressureProxy: clamp(input.vectorPressureProxy, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().populations.find((c) => c.id === input.populationId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): PestCompare[] {
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
  populationId: string;
  moduleId: string;
  runId: string;
  controlBias?: ControlBias;
  bias?: ControlBias;
  singleSpeciesBreadth?: number;
  baselineOptimism?: number;
  controlHardness?: number;
  overclaimRisk?: number;
}): PestCompare | null {
  const population = state().populations.find(
    (c) => c.id === input.populationId,
  );
  const mod = state().modules.find((m) => m.id === input.moduleId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!population || !mod || !run) return null;

  const goldWeight = outcomeWeight(String(population.successCondition));
  const span = Math.max(0.05, mod.fidelityMax - mod.fidelityMin);
  const pestInput: PestInput = {
    agentCoverage: clamp(run.agentCoverage, 0, 1),
    moduleCoordination: clamp(run.moduleCoordination, 0, 1),
    suppressionProxy: clamp(run.suppressionProxy, 0, 1),
    vectorPressureProxy: clamp(
      (run.vectorPressureProxy + goldWeight) / 2,
      0,
      1,
    ),
    singleSpeciesBreadth: input.singleSpeciesBreadth ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    controlHardness: input.controlHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    controlBias:
      input.controlBias ?? input.bias ?? state().org.defaultControlBias,
    profile: "modular_multiagent_pest_control",
  };

  const modularMultiagent = scoreModularMultiagentPestControl({
    ...pestInput,
    profile: "modular_multiagent_pest_control",
  });
  const singleSpeciesBaseline = scoreSingleSpeciesBaseline({
    ...pestInput,
    profile: "single_species_baseline",
  });
  const gap = Math.abs(
    modularMultiagent.overall - singleSpeciesBaseline.overall,
  );
  let winner: PestCompare["winner"] = "tie";
  if (modularMultiagent.overall > singleSpeciesBaseline.overall + 0.5) {
    winner = "modular_multiagent_pest_control";
  } else if (
    singleSpeciesBaseline.overall >
    modularMultiagent.overall + 0.5
  ) {
    winner = "single_species_baseline";
  }

  const compare: PestCompare = {
    id: randomUUID(),
    name: input.name,
    populationId: population.id,
    moduleId: mod.id,
    runId: run.id,
    input: pestInput,
    modularMultiagent,
    singleSpeciesBaseline,
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

export function getScoreboard(): PestCompare[] {
  return [...state().compares].sort(
    (a, b) => b.modularMultiagent.overall - a.modularMultiagent.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      modules: state().modules,
      populations: state().populations,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,multiagentOverall,speciesOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.modularMultiagent.overall},${c.singleSpeciesBaseline.overall},${c.createdAt}`,
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
    { id: "control-packs", name: "Control pack registry" },
    { id: "pack-versions", name: "Versioned control packs" },
    { id: "modules", name: "Agent module workspace" },
    { id: "module-editor", name: "Module channel / fidelity editor" },
    { id: "module-search", name: "Module search and filter" },
    { id: "seed-packs", name: "Seed control packs" },
    { id: "populations", name: "Population specs" },
    { id: "population-filters", name: "Population filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "control-runs", name: "Control soft-sim runs" },
    { id: "control-bias", name: "Control bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Modular multi-agent vs single-species baseline compare",
    },
    { id: "delta-view", name: "Control delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not field-validated / not live spray-fleet / not authors' system",
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

export function scorePreview(input: PestInput): {
  modularMultiagent: PestQuality;
  singleSpeciesBaseline: PestQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const modularMultiagent = scoreModularMultiagentPestControl({
    ...input,
    profile: "modular_multiagent_pest_control",
  });
  const singleSpeciesBaseline = scoreSingleSpeciesBaseline({
    ...input,
    profile: "single_species_baseline",
  });
  return {
    modularMultiagent,
    singleSpeciesBaseline,
    readiness: readinessFromQuality(modularMultiagent.overall),
  };
}
