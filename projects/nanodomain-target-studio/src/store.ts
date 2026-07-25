import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreLocalizedNanodomain,
  scoreSystemicPhosphorylation,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AssayKind,
  type NanodomainInput,
  type NanodomainKind,
  type NanodomainQuality,
  type PeptideKind,
  type ScoreMode,
  type TargetBias,
} from "./domain/types";

export type {
  AssayKind,
  NanodomainInput,
  NanodomainKind,
  NanodomainQuality,
  PeptideKind,
  ScoreMode,
  TargetBias,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type TherapyPack = {
  id: string;
  label: string;
  version: string;
  therapyFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type NanodomainSpec = {
  id: string;
  packId: string;
  label: string;
  kind: NanodomainKind;
  locusHint: string;
  localizationFloor: number;
  diastolicFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type PeptideSpec = {
  id: string;
  packId: string;
  label: string;
  kind: PeptideKind;
  pryHint: string;
  pryFloor: number;
  systolicFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  nanodomainId: string;
  peptideId: string;
  label: string;
  kind: AssayKind;
  nanodomainLocalization: number;
  pdePryStrength: number;
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
  defaultTargetBias: TargetBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type NanodomainCompare = {
  id: string;
  name: string;
  packId: string;
  nanodomainId: string;
  peptideId: string;
  assayRunId: string;
  input: NanodomainInput;
  localized: NanodomainQuality;
  systemic: NanodomainQuality;
  winner:
    | "localized_nanodomain_target"
    | "systemic_phosphorylation_baseline"
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
  packs: TherapyPack[];
  nanodomains: NanodomainSpec[];
  peptides: PeptideSpec[];
  assayRuns: AssayRun[];
  auditEvents: AuditEvent[];
  compares: NanodomainCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __nanodomainTargetStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const nanodomainId = "nanodomain-demo";
  const peptideId = "peptide-demo";
  const assayRunId = "assay-demo";
  return {
    org: {
      name: "Nanodomain Target Org",
      webhookUrl: "",
      webhookSecret: "nanodomain-target-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultTargetBias: "balanced",
      defaultMode: "localized_nanodomain_target",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@nanodomain-target.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Troponin Nanodomain Soft-Sim Pack",
        version: "2026.1",
        therapyFocus:
          "Localized nanodomain target vs systemic phosphorylation baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for nanodomains, peptides, and assay soft-sim vs systemic baseline",
        createdAt: now(),
      },
    ],
    nanodomains: [
      {
        id: nanodomainId,
        packId,
        label: "cAMP/PKA local draft",
        kind: "camp_pka_local",
        locusHint: "troponin-I,PDE4D9-proximal",
        localizationFloor: 0.45,
        diastolicFloor: 0.4,
        metricHint: "Localized nanodomain soft-sim",
        status: "active",
        notes:
          "Soft-sim nanodomains — not wet-lab validated IND/NDA",
        createdAt: now(),
      },
    ],
    peptides: [
      {
        id: peptideId,
        packId,
        label: "PDE pry draft",
        kind: "pde_pry",
        pryHint: "PDE4D9-pry,localized",
        pryFloor: 0.4,
        systolicFloor: 0.5,
        metricHint: "Peptide pry soft-sim",
        status: "active",
        notes: "Soft-sim peptides — not live patient dosing",
        createdAt: now(),
      },
    ],
    assayRuns: [
      {
        id: assayRunId,
        packId,
        nanodomainId,
        peptideId,
        label: "Diastolic restore soft-sim",
        kind: "diastolic_restore",
        nanodomainLocalization: 0.72,
        pdePryStrength: 0.68,
        assaySignal: 0.74,
        runNotes:
          "Localized pry looks strong but systemic still leads when spillover is high",
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
        detail: "Demo pack, nanodomains, peptides, and assay seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__nanodomainTargetStore) g.__nanodomainTargetStore = seed();
  return g.__nanodomainTargetStore;
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
  g.__nanodomainTargetStore = seed();
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
  if (patch.defaultTargetBias !== undefined) {
    org.defaultTargetBias = patch.defaultTargetBias;
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
  items: TherapyPack[];
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
        p.therapyFocus.toLowerCase().includes(q) ||
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
  therapyFocus: string;
  sessionBudget?: number;
  notes?: string;
}): TherapyPack {
  const pack: TherapyPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    therapyFocus: input.therapyFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): TherapyPack | null {
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

export function listNanodomains(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().nanodomains, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.locusHint.toLowerCase().includes(q),
  });
}

export function createNanodomain(input: {
  packId: string;
  label: string;
  kind: NanodomainKind;
  locusHint: string;
  localizationFloor: number;
  diastolicFloor: number;
  metricHint?: string;
  notes?: string;
}): NanodomainSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: NanodomainSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    locusHint: input.locusHint,
    localizationFloor: input.localizationFloor,
    diastolicFloor: input.diastolicFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().nanodomains.unshift(row);
  audit("evaluator", "nanodomain.create", row.label);
  return row;
}

export function archiveNanodomain(id: string): NanodomainSpec | null {
  const row = state().nanodomains.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "nanodomain.archive", id);
  return row;
}

export function listPeptides(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().peptides, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.pryHint.toLowerCase().includes(q),
  });
}

export function createPeptide(input: {
  packId: string;
  label: string;
  kind: PeptideKind;
  pryHint: string;
  pryFloor: number;
  systolicFloor: number;
  metricHint?: string;
  notes?: string;
}): PeptideSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: PeptideSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    pryHint: input.pryHint,
    pryFloor: input.pryFloor,
    systolicFloor: input.systolicFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().peptides.unshift(row);
  audit("evaluator", "peptide.create", row.label);
  return row;
}

