import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  passBreakdown,
  scoreMultiPass,
  scoreSinglePass,
} from "./domain/compile";
import type {
  CompileInput,
  CompileMode,
  CompileProfile,
  CompileQuality,
  PassBreakdown,
} from "./domain/types";

export type MemberRole = "owner" | "engineer" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type ModelProject = {
  id: string;
  name: string;
  family: string;
  parameterScale: string;
  tags: string[];
  parameterBillion: number;
  createdAt: string;
};

export type TargetProfile = {
  id: string;
  name: string;
  acceleratorClass: string;
  memoryGb: number;
  notes: string;
  createdAt: string;
};

export type ArtifactKind = "mlir" | "optimized_ir" | "binary" | "report";

export type Artifact = {
  id: string;
  runId: string;
  modelId: string;
  kind: ArtifactKind;
  label: string;
  sizeKb: number;
  notes: string;
  createdAt: string;
};

export type CompileRun = {
  id: string;
  modelId: string;
  targetId: string;
  mode: CompileMode;
  profile: CompileProfile;
  stage: "queued" | "lower" | "optimize" | "emit" | "complete" | "failed";
  input: CompileInput;
  quality?: CompileQuality;
  passes?: PassBreakdown;
  modelLabel: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
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
  defaultProfile: CompileProfile;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  modelId: string;
  input: CompileInput;
  multiPass: CompileQuality;
  singlePass: CompileQuality;
  winner: "multi_pass" | "single_pass" | "tie";
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
  models: ModelProject[];
  targets: TargetProfile[];
  artifacts: Artifact[];
  runs: CompileRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __mcsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): CompileInput {
  return {
    graphComplexity: 0.68,
    operatorFusionPotential: 0.74,
    memoryLayoutFit: 0.71,
    quantizationHeadroom: 0.62,
    targetAffinity: 0.78,
    irDepth: 0.66,
    kernelCoverage: 0.7,
    passBudget: 8,
    profile: "full",
  };
}

