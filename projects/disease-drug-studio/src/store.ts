import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreDiseaseAware,
  scoreDiseaseBlind,
} from "./domain/diseaseAware";
import type {
  GenerationInput,
  GenerationMode,
  GenerationQuality,
  TrainingProfile,
} from "./domain/types";

export type MemberRole = "owner" | "chemist" | "analyst";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type DiseaseProgram = {
  id: string;
  name: string;
  indication: string;
  meshTags: string[];
  targetName: string;
  targetUniprot: string;
  createdAt: string;
};

export type Candidate = {
  id: string;
  programId: string;
  runId: string;
  smiles: string;
  mode: GenerationMode;
  validityScore: number;
  noveltyScore: number;
  affinityScore: number;
  diseaseFitScore: number;
  approvedSimilarity: number;
  rank: number;
  createdAt: string;
};

export type GenerationRun = {
  id: string;
  programId: string;
  mode: GenerationMode;
  profile: TrainingProfile;
  stage: "queued" | "conditioning" | "generating" | "ranked" | "failed";
  input: GenerationInput;
  quality?: GenerationQuality;
  candidateCount: number;
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
  defaultProfile: TrainingProfile;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  programId: string;
  input: GenerationInput;
  diseaseAware: GenerationQuality;
  diseaseBlind: GenerationQuality;
  winner: "disease_aware" | "disease_blind" | "tie";
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
  programs: DiseaseProgram[];
  runs: GenerationRun[];
  candidates: Candidate[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __ddsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

const DEMO_SMILES = [
  "CC(=O)Oc1ccccc1C(=O)O",
  "CCOC(=O)C1=C(C)NC(C)=C(C1C(=O)OC)C(=O)OCC",
  "CC(C)Cc1ccc(cc1)C(C)C(=O)O",
  "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
  "CC1=C(C(=CC=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5",
  "C1=CC=C(C=C1)C2=CC(=O)C3=C(O2)C=CC(=C3)O",
];

function seedInput(): GenerationInput {
  return {
    meshDepth: 3,
    targetLength: 420,
    conditioningStrength: 0.82,
    seedDiversity: 0.7,
    batchSize: 100,
    noveltyPrior: 0.65,
    affinityPrior: 8.4,
    approvedSimilarityPrior: 0.55,
    profile: "grpo",
  };
}

function seed(): StoreState {
  const programId = "prog-demo";
  const runId = "run-demo";
  const input = seedInput();
  const quality = scoreDiseaseAware(input);
  const candidates: Candidate[] = DEMO_SMILES.slice(0, 5).map((smiles, i) => ({
    id: `cand-demo-${i + 1}`,
    programId,
    runId,
    smiles,
    mode: "disease_aware" as const,
    validityScore: roundLocal(quality.validityScore - i * 0.4),
    noveltyScore: roundLocal(quality.noveltyScore - i * 1.2),
    affinityScore: roundLocal(quality.affinityScore - i * 1.5),
    diseaseFitScore: roundLocal(quality.diseaseFitScore - i * 0.8),
    approvedSimilarity: roundLocal(quality.approvedSimilarity - i * 0.6),
    rank: i + 1,
    createdAt: now(),
  }));

  return {
    org: {
      name: "Disease Drug Studio Lab",
      webhookUrl: "",
      webhookSecret: "dds-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "grpo",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "chemist@studio.local", role: "chemist" },
      { id: "m3", email: "analyst@studio.local", role: "analyst" },
    ],
    programs: [
      {
        id: programId,
        name: "Diabetic nephropathy — ACE",
        indication: "Diabetic nephropathy",
        meshTags: ["D048909", "D007674", "C12.050"],
        targetName: "Angiotensin-converting enzyme",
        targetUniprot: "P12821",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        programId,
        mode: "disease_aware",
        profile: "grpo",
        stage: "ranked",
        input,
        quality,
        candidateCount: candidates.length,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    candidates,
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo disease program and ranked run loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function roundLocal(n: number): number {
  return Math.round(n * 100) / 100;
}

function state(): StoreState {
  if (!g.__ddsStore) g.__ddsStore = seed();
  return g.__ddsStore;
}

export function resetStore(): void {
  g.__ddsStore = seed();
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

export function listPrograms(q?: string): DiseaseProgram[] {
  const all = [...state().programs].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.indication.toLowerCase().includes(needle) ||
      p.targetName.toLowerCase().includes(needle) ||
      p.meshTags.some((t) => t.toLowerCase().includes(needle)),
  );
}

export function createProgram(input: {
  name: string;
  indication: string;
  meshTags: string[];
  targetName: string;
  targetUniprot: string;
}): DiseaseProgram {
  const p: DiseaseProgram = {
    id: randomUUID(),
    name: input.name.trim(),
    indication: input.indication.trim(),
    meshTags: input.meshTags.map((t) => t.trim()).filter(Boolean),
    targetName: input.targetName.trim(),
    targetUniprot: input.targetUniprot.trim().toUpperCase(),
    createdAt: now(),
  };
  state().programs.unshift(p);
  audit("chemist", "program.create", p.name);
  return p;
}

export function getProgram(id: string): DiseaseProgram | undefined {
  return state().programs.find((p) => p.id === id);
}

export function listRuns(programId?: string): GenerationRun[] {
  let rows = [...state().runs];
  if (programId) rows = rows.filter((r) => r.programId === programId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createRun(input: {
  programId: string;
  mode?: GenerationMode;
  profile?: TrainingProfile;
  generationInput?: Partial<GenerationInput>;
}): GenerationRun {
  const program = getProgram(input.programId);
  if (!program) throw new Error("program_not_found");
  const base = seedInput();
  const profile = input.profile ?? state().org.defaultProfile;
  const gen: GenerationInput = {
    ...base,
    ...input.generationInput,
    profile,
    meshDepth: Math.max(
      1,
      Math.min(
        5,
        input.generationInput?.meshDepth ?? (program.meshTags.length || 2),
      ),
    ),
  };
  const run: GenerationRun = {
    id: randomUUID(),
    programId: input.programId,
    mode: input.mode ?? "disease_aware",
    profile,
    stage: "queued",
    input: gen,
    candidateCount: 0,
    createdAt: now(),
    updatedAt: now(),
  };
  state().runs.unshift(run);
  audit("chemist", "run.create", `${run.id} ${run.mode}`);
  return run;
}

const STAGE_ORDER: GenerationRun["stage"][] = [
  "queued",
  "conditioning",
  "generating",
  "ranked",
];

export function advanceRun(id: string): GenerationRun {
  const run = state().runs.find((r) => r.id === id);
  if (!run) throw new Error("run_not_found");
  if (run.stage === "failed" || run.stage === "ranked") {
    throw new Error("illegal_stage_advance");
  }
  const idx = STAGE_ORDER.indexOf(run.stage);
  const next = STAGE_ORDER[idx + 1];
  if (!next) throw new Error("illegal_stage_advance");

  if (next === "ranked") {
    const quality =
      run.mode === "disease_aware"
        ? scoreDiseaseAware(run.input)
        : scoreDiseaseBlind(run.input);
    run.quality = quality;
    const count = Math.min(12, Math.max(3, Math.round(quality.uniqueCandidates / 20)));
    const newCands: Candidate[] = [];
    for (let i = 0; i < count; i++) {
      newCands.push({
        id: randomUUID(),
        programId: run.programId,
        runId: run.id,
        smiles: DEMO_SMILES[i % DEMO_SMILES.length]!,
        mode: run.mode,
        validityScore: roundLocal(quality.validityScore - i * 0.5),
        noveltyScore: roundLocal(quality.noveltyScore - i * 1.1),
        affinityScore: roundLocal(quality.affinityScore - i * 1.4),
        diseaseFitScore: roundLocal(quality.diseaseFitScore - i * 0.9),
        approvedSimilarity: roundLocal(quality.approvedSimilarity - i * 0.7),
        rank: i + 1,
        createdAt: now(),
      });
    }
    state().candidates.unshift(...newCands);
    run.candidateCount = newCands.length;
  }

  run.stage = next;
  run.updatedAt = now();
  audit("chemist", "run.advance", `${run.id} → ${next}`);
  return { ...run };
}

export type CandidateFilters = {
  q?: string;
  mode?: GenerationMode;
  minAffinity?: number;
  minDiseaseFit?: number;
  programId?: string;
};

export function listCandidates(filters: CandidateFilters = {}): Candidate[] {
  let rows = [...state().candidates];
  if (filters.programId) {
    rows = rows.filter((c) => c.programId === filters.programId);
  }
  if (filters.mode) {
    rows = rows.filter((c) => c.mode === filters.mode);
  }
  if (typeof filters.minAffinity === "number") {
    rows = rows.filter((c) => c.affinityScore >= filters.minAffinity!);
  }
  if (typeof filters.minDiseaseFit === "number") {
    rows = rows.filter((c) => c.diseaseFitScore >= filters.minDiseaseFit!);
  }
  if (filters.q) {
    const needle = filters.q.toLowerCase();
    rows = rows.filter((c) => c.smiles.toLowerCase().includes(needle));
  }
  return rows.sort((a, b) => a.rank - b.rank || b.affinityScore - a.affinityScore);
}

export function exportCandidatesJson(filters: CandidateFilters = {}): string {
  return JSON.stringify(listCandidates(filters), null, 2);
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

export function createCompare(input: {
  name: string;
  programId: string;
  generationInput: GenerationInput;
}): CompareResult {
  const program = getProgram(input.programId);
  if (!program) throw new Error("program_not_found");
  const diseaseAware = scoreDiseaseAware(input.generationInput);
  const diseaseBlind = scoreDiseaseBlind(input.generationInput);
  let winner: CompareResult["winner"] = "tie";
  if (diseaseAware.overall > diseaseBlind.overall + 0.01) winner = "disease_aware";
  else if (diseaseBlind.overall > diseaseAware.overall + 0.01)
    winner = "disease_blind";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    programId: input.programId,
    input: input.generationInput,
    diseaseAware,
    diseaseBlind,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("analyst", "compare.create", row.name);
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
