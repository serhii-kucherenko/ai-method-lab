import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreFragmentedMultiToolBaseline,
  scoreIntegratedAtlasWorkflow,
} from "./domain/atlas";
import {
  clamp,
  readinessFromQuality,
  round2,
  type RegistrationKind,
  type RegistrationBias,
  type ScoreMode,
  type AtlasInput,
  type AtlasQuality,
} from "./domain/types";

export type {
  RegistrationKind,
  RegistrationBias,
  ScoreMode,
  AtlasInput,
  AtlasQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type AtlasPack = {
  id: string;
  label: string;
  version: string;
  atlasFocus: string;
  regionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type RegistrationStatus = "draft" | "active" | "archived";

export type Registration = {
  id: string;
  packId: string;
  label: string;
  kind: RegistrationKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: RegistrationStatus;
  notes: string;
  createdAt: string;
};

export type QuantificationStatus = "draft" | "open" | "scored" | "archived";

export type Quantification = {
  id: string;
  packId?: string;
  label: string;
  regionText: string;
  lockCondition: string;
  quantChannel: string;
  status: QuantificationStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type AtlasRun = {
  id: string;
  quantificationId: string;
  registrationId: string;
  registrationFidelity: number;
  regionCoverage: number;
  atlasAlignment: number;
  quantStability: number;
  runNotes: string;
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
  defaultRegistrationBias: RegistrationBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type AtlasCompare = {
  id: string;
  name: string;
  quantificationId: string;
  registrationId: string;
  runId: string;
  input: AtlasInput;
  integrated: AtlasQuality;
  fragmented: AtlasQuality;
  winner:
    | "integrated_atlas_workflow"
    | "fragmented_multi_tool_baseline"
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
  packs: AtlasPack[];
  registrations: Registration[];
  quantifications: Quantification[];
  runs: AtlasRun[];
  audits: AuditEvent[];
  compares: AtlasCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __atlasFlowStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const registrationId = "reg-demo";
  const quantificationId = "quant-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Atlas Flow Org",
      webhookUrl: "",
      webhookSecret: "atlas-flow-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultRegistrationBias: "balanced",
      defaultMode: "integrated_atlas_workflow",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@atlas-flow.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Mouse Brain Atlas Soft-Sim Pack",
        version: "2026.1",
        atlasFocus:
          "Integrated atlas registration + region quantification soft-sim",
        regionBudget: 36,
        status: "active",
        notes:
          "Seed pack for integrated atlas workflow vs fragmented multi-tool baseline soft-sim",
        createdAt: now(),
      },
    ],
    registrations: [
      {
        id: registrationId,
        packId,
        label: "Nonlinear slice-to-volume registration",
        kind: "nonlinear",
        channelHint:
          "registration_fidelity,region_coverage,atlas_alignment,quant_stability",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "Fidelity, coverage, alignment, and quant stability for atlas soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim registration — not live microscope control / not diagnostic",
        createdAt: now(),
      },
    ],
    quantifications: [
      {
        id: quantificationId,
        packId,
        label: "Region quantification soft-sim",
        regionText:
          "Given registered atlas context, run region quantification soft-sim against the atlas pack.",
        lockCondition: "lock_soft_sim",
        quantChannel: "soft_sim_atlas_signal",
        status: "scored",
        notes: "Seed quantification for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        quantificationId,
        registrationId,
        registrationFidelity: 0.62,
        regionCoverage: 0.7,
        atlasAlignment: 0.74,
        quantStability: 0.68,
        runNotes:
          "Integrated path looks trustworthy but fragmented multi-tool needs more stitching honesty",
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
        detail: "Demo pack, registrations, quantifications, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__atlasFlowStore) g.__atlasFlowStore = seed();
  return g.__atlasFlowStore;
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
  g.__atlasFlowStore = seed();
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
  if (patch.defaultRegistrationBias !== undefined) {
    org.defaultRegistrationBias = patch.defaultRegistrationBias;
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
  items: AtlasPack[];
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
        p.atlasFocus.toLowerCase().includes(q) ||
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
  atlasFocus: string;
  regionBudget?: number;
  notes?: string;
}): AtlasPack {
  const pack: AtlasPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    atlasFocus: input.atlasFocus,
    regionBudget: input.regionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): AtlasPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listRegistrations(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Registration[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().registrations];
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

export function createRegistration(input: {
  packId: string;
  label: string;
  kind: RegistrationKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): Registration | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Registration = {
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
  state().registrations.unshift(row);
  audit("evaluator", "registration.create", row.label);
  return row;
}

export function archiveRegistration(id: string): Registration | null {
  const row = state().registrations.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "registration.archive", id);
  return row;
}

export function listQuantifications(opts?: {
  q?: string;
  quantChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Quantification[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().quantifications];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.regionText.toLowerCase().includes(q) ||
        c.quantChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.quantChannel) {
    items = items.filter((c) => c.quantChannel === opts.quantChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createQuantification(input: {
  packId?: string;
  label: string;
  regionText: string;
  lockCondition: string;
  quantChannel: string;
  notes?: string;
}): Quantification {
  const row: Quantification = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    regionText: input.regionText,
    lockCondition: input.lockCondition,
    quantChannel: input.quantChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().quantifications.unshift(row);
  audit("evaluator", "quantification.create", row.label);
  return row;
}

export function archiveQuantification(id: string): Quantification | null {
  const row = state().quantifications.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "quantification.archive", id);
  return row;
}

export function listRuns(opts?: {
  quantificationId?: string;
  registrationId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AtlasRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.quantificationId) {
    items = items.filter((r) => r.quantificationId === opts.quantificationId);
  }
  if (opts?.registrationId) {
    items = items.filter((r) => r.registrationId === opts.registrationId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  quantificationId: string;
  registrationId: string;
  registrationFidelity: number;
  regionCoverage: number;
  atlasAlignment: number;
  quantStability: number;
  runNotes?: string;
}): AtlasRun | null {
  if (!state().quantifications.some((c) => c.id === input.quantificationId)) {
    return null;
  }
  if (!state().registrations.some((m) => m.id === input.registrationId)) {
    return null;
  }
  const run: AtlasRun = {
    id: randomUUID(),
    quantificationId: input.quantificationId,
    registrationId: input.registrationId,
    registrationFidelity: clamp(input.registrationFidelity, 0, 1),
    regionCoverage: clamp(input.regionCoverage, 0, 1),
    atlasAlignment: clamp(input.atlasAlignment, 0, 1),
    quantStability: clamp(input.quantStability, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().quantifications.find(
    (c) => c.id === input.quantificationId,
  );
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): AtlasCompare[] {
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
  quantificationId: string;
  registrationId: string;
  runId: string;
  registrationBias?: RegistrationBias;
  bias?: RegistrationBias;
  fragmentToolConfidence?: number;
  baselineOptimism?: number;
  workflowHardness?: number;
  overclaimRisk?: number;
}): AtlasCompare | null {
  const quantification = state().quantifications.find(
    (c) => c.id === input.quantificationId,
  );
  const registration = state().registrations.find(
    (m) => m.id === input.registrationId,
  );
  const run = state().runs.find((r) => r.id === input.runId);
  if (!quantification || !registration || !run) return null;

  const goldWeight = outcomeWeight(String(quantification.lockCondition));
  const span = Math.max(
    0.05,
    registration.fidelityMax - registration.fidelityMin,
  );
  const atlasInput: AtlasInput = {
    registrationFidelity: clamp(run.registrationFidelity, 0, 1),
    regionCoverage: clamp(run.regionCoverage, 0, 1),
    atlasAlignment: clamp(run.atlasAlignment, 0, 1),
    quantStability: clamp((run.quantStability + goldWeight) / 2, 0, 1),
    fragmentToolConfidence: input.fragmentToolConfidence ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    workflowHardness:
      input.workflowHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    registrationBias:
      input.registrationBias ??
      input.bias ??
      state().org.defaultRegistrationBias,
    profile: "integrated_atlas_workflow",
  };

  const integrated = scoreIntegratedAtlasWorkflow({
    ...atlasInput,
    profile: "integrated_atlas_workflow",
  });
  const fragmented = scoreFragmentedMultiToolBaseline({
    ...atlasInput,
    profile: "fragmented_multi_tool_baseline",
  });
  const gap = Math.abs(integrated.overall - fragmented.overall);
  let winner: AtlasCompare["winner"] = "tie";
  if (integrated.overall > fragmented.overall + 0.5) {
    winner = "integrated_atlas_workflow";
  } else if (fragmented.overall > integrated.overall + 0.5) {
    winner = "fragmented_multi_tool_baseline";
  }

  const compare: AtlasCompare = {
    id: randomUUID(),
    name: input.name,
    quantificationId: quantification.id,
    registrationId: registration.id,
    runId: run.id,
    input: atlasInput,
    integrated,
    fragmented,
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

export function getScoreboard(): AtlasCompare[] {
  return [...state().compares].sort(
    (a, b) => b.integrated.overall - a.integrated.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      registrations: state().registrations,
      quantifications: state().quantifications,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,integratedOverall,fragmentedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.integrated.overall},${c.fragmented.overall},${c.createdAt}`,
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
    { id: "atlas-packs", name: "Atlas pack registry" },
    { id: "pack-versions", name: "Versioned atlas packs" },
    { id: "registrations", name: "Registration workspace" },
    { id: "registration-editor", name: "Registration channel / fidelity editor" },
    { id: "registration-search", name: "Registration search and filter" },
    { id: "seed-packs", name: "Seed atlas packs" },
    { id: "quantifications", name: "Region quantification registry" },
    { id: "quant-filters", name: "Quantification filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "atlas-runs", name: "Atlas soft-sim runs" },
    { id: "registration-bias", name: "Registration bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Integrated atlas workflow vs fragmented multi-tool baseline compare",
    },
    { id: "delta-view", name: "Atlas delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not live microscope / not diagnostic / not FDA / not NeuroFlow / not authors' system",
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

export function scorePreview(input: AtlasInput): {
  integrated: AtlasQuality;
  fragmented: AtlasQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const integrated = scoreIntegratedAtlasWorkflow({
    ...input,
    profile: "integrated_atlas_workflow",
  });
  const fragmented = scoreFragmentedMultiToolBaseline({
    ...input,
    profile: "fragmented_multi_tool_baseline",
  });
  return {
    integrated,
    fragmented,
    readiness: readinessFromQuality(integrated.overall),
  };
}
