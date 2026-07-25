import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreArcStructuralSemantic,
  scoreMetadataOnlyBaseline,
} from "./domain/crate";
import {
  clamp,
  readinessFromQuality,
  round2,
  type RuleKind,
  type CrateBias,
  type ScoreMode,
  type CrateInput,
  type CrateQuality,
} from "./domain/types";

export type {
  RuleKind,
  CrateBias,
  ScoreMode,
  CrateInput,
  CrateQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CratePack = {
  id: string;
  label: string;
  version: string;
  fairTarget: string;
  ruleBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type RuleStatus = "draft" | "active" | "archived";

export type ValidationRule = {
  id: string;
  packId: string;
  label: string;
  kind: RuleKind;
  terms: string;
  termCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: RuleStatus;
  notes: string;
  createdAt: string;
};

export type CheckStatus = "draft" | "open" | "scored" | "archived";

export type FrictionlessCheck = {
  id: string;
  packId?: string;
  label: string;
  checkText: string;
  successCondition: string;
  checkChannel: string;
  status: CheckStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type CheckRun = {
  id: string;
  checkId: string;
  ruleId: string;
  crateCoverage: number;
  structuralFidelity: number;
  semanticClarity: number;
  checkStability: number;
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
  defaultCrateBias: CrateBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CrateCompare = {
  id: string;
  name: string;
  checkId: string;
  ruleId: string;
  runId: string;
  input: CrateInput;
  structuralSemantic: CrateQuality;
  metadataBaseline: CrateQuality;
  winner:
    | "arc_structural_semantic_validation"
    | "metadata_only_baseline"
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
  packs: CratePack[];
  rules: ValidationRule[];
  checks: FrictionlessCheck[];
  runs: CheckRun[];
  audits: AuditEntry[];
  compares: CrateCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __crateValidateStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const ruleId = "rule-demo";
  const checkId = "check-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Crate Validate Org",
      webhookUrl: "",
      webhookSecret: "crate-validate-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultCrateBias: "balanced",
      defaultMode: "arc_structural_semantic_validation",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@crate-validate.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Plant Assay ARC Soft-Sim Pack",
        version: "2026.1",
        fairTarget: "ARC RO-Crate — structural + semantic soft-sim",
        ruleBudget: 36,
        status: "active",
        notes: "Seed pack for ARC validation vs metadata-only compare",
        createdAt: now(),
      },
    ],
    rules: [
      {
        id: ruleId,
        packId,
        label: "ARC structural + semantic gate",
        kind: "hybrid",
        terms: "ro-crate,isa,payload,frictionless",
        termCount: 4,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint: "Structural+semantic ARC validation under soft-sim honesty",
        status: "active",
        notes: "Soft-sim rule — not institutional repo write-back",
        createdAt: now(),
      },
    ],
    checks: [
      {
        id: checkId,
        packId,
        label: "Frictionless payload integrity check",
        checkText:
          "Does structural+semantic ARC validation catch broken payloads before metadata-only?",
        successCondition: "lock_soft_sim",
        checkChannel: "soft_sim_frictionless",
        status: "scored",
        notes: "Seed check for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        checkId,
        ruleId,
        crateCoverage: 0.62,
        structuralFidelity: 0.7,
        semanticClarity: 0.74,
        checkStability: 0.68,
        reviewerNotes:
          "ARC structural+semantic looks trustworthy but metadata-only misses payload drift",
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
        detail: "Demo pack, rule, check, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__crateValidateStore) g.__crateValidateStore = seed();
  return g.__crateValidateStore;
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
  g.__crateValidateStore = seed();
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
  if (patch.defaultCrateBias !== undefined) {
    org.defaultCrateBias = patch.defaultCrateBias;
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
  items: CratePack[];
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
        p.fairTarget.toLowerCase().includes(q) ||
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
  fairTarget: string;
  ruleBudget?: number;
  notes?: string;
}): CratePack {
  const pack: CratePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    fairTarget: input.fairTarget,
    ruleBudget: input.ruleBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CratePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listRules(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ValidationRule[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().rules];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.terms.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRule(input: {
  packId: string;
  label: string;
  kind: RuleKind;
  terms: string;
  termCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): ValidationRule | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const rule: ValidationRule = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    terms: input.terms,
    termCount: input.termCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().rules.unshift(rule);
  audit("evaluator", "rule.create", rule.label);
  return rule;
}

export function archiveRule(id: string): ValidationRule | null {
  const rule = state().rules.find((m) => m.id === id);
  if (!rule) return null;
  rule.status = "archived";
  audit("evaluator", "rule.archive", id);
  return rule;
}

export function listChecks(opts?: {
  q?: string;
  checkChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: FrictionlessCheck[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().checks];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.checkText.toLowerCase().includes(q) ||
        c.checkChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.checkChannel) {
    items = items.filter((c) => c.checkChannel === opts.checkChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCheck(input: {
  packId?: string;
  label: string;
  checkText: string;
  successCondition: string;
  checkChannel: string;
  notes?: string;
}): FrictionlessCheck {
  const check: FrictionlessCheck = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    checkText: input.checkText,
    successCondition: input.successCondition,
    checkChannel: input.checkChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().checks.unshift(check);
  audit("evaluator", "check.create", check.label);
  return check;
}

export function archiveCheck(id: string): FrictionlessCheck | null {
  const check = state().checks.find((c) => c.id === id);
  if (!check) return null;
  check.status = "archived";
  audit("evaluator", "check.archive", id);
  return check;
}

export function listRuns(opts?: {
  checkId?: string;
  ruleId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CheckRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.checkId) {
    items = items.filter((r) => r.checkId === opts.checkId);
  }
  if (opts?.ruleId) {
    items = items.filter((r) => r.ruleId === opts.ruleId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  checkId: string;
  ruleId: string;
  crateCoverage: number;
  structuralFidelity: number;
  semanticClarity: number;
  checkStability: number;
  reviewerNotes?: string;
}): CheckRun | null {
  if (!state().checks.some((c) => c.id === input.checkId)) {
    return null;
  }
  if (!state().rules.some((m) => m.id === input.ruleId)) return null;
  const run: CheckRun = {
    id: randomUUID(),
    checkId: input.checkId,
    ruleId: input.ruleId,
    crateCoverage: clamp(input.crateCoverage, 0, 1),
    structuralFidelity: clamp(input.structuralFidelity, 0, 1),
    semanticClarity: clamp(input.semanticClarity, 0, 1),
    checkStability: clamp(input.checkStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const check = state().checks.find((c) => c.id === input.checkId);
  if (check) check.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): CrateCompare[] {
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
  checkId: string;
  ruleId: string;
  runId: string;
  crateBias?: CrateBias;
  bias?: CrateBias;
  metadataOnlyRate?: number;
  metadataOptimism?: number;
  payloadHardness?: number;
  overclaimRisk?: number;
}): CrateCompare | null {
  const check = state().checks.find((c) => c.id === input.checkId);
  const rule = state().rules.find((m) => m.id === input.ruleId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!check || !rule || !run) return null;

  const goldWeight = outcomeWeight(String(check.successCondition));
  const span = Math.max(0.05, rule.coverageMax - rule.coverageMin);
  const crateInput: CrateInput = {
    crateCoverage: clamp(run.crateCoverage, 0, 1),
    structuralFidelity: clamp(run.structuralFidelity, 0, 1),
    semanticClarity: clamp(run.semanticClarity, 0, 1),
    checkStability: clamp((run.checkStability + goldWeight) / 2, 0, 1),
    metadataOnlyRate: input.metadataOnlyRate ?? 0.82,
    metadataOptimism: input.metadataOptimism ?? 0.7,
    payloadHardness:
      input.payloadHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    crateBias: input.crateBias ?? input.bias ?? state().org.defaultCrateBias,
    profile: "arc_structural_semantic_validation",
  };

  const structuralSemantic = scoreArcStructuralSemantic({
    ...crateInput,
    profile: "arc_structural_semantic_validation",
  });
  const metadataBaseline = scoreMetadataOnlyBaseline({
    ...crateInput,
    profile: "metadata_only_baseline",
  });
  const gap = Math.abs(structuralSemantic.overall - metadataBaseline.overall);
  let winner: CrateCompare["winner"] = "tie";
  if (structuralSemantic.overall > metadataBaseline.overall + 0.5) {
    winner = "arc_structural_semantic_validation";
  } else if (metadataBaseline.overall > structuralSemantic.overall + 0.5) {
    winner = "metadata_only_baseline";
  }

  const compare: CrateCompare = {
    id: randomUUID(),
    name: input.name,
    checkId: check.id,
    ruleId: rule.id,
    runId: run.id,
    input: crateInput,
    structuralSemantic,
    metadataBaseline,
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

export function getScoreboard(): CrateCompare[] {
  return [...state().compares].sort(
    (a, b) => b.structuralSemantic.overall - a.structuralSemantic.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      rules: state().rules,
      checks: state().checks,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,structuralSemanticOverall,metadataBaselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.structuralSemantic.overall},${c.metadataBaseline.overall},${c.createdAt}`,
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
    { id: "crate-packs", name: "Crate pack registry" },
    { id: "pack-versions", name: "Versioned crate packs" },
    { id: "validation-rules", name: "Structural + semantic rules" },
    { id: "rule-editor", name: "Rule term / coverage editor" },
    { id: "rule-search", name: "Rule search and filter" },
    { id: "seed-packs", name: "Seed crate packs" },
    { id: "checks", name: "Frictionless check workspace" },
    { id: "check-filters", name: "Check filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "check-runs", name: "Validation soft-sim runs" },
    { id: "crate-bias", name: "Crate bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "ARC structural+semantic vs metadata-only compare" },
    { id: "delta-view", name: "Validation delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not repo write-back / not ARC farm notes" },
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

export function scorePreview(input: CrateInput): {
  structuralSemantic: CrateQuality;
  metadataBaseline: CrateQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const structuralSemantic = scoreArcStructuralSemantic({
    ...input,
    profile: "arc_structural_semantic_validation",
  });
  const metadataBaseline = scoreMetadataOnlyBaseline({
    ...input,
    profile: "metadata_only_baseline",
  });
  return {
    structuralSemantic,
    metadataBaseline,
    readiness: readinessFromQuality(structuralSemantic.overall),
  };
}
