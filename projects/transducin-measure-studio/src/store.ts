import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreRawPrivateTagBaseline,
  scoreSnomedCodedOctRecovery,
} from "./domain/measure";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ParserKind,
  type MeasureBias,
  type ScoreMode,
  type MeasureInput,
  type MeasureQuality,
} from "./domain/types";

export type {
  ParserKind,
  MeasureBias,
  ScoreMode,
  MeasureInput,
  MeasureQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type MeasurePack = {
  id: string;
  label: string;
  version: string;
  imagingTarget: string;
  parserBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ParserStatus = "draft" | "active" | "archived";

export type ParserConfig = {
  id: string;
  packId: string;
  label: string;
  kind: ParserKind;
  vendors: string;
  vendorCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: ParserStatus;
  notes: string;
  createdAt: string;
};

export type ExportStatus = "draft" | "open" | "scored" | "archived";

export type DicomExport = {
  id: string;
  packId?: string;
  label: string;
  exportText: string;
  successCondition: string;
  exportChannel: string;
  status: ExportStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type MeasureRun = {
  id: string;
  exportId: string;
  parserId: string;
  measureCoverage: number;
  parseFidelity: number;
  snomedClarity: number;
  exportStability: number;
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
  defaultMeasureBias: MeasureBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type MeasureCompare = {
  id: string;
  name: string;
  exportId: string;
  parserId: string;
  runId: string;
  input: MeasureInput;
  snomedCoded: MeasureQuality;
  privateTagBaseline: MeasureQuality;
  winner:
    | "snomed_coded_oct_recovery"
    | "raw_private_tag_baseline"
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
  packs: MeasurePack[];
  parsers: ParserConfig[];
  exports: DicomExport[];
  runs: MeasureRun[];
  audits: AuditEntry[];
  compares: MeasureCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __transducinMeasureStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const parserId = "parser-demo";
  const exportId = "export-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Transducin Measure Org",
      webhookUrl: "",
      webhookSecret: "transducin-measure-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultMeasureBias: "balanced",
      defaultMode: "snomed_coded_oct_recovery",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@transducin-measure.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Macular Thickness Soft-Sim Pack",
        version: "2026.1",
        imagingTarget: "Optopol + Zeiss Cirrus → DICOM SR soft-sim",
        parserBudget: 36,
        status: "active",
        notes: "Seed pack for SNOMED-coded OCT recovery vs raw private-tag compare",
        createdAt: now(),
      },
    ],
    parsers: [
      {
        id: parserId,
        packId,
        label: "Optopol/Zeiss hybrid SNOMED gate",
        kind: "hybrid",
        vendors: "optopol,zeiss,snomed",
        vendorCount: 3,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint: "SNOMED-coded OCT recovery under soft-sim honesty",
        status: "active",
        notes: "Soft-sim parser — not live PACS write-back",
        createdAt: now(),
      },
    ],
    exports: [
      {
        id: exportId,
        packId,
        label: "DICOM SR macular measure export",
        exportText:
          "Does SNOMED-coded OCT recovery beat raw private-tag dumps before lock?",
        successCondition: "lock_soft_sim",
        exportChannel: "soft_sim_dicom_sr",
        status: "scored",
        notes: "Seed export for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        exportId,
        parserId,
        measureCoverage: 0.62,
        parseFidelity: 0.7,
        snomedClarity: 0.74,
        exportStability: 0.68,
        reviewerNotes:
          "SNOMED-coded recovery looks trustworthy but raw private tags miss coding drift",
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
        detail: "Demo pack, parser, export, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__transducinMeasureStore) g.__transducinMeasureStore = seed();
  return g.__transducinMeasureStore;
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
  g.__transducinMeasureStore = seed();
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
  if (patch.defaultMeasureBias !== undefined) {
    org.defaultMeasureBias = patch.defaultMeasureBias;
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
  items: MeasurePack[];
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
        p.imagingTarget.toLowerCase().includes(q) ||
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
  imagingTarget: string;
  parserBudget?: number;
  notes?: string;
}): MeasurePack {
  const pack: MeasurePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    imagingTarget: input.imagingTarget,
    parserBudget: input.parserBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): MeasurePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listParsers(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ParserConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().parsers];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.vendors.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createParser(input: {
  packId: string;
  label: string;
  kind: ParserKind;
  vendors: string;
  vendorCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): ParserConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const parser: ParserConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    vendors: input.vendors,
    vendorCount: input.vendorCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().parsers.unshift(parser);
  audit("evaluator", "parser.create", parser.label);
  return parser;
}

export function archiveParser(id: string): ParserConfig | null {
  const parser = state().parsers.find((m) => m.id === id);
  if (!parser) return null;
  parser.status = "archived";
  audit("evaluator", "parser.archive", id);
  return parser;
}

export function listExports(opts?: {
  q?: string;
  exportChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DicomExport[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().exports];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.exportText.toLowerCase().includes(q) ||
        c.exportChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.exportChannel) {
    items = items.filter((c) => c.exportChannel === opts.exportChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createExport(input: {
  packId?: string;
  label: string;
  exportText: string;
  successCondition: string;
  exportChannel: string;
  notes?: string;
}): DicomExport {
  const row: DicomExport = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    exportText: input.exportText,
    successCondition: input.successCondition,
    exportChannel: input.exportChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().exports.unshift(row);
  audit("evaluator", "export.create", row.label);
  return row;
}

export function archiveExport(id: string): DicomExport | null {
  const row = state().exports.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "export.archive", id);
  return row;
}

export function listRuns(opts?: {
  exportId?: string;
  parserId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: MeasureRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.exportId) {
    items = items.filter((r) => r.exportId === opts.exportId);
  }
  if (opts?.parserId) {
    items = items.filter((r) => r.parserId === opts.parserId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  exportId: string;
  parserId: string;
  measureCoverage: number;
  parseFidelity: number;
  snomedClarity: number;
  exportStability: number;
  reviewerNotes?: string;
}): MeasureRun | null {
  if (!state().exports.some((c) => c.id === input.exportId)) {
    return null;
  }
  if (!state().parsers.some((m) => m.id === input.parserId)) return null;
  const run: MeasureRun = {
    id: randomUUID(),
    exportId: input.exportId,
    parserId: input.parserId,
    measureCoverage: clamp(input.measureCoverage, 0, 1),
    parseFidelity: clamp(input.parseFidelity, 0, 1),
    snomedClarity: clamp(input.snomedClarity, 0, 1),
    exportStability: clamp(input.exportStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().exports.find((c) => c.id === input.exportId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): MeasureCompare[] {
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
  exportId: string;
  parserId: string;
  runId: string;
  measureBias?: MeasureBias;
  bias?: MeasureBias;
  privateTagRate?: number;
  privateTagOptimism?: number;
  formatHardness?: number;
  overclaimRisk?: number;
}): MeasureCompare | null {
  const exportRow = state().exports.find((c) => c.id === input.exportId);
  const parser = state().parsers.find((m) => m.id === input.parserId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!exportRow || !parser || !run) return null;

  const goldWeight = outcomeWeight(String(exportRow.successCondition));
  const span = Math.max(0.05, parser.coverageMax - parser.coverageMin);
  const measureInput: MeasureInput = {
    measureCoverage: clamp(run.measureCoverage, 0, 1),
    parseFidelity: clamp(run.parseFidelity, 0, 1),
    snomedClarity: clamp(run.snomedClarity, 0, 1),
    exportStability: clamp((run.exportStability + goldWeight) / 2, 0, 1),
    privateTagRate: input.privateTagRate ?? 0.82,
    privateTagOptimism: input.privateTagOptimism ?? 0.7,
    formatHardness: input.formatHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    measureBias:
      input.measureBias ?? input.bias ?? state().org.defaultMeasureBias,
    profile: "snomed_coded_oct_recovery",
  };

  const snomedCoded = scoreSnomedCodedOctRecovery({
    ...measureInput,
    profile: "snomed_coded_oct_recovery",
  });
  const privateTagBaseline = scoreRawPrivateTagBaseline({
    ...measureInput,
    profile: "raw_private_tag_baseline",
  });
  const gap = Math.abs(snomedCoded.overall - privateTagBaseline.overall);
  let winner: MeasureCompare["winner"] = "tie";
  if (snomedCoded.overall > privateTagBaseline.overall + 0.5) {
    winner = "snomed_coded_oct_recovery";
  } else if (privateTagBaseline.overall > snomedCoded.overall + 0.5) {
    winner = "raw_private_tag_baseline";
  }

  const compare: MeasureCompare = {
    id: randomUUID(),
    name: input.name,
    exportId: exportRow.id,
    parserId: parser.id,
    runId: run.id,
    input: measureInput,
    snomedCoded,
    privateTagBaseline,
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

export function getScoreboard(): MeasureCompare[] {
  return [...state().compares].sort(
    (a, b) => b.snomedCoded.overall - a.snomedCoded.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      parsers: state().parsers,
      exports: state().exports,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,snomedCodedOverall,privateTagBaselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.snomedCoded.overall},${c.privateTagBaseline.overall},${c.createdAt}`,
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
    { id: "measure-packs", name: "Measure pack registry" },
    { id: "pack-versions", name: "Versioned measure packs" },
    { id: "parser-configs", name: "Optopol/Zeiss parser configs" },
    { id: "parser-editor", name: "Parser vendor / coverage editor" },
    { id: "parser-search", name: "Parser search and filter" },
    { id: "seed-packs", name: "Seed measure packs" },
    { id: "dicom-exports", name: "DICOM SR export workspace" },
    { id: "export-filters", name: "Export filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "measure-runs", name: "Measure soft-sim runs" },
    { id: "measure-bias", name: "Measure bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "SNOMED-coded OCT recovery vs raw private-tag compare",
    },
    { id: "delta-view", name: "Measure delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not clinical / not PACS / not diagnostic notes",
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

export function scorePreview(input: MeasureInput): {
  snomedCoded: MeasureQuality;
  privateTagBaseline: MeasureQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const snomedCoded = scoreSnomedCodedOctRecovery({
    ...input,
    profile: "snomed_coded_oct_recovery",
  });
  const privateTagBaseline = scoreRawPrivateTagBaseline({
    ...input,
    profile: "raw_private_tag_baseline",
  });
  return {
    snomedCoded,
    privateTagBaseline,
    readiness: readinessFromQuality(snomedCoded.overall),
  };
}
