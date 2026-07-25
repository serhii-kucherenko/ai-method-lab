import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreFederatedCvdRisk,
  scoreCentralizedBaseline,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type CvdBias,
  type CvdInput,
  type CvdQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  CvdBias,
  CvdInput,
  CvdQuality,
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

export type CohortPack = {
  id: string;
  label: string;
  version: string;
  cohortScope: string;
  patientCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SchemaStatus = "draft" | "active" | "archived";

export type FeatureSchema = {
  id: string;
  packId: string;
  label: string;
  featureCount: number;
  features: string[];
  federationWeight: number;
  centralWeight: number;
  status: SchemaStatus;
  notes: string;
  createdAt: string;
};

export type FederationStatus = "draft" | "open" | "scored" | "archived";

export type FederationConfig = {
  id: string;
  packId?: string;
  label: string;
  siteSummary: string;
  successCondition: OutcomeLabel | string;
  federationChannel: string;
  status: FederationStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type CvdRun = {
  id: string;
  federationId: string;
  schemaId: string;
  siteParticipation: number;
  featureConfidence: number;
  schemaConfidence: number;
  federationAgreement: number;
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
  defaultCvdBias: CvdBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CvdCompare = {
  id: string;
  name: string;
  federationId: string;
  schemaId: string;
  runId: string;
  input: CvdInput;
  federatedCvdRisk: CvdQuality;
  centralizedBaseline: CvdQuality;
  winner: "federated_cvd_risk" | "centralized_baseline" | "tie";
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
  schemas: FeatureSchema[];
  federations: FederationConfig[];
  runs: CvdRun[];
  audits: AuditEntry[];
  compares: CvdCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __fcvdStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const schemaId = "schema-demo";
  const federationId = "federation-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Federated CVD Org",
      webhookUrl: "",
      webhookSecret: "fcvd-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultCvdBias: "balanced",
      defaultMode: "federated_cvd_risk",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "cvd-lead@federated-cvd.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Multi-site CVD Soft-Sim Pack",
        version: "2026.1",
        cohortScope: "Adult CVD risk cohort (soft-sim)",
        patientCount: 4800,
        status: "active",
        notes: "Seed pack for demo federated vs centralized compare",
        createdAt: now(),
      },
    ],
    schemas: [
      {
        id: schemaId,
        packId,
        label: "CVD risk feature schema",
        featureCount: 8,
        features: [
          "Age",
          "Systolic BP",
          "LDL",
          "HDL",
          "Smoking status",
          "Diabetes flag",
          "BMI",
          "Prior event",
        ],
        federationWeight: 0.62,
        centralWeight: 0.38,
        status: "active",
        notes: "Soft-sim schema without FDA claim",
        createdAt: now(),
      },
    ],
    federations: [
      {
        id: federationId,
        packId,
        label: "Hospital federation ring",
        siteSummary:
          "Soft-sim federated CVD risk across hospital sites vs centralized pooled baseline.",
        successCondition: "elevated",
        federationChannel: "soft_sim_federation",
        status: "scored",
        notes: "Seed federation for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        federationId,
        schemaId,
        siteParticipation: 0.58,
        featureConfidence: 0.7,
        schemaConfidence: 0.74,
        federationAgreement: 0.68,
        reviewerNotes:
          "Federation cues look informative but centralized alone misses site-shift under soft-sim load",
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
        detail: "Demo pack, schema, federation, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__fcvdStore) g.__fcvdStore = seed();
  return g.__fcvdStore;
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
  g.__fcvdStore = seed();
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
  if (patch.defaultCvdBias !== undefined) {
    org.defaultCvdBias = patch.defaultCvdBias;
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
        p.cohortScope.toLowerCase().includes(q) ||
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
  cohortScope: string;
  patientCount?: number;
  notes?: string;
}): CohortPack {
  const pack: CohortPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    cohortScope: input.cohortScope,
    patientCount: input.patientCount ?? 1000,
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

export function listSchemas(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: FeatureSchema[];
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
        m.features.some((f) => f.toLowerCase().includes(q)) ||
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
  features: string[];
  featureCount: number;
  federationWeight: number;
  centralWeight?: number;
  notes?: string;
}): FeatureSchema | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const schema: FeatureSchema = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    features: input.features,
    featureCount: Math.max(0, Math.floor(input.featureCount)),
    federationWeight: clamp(input.federationWeight, 0, 1),
    centralWeight: clamp(input.centralWeight ?? 1 - input.federationWeight, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().schemas.unshift(schema);
  audit("evaluator", "schema.create", schema.label);
  return schema;
}

export function archiveSchema(id: string): FeatureSchema | null {
  const schema = state().schemas.find((m) => m.id === id);
  if (!schema) return null;
  schema.status = "archived";
  audit("evaluator", "schema.archive", id);
  return schema;
}

export function listFederations(opts?: {
  q?: string;
  federationChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: FederationConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().federations];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.siteSummary.toLowerCase().includes(q) ||
        c.federationChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.federationChannel) {
    items = items.filter((c) => c.federationChannel === opts.federationChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createFederation(input: {
  packId?: string;
  label: string;
  siteSummary: string;
  successCondition: string;
  federationChannel: string;
  notes?: string;
}): FederationConfig {
  const federation: FederationConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    siteSummary: input.siteSummary,
    successCondition: input.successCondition,
    federationChannel: input.federationChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().federations.unshift(federation);
  audit("evaluator", "federation.create", federation.label);
  return federation;
}

export function archiveFederation(id: string): FederationConfig | null {
  const federation = state().federations.find((c) => c.id === id);
  if (!federation) return null;
  federation.status = "archived";
  audit("evaluator", "federation.archive", id);
  return federation;
}

export function listRuns(opts?: {
  federationId?: string;
  schemaId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CvdRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.federationId) {
    items = items.filter((r) => r.federationId === opts.federationId);
  }
  if (opts?.schemaId) {
    items = items.filter((r) => r.schemaId === opts.schemaId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  federationId: string;
  schemaId: string;
  siteParticipation: number;
  featureConfidence: number;
  schemaConfidence: number;
  federationAgreement: number;
  reviewerNotes?: string;
}): CvdRun | null {
  if (!state().federations.some((c) => c.id === input.federationId)) {
    return null;
  }
  if (!state().schemas.some((m) => m.id === input.schemaId)) return null;
  const run: CvdRun = {
    id: randomUUID(),
    federationId: input.federationId,
    schemaId: input.schemaId,
    siteParticipation: clamp(input.siteParticipation, 0, 1),
    featureConfidence: clamp(input.featureConfidence, 0, 1),
    schemaConfidence: clamp(input.schemaConfidence, 0, 1),
    federationAgreement: clamp(input.federationAgreement, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const federation = state().federations.find(
    (c) => c.id === input.federationId,
  );
  if (federation) federation.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): CvdCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "low_risk":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "elevated":
      return 0.7;
    case "critical":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  federationId: string;
  schemaId: string;
  runId: string;
  cvdBias?: CvdBias;
  bias?: CvdBias;
  centralizedAccuracy?: number;
  centralOptimism?: number;
  heterogeneityHardness?: number;
  leakageRisk?: number;
}): CvdCompare | null {
  const federation = state().federations.find(
    (c) => c.id === input.federationId,
  );
  const schema = state().schemas.find((m) => m.id === input.schemaId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!federation || !schema || !run) return null;

  const goldWeight = outcomeWeight(String(federation.successCondition));
  const cvdInput: CvdInput = {
    siteParticipation: clamp(run.siteParticipation, 0, 1),
    featureFidelity: clamp(run.featureConfidence, 0, 1),
    schemaFit: clamp(run.schemaConfidence, 0, 1),
    federationAgreement: clamp((run.federationAgreement + goldWeight) / 2, 0, 1),
    centralizedAccuracy: input.centralizedAccuracy ?? 0.82,
    centralOptimism: input.centralOptimism ?? 0.7,
    heterogeneityHardness:
      input.heterogeneityHardness ??
      clamp(1 - schema.federationWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(schema.featureCount > 12 ? 0.55 : 0.28, 0, 1),
    cvdBias: input.cvdBias ?? input.bias ?? state().org.defaultCvdBias,
    profile: "federated_cvd_risk",
  };

  const federatedCvdRisk = scoreFederatedCvdRisk({
    ...cvdInput,
    profile: "federated_cvd_risk",
  });
  const centralizedBaseline = scoreCentralizedBaseline({
    ...cvdInput,
    profile: "centralized_baseline",
  });
  const gap = Math.abs(federatedCvdRisk.overall - centralizedBaseline.overall);
  let winner: CvdCompare["winner"] = "tie";
  if (federatedCvdRisk.overall > centralizedBaseline.overall + 0.5) {
    winner = "federated_cvd_risk";
  } else if (centralizedBaseline.overall > federatedCvdRisk.overall + 0.5) {
    winner = "centralized_baseline";
  }

  const compare: CvdCompare = {
    id: randomUUID(),
    name: input.name,
    federationId: federation.id,
    schemaId: schema.id,
    runId: run.id,
    input: cvdInput,
    federatedCvdRisk,
    centralizedBaseline,
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

export function getScoreboard(): CvdCompare[] {
  return [...state().compares].sort(
    (a, b) => b.federatedCvdRisk.overall - a.federatedCvdRisk.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      schemas: state().schemas,
      federations: state().federations,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,federatedOverall,centralizedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.federatedCvdRisk.overall},${c.centralizedBaseline.overall},${c.createdAt}`,
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
    { id: "cohort-packs", name: "Cohort pack registry" },
    { id: "pack-versions", name: "Versioned cohort packs" },
    { id: "feature-schemas", name: "Feature schema registry" },
    { id: "schema-editor", name: "Federation vs central weight editor" },
    { id: "schema-search", name: "Schema search and filter" },
    { id: "seed-packs", name: "Seed cohort packs" },
    { id: "federation", name: "Federation config workspace" },
    { id: "federation-filters", name: "Federation config filters" },
    { id: "success-conditions", name: "CVD risk success conditions" },
    { id: "cvd-runs", name: "CVD soft-sim runs" },
    { id: "cvd-bias", name: "CVD bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Federated vs centralized compare" },
    { id: "delta-view", name: "Risk delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-FDA notes" },
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

export function scorePreview(input: CvdInput): {
  federatedCvdRisk: CvdQuality;
  centralizedBaseline: CvdQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const federatedCvdRisk = scoreFederatedCvdRisk({
    ...input,
    profile: "federated_cvd_risk",
  });
  const centralizedBaseline = scoreCentralizedBaseline({
    ...input,
    profile: "centralized_baseline",
  });
  return {
    federatedCvdRisk,
    centralizedBaseline,
    readiness: readinessFromQuality(federatedCvdRisk.overall),
  };
}
