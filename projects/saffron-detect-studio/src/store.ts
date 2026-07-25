import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreCnnAdulterationDetection,
  scoreVisualInspectionBaseline,
} from "./domain/detect";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ImageKind,
  type DetectBias,
  type ScoreMode,
  type DetectInput,
  type DetectQuality,
} from "./domain/types";

export type {
  ImageKind,
  DetectBias,
  ScoreMode,
  DetectInput,
  DetectQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type DetectPack = {
  id: string;
  label: string;
  version: string;
  detectFocus: string;
  imageBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ImageStatus = "draft" | "active" | "archived";

export type StigmaImage = {
  id: string;
  packId: string;
  label: string;
  kind: ImageKind;
  channelHint: string;
  seriesCount: number;
  clarityMin: number;
  clarityMax: number;
  metricHint: string;
  status: ImageStatus;
  notes: string;
  createdAt: string;
};

export type ModelStatus = "draft" | "open" | "scored" | "archived";

export type DetectModel = {
  id: string;
  packId?: string;
  label: string;
  architecture: string;
  lockCondition: string;
  modelChannel: string;
  status: ModelStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type DetectRun = {
  id: string;
  modelId: string;
  imageId: string;
  stigmaClarity: number;
  adulterantContrast: number;
  cnnConfidence: number;
  textureIntegrity: number;
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
  defaultDetectBias: DetectBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type DetectCompare = {
  id: string;
  name: string;
  modelId: string;
  imageId: string;
  runId: string;
  input: DetectInput;
  cnn: DetectQuality;
  visual: DetectQuality;
  winner:
    | "cnn_adulteration_detection"
    | "visual_inspection_baseline"
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
  packs: DetectPack[];
  images: StigmaImage[];
  models: DetectModel[];
  runs: DetectRun[];
  audits: AuditEvent[];
  compares: DetectCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __saffronDetectStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const imageId = "img-demo";
  const modelId = "model-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Saffron Detect Org",
      webhookUrl: "",
      webhookSecret: "saffron-detect-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultDetectBias: "balanced",
      defaultMode: "cnn_adulteration_detection",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@saffron-detect.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Saffron Stigma Soft-Sim Pack",
        version: "2026.1",
        detectFocus:
          "CNN stigma-image adulteration detection soft-sim",
        imageBudget: 36,
        status: "active",
        notes:
          "Seed pack for CNN adulteration detection vs visual inspection baseline soft-sim",
        createdAt: now(),
      },
    ],
    images: [
      {
        id: imageId,
        packId,
        label: "Macro stigma tray series",
        kind: "stigma_macro",
        channelHint:
          "stigma_clarity,adulterant_contrast,cnn_confidence,texture_integrity",
        seriesCount: 4,
        clarityMin: 0.4,
        clarityMax: 0.95,
        metricHint:
          "Clarity, contrast, CNN confidence, and texture for detect soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim stigma images — not customs authority / not certified lab",
        createdAt: now(),
      },
    ],
    models: [
      {
        id: modelId,
        packId,
        label: "ResNet soft-sim detect model",
        architecture:
          "Comparative CNN soft-sim (AlexNet / ResNet / VGG16 pattern)",
        lockCondition: "lock_soft_sim",
        modelChannel: "soft_sim_cnn_signal",
        status: "scored",
        notes: "Seed model for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        modelId,
        imageId,
        stigmaClarity: 0.62,
        adulterantContrast: 0.7,
        cnnConfidence: 0.74,
        textureIntegrity: 0.68,
        runNotes:
          "CNN path looks trustworthy but visual inspection needs more honesty on economically motivated adulteration",
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
        detail: "Demo pack, images, models, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__saffronDetectStore) g.__saffronDetectStore = seed();
  return g.__saffronDetectStore;
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
  g.__saffronDetectStore = seed();
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
  if (patch.defaultDetectBias !== undefined) {
    org.defaultDetectBias = patch.defaultDetectBias;
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
  items: DetectPack[];
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
        p.detectFocus.toLowerCase().includes(q) ||
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
  detectFocus: string;
  imageBudget?: number;
  notes?: string;
}): DetectPack {
  const pack: DetectPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    detectFocus: input.detectFocus,
    imageBudget: input.imageBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): DetectPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listImages(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: StigmaImage[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().images];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.channelHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createImage(input: {
  packId: string;
  label: string;
  kind: ImageKind;
  channelHint: string;
  seriesCount: number;
  clarityMin: number;
  clarityMax: number;
  metricHint?: string;
  notes?: string;
}): StigmaImage | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: StigmaImage = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    channelHint: input.channelHint,
    seriesCount: input.seriesCount,
    clarityMin: input.clarityMin,
    clarityMax: input.clarityMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().images.unshift(row);
  audit("evaluator", "image.create", row.label);
  return row;
}

export function archiveImage(id: string): StigmaImage | null {
  const row = state().images.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "image.archive", id);
  return row;
}

export function listModels(opts?: {
  q?: string;
  modelChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DetectModel[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().models];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.architecture.toLowerCase().includes(q) ||
        c.modelChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.modelChannel) {
    items = items.filter((c) => c.modelChannel === opts.modelChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createModel(input: {
  packId?: string;
  label: string;
  architecture: string;
  lockCondition: string;
  modelChannel: string;
  notes?: string;
}): DetectModel {
  const row: DetectModel = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    architecture: input.architecture,
    lockCondition: input.lockCondition,
    modelChannel: input.modelChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().models.unshift(row);
  audit("evaluator", "model.create", row.label);
  return row;
}

export function archiveModel(id: string): DetectModel | null {
  const row = state().models.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "model.archive", id);
  return row;
}

export function listRuns(opts?: {
  modelId?: string;
  imageId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DetectRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.modelId) {
    items = items.filter((r) => r.modelId === opts.modelId);
  }
  if (opts?.imageId) {
    items = items.filter((r) => r.imageId === opts.imageId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  modelId: string;
  imageId: string;
  stigmaClarity: number;
  adulterantContrast: number;
  cnnConfidence: number;
  textureIntegrity: number;
  runNotes?: string;
}): DetectRun | null {
  if (!state().models.some((c) => c.id === input.modelId)) {
    return null;
  }
  if (!state().images.some((m) => m.id === input.imageId)) {
    return null;
  }
  const run: DetectRun = {
    id: randomUUID(),
    modelId: input.modelId,
    imageId: input.imageId,
    stigmaClarity: clamp(input.stigmaClarity, 0, 1),
    adulterantContrast: clamp(input.adulterantContrast, 0, 1),
    cnnConfidence: clamp(input.cnnConfidence, 0, 1),
    textureIntegrity: clamp(input.textureIntegrity, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().models.find((c) => c.id === input.modelId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): DetectCompare[] {
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
  modelId: string;
  imageId: string;
  runId: string;
  detectBias?: DetectBias;
  bias?: DetectBias;
  visualConfidence?: number;
  baselineOptimism?: number;
  detectHardness?: number;
  overclaimRisk?: number;
}): DetectCompare | null {
  const model = state().models.find((c) => c.id === input.modelId);
  const image = state().images.find((m) => m.id === input.imageId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!model || !image || !run) return null;

  const goldWeight = outcomeWeight(String(model.lockCondition));
  const span = Math.max(0.05, image.clarityMax - image.clarityMin);
  const detectInput: DetectInput = {
    stigmaClarity: clamp(run.stigmaClarity, 0, 1),
    adulterantContrast: clamp(run.adulterantContrast, 0, 1),
    cnnConfidence: clamp(run.cnnConfidence, 0, 1),
    textureIntegrity: clamp((run.textureIntegrity + goldWeight) / 2, 0, 1),
    visualConfidence: input.visualConfidence ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    detectHardness: input.detectHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    detectBias:
      input.detectBias ?? input.bias ?? state().org.defaultDetectBias,
    profile: "cnn_adulteration_detection",
  };

  const cnn = scoreCnnAdulterationDetection({
    ...detectInput,
    profile: "cnn_adulteration_detection",
  });
  const visual = scoreVisualInspectionBaseline({
    ...detectInput,
    profile: "visual_inspection_baseline",
  });
  const gap = Math.abs(cnn.overall - visual.overall);
  let winner: DetectCompare["winner"] = "tie";
  if (cnn.overall > visual.overall + 0.5) {
    winner = "cnn_adulteration_detection";
  } else if (visual.overall > cnn.overall + 0.5) {
    winner = "visual_inspection_baseline";
  }

  const compare: DetectCompare = {
    id: randomUUID(),
    name: input.name,
    modelId: model.id,
    imageId: image.id,
    runId: run.id,
    input: detectInput,
    cnn,
    visual,
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

export function getScoreboard(): DetectCompare[] {
  return [...state().compares].sort((a, b) => b.cnn.overall - a.cnn.overall);
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      images: state().images,
      models: state().models,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,cnnOverall,visualOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.cnn.overall},${c.visual.overall},${c.createdAt}`,
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
    { id: "detect-packs", name: "Detect pack registry" },
    { id: "pack-versions", name: "Versioned detect packs" },
    { id: "images", name: "Stigma-image workspace" },
    { id: "image-editor", name: "Image channel / clarity editor" },
    { id: "image-search", name: "Image search and filter" },
    { id: "seed-packs", name: "Seed detect packs" },
    { id: "models", name: "CNN model registry" },
    { id: "model-filters", name: "Model filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "detect-runs", name: "Detect soft-sim runs" },
    { id: "detect-bias", name: "Detect bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "CNN adulteration detection vs visual inspection baseline compare",
    },
    { id: "delta-view", name: "Detect delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not customs / not lab accreditation / not supply-chain write-back / not authors' system",
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

export function scorePreview(input: DetectInput): {
  cnn: DetectQuality;
  visual: DetectQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const cnn = scoreCnnAdulterationDetection({
    ...input,
    profile: "cnn_adulteration_detection",
  });
  const visual = scoreVisualInspectionBaseline({
    ...input,
    profile: "visual_inspection_baseline",
  });
  return {
    cnn,
    visual,
    readiness: readinessFromQuality(cnn.overall),
  };
}
