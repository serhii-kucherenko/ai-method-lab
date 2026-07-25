import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreBaselineMultilingual,
  scoreExpandedGeezLexicon,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type LexiconBias,
  type ScriptLexiconInput,
  type ScriptLexiconQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  LexiconBias,
  ScriptLexiconInput,
  ScriptLexiconQuality,
  OutcomeLabel,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type LanguagePack = {
  id: string;
  label: string;
  version: string;
  scriptFamily: string;
  languageCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type LexiconStatus = "draft" | "active" | "archived";

export type LexiconExpand = {
  id: string;
  packId: string;
  label: string;
  addedSubwords: number;
  languages: string[];
  expansionWeight: number;
  baselineWeight: number;
  status: LexiconStatus;
  notes: string;
  createdAt: string;
};

export type TokenizerStatus = "draft" | "open" | "scored" | "archived";

export type TokenizerConfig = {
  id: string;
  packId?: string;
  label: string;
  tokenizerSummary: string;
  successCondition: OutcomeLabel | string;
  evalChannel: string;
  status: TokenizerStatus;
  notes: string;
  createdAt: string;
};

export type EvalStatus = "draft" | "active" | "archived";

export type EvalRun = {
  id: string;
  tokenizerId: string;
  lexiconId: string;
  lexiconCoverage: number;
  expansionConfidence: number;
  scriptConfidence: number;
  subwordAgreement: number;
  reviewerNotes: string;
  status: EvalStatus;
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
  defaultLexiconBias: LexiconBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type LexiconCompare = {
  id: string;
  name: string;
  tokenizerId: string;
  lexiconId: string;
  evalRunId: string;
  input: ScriptLexiconInput;
  expandedGeezLexicon: ScriptLexiconQuality;
  baselineMultilingual: ScriptLexiconQuality;
  winner: "expanded_geez_lexicon" | "baseline_multilingual" | "tie";
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
  packs: LanguagePack[];
  lexicons: LexiconExpand[];
  tokenizers: TokenizerConfig[];
  evalRuns: EvalRun[];
  audits: AuditEntry[];
  compares: LexiconCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __slsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const lexiconId = "lexicon-demo";
  const tokenizerId = "tokenizer-demo";
  const evalId = "eval-demo";
  return {
    org: {
      name: "Script Lexicon Org",
      webhookUrl: "",
      webhookSecret: "sls-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultLexiconBias: "balanced",
      defaultMode: "expanded_geez_lexicon",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "nlp-lead@script-lexicon.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Ge'ez Script Pack",
        version: "2026.1",
        scriptFamily: "Ge'ez (Amharic + Tigrinya)",
        languageCount: 2,
        status: "active",
        notes: "Seed pack for demo lexicon compare",
        createdAt: now(),
      },
    ],
    lexicons: [
      {
        id: lexiconId,
        packId,
        label: "Expanded Ge'ez subword lexicon",
        addedSubwords: 30000,
        languages: ["am", "ti"],
        expansionWeight: 0.62,
        baselineWeight: 0.38,
        status: "active",
        notes: "Soft-sim 30k Ge'ez-script subwords without MT certification claim",
        createdAt: now(),
      },
    ],
    tokenizers: [
      {
        id: tokenizerId,
        packId,
        label: "Baseline XLM-style tokenizer case",
        tokenizerSummary:
          "Soft-sim multilingual SentencePiece baseline vs expanded Ge'ez lexicon for Amharic and Tigrinya.",
        successCondition: "script_positive",
        evalChannel: "soft_sim_nlp",
        status: "scored",
        notes: "Seed tokenizer for demo compare",
        createdAt: now(),
      },
    ],
    evalRuns: [
      {
        id: evalId,
        tokenizerId,
        lexiconId,
        lexiconCoverage: 0.58,
        expansionConfidence: 0.7,
        scriptConfidence: 0.74,
        subwordAgreement: 0.68,
        reviewerNotes:
          "Expanded lexicon cues look informative but baseline alone fragments Ge'ez morphology",
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
        detail: "Demo pack, lexicon, tokenizer, and eval run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__slsStore) g.__slsStore = seed();
  return g.__slsStore;
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
  g.__slsStore = seed();
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
  if (patch.defaultLexiconBias !== undefined) {
    org.defaultLexiconBias = patch.defaultLexiconBias;
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
  items: LanguagePack[];
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
        p.scriptFamily.toLowerCase().includes(q) ||
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
  scriptFamily: string;
  languageCount?: number;
  notes?: string;
}): LanguagePack {
  const pack: LanguagePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    scriptFamily: input.scriptFamily,
    languageCount: input.languageCount ?? 2,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): LanguagePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listLexicons(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: LexiconExpand[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().lexicons];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.languages.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createLexicon(input: {
  packId: string;
  label: string;
  languages: string[];
  addedSubwords: number;
  expansionWeight: number;
  baselineWeight?: number;
  notes?: string;
}): LexiconExpand | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const lexicon: LexiconExpand = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    languages: input.languages,
    addedSubwords: Math.max(0, Math.floor(input.addedSubwords)),
    expansionWeight: clamp(input.expansionWeight, 0, 1),
    baselineWeight: clamp(
      input.baselineWeight ?? 1 - input.expansionWeight,
      0,
      1,
    ),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().lexicons.unshift(lexicon);
  audit("evaluator", "lexicon.create", lexicon.label);
  return lexicon;
}

export function archiveLexicon(id: string): LexiconExpand | null {
  const lexicon = state().lexicons.find((m) => m.id === id);
  if (!lexicon) return null;
  lexicon.status = "archived";
  audit("evaluator", "lexicon.archive", id);
  return lexicon;
}

export function listTokenizers(opts?: {
  q?: string;
  evalChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TokenizerConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().tokenizers];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.tokenizerSummary.toLowerCase().includes(q) ||
        c.evalChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.evalChannel) {
    items = items.filter((c) => c.evalChannel === opts.evalChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTokenizer(input: {
  packId?: string;
  label: string;
  tokenizerSummary: string;
  successCondition: string;
  evalChannel: string;
  notes?: string;
}): TokenizerConfig {
  const tokenizer: TokenizerConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    tokenizerSummary: input.tokenizerSummary,
    successCondition: input.successCondition,
    evalChannel: input.evalChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().tokenizers.unshift(tokenizer);
  audit("evaluator", "tokenizer.create", tokenizer.label);
  return tokenizer;
}

export function archiveTokenizer(id: string): TokenizerConfig | null {
  const tokenizer = state().tokenizers.find((c) => c.id === id);
  if (!tokenizer) return null;
  tokenizer.status = "archived";
  audit("evaluator", "tokenizer.archive", id);
  return tokenizer;
}

export function listEvalRuns(opts?: {
  tokenizerId?: string;
  lexiconId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: EvalRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().evalRuns];
  if (opts?.tokenizerId) {
    items = items.filter((r) => r.tokenizerId === opts.tokenizerId);
  }
  if (opts?.lexiconId) {
    items = items.filter((r) => r.lexiconId === opts.lexiconId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createEvalRun(input: {
  tokenizerId: string;
  lexiconId: string;
  lexiconCoverage: number;
  expansionConfidence: number;
  scriptConfidence: number;
  subwordAgreement: number;
  reviewerNotes?: string;
}): EvalRun | null {
  if (!state().tokenizers.some((c) => c.id === input.tokenizerId)) return null;
  if (!state().lexicons.some((m) => m.id === input.lexiconId)) return null;
  const run: EvalRun = {
    id: randomUUID(),
    tokenizerId: input.tokenizerId,
    lexiconId: input.lexiconId,
    lexiconCoverage: clamp(input.lexiconCoverage, 0, 1),
    expansionConfidence: clamp(input.expansionConfidence, 0, 1),
    scriptConfidence: clamp(input.scriptConfidence, 0, 1),
    subwordAgreement: clamp(input.subwordAgreement, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().evalRuns.unshift(run);
  const tokenizer = state().tokenizers.find((c) => c.id === input.tokenizerId);
  if (tokenizer) tokenizer.status = "scored";
  audit("evaluator", "eval_run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): LexiconCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "negative":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "positive":
    case "script_positive":
      return 0.7;
    case "critical":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  tokenizerId: string;
  lexiconId: string;
  evalRunId: string;
  lexiconBias?: LexiconBias;
  bias?: LexiconBias;
  baselineAccuracy?: number;
  multilingualOptimism?: number;
  morphologyHardness?: number;
  leakageRisk?: number;
}): LexiconCompare | null {
  const tokenizer = state().tokenizers.find((c) => c.id === input.tokenizerId);
  const lexicon = state().lexicons.find((m) => m.id === input.lexiconId);
  const run = state().evalRuns.find((r) => r.id === input.evalRunId);
  if (!tokenizer || !lexicon || !run) return null;

  const goldWeight = outcomeWeight(String(tokenizer.successCondition));
  const slInput: ScriptLexiconInput = {
    lexiconCoverage: clamp(run.lexiconCoverage, 0, 1),
    expansionFidelity: clamp(run.expansionConfidence, 0, 1),
    scriptFit: clamp(run.scriptConfidence, 0, 1),
    subwordAgreement: clamp((run.subwordAgreement + goldWeight) / 2, 0, 1),
    baselineAccuracy: input.baselineAccuracy ?? 0.82,
    multilingualOptimism: input.multilingualOptimism ?? 0.7,
    morphologyHardness:
      input.morphologyHardness ??
      clamp(1 - lexicon.expansionWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(lexicon.addedSubwords > 50000 ? 0.55 : 0.28, 0, 1),
    lexiconBias:
      input.lexiconBias ??
      input.bias ??
      state().org.defaultLexiconBias,
    profile: "expanded_geez_lexicon",
  };

  const expandedGeezLexicon = scoreExpandedGeezLexicon({
    ...slInput,
    profile: "expanded_geez_lexicon",
  });
  const baselineMultilingual = scoreBaselineMultilingual({
    ...slInput,
    profile: "baseline_multilingual",
  });
  const gap = Math.abs(
    expandedGeezLexicon.overall - baselineMultilingual.overall,
  );
  let winner: LexiconCompare["winner"] = "tie";
  if (expandedGeezLexicon.overall > baselineMultilingual.overall + 0.5) {
    winner = "expanded_geez_lexicon";
  } else if (baselineMultilingual.overall > expandedGeezLexicon.overall + 0.5) {
    winner = "baseline_multilingual";
  }

  const compare: LexiconCompare = {
    id: randomUUID(),
    name: input.name,
    tokenizerId: tokenizer.id,
    lexiconId: lexicon.id,
    evalRunId: run.id,
    input: slInput,
    expandedGeezLexicon,
    baselineMultilingual,
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

export function getScoreboard(): LexiconCompare[] {
  return [...state().compares].sort(
    (a, b) =>
      b.expandedGeezLexicon.overall - a.expandedGeezLexicon.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      lexicons: state().lexicons,
      tokenizers: state().tokenizers,
      evalRuns: state().evalRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,expandedOverall,baselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.expandedGeezLexicon.overall},${c.baselineMultilingual.overall},${c.createdAt}`,
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
    { id: "language-packs", name: "Language pack registry" },
    { id: "pack-versions", name: "Versioned language packs" },
    { id: "lexicons", name: "Lexicon expansion registry" },
    { id: "lexicon-editor", name: "Expanded vs baseline lexicon editor" },
    { id: "lexicon-search", name: "Lexicon search and filter" },
    { id: "seed-packs", name: "Seed language packs" },
    { id: "tokenizers", name: "Tokenizer config workspace" },
    { id: "tokenizer-filters", name: "Tokenizer config filters" },
    { id: "success-conditions", name: "Script success conditions" },
    { id: "eval-runs", name: "NLP soft-sim eval runs" },
    { id: "lexicon-bias", name: "Lexicon bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Expanded lexicon vs baseline compare" },
    { id: "delta-view", name: "Lexicon delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-MT-cert notes" },
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

export function scorePreview(input: ScriptLexiconInput): {
  expandedGeezLexicon: ScriptLexiconQuality;
  baselineMultilingual: ScriptLexiconQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const expandedGeezLexicon = scoreExpandedGeezLexicon({
    ...input,
    profile: "expanded_geez_lexicon",
  });
  const baselineMultilingual = scoreBaselineMultilingual({
    ...input,
    profile: "baseline_multilingual",
  });
  return {
    expandedGeezLexicon,
    baselineMultilingual,
    readiness: readinessFromQuality(expandedGeezLexicon.overall),
  };
}
