import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreStructuredHitFinding,
  scoreNaiveDockingBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type TargetKind,
  type HitBias,
  type ScoreMode,
  type CacheHitInput,
  type CacheHitQuality,
} from "./domain/types";

export type {
  TargetKind,
  HitBias,
  ScoreMode,
  CacheHitInput,
  CacheHitQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type HitPack = {
  id: string;
  label: string;
  version: string;
  riskFocus: string;
  compoundBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type TargetStatus = "draft" | "active" | "archived";

export type Target = {
  id: string;
  packId: string;
  label: string;
  kind: TargetKind;
  pocketHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: TargetStatus;
  notes: string;
  createdAt: string;
};

export type CompoundStatus = "draft" | "open" | "scored" | "archived";

export type CompoundSet = {
  id: string;
  packId?: string;
  label: string;
  library: string;
  lockCondition: string;
  assayChannel: string;
  status: CompoundStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type HitRun = {
  id: string;
  compoundSetId: string;
  targetId: string;
  pocketCoverage: number;
  hitFidelity: number;
  ligandGrounding: number;
  packCompleteness: number;
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
  defaultHitBias: HitBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CacheHitCompare = {
  id: string;
  name: string;
  compoundSetId: string;
  targetId: string;
  runId: string;
  input: CacheHitInput;
  structured: CacheHitQuality;
  docking: CacheHitQuality;
  winner:
    | "structured_hit_finding"
    | "naive_docking_baseline"
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
  packs: HitPack[];
  targets: Target[];
  compounds: CompoundSet[];
  runs: HitRun[];
  audits: AuditEvent[];
  compares: CacheHitCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __cacheHitStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const targetId = "target-demo";
  const compoundSetId = "compound-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Cache Hit Org",
      webhookUrl: "",
      webhookSecret: "cache-hit-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultHitBias: "balanced",
      defaultMode: "structured_hit_finding",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@cache-hit.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "CBLB TKB Soft-Sim Hit Pack",
        version: "2026.1",
        riskFocus:
          "Structured computational hit-finding soft-sim vs naive docking baseline",
        compoundBudget: 36,
        status: "active",
        notes:
          "Seed pack for structured hit-finding vs naive docking soft-sim",
        createdAt: now(),
      },
    ],
    targets: [
      {
        id: targetId,
        packId,
        label: "CBLB TKB pocket set",
        kind: "cblb_tkb",
        pocketHint:
          "pocket_coverage,ligand_grounding,hit_fidelity,pack_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Pocket, ligand grounding, fidelity, and completeness for hit soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim target pocket — not wet-lab / not CACHE / not live ELN write-back",
        createdAt: now(),
      },
    ],
    compounds: [
      {
        id: compoundSetId,
        packId,
        label: "Hit compound set",
        library:
          "Comparative computational hit soft-sim (structured vs naive docking)",
        lockCondition: "lock_soft_sim",
        assayChannel: "soft_sim_hit_finding_signal",
        status: "scored",
        notes: "Seed compounds for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        compoundSetId,
        targetId,
        pocketCoverage: 0.62,
        hitFidelity: 0.7,
        ligandGrounding: 0.74,
        packCompleteness: 0.68,
        runNotes:
          "Structured pack looks strong but naive docking still leads on hard pockets",
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
        detail: "Demo pack, targets, compounds, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__cacheHitStore) g.__cacheHitStore = seed();
  return g.__cacheHitStore;
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
  g.__cacheHitStore = seed();
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
  if (patch.defaultHitBias !== undefined) {
    org.defaultHitBias = patch.defaultHitBias;
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
  items: HitPack[];
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
        p.riskFocus.toLowerCase().includes(q) ||
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
  riskFocus: string;
  compoundBudget?: number;
  notes?: string;
}): HitPack {
  const pack: HitPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    riskFocus: input.riskFocus,
    compoundBudget: input.compoundBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): HitPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listTargets(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Target[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().targets];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.pocketHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTarget(input: {
  packId: string;
  label: string;
  kind: TargetKind;
  pocketHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): Target | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Target = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    pocketHint: input.pocketHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().targets.unshift(row);
  audit("evaluator", "target.create", row.label);
  return row;
}

export function archiveTarget(id: string): Target | null {
  const row = state().targets.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "target.archive", id);
  return row;
}

export function listCompounds(opts?: {
  q?: string;
  assayChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CompoundSet[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().compounds];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.library.toLowerCase().includes(q) ||
        c.assayChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.assayChannel) {
    items = items.filter((c) => c.assayChannel === opts.assayChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCompound(input: {
  packId?: string;
  label: string;
  library: string;
  lockCondition: string;
  assayChannel: string;
  notes?: string;
}): CompoundSet {
  const row: CompoundSet = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    library: input.library,
    lockCondition: input.lockCondition,
    assayChannel: input.assayChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().compounds.unshift(row);
  audit("evaluator", "compound.create", row.label);
  return row;
}

export function archiveCompound(id: string): CompoundSet | null {
  const row = state().compounds.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "compound.archive", id);
  return row;
}

export function listRuns(opts?: {
  compoundSetId?: string;
  targetId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: HitRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.compoundSetId) {
    items = items.filter((r) => r.compoundSetId === opts.compoundSetId);
  }
  if (opts?.targetId) {
    items = items.filter((r) => r.targetId === opts.targetId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  compoundSetId: string;
  targetId: string;
  pocketCoverage: number;
  hitFidelity: number;
  ligandGrounding: number;
  packCompleteness: number;
  runNotes?: string;
}): HitRun | null {
  if (!state().compounds.some((c) => c.id === input.compoundSetId)) {
    return null;
  }
  if (!state().targets.some((m) => m.id === input.targetId)) {
    return null;
  }
  const run: HitRun = {
    id: randomUUID(),
    compoundSetId: input.compoundSetId,
    targetId: input.targetId,
    pocketCoverage: clamp(input.pocketCoverage, 0, 1),
    hitFidelity: clamp(input.hitFidelity, 0, 1),
    ligandGrounding: clamp(input.ligandGrounding, 0, 1),
    packCompleteness: clamp(input.packCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().compounds.find((c) => c.id === input.compoundSetId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): CacheHitCompare[] {
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
  compoundSetId: string;
  targetId: string;
  runId: string;
  hitBias?: HitBias;
  bias?: HitBias;
  dockingConfidence?: number;
  dockingOptimism?: number;
  pocketHardness?: number;
  overclaimRisk?: number;
}): CacheHitCompare | null {
  const compound = state().compounds.find((c) => c.id === input.compoundSetId);
  const target = state().targets.find((m) => m.id === input.targetId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!compound || !target || !run) return null;

  const goldWeight = outcomeWeight(String(compound.lockCondition));
  const span = Math.max(0.05, target.hardnessMax - target.hardnessMin);
  const hitInput: CacheHitInput = {
    pocketCoverage: clamp(run.pocketCoverage, 0, 1),
    hitFidelity: clamp(run.hitFidelity, 0, 1),
    ligandGrounding: clamp(run.ligandGrounding, 0, 1),
    packCompleteness: clamp(
      (run.packCompleteness + goldWeight) / 2,
      0,
      1,
    ),
    dockingConfidence: input.dockingConfidence ?? 0.82,
    dockingOptimism: input.dockingOptimism ?? 0.7,
    pocketHardness: input.pocketHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    hitBias: input.hitBias ?? input.bias ?? state().org.defaultHitBias,
    profile: "structured_hit_finding",
  };

  const structured = scoreStructuredHitFinding({
    ...hitInput,
    profile: "structured_hit_finding",
  });
  const docking = scoreNaiveDockingBaseline({
    ...hitInput,
    profile: "naive_docking_baseline",
  });
  const gap = Math.abs(structured.overall - docking.overall);
  let winner: CacheHitCompare["winner"] = "tie";
  if (structured.overall > docking.overall + 0.5) {
    winner = "structured_hit_finding";
  } else if (docking.overall > structured.overall + 0.5) {
    winner = "naive_docking_baseline";
  }

  const compare: CacheHitCompare = {
    id: randomUUID(),
    name: input.name,
    compoundSetId: compound.id,
    targetId: target.id,
    runId: run.id,
    input: hitInput,
    structured,
    docking,
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

export function getScoreboard(): CacheHitCompare[] {
  return [...state().compares].sort(
    (a, b) => b.structured.overall - a.structured.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      targets: state().targets,
      compounds: state().compounds,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,structuredOverall,dockingOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.structured.overall},${c.docking.overall},${c.createdAt}`,
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
    { id: "hit-packs", name: "Hit pack registry" },
    { id: "pack-versions", name: "Versioned hit packs" },
    { id: "targets", name: "Target / pocket configs" },
    { id: "target-editor", name: "Target pocket / case editor" },
    { id: "target-search", name: "Target search and filter" },
    { id: "seed-packs", name: "Seed hit packs" },
    { id: "compounds", name: "Compound set registry" },
    { id: "compound-filters", name: "Compound set filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "hit-runs", name: "Hit soft-sim runs" },
    { id: "hit-bias", name: "Hit bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Structured hit-finding vs naive docking baseline compare",
    },
    { id: "delta-view", name: "Hit-finding delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not wet-lab / not live ELN / not FDA / not CACHE / not authors' system",
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

export function scorePreview(input: CacheHitInput): {
  structured: CacheHitQuality;
  docking: CacheHitQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const structured = scoreStructuredHitFinding({
    ...input,
    profile: "structured_hit_finding",
  });
  const docking = scoreNaiveDockingBaseline({
    ...input,
    profile: "naive_docking_baseline",
  });
  return {
    structured,
    docking,
    readiness: readinessFromQuality(structured.overall),
  };
}
