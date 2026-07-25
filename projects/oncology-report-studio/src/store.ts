import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMultiLlmCollaborative,
  scoreSingleLlmBaseline,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ReportBias,
  type ReportInput,
  type ReportQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  ReportBias,
  ReportInput,
  ReportQuality,
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

export type CasePack = {
  id: string;
  label: string;
  version: string;
  anatomyRegion: string;
  caseCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SchemaStatus = "draft" | "active" | "archived";

export type ReportSchema = {
  id: string;
  packId: string;
  label: string;
  sectionCount: number;
  sections: string[];
  collaboratorWeight: number;
  soloWeight: number;
  status: SchemaStatus;
  notes: string;
  createdAt: string;
};

export type CollaboratorStatus = "draft" | "open" | "scored" | "archived";

export type CollaboratorConfig = {
  id: string;
  packId?: string;
  label: string;
  collaboratorSummary: string;
  successCondition: OutcomeLabel | string;
  draftChannel: string;
  status: CollaboratorStatus;
  notes: string;
  createdAt: string;
};

export type DraftStatus = "draft" | "active" | "archived";

export type ReportDraft = {
  id: string;
  collaboratorId: string;
  schemaId: string;
  collaboratorCoverage: number;
  findingConfidence: number;
  schemaConfidence: number;
  consensusAgreement: number;
  reviewerNotes: string;
  status: DraftStatus;
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
  defaultReportBias: ReportBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ReportCompare = {
  id: string;
  name: string;
  collaboratorId: string;
  schemaId: string;
  draftId: string;
  input: ReportInput;
  multiLlmCollaborative: ReportQuality;
  singleLlmBaseline: ReportQuality;
  winner: "multi_llm_collaborative" | "single_llm_baseline" | "tie";
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
  packs: CasePack[];
  schemas: ReportSchema[];
  collaborators: CollaboratorConfig[];
  drafts: ReportDraft[];
  audits: AuditEntry[];
  compares: ReportCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __orsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const schemaId = "schema-demo";
  const collaboratorId = "collaborator-demo";
  const draftId = "draft-demo";
  return {
    org: {
      name: "Oncology Report Org",
      webhookUrl: "",
      webhookSecret: "ors-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultReportBias: "balanced",
      defaultMode: "multi_llm_collaborative",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "imaging-lead@oncology-report.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Glioma MRI Soft-Sim Pack",
        version: "2026.1",
        anatomyRegion: "Brain oncology MRI (soft-sim)",
        caseCount: 48,
        status: "active",
        notes: "Seed pack for demo multi-LLM collaborative compare",
        createdAt: now(),
      },
    ],
    schemas: [
      {
        id: schemaId,
        packId,
        label: "Structured neuro-oncology report schema",
        sectionCount: 8,
        sections: [
          "Indication",
          "Technique",
          "Findings",
          "Lesion metrics",
          "Enhancement",
          "Edema",
          "Impression",
          "Recommendations",
        ],
        collaboratorWeight: 0.62,
        soloWeight: 0.38,
        status: "active",
        notes: "Soft-sim schema without CDS claim",
        createdAt: now(),
      },
    ],
    collaborators: [
      {
        id: collaboratorId,
        packId,
        label: "Multi-LLM collaborative panel",
        collaboratorSummary:
          "Soft-sim multi-LLM collaborative MRI report draft vs single-LLM baseline for brain oncology packs.",
        successCondition: "report_positive",
        draftChannel: "soft_sim_report",
        status: "scored",
        notes: "Seed collaborator for demo compare",
        createdAt: now(),
      },
    ],
    drafts: [
      {
        id: draftId,
        collaboratorId,
        schemaId,
        collaboratorCoverage: 0.58,
        findingConfidence: 0.7,
        schemaConfidence: 0.74,
        consensusAgreement: 0.68,
        reviewerNotes:
          "Collaborator cues look informative but single-LLM alone misses rare findings under soft-sim load",
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
        detail: "Demo pack, schema, collaborator, and draft seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__orsStore) g.__orsStore = seed();
  return g.__orsStore;
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
  g.__orsStore = seed();
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
  if (patch.defaultReportBias !== undefined) {
    org.defaultReportBias = patch.defaultReportBias;
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
  items: CasePack[];
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
        p.anatomyRegion.toLowerCase().includes(q) ||
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
  anatomyRegion: string;
  caseCount?: number;
  notes?: string;
}): CasePack {
  const pack: CasePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    anatomyRegion: input.anatomyRegion,
    caseCount: input.caseCount ?? 40,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CasePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listSchemas(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ReportSchema[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().schemas];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.sections.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSchema(input: {
  packId: string;
  label: string;
  sections: string[];
  sectionCount: number;
  collaboratorWeight: number;
  soloWeight?: number;
  notes?: string;
}): ReportSchema | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const schema: ReportSchema = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    sections: input.sections,
    sectionCount: Math.max(0, Math.floor(input.sectionCount)),
    collaboratorWeight: clamp(input.collaboratorWeight, 0, 1),
    soloWeight: clamp(input.soloWeight ?? 1 - input.collaboratorWeight, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().schemas.unshift(schema);
  audit("evaluator", "schema.create", schema.label);
  return schema;
}

export function archiveSchema(id: string): ReportSchema | null {
  const schema = state().schemas.find((m) => m.id === id);
  if (!schema) return null;
  schema.status = "archived";
  audit("evaluator", "schema.archive", id);
  return schema;
}

export function listCollaborators(opts?: {
  q?: string;
  draftChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CollaboratorConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().collaborators];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.collaboratorSummary.toLowerCase().includes(q) ||
        c.draftChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.draftChannel) {
    items = items.filter((c) => c.draftChannel === opts.draftChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCollaborator(input: {
  packId?: string;
  label: string;
  collaboratorSummary: string;
  successCondition: string;
  draftChannel: string;
  notes?: string;
}): CollaboratorConfig {
  const collaborator: CollaboratorConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    collaboratorSummary: input.collaboratorSummary,
    successCondition: input.successCondition,
    draftChannel: input.draftChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().collaborators.unshift(collaborator);
  audit("evaluator", "collaborator.create", collaborator.label);
  return collaborator;
}

export function archiveCollaborator(id: string): CollaboratorConfig | null {
  const collaborator = state().collaborators.find((c) => c.id === id);
  if (!collaborator) return null;
  collaborator.status = "archived";
  audit("evaluator", "collaborator.archive", id);
  return collaborator;
}

export function listDrafts(opts?: {
  collaboratorId?: string;
  schemaId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ReportDraft[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().drafts];
  if (opts?.collaboratorId) {
    items = items.filter((r) => r.collaboratorId === opts.collaboratorId);
  }
  if (opts?.schemaId) {
    items = items.filter((r) => r.schemaId === opts.schemaId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createDraft(input: {
  collaboratorId: string;
  schemaId: string;
  collaboratorCoverage: number;
  findingConfidence: number;
  schemaConfidence: number;
  consensusAgreement: number;
  reviewerNotes?: string;
}): ReportDraft | null {
  if (!state().collaborators.some((c) => c.id === input.collaboratorId)) {
    return null;
  }
  if (!state().schemas.some((m) => m.id === input.schemaId)) return null;
  const draft: ReportDraft = {
    id: randomUUID(),
    collaboratorId: input.collaboratorId,
    schemaId: input.schemaId,
    collaboratorCoverage: clamp(input.collaboratorCoverage, 0, 1),
    findingConfidence: clamp(input.findingConfidence, 0, 1),
    schemaConfidence: clamp(input.schemaConfidence, 0, 1),
    consensusAgreement: clamp(input.consensusAgreement, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().drafts.unshift(draft);
  const collaborator = state().collaborators.find(
    (c) => c.id === input.collaboratorId,
  );
  if (collaborator) collaborator.status = "scored";
  audit("evaluator", "draft.create", draft.id);
  return draft;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ReportCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "negative":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "positive":
    case "report_positive":
      return 0.7;
    case "critical":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  collaboratorId: string;
  schemaId: string;
  draftId: string;
  reportBias?: ReportBias;
  bias?: ReportBias;
  singleModelAccuracy?: number;
  soloOptimism?: number;
  rareFindingHardness?: number;
  leakageRisk?: number;
}): ReportCompare | null {
  const collaborator = state().collaborators.find(
    (c) => c.id === input.collaboratorId,
  );
  const schema = state().schemas.find((m) => m.id === input.schemaId);
  const draft = state().drafts.find((r) => r.id === input.draftId);
  if (!collaborator || !schema || !draft) return null;

  const goldWeight = outcomeWeight(String(collaborator.successCondition));
  const reportInput: ReportInput = {
    collaboratorCoverage: clamp(draft.collaboratorCoverage, 0, 1),
    findingFidelity: clamp(draft.findingConfidence, 0, 1),
    schemaFit: clamp(draft.schemaConfidence, 0, 1),
    consensusAgreement: clamp((draft.consensusAgreement + goldWeight) / 2, 0, 1),
    singleModelAccuracy: input.singleModelAccuracy ?? 0.82,
    soloOptimism: input.soloOptimism ?? 0.7,
    rareFindingHardness:
      input.rareFindingHardness ??
      clamp(1 - schema.collaboratorWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(schema.sectionCount > 12 ? 0.55 : 0.28, 0, 1),
    reportBias:
      input.reportBias ?? input.bias ?? state().org.defaultReportBias,
    profile: "multi_llm_collaborative",
  };

  const multiLlmCollaborative = scoreMultiLlmCollaborative({
    ...reportInput,
    profile: "multi_llm_collaborative",
  });
  const singleLlmBaseline = scoreSingleLlmBaseline({
    ...reportInput,
    profile: "single_llm_baseline",
  });
  const gap = Math.abs(
    multiLlmCollaborative.overall - singleLlmBaseline.overall,
  );
  let winner: ReportCompare["winner"] = "tie";
  if (multiLlmCollaborative.overall > singleLlmBaseline.overall + 0.5) {
    winner = "multi_llm_collaborative";
  } else if (singleLlmBaseline.overall > multiLlmCollaborative.overall + 0.5) {
    winner = "single_llm_baseline";
  }

  const compare: ReportCompare = {
    id: randomUUID(),
    name: input.name,
    collaboratorId: collaborator.id,
    schemaId: schema.id,
    draftId: draft.id,
    input: reportInput,
    multiLlmCollaborative,
    singleLlmBaseline,
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

export function getScoreboard(): ReportCompare[] {
  return [...state().compares].sort(
    (a, b) =>
      b.multiLlmCollaborative.overall - a.multiLlmCollaborative.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      schemas: state().schemas,
      collaborators: state().collaborators,
      drafts: state().drafts,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,multiLlmOverall,singleLlmOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.multiLlmCollaborative.overall},${c.singleLlmBaseline.overall},${c.createdAt}`,
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
    { id: "case-packs", name: "Case pack registry" },
    { id: "pack-versions", name: "Versioned case packs" },
    { id: "report-schemas", name: "Report schema registry" },
    { id: "schema-editor", name: "Collaborator vs solo weight editor" },
    { id: "schema-search", name: "Schema search and filter" },
    { id: "seed-packs", name: "Seed case packs" },
    { id: "collaborators", name: "Collaborator config workspace" },
    { id: "collaborator-filters", name: "Collaborator config filters" },
    { id: "success-conditions", name: "Report success conditions" },
    { id: "report-drafts", name: "Report soft-sim drafts" },
    { id: "report-bias", name: "Report bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Multi-LLM vs single-LLM compare" },
    { id: "delta-view", name: "Report delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-CDS notes" },
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

export function scorePreview(input: ReportInput): {
  multiLlmCollaborative: ReportQuality;
  singleLlmBaseline: ReportQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const multiLlmCollaborative = scoreMultiLlmCollaborative({
    ...input,
    profile: "multi_llm_collaborative",
  });
  const singleLlmBaseline = scoreSingleLlmBaseline({
    ...input,
    profile: "single_llm_baseline",
  });
  return {
    multiLlmCollaborative,
    singleLlmBaseline,
    readiness: readinessFromQuality(multiLlmCollaborative.overall),
  };
}
