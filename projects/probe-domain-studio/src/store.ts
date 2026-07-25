import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreCooperativeMultiDomainProbe,
  scoreSingleDomainMeltingBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ProbeBias,
  type DomainLayout,
  type ScoreMode,
  type ProbeKind,
  type TargetKind,
  type ProbeInput,
  type ProbeQuality,
} from "./domain/types";

export type {
  ProbeBias,
  DomainLayout,
  ScoreMode,
  ProbeKind,
  TargetKind,
  ProbeInput,
  ProbeQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ProbePack = {
  id: string;
  label: string;
  version: string;
  assayFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type ProbeDesign = {
  id: string;
  packId: string;
  label: string;
  kind: ProbeKind;
  splitHint: string;
  strandCount: number;
  coopFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type DomainSpec = {
  id: string;
  packId: string;
  label: string;
  layout: DomainLayout;
  layoutHint: string;
  domainCount: number;
  coverageFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type TargetSeq = {
  id: string;
  packId: string;
  label: string;
  kind: TargetKind;
  sequenceHint: string;
  lengthNt: number;
  bridgeFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  probeId: string;
  domainId: string;
  targetId: string;
  cooperativity: number;
  domainCoverage: number;
  bridgeCompleteness: number;
  specificityDelta: number;
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
  defaultProbeBias: ProbeBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ProbeCompare = {
  id: string;
  name: string;
  packId: string;
  probeId: string;
  domainId: string;
  targetId: string;
  assayRunId: string;
  input: ProbeInput;
  cooperative: ProbeQuality;
  meltingBaseline: ProbeQuality;
  winner:
    | "cooperative_multi_domain_probe"
    | "single_domain_melting_baseline"
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
  packs: ProbePack[];
  probes: ProbeDesign[];
  domains: DomainSpec[];
  targets: TargetSeq[];
  assayRuns: AssayRun[];
  auditEvents: AuditEvent[];
  compares: ProbeCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __probeDomainStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const probeId = "probe-demo";
  const domainId = "domain-demo";
  const targetId = "target-demo";
  const assayRunId = "assay-demo";
  return {
    org: {
      name: "Probe Domain Org",
      webhookUrl: "",
      webhookSecret: "probe-domain-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProbeBias: "balanced",
      defaultMode: "cooperative_multi_domain_probe",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@probe-domain.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Cooperative Probe Soft-Sim Pack",
        version: "2026.1",
        assayFocus:
          "Cooperative multi-domain probe vs single-domain melting baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for domain splits and target bridges vs melting soft-sim",
        createdAt: now(),
      },
    ],
    probes: [
      {
        id: probeId,
        packId,
        label: "Dual-strand cooperative probe",
        kind: "cooperative_split",
        splitHint: "capture,detect,bridge",
        strandCount: 2,
        coopFloor: 0.35,
        metricHint: "Cooperativity and split-recognition soft-sim",
        status: "active",
        notes: "Soft-sim probes — not wet-lab validated IVD",
        createdAt: now(),
      },
    ],
    domains: [
      {
        id: domainId,
        packId,
        label: "Capture–detect domain split",
        layout: "capture_detect",
        layoutHint: "capture,detect,cooperative",
        domainCount: 2,
        coverageFloor: 0.4,
        metricHint: "Domain coverage for cooperative soft-sim",
        status: "active",
        notes: "Soft-sim domains — not whole-blood device deployment",
        createdAt: now(),
      },
    ],
    targets: [
      {
        id: targetId,
        packId,
        label: "Wild-type bridge target",
        kind: "wild_type",
        sequenceHint: "wt,bridge,physio",
        lengthNt: 48,
        bridgeFloor: 0.35,
        metricHint: "Bridge completeness and target fidelity",
        status: "active",
        notes:
          "Soft-sim targets — not authors’ probe system / not IVD cleared",
        createdAt: now(),
      },
    ],
    assayRuns: [
      {
        id: assayRunId,
        packId,
        probeId,
        domainId,
        targetId,
        cooperativity: 0.62,
        domainCoverage: 0.7,
        bridgeCompleteness: 0.74,
        specificityDelta: 0.68,
        runNotes:
          "Cooperative design looks strong but melting baseline still leads when bridge is thin",
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
        detail: "Demo pack, probes, domains, targets, and assay run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__probeDomainStore) g.__probeDomainStore = seed();
  return g.__probeDomainStore;
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
  g.__probeDomainStore = seed();
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
  if (patch.defaultProbeBias !== undefined) {
    org.defaultProbeBias = patch.defaultProbeBias;
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
  items: ProbePack[];
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
        p.assayFocus.toLowerCase().includes(q) ||
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
  assayFocus: string;
  sessionBudget?: number;
  notes?: string;
}): ProbePack {
  const pack: ProbePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    assayFocus: input.assayFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ProbePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

function listEntity<T extends { label: string; id: string; packId: string; status: string; metricHint?: string }>(
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

export function listProbes(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().probes, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.splitHint.toLowerCase().includes(q),
  });
}

export function createProbe(input: {
  packId: string;
  label: string;
  kind: ProbeKind;
  splitHint: string;
  strandCount: number;
  coopFloor: number;
  metricHint?: string;
  notes?: string;
}): ProbeDesign | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ProbeDesign = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    splitHint: input.splitHint,
    strandCount: input.strandCount,
    coopFloor: input.coopFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().probes.unshift(row);
  audit("evaluator", "probe.create", row.label);
  return row;
}

export function archiveProbe(id: string): ProbeDesign | null {
  const row = state().probes.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "probe.archive", id);
  return row;
}

export function listDomains(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().domains, {
    ...opts,
    extra: (m, q) =>
      m.layout.toLowerCase().includes(q) ||
      m.layoutHint.toLowerCase().includes(q),
  });
}

export function createDomain(input: {
  packId: string;
  label: string;
  layout: DomainLayout;
  layoutHint: string;
  domainCount: number;
  coverageFloor: number;
  metricHint?: string;
  notes?: string;
}): DomainSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: DomainSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    layout: input.layout,
    layoutHint: input.layoutHint,
    domainCount: input.domainCount,
    coverageFloor: input.coverageFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().domains.unshift(row);
  audit("evaluator", "domain.create", row.label);
  return row;
}

export function archiveDomain(id: string): DomainSpec | null {
  const row = state().domains.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "domain.archive", id);
  return row;
}

export function listTargets(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().targets, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.sequenceHint.toLowerCase().includes(q),
  });
}