function seed(): StoreState {
  const modelId = "model-demo";
  const targetId = "target-demo";
  const runId = "run-demo";
  const input = seedInput();
  const quality = scoreMultiPass(input);
  const passes = passBreakdown(input, "multi_pass");

  return {
    org: {
      name: "Compile Lab Org",
      webhookUrl: "",
      webhookSecret: "mcs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "full",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "eng@studio.local", role: "engineer" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    models: [
      {
        id: modelId,
        name: "Demo LLM 7B",
        family: "decoder",
        parameterScale: "7B",
        tags: ["chat", "demo", "mlir-plan"],
        parameterBillion: 7,
        createdAt: now(),
      },
    ],
    targets: [
      {
        id: targetId,
        name: "Edge accelerator A",
        acceleratorClass: "NPU-class",
        memoryGb: 16,
        notes: "Soft target profile for plan comparison — not a chip claim",
        createdAt: now(),
      },
    ],
    artifacts: [
      {
        id: "art-demo",
        runId,
        modelId,
        kind: "optimized_ir",
        label: "Demo optimized IR snapshot",
        sizeKb: 420,
        notes: "Seeded artifact from multi-pass plan",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        modelId,
        targetId,
        mode: "multi_pass",
        profile: "full",
        stage: "complete",
        input,
        quality,
        passes,
        modelLabel: "Demo LLM 7B",
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo model, target, artifact, and completed compile run loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__mcsStore) g.__mcsStore = seed();
  return g.__mcsStore;
}

export function resetStore(): void {
  g.__mcsStore = seed();
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

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  Object.assign(state().org, patch);
  audit("owner", "settings.update", JSON.stringify(patch));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole): Member {
  const m: Member = { id: randomUUID(), email, role };
  state().members.push(m);
  audit("owner", "member.invite", `${email} as ${role}`);
  return m;
}

export function listModels(q?: string): ModelProject[] {
  const all = [...state().models].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (m) =>
      m.name.toLowerCase().includes(needle) ||
      m.family.toLowerCase().includes(needle) ||
      m.parameterScale.toLowerCase().includes(needle) ||
      m.tags.some((t) => t.toLowerCase().includes(needle)),
  );
}

export function createModel(input: {
  name: string;
  family: string;
  parameterScale: string;
  tags: string[];
  parameterBillion: number;
}): ModelProject {
  const m: ModelProject = {
    id: randomUUID(),
    name: input.name.trim(),
    family: input.family.trim(),
    parameterScale: input.parameterScale.trim(),
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    parameterBillion: Math.max(0.1, input.parameterBillion),
    createdAt: now(),
  };
  state().models.unshift(m);
  audit("engineer", "model.create", m.name);
  return m;
}

export function getModel(id: string): ModelProject | undefined {
  return state().models.find((m) => m.id === id);
}

export function listTargets(): TargetProfile[] {
  return [...state().targets].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function createTarget(input: {
  name: string;
  acceleratorClass: string;
  memoryGb: number;
  notes?: string;
}): TargetProfile {
  const t: TargetProfile = {
    id: randomUUID(),
    name: input.name.trim(),
    acceleratorClass: input.acceleratorClass.trim(),
    memoryGb: Math.max(1, Math.round(input.memoryGb)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().targets.unshift(t);
  audit("engineer", "target.create", t.name);
  return t;
}

export function getTarget(id: string): TargetProfile | undefined {
  return state().targets.find((t) => t.id === id);
}

export function listArtifacts(opts?: {
  modelId?: string;
  kind?: ArtifactKind;
}): Artifact[] {
  let rows = [...state().artifacts];
  if (opts?.modelId) rows = rows.filter((a) => a.modelId === opts.modelId);
  if (opts?.kind) rows = rows.filter((a) => a.kind === opts.kind);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createArtifact(input: {
  runId: string;
  modelId: string;
  kind: ArtifactKind;
  label: string;
  sizeKb: number;
  notes?: string;
}): Artifact {
  const model = getModel(input.modelId);
  if (!model) throw new Error("model_not_found");
  const a: Artifact = {
    id: randomUUID(),
    runId: input.runId,
    modelId: input.modelId,
    kind: input.kind,
    label: input.label.trim(),
    sizeKb: Math.max(1, Math.round(input.sizeKb)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().artifacts.unshift(a);
  audit("engineer", "artifact.create", a.label);
  return a;
}

export function listRuns(modelId?: string): CompileRun[] {
  let rows = [...state().runs];
  if (modelId) rows = rows.filter((r) => r.modelId === modelId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createRun(input: {
  modelId: string;
  targetId: string;
  mode?: CompileMode;
  profile?: CompileProfile;
  modelLabel?: string;
  compileInput?: Partial<CompileInput>;
}): CompileRun {
  const model = getModel(input.modelId);
  if (!model) throw new Error("model_not_found");
  const target = getTarget(input.targetId);
  if (!target) throw new Error("target_not_found");
  const base = seedInput();
  const profile = input.profile ?? state().org.defaultProfile;
  const emb: CompileInput = {
    ...base,
    ...input.compileInput,
    profile,
  };
  const run: CompileRun = {
    id: randomUUID(),
    modelId: input.modelId,
    targetId: input.targetId,
    mode: input.mode ?? "multi_pass",
    profile,
    stage: "queued",
    input: emb,
    modelLabel: (input.modelLabel ?? model.name).trim(),
    createdAt: now(),
    updatedAt: now(),
  };
  state().runs.unshift(run);
  audit("engineer", "run.create", `${run.id} ${run.mode}`);
  return run;
}

const STAGE_ORDER: CompileRun["stage"][] = [
  "queued",
  "lower",
  "optimize",
  "emit",
  "complete",
];

export function advanceRun(id: string): CompileRun {
  const run = state().runs.find((r) => r.id === id);
  if (!run) throw new Error("run_not_found");
  if (run.stage === "failed" || run.stage === "complete") {
    throw new Error("illegal_stage_advance");
  }
  const idx = STAGE_ORDER.indexOf(run.stage);
  const next = STAGE_ORDER[idx + 1];
  if (!next) throw new Error("illegal_stage_advance");

  if (next === "complete") {
    const quality =
      run.mode === "multi_pass"
        ? scoreMultiPass(run.input)
        : scoreSinglePass(run.input);
    run.quality = quality;
    run.passes = passBreakdown(run.input, run.mode);
    state().artifacts.unshift({
      id: randomUUID(),
      runId: run.id,
      modelId: run.modelId,
      kind: quality.predictedArtifactTier,
      label: `${run.modelLabel} · ${quality.predictedArtifactTier}`,
      sizeKb: Math.round(80 + quality.overall * 4),
      notes: `Auto-emitted from ${run.mode} plan`,
      createdAt: now(),
    });
  }

  run.stage = next;
  run.updatedAt = now();
  audit("engineer", "run.advance", `${run.id} → ${next}`);
  return { ...run };
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, Math.max(1, limit));
}

export function exportAuditsCsv(): string {
  const header = "id,at,actor,action,detail";
  const lines = state().audits.map((a) =>
    [a.id, a.at, a.actor, a.action, JSON.stringify(a.detail)].join(","),
  );
  return [header, ...lines].join("\n");
}

export function exportRunsJson(modelId?: string): string {
  return JSON.stringify(listRuns(modelId), null, 2);
}

export function createCompare(input: {
  name: string;
  modelId: string;
  compileInput: CompileInput;
}): CompareResult {
  const model = getModel(input.modelId);
  if (!model) throw new Error("model_not_found");
  const multiPass = scoreMultiPass(input.compileInput);
  const singlePass = scoreSinglePass(input.compileInput);
  let winner: CompareResult["winner"] = "tie";
  if (multiPass.overall > singlePass.overall + 0.01) {
    winner = "multi_pass";
  } else if (singlePass.overall > multiPass.overall + 0.01) {
    winner = "single_pass";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    modelId: input.modelId,
    input: input.compileInput,
    multiPass,
    singlePass,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("engineer", "compare.create", row.name);
  return row;
}

export function listCompares(): CompareResult[] {
  return [...state().compares];
}

export function checkBearer(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token === state().org.bearerToken;
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const s = state();
  const minute = 60_000;
  const t = Date.now();
  if (t - s.rateBucket.windowStart > minute) {
    s.rateBucket = { windowStart: t, count: 0 };
  }
  s.rateBucket.count += 1;
  const remaining = s.org.rateLimitPerMinute - s.rateBucket.count;
  return { ok: remaining >= 0, remaining: Math.max(0, remaining) };
}

export function signWebhook(body: string, secret?: string): string {
  const key = secret ?? state().org.webhookSecret;
  return createHmac("sha256", key).update(body).digest("hex");
}

export function verifyWebhook(
  body: string,
  signature: string,
  secret?: string,
): boolean {
  const expected = signWebhook(body, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function ingestWebhook(
  body: string,
  signature: string,
  idempotencyKey: string,
): { ok: boolean; duplicate?: boolean; event?: WebhookEvent } {
  if (!verifyWebhook(body, signature)) return { ok: false };
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, event: existing };
  let payload: unknown = body;
  try {
    payload = JSON.parse(body);
  } catch {
    /* keep raw */
  }
  const event: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(event);
  audit("webhook", "webhook.ingest", idempotencyKey);
  return { ok: true, duplicate: false, event };
}

export function listWebhookEvents(): WebhookEvent[] {
  return [...state().webhookEvents];
}

export function paginate<T>(
  rows: T[],
  page = 1,
  pageSize = 10,
): { items: T[]; page: number; pageSize: number; total: number } {
  const p = Math.max(1, page);
  const size = Math.min(50, Math.max(1, pageSize));
  const start = (p - 1) * size;
  return {
    items: rows.slice(start, start + size),
    page: p,
    pageSize: size,
    total: rows.length,
  };
}

export function getLatestPasses(
  runId?: string,
): { run: CompileRun; passes: PassBreakdown } | null {
  const runs = listRuns();
  const run = runId
    ? runs.find((r) => r.id === runId)
    : runs.find((r) => r.passes);
  if (!run?.passes) return null;
  return { run, passes: run.passes };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing with selling points",
    "Model project create",
    "Model search (family / scale / tags)",
    "Multi-pass compile console",
    "Single-pass / target-blind baseline mode",
    "Full vs fast compile profile",
    "Pass budget + IR depth inputs",
    "Stage advance (queued → complete)",
    "Target profile create",
    "Artifact browser with kind filter",
    "Pass timeline / contribution bars",
    "Multi-pass vs single-pass compare",
    "Compare winner badge + score bars",
    "Runs audit list",
    "CSV audit export",
    "JSON run export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on models",
    "Dual-impl goldens sample API",
    "Pagination on models / runs / audits",
    "Predicted artifact tier (mlir / optimized_ir / binary)",
    "Soft simulation disclaimer (no chip timing claims)",
  ];
}
