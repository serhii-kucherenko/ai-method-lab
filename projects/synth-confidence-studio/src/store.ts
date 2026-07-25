import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreConfidenceGatedAiRetrosynthesis,
  scoreNaiveAiRouteBaseline,
} from "./domain/synth";
import {
  clamp,
  readinessFromQuality,
  round2,
  type CandidateKind,
  type RouteBias,
  type ScoreMode,
  type SynthInput,
  type SynthQuality,
} from "./domain/types";

export type {
  CandidateKind,
  RouteBias,
  ScoreMode,
  SynthInput,
  SynthQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type RoutePack = {
  id: string;
  label: string;
  version: string;
  targetMolecule: string;
  candidateBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type CandidateStatus = "draft" | "active" | "archived";

export type CandidateRoute = {
  id: string;
  packId: string;
  label: string;
  kind: CandidateKind;
  reactionClasses: string;
  stepCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: CandidateStatus;
  notes: string;
  createdAt: string;
};

export type ScoreStatus = "draft" | "open" | "scored" | "archived";

export type ConfidenceScore = {
  id: string;
  packId?: string;
  label: string;
  scoreText: string;
  successCondition: string;
  scoreChannel: string;
  status: ScoreStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type SynthRun = {
  id: string;
  scoreId: string;
  candidateId: string;
  packCoverage: number;
  confidenceFidelity: number;
  candidateClarity: number;
  runStability: number;
  reviewerNotes: string;
  status: RunStatus;
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
  defaultRouteBias: RouteBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type SynthCompare = {
  id: string;
  name: string;
  scoreId: string;
  candidateId: string;
  runId: string;
  input: SynthInput;
  confidenceGated: SynthQuality;
  naiveBaseline: SynthQuality;
  winner:
    | "confidence_gated_ai_retrosynthesis"
    | "naive_ai_route_baseline"
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
  packs: RoutePack[];
  candidates: CandidateRoute[];
  scores: ConfidenceScore[];
  runs: SynthRun[];
  audits: AuditEntry[];
  compares: SynthCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __synthConfidenceStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const candidateId = "candidate-demo";
  const scoreId = "score-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Synth Confidence Org",
      webhookUrl: "",
      webhookSecret: "synth-confidence-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultRouteBias: "balanced",
      defaultMode: "confidence_gated_ai_retrosynthesis",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@synth-confidence.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Malaria Candidate Soft-Sim Route Pack",
        version: "2026.1",
        targetMolecule: "Antimalarial scaffold A — confidence-gated routes",
        candidateBudget: 36,
        status: "active",
        notes: "Seed pack for confidence-gated vs naive AI compare",
        createdAt: now(),
      },
    ],
    candidates: [
      {
        id: candidateId,
        packId,
        label: "Convergent SCS-gated route",
        kind: "convergent",
        reactionClasses: "amide_coupling,reductive_amination,snar",
        stepCount: 7,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint: "Confidence-gated route quality under soft-sim honesty",
        status: "active",
        notes: "Soft-sim candidate — not wet-lab validated",
        createdAt: now(),
      },
    ],
    scores: [
      {
        id: scoreId,
        packId,
        label: "Synthetic Confidence Score gate",
        scoreText:
          "Does the Synthetic Confidence Score gate flashy but untrusted AI steps before locking?",
        successCondition: "lock_soft_sim",
        scoreChannel: "soft_sim_scs",
        status: "scored",
        notes: "Seed confidence score for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        scoreId,
        candidateId,
        packCoverage: 0.62,
        confidenceFidelity: 0.7,
        candidateClarity: 0.74,
        runStability: 0.68,
        reviewerNotes:
          "Confidence-gated route looks trustworthy but naive AI baseline drifts under hard steps",
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
        detail: "Demo pack, candidate, score, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__synthConfidenceStore) g.__synthConfidenceStore = seed();
  return g.__synthConfidenceStore;
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
  g.__synthConfidenceStore = seed();
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
  if (patch.defaultRouteBias !== undefined) {
    org.defaultRouteBias = patch.defaultRouteBias;
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
  items: RoutePack[];
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
        p.targetMolecule.toLowerCase().includes(q) ||
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
  targetMolecule: string;
  candidateBudget?: number;
  notes?: string;
}): RoutePack {
  const pack: RoutePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    targetMolecule: input.targetMolecule,
    candidateBudget: input.candidateBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): RoutePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listCandidates(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CandidateRoute[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().candidates];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.reactionClasses.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCandidate(input: {
  packId: string;
  label: string;
  kind: CandidateKind;
  reactionClasses: string;
  stepCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): CandidateRoute | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const candidate: CandidateRoute = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    reactionClasses: input.reactionClasses,
    stepCount: input.stepCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().candidates.unshift(candidate);
  audit("evaluator", "candidate.create", candidate.label);
  return candidate;
}

export function archiveCandidate(id: string): CandidateRoute | null {
  const candidate = state().candidates.find((m) => m.id === id);
  if (!candidate) return null;
  candidate.status = "archived";
  audit("evaluator", "candidate.archive", id);
  return candidate;
}

export function listScores(opts?: {
  q?: string;
  scoreChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ConfidenceScore[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().scores];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.scoreText.toLowerCase().includes(q) ||
        c.scoreChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.scoreChannel) {
    items = items.filter((c) => c.scoreChannel === opts.scoreChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createScore(input: {
  packId?: string;
  label: string;
  scoreText: string;
  successCondition: string;
  scoreChannel: string;
  notes?: string;
}): ConfidenceScore {
  const score: ConfidenceScore = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    scoreText: input.scoreText,
    successCondition: input.successCondition,
    scoreChannel: input.scoreChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().scores.unshift(score);
  audit("evaluator", "score.create", score.label);
  return score;
}

export function archiveScore(id: string): ConfidenceScore | null {
  const score = state().scores.find((c) => c.id === id);
  if (!score) return null;
  score.status = "archived";
  audit("evaluator", "score.archive", id);
  return score;
}

export function listRuns(opts?: {
  scoreId?: string;
  candidateId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SynthRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.scoreId) {
    items = items.filter((r) => r.scoreId === opts.scoreId);
  }
  if (opts?.candidateId) {
    items = items.filter((r) => r.candidateId === opts.candidateId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  scoreId: string;
  candidateId: string;
  packCoverage: number;
  confidenceFidelity: number;
  candidateClarity: number;
  runStability: number;
  reviewerNotes?: string;
}): SynthRun | null {
  if (!state().scores.some((c) => c.id === input.scoreId)) {
    return null;
  }
  if (!state().candidates.some((m) => m.id === input.candidateId)) return null;
  const run: SynthRun = {
    id: randomUUID(),
    scoreId: input.scoreId,
    candidateId: input.candidateId,
    packCoverage: clamp(input.packCoverage, 0, 1),
    confidenceFidelity: clamp(input.confidenceFidelity, 0, 1),
    candidateClarity: clamp(input.candidateClarity, 0, 1),
    runStability: clamp(input.runStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const score = state().scores.find((c) => c.id === input.scoreId);
  if (score) score.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): SynthCompare[] {
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
  scoreId: string;
  candidateId: string;
  runId: string;
  routeBias?: RouteBias;
  bias?: RouteBias;
  naiveBaselineRate?: number;
  skipOptimism?: number;
  routeHardness?: number;
  overclaimRisk?: number;
}): SynthCompare | null {
  const score = state().scores.find((c) => c.id === input.scoreId);
  const candidate = state().candidates.find((m) => m.id === input.candidateId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!score || !candidate || !run) return null;

  const goldWeight = outcomeWeight(String(score.successCondition));
  const span = Math.max(0.05, candidate.coverageMax - candidate.coverageMin);
  const synthInput: SynthInput = {
    packCoverage: clamp(run.packCoverage, 0, 1),
    confidenceFidelity: clamp(run.confidenceFidelity, 0, 1),
    candidateClarity: clamp(run.candidateClarity, 0, 1),
    runStability: clamp((run.runStability + goldWeight) / 2, 0, 1),
    naiveBaselineRate: input.naiveBaselineRate ?? 0.82,
    skipOptimism: input.skipOptimism ?? 0.7,
    routeHardness: input.routeHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    routeBias: input.routeBias ?? input.bias ?? state().org.defaultRouteBias,
    profile: "confidence_gated_ai_retrosynthesis",
  };

  const confidenceGated = scoreConfidenceGatedAiRetrosynthesis({
    ...synthInput,
    profile: "confidence_gated_ai_retrosynthesis",
  });
  const naiveBaseline = scoreNaiveAiRouteBaseline({
    ...synthInput,
    profile: "naive_ai_route_baseline",
  });
  const gap = Math.abs(confidenceGated.overall - naiveBaseline.overall);
  let winner: SynthCompare["winner"] = "tie";
  if (confidenceGated.overall > naiveBaseline.overall + 0.5) {
    winner = "confidence_gated_ai_retrosynthesis";
  } else if (naiveBaseline.overall > confidenceGated.overall + 0.5) {
    winner = "naive_ai_route_baseline";
  }

  const compare: SynthCompare = {
    id: randomUUID(),
    name: input.name,
    scoreId: score.id,
    candidateId: candidate.id,
    runId: run.id,
    input: synthInput,
    confidenceGated,
    naiveBaseline,
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

export function getScoreboard(): SynthCompare[] {
  return [...state().compares].sort(
    (a, b) => b.confidenceGated.overall - a.confidenceGated.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      candidates: state().candidates,
      scores: state().scores,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,gatedOverall,naiveOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.confidenceGated.overall},${c.naiveBaseline.overall},${c.createdAt}`,
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
    { id: "route-packs", name: "Route pack registry" },
    { id: "pack-versions", name: "Versioned route packs" },
    { id: "candidate-routes", name: "Candidate route definitions" },
    { id: "candidate-editor", name: "Reaction class / step editor" },
    { id: "candidate-search", name: "Candidate search and filter" },
    { id: "seed-packs", name: "Seed route packs" },
    { id: "confidence-scores", name: "Synthetic Confidence Score workspace" },
    { id: "score-filters", name: "Confidence score filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "synth-runs", name: "Synth soft-sim runs" },
    { id: "route-bias", name: "Route bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Confidence-gated vs naive AI compare" },
    { id: "delta-view", name: "Route delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not wet-lab / not live ELN notes" },
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

export function scorePreview(input: SynthInput): {
  confidenceGated: SynthQuality;
  naiveBaseline: SynthQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const confidenceGated = scoreConfidenceGatedAiRetrosynthesis({
    ...input,
    profile: "confidence_gated_ai_retrosynthesis",
  });
  const naiveBaseline = scoreNaiveAiRouteBaseline({
    ...input,
    profile: "naive_ai_route_baseline",
  });
  return {
    confidenceGated,
    naiveBaseline,
    readiness: readinessFromQuality(confidenceGated.overall),
  };
}