export function createTarget(input: {
  packId: string;
  label: string;
  kind: TargetKind;
  sequenceHint: string;
  lengthNt: number;
  bridgeFloor: number;
  metricHint?: string;
  notes?: string;
}): TargetSeq | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: TargetSeq = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    sequenceHint: input.sequenceHint,
    lengthNt: input.lengthNt,
    bridgeFloor: input.bridgeFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().targets.unshift(row);
  audit("evaluator", "target.create", row.label);
  return row;
}

export function archiveTarget(id: string): TargetSeq | null {
  const row = state().targets.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "target.archive", id);
  return row;
}

export function listAssayRuns(opts?: {
  packId?: string;
  probeId?: string;
  domainId?: string;
  targetId?: string;
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
  if (opts?.probeId) items = items.filter((r) => r.probeId === opts.probeId);
  if (opts?.domainId) items = items.filter((r) => r.domainId === opts.domainId);
  if (opts?.targetId) items = items.filter((r) => r.targetId === opts.targetId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssayRun(input: {
  packId: string;
  probeId: string;
  domainId: string;
  targetId: string;
  cooperativity: number;
  domainCoverage: number;
  bridgeCompleteness: number;
  specificityDelta: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().probes.some((m) => m.id === input.probeId)) return null;
  if (!state().domains.some((m) => m.id === input.domainId)) return null;
  if (!state().targets.some((m) => m.id === input.targetId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    probeId: input.probeId,
    domainId: input.domainId,
    targetId: input.targetId,
    cooperativity: clamp(input.cooperativity, 0, 1),
    domainCoverage: clamp(input.domainCoverage, 0, 1),
    bridgeCompleteness: clamp(input.bridgeCompleteness, 0, 1),
    specificityDelta: clamp(input.specificityDelta, 0, 1),
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

export function listCompares(): ProbeCompare[] {
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
  packId: string;
  probeId: string;
  domainId: string;
  targetId: string;
  assayRunId: string;
  probeBias?: ProbeBias;
  bias?: ProbeBias;
  meltingSharpness?: number;
  incompleteRisk?: number;
  physioNoise?: number;
  overclaimRisk?: number;
}): ProbeCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const probe = state().probes.find((m) => m.id === input.probeId);
  const domain = state().domains.find((m) => m.id === input.domainId);
  const target = state().targets.find((m) => m.id === input.targetId);
  const assayRun = state().assayRuns.find((r) => r.id === input.assayRunId);
  if (!pack || !probe || !domain || !target || !assayRun) return null;

  const goldWeight = outcomeWeight("review");
  const span = Math.max(0.05, 1 - domain.coverageFloor);
  const pdInput: ProbeInput = {
    cooperativity: clamp(assayRun.cooperativity, 0, 1),
    domainCoverage: clamp(assayRun.domainCoverage, 0, 1),
    bridgeCompleteness: clamp(assayRun.bridgeCompleteness, 0, 1),
    specificityDelta: clamp(
      (assayRun.specificityDelta + goldWeight) / 2,
      0,
      1,
    ),
    meltingSharpness: input.meltingSharpness ?? 0.82,
    incompleteRisk: input.incompleteRisk ?? 0.7,
    physioNoise: input.physioNoise ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    probeBias:
      input.probeBias ?? input.bias ?? state().org.defaultProbeBias,
    profile: "cooperative_multi_domain_probe",
  };

  const cooperative = scoreCooperativeMultiDomainProbe({
    ...pdInput,
    profile: "cooperative_multi_domain_probe",
  });
  const meltingBaseline = scoreSingleDomainMeltingBaseline({
    ...pdInput,
    profile: "single_domain_melting_baseline",
  });
  const gap = Math.abs(cooperative.overall - meltingBaseline.overall);
  let winner: ProbeCompare["winner"] = "tie";
  if (cooperative.overall > meltingBaseline.overall + 0.5) {
    winner = "cooperative_multi_domain_probe";
  } else if (meltingBaseline.overall > cooperative.overall + 0.5) {
    winner = "single_domain_melting_baseline";
  }

  const compare: ProbeCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    probeId: probe.id,
    domainId: domain.id,
    targetId: target.id,
    assayRunId: assayRun.id,
    input: pdInput,
    cooperative,
    meltingBaseline,
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

export function getScoreboard(): ProbeCompare[] {
  return [...state().compares].sort(
    (a, b) => b.cooperative.overall - a.cooperative.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      probes: state().probes,
      domains: state().domains,
      targets: state().targets,
      assayRuns: state().assayRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,cooperativeOverall,meltingBaselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.cooperative.overall},${c.meltingBaseline.overall},${c.createdAt}`,
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
    { id: "probe-packs", name: "Probe pack registry" },
    { id: "pack-versions", name: "Versioned probe packs" },
    { id: "probe-designs", name: "Probe design registry" },
    { id: "probe-editor", name: "Probe split editor" },
    { id: "probe-search", name: "Probe search and filter" },
    { id: "domains", name: "Domain layout configs" },
    { id: "domain-editor", name: "Domain split editor" },
    { id: "targets", name: "Target sequence registry" },
    { id: "target-filters", name: "Target sequence filters" },
    { id: "assay-runs", name: "Assay run soft-sim" },
    { id: "probe-bias", name: "Probe bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Cooperative multi-domain vs single-domain melting compare",
    },
    { id: "delta-view", name: "Probe delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not wet-lab IVD / not whole-blood device / not authors’ brand",
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
    { id: "search", name: "Search across packs and probes" },
    { id: "assays-page", name: "Assay runs workspace" },
  ];
}

export function scorePreview(input: ProbeInput): {
  cooperative: ProbeQuality;
  meltingBaseline: ProbeQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const cooperative = scoreCooperativeMultiDomainProbe({
    ...input,
    profile: "cooperative_multi_domain_probe",
  });
  const meltingBaseline = scoreSingleDomainMeltingBaseline({
    ...input,
    profile: "single_domain_melting_baseline",
  });
  return {
    cooperative,
    meltingBaseline,
    readiness: readinessFromQuality(cooperative.overall),
  };
}
