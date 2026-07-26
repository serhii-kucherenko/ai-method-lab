import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreAntibioticTreatedShigella,
  scoreUntreatedDiarrheaGrowth,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type CohortKind,
  type EpisodeKind,
  type GrowthAssayKind,
  type GrowthInput,
  type GrowthQuality,
  type ScoreMode,
  type TreatmentBias,
} from "./domain/types";

export type {
  CohortKind,
  EpisodeKind,
  GrowthAssayKind,
  GrowthInput,
  GrowthQuality,
  ScoreMode,
  TreatmentBias,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CohortPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  cohortBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type CohortSpec = {
  id: string;
  packId: string;
  label: string;
  kind: CohortKind;
  siteHint: string;
  severityCeiling: number;
  followUpFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type EpisodeSpec = {
  id: string;
  packId: string;
  label: string;
  kind: EpisodeKind;
  modelHint: string;
  antibioticFloor: number;
  confirmationFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type GrowthAssay = {
  id: string;
  packId: string;
  cohortId: string;
  episodeId: string;
  label: string;
  kind: GrowthAssayKind;
  antibioticCoverage: number;
  episodeSeverity: number;
  untreatedDuration: number;
  growthAssaySignal: number;
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
  defaultTreatmentBias: TreatmentBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type GrowthCompare = {
  id: string;
  name: string;
  packId: string;
  cohortId: string;
  episodeId: string;
  growthId: string;
  input: GrowthInput;
  antibiotic: GrowthQuality;
  untreated: GrowthQuality;
  winner:
    | "antibiotic_treated_shigella"
    | "untreated_diarrhea_growth"
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
  packs: CohortPack[];
  cohorts: CohortSpec[];
  episodes: EpisodeSpec[];
  growthAssays: GrowthAssay[];
  auditEvents: AuditEvent[];
  compares: GrowthCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __shigellaGrowthStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const cohortId = "cohort-demo";
  const episodeId = "episode-demo";
  const growthId = "growth-demo";
  return {
    org: {
      name: "Shigella Growth Org",
      webhookUrl: "",
      webhookSecret: "shigella-growth-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultTreatmentBias: "balanced",
      defaultMode: "antibiotic_treated_shigella",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@shigella-growth.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Child Diarrhea Growth Pack",
        version: "2026.1",
        programFocus:
          "Antibiotic-treated Shigella vs untreated diarrhea growth soft-sim",
        cohortBudget: 36,
        status: "active",
        notes:
          "Seed pack for cohorts, episodes, and growth soft-sims",
        createdAt: now(),
      },
    ],
    cohorts: [
      {
        id: cohortId,
        packId,
        label: "Under-5 mixed draft",
        kind: "mixed_under_5",
        siteHint: "site-a12",
        severityCeiling: 0.45,
        followUpFloor: 0.4,
        metricHint: "Cohort soft-sim",
        status: "active",
        notes: "Soft-sim cohort panel — not live clinical prescribing",
        createdAt: now(),
      },
    ],
    episodes: [
      {
        id: episodeId,
        packId,
        label: "Culture-confirmed Shigella draft",
        kind: "culture_confirmed_shigella",
        modelHint: "abx-treated-shigella",
        antibioticFloor: 0.4,
        confirmationFloor: 0.35,
        metricHint: "Episode soft-sim",
        status: "active",
        notes: "Soft-sim episode — not diagnostic clearance",
        createdAt: now(),
      },
    ],
    growthAssays: [
      {
        id: growthId,
        packId,
        cohortId,
        episodeId,
        label: "HAZ delta / linear growth soft-sim",
        kind: "haz_delta",
        antibioticCoverage: 0.42,
        episodeSeverity: 0.32,
        untreatedDuration: 0.28,
        growthAssaySignal: 0.7,
        runNotes:
          "Antibiotic-treated path looks strong on growth protection but untreated baseline still leads when coverage is ignored",
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
        detail: "Demo pack, cohorts, episodes, and growth assays seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__shigellaGrowthStore) g.__shigellaGrowthStore = seed();
  return g.__shigellaGrowthStore;
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
  g.__shigellaGrowthStore = seed();
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
  if (patch.defaultTreatmentBias !== undefined) {
    org.defaultTreatmentBias = patch.defaultTreatmentBias;
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
  items: CohortPack[];
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
  cohortBudget?: number;
  notes?: string;
}): CohortPack {
  const pack: CohortPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    cohortBudget: input.cohortBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CohortPack | null {
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

export function listCohorts(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().cohorts, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.siteHint.toLowerCase().includes(q),
  });
}

export function createCohort(input: {
  packId: string;
  label: string;
  kind: CohortKind;
  siteHint: string;
  severityCeiling: number;
  followUpFloor: number;
  metricHint?: string;
  notes?: string;
}): CohortSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: CohortSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    siteHint: input.siteHint,
    severityCeiling: input.severityCeiling,
    followUpFloor: input.followUpFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().cohorts.unshift(row);
  audit("evaluator", "cohort.create", row.label);
  return row;
}

export function archiveCohort(id: string): CohortSpec | null {
  const row = state().cohorts.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "cohort.archive", id);
  return row;
}

export function listEpisodes(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().episodes, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createEpisode(input: {
  packId: string;
  label: string;
  kind: EpisodeKind;
  modelHint: string;
  antibioticFloor: number;
  confirmationFloor: number;
  metricHint?: string;
  notes?: string;
}): EpisodeSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: EpisodeSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    antibioticFloor: input.antibioticFloor,
    confirmationFloor: input.confirmationFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().episodes.unshift(row);
  audit("evaluator", "episode.create", row.label);
  return row;
}

export function archiveEpisode(id: string): EpisodeSpec | null {
  const row = state().episodes.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "episode.archive", id);
  return row;
}

export function listGrowth(opts?: {
  packId?: string;
  cohortId?: string;
  episodeId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: GrowthAssay[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().growthAssays];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.cohortId)
    items = items.filter((r) => r.cohortId === opts.cohortId);
  if (opts?.episodeId)
    items = items.filter((r) => r.episodeId === opts.episodeId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createGrowth(input: {
  packId: string;
  cohortId: string;
  episodeId: string;
  label: string;
  kind: GrowthAssayKind;
  antibioticCoverage: number;
  episodeSeverity: number;
  untreatedDuration: number;
  growthAssaySignal: number;
  runNotes?: string;
}): GrowthAssay | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().cohorts.some((m) => m.id === input.cohortId)) return null;
  if (!state().episodes.some((m) => m.id === input.episodeId)) return null;
  const run: GrowthAssay = {
    id: randomUUID(),
    packId: input.packId,
    cohortId: input.cohortId,
    episodeId: input.episodeId,
    label: input.label,
    kind: input.kind,
    antibioticCoverage: clamp(input.antibioticCoverage, 0, 1),
    episodeSeverity: clamp(input.episodeSeverity, 0, 1),
    untreatedDuration: clamp(input.untreatedDuration, 0, 1),
    growthAssaySignal: clamp(input.growthAssaySignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().growthAssays.unshift(run);
  audit("evaluator", "growth.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): GrowthCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  cohortId: string;
  episodeId: string;
  growthId: string;
  treatmentBias?: TreatmentBias;
  bias?: TreatmentBias;
  overclaimRisk?: number;
  growthVulnerability?: number;
  shigellaConfirmation?: number;
  cohortFollowUp?: number;
}): GrowthCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const cohort = state().cohorts.find((m) => m.id === input.cohortId);
  const episode = state().episodes.find((m) => m.id === input.episodeId);
  const growth = state().growthAssays.find((r) => r.id === input.growthId);
  if (!pack || !cohort || !episode || !growth) return null;

  const growthInput: GrowthInput = {
    antibioticCoverage: clamp(growth.antibioticCoverage, 0, 1),
    shigellaConfirmation: clamp(
      input.shigellaConfirmation ?? episode.confirmationFloor,
      0,
      1,
    ),
    episodeSeverity: clamp(growth.episodeSeverity, 0, 1),
    untreatedDuration: clamp(growth.untreatedDuration, 0, 1),
    growthVulnerability: clamp(
      input.growthVulnerability ?? cohort.severityCeiling,
      0,
      1,
    ),
    cohortFollowUp: clamp(
      input.cohortFollowUp ?? cohort.followUpFloor,
      0,
      1,
    ),
    growthAssaySignal: clamp(growth.growthAssaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - episode.antibioticFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    treatmentBias:
      input.treatmentBias ??
      input.bias ??
      state().org.defaultTreatmentBias,
    profile: "antibiotic_treated_shigella",
  };

  const antibiotic = scoreAntibioticTreatedShigella({
    ...growthInput,
    profile: "antibiotic_treated_shigella",
  });
  const untreated = scoreUntreatedDiarrheaGrowth({
    ...growthInput,
    profile: "untreated_diarrhea_growth",
  });
  const gap = Math.abs(antibiotic.overall - untreated.overall);
  let winner: GrowthCompare["winner"] = "tie";
  if (antibiotic.overall > untreated.overall + 0.5) {
    winner = "antibiotic_treated_shigella";
  } else if (untreated.overall > antibiotic.overall + 0.5) {
    winner = "untreated_diarrhea_growth";
  }

  const compare: GrowthCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    cohortId: cohort.id,
    episodeId: episode.id,
    growthId: growth.id,
    input: growthInput,
    antibiotic,
    untreated,
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

export function getScoreboard(): GrowthCompare[] {
  return [...state().compares].sort(
    (a, b) => b.antibiotic.overall - a.antibiotic.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      cohorts: state().cohorts,
      episodes: state().episodes,
      growthAssays: state().growthAssays,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,antibioticOverall,untreatedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.antibiotic.overall},${c.untreated.overall},${c.createdAt}`,
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
    { id: "packs", label: "Cohort pack registry CRUD" },
    { id: "cohorts", label: "Cohort workspace" },
    { id: "episodes", label: "Shigella episode specs" },
    { id: "growth", label: "Growth assay runs" },
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
    { id: "search", label: "Pack/cohort search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "antibiotic_treated_shigella scorer" },
    { id: "scorer-b", label: "untreated_diarrhea_growth scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "treatment-bias", label: "Treatment bias controls" },
    { id: "archive", label: "Archive packs/cohorts/episodes" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "cohort-kinds", label: "Cohort kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