export function archivePeptide(id: string): PeptideSpec | null {
  const row = state().peptides.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "peptide.archive", id);
  return row;
}

export function listAssayRuns(opts?: {
  packId?: string;
  nanodomainId?: string;
  peptideId?: string;
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
  if (opts?.nanodomainId)
    items = items.filter((r) => r.nanodomainId === opts.nanodomainId);
  if (opts?.peptideId)
    items = items.filter((r) => r.peptideId === opts.peptideId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssayRun(input: {
  packId: string;
  nanodomainId: string;
  peptideId: string;
  label: string;
  kind: AssayKind;
  nanodomainLocalization: number;
  pdePryStrength: number;
  assaySignal: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().nanodomains.some((m) => m.id === input.nanodomainId))
    return null;
  if (!state().peptides.some((m) => m.id === input.peptideId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    nanodomainId: input.nanodomainId,
    peptideId: input.peptideId,
    label: input.label,
    kind: input.kind,
    nanodomainLocalization: clamp(input.nanodomainLocalization, 0, 1),
    pdePryStrength: clamp(input.pdePryStrength, 0, 1),
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

export function listCompares(): NanodomainCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  nanodomainId: string;
  peptideId: string;
  assayRunId: string;
  targetBias?: TargetBias;
  bias?: TargetBias;
  overclaimRisk?: number;
  diastolicGain?: number;
  systolicPreserve?: number;
  systemicSpillover?: number;
  phosphorylationCoverage?: number;
}): NanodomainCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const nanodomain = state().nanodomains.find(
    (m) => m.id === input.nanodomainId,
  );
  const peptide = state().peptides.find((m) => m.id === input.peptideId);
  const assayRun = state().assayRuns.find((r) => r.id === input.assayRunId);
  if (!pack || !nanodomain || !peptide || !assayRun) return null;

  const nanodomainInput: NanodomainInput = {
    nanodomainLocalization: clamp(assayRun.nanodomainLocalization, 0, 1),
    pdePryStrength: clamp(assayRun.pdePryStrength, 0, 1),
    diastolicGain: clamp(
      input.diastolicGain ?? nanodomain.diastolicFloor,
      0,
      1,
    ),
    systolicPreserve: clamp(
      input.systolicPreserve ?? peptide.systolicFloor,
      0,
      1,
    ),
    systemicSpillover: clamp(input.systemicSpillover ?? 0.35, 0, 1),
    phosphorylationCoverage: clamp(
      input.phosphorylationCoverage ?? 0.55,
      0,
      1,
    ),
    assaySignal: clamp(assayRun.assaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - nanodomain.localizationFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    targetBias:
      input.targetBias ?? input.bias ?? state().org.defaultTargetBias,
    profile: "localized_nanodomain_target",
  };

  const localized = scoreLocalizedNanodomain({
    ...nanodomainInput,
    profile: "localized_nanodomain_target",
  });
  const systemic = scoreSystemicPhosphorylation({
    ...nanodomainInput,
    profile: "systemic_phosphorylation_baseline",
  });
  const gap = Math.abs(localized.overall - systemic.overall);
  let winner: NanodomainCompare["winner"] = "tie";
  if (localized.overall > systemic.overall + 0.5) {
    winner = "localized_nanodomain_target";
  } else if (systemic.overall > localized.overall + 0.5) {
    winner = "systemic_phosphorylation_baseline";
  }

  const compare: NanodomainCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    nanodomainId: nanodomain.id,
    peptideId: peptide.id,
    assayRunId: assayRun.id,
    input: nanodomainInput,
    localized,
    systemic,
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

export function getScoreboard(): NanodomainCompare[] {
  return [...state().compares].sort(
    (a, b) => b.localized.overall - a.localized.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      nanodomains: state().nanodomains,
      peptides: state().peptides,
      assayRuns: state().assayRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,localizedOverall,systemicOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.localized.overall},${c.systemic.overall},${c.createdAt}`,
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
    { id: "therapy-packs", name: "Therapy pack registry" },
    { id: "pack-versions", name: "Versioned therapy packs" },
    { id: "nanodomains", name: "Nanodomain registry" },
    { id: "nanodomain-editor", name: "Nanodomain locus editor" },
    { id: "nanodomain-search", name: "Nanodomain search and filter" },
    { id: "peptides", name: "Peptide pry configs" },
    { id: "peptide-editor", name: "Peptide pry editor" },
    { id: "assays", name: "Assay run soft-sim" },
    { id: "assay-filters", name: "Assay filters" },
    { id: "target-bias", name: "Target bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Localized nanodomain vs systemic phosphorylation compare",
    },
    { id: "delta-view", name: "Nanodomain delta view" },
    { id: "scoreboard", name: "Nanodomain scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not IND/NDA / not live dosing / not clinical HF diagnosis",
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
    { id: "search", name: "Search across packs and nanodomains" },
    { id: "assays-page", name: "Assay runs workspace" },
  ];
}

export function scorePreview(input: NanodomainInput): {
  localized: NanodomainQuality;
  systemic: NanodomainQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const localized = scoreLocalizedNanodomain({
    ...input,
    profile: "localized_nanodomain_target",
  });
  const systemic = scoreSystemicPhosphorylation({
    ...input,
    profile: "systemic_phosphorylation_baseline",
  });
  return {
    localized,
    systemic,
    readiness: readinessFromQuality(localized.overall),
  };
}
