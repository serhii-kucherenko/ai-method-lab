import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreAffinityOnly,
  scorePocketDevelopability,
} from "./domain/molecule";
import {
  readinessFromQuality,
  type DevelopabilityReadiness,
  type MoleculeInput,
  type MoleculeQuality,
  type PlanKind,
  type PocketFamily,
  type ScoreMode,
} from "./domain/types";

export type {
  DevelopabilityReadiness,
  MoleculeInput,
  MoleculeQuality,
  PlanKind,
  PocketFamily,
  ScoreMode,
};

export type MemberRole = "owner" | "chemist" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type BindingPocket = {
  id: string;
  name: string;
  family: PocketFamily;
  volumeA3: number;
  hydrophobicity: number;
  notes: string;
  createdAt: string;
};

export type CandidateStatus = "draft" | "scored" | "optimized" | "archived";

export type MoleculeCandidate = {
  id: string;
  pocketId: string;
  name: string;
  smilesHint: string;
  status: CandidateStatus;
  qedScore: number;
  notes: string;
  createdAt: string;
};

export type DiffusionStatus = "queued" | "running" | "complete" | "failed";

export type DiffusionRun = {
  id: string;
  pocketId: string;
  name: string;
  status: DiffusionStatus;
  steps: number;
  pocketConditioning: number;
  notes: string;
  createdAt: string;
};

export type OptimizeStatus = "planned" | "running" | "complete" | "rejected";

export type OptimizePass = {
  id: string;
  candidateId: string;
  name: string;
  status: OptimizeStatus;
  propertyWeight: number;
  notes: string;
  createdAt: string;
};

export type PropertyLedgerEntry = {
  id: string;
  candidateId: string;
  name: string;
  solubility: number;
  clearanceRisk: number;
  toxicityRisk: number;
  synthesizability: number;
  lipophilicity: number;
  notes: string;
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
  defaultPlan: PlanKind;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  pocketId: string;
  input: MoleculeInput;
  pocketDevelopability: MoleculeQuality;
  affinityOnly: MoleculeQuality;
  winner: "pocket_developability" | "affinity_only" | "tie";
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
  pockets: BindingPocket[];
  candidates: MoleculeCandidate[];
  diffusionRuns: DiffusionRun[];
  optimizePasses: OptimizePass[];
  properties: PropertyLedgerEntry[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __dmsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): MoleculeInput {
  return {
    pocketFit: 0.78,
    pocketVolumeMatch: 0.74,
    hydrophobicityMatch: 0.7,
    hbondPotential: 0.72,
    qedScore: 0.76,
    solubility: 0.68,
    clearanceRisk: 0.22,
    toxicityRisk: 0.18,
    synthesizability: 0.7,
    lipophilicity: 0.58,
    family: "kinase",
    plan: "pocket_developability",
  };
}

function seed(): StoreState {
  const pocketId = "pkt-demo";
  const candidateId = "mol-demo";
  return {
    org: {
      name: "Developable Molecule Org",
      webhookUrl: "",
      webhookSecret: "dms-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "pocket_developability",
      defaultMode: "pocket_developability",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@developable-molecule.local", role: "owner" },
      { id: "m2", email: "chemist@developable-molecule.local", role: "chemist" },
      { id: "m3", email: "viewer@developable-molecule.local", role: "viewer" },
    ],
    pockets: [
      {
        id: pocketId,
        name: "EGFR kinase hinge · demo",
        family: "kinase",
        volumeA3: 420,
        hydrophobicity: 0.62,
        notes: "Demo pocket — simulated conditioning only",
        createdAt: now(),
      },
      {
        id: "pkt-demo-2",
        name: "Aspartic protease active site",
        family: "protease",
        volumeA3: 380,
        hydrophobicity: 0.48,
        notes: "Volume-sensitive protease pocket",
        createdAt: now(),
      },
    ],
    candidates: [
      {
        id: candidateId,
        pocketId,
        name: "Dev-lead scaffold A",
        smilesHint: "c1ccc(Nc2ncnc3cc(OC)ccc23)cc1",
        status: "scored",
        qedScore: 0.74,
        notes: "Pocket-fit candidate awaiting property optimize",
        createdAt: now(),
      },
    ],
    diffusionRuns: [
      {
        id: "dif-demo",
        pocketId,
        name: "Pocket-conditioned diffusion · EGFR",
        status: "complete",
        steps: 200,
        pocketConditioning: 0.86,
        notes: "Demo diffusion conditioned on hinge geometry",
        createdAt: now(),
      },
    ],
    optimizePasses: [
      {
        id: "opt-demo",
        candidateId,
        name: "QED + solubility pass",
        status: "complete",
        propertyWeight: 0.72,
        notes: "Property-aware developability optimize",
        createdAt: now(),
      },
    ],
    properties: [
      {
        id: "prop-demo",
        candidateId,
        name: "Lead A developability ledger",
        solubility: 0.7,
        clearanceRisk: 0.24,
        toxicityRisk: 0.16,
        synthesizability: 0.72,
        lipophilicity: 0.55,
        notes: "Baseline property ledger for demo candidate",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pockets, candidates, diffusion, optimize, properties loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__dmsStore) g.__dmsStore = seed();
  return g.__dmsStore;
}

export function resetStore(): void {
  g.__dmsStore = seed();
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

export function listPockets(
  q?: string,
  page = 1,
  pageSize = 50,
): {
  items: BindingPocket[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().pockets].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.family.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  const total = rows.length;
  const start = Math.max(0, (page - 1) * pageSize);
  return {
    items: rows.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
}

export function createPocket(input: {
  name: string;
  family: PocketFamily;
  volumeA3: number;
  hydrophobicity: number;
  notes?: string;
}): BindingPocket {
  const row: BindingPocket = {
    id: randomUUID(),
    name: input.name.trim(),
    family: input.family,
    volumeA3: Math.max(80, Math.min(1200, input.volumeA3)),
    hydrophobicity: Math.max(0, Math.min(1, input.hydrophobicity)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().pockets.unshift(row);
  audit("chemist", "pocket.create", row.name);
  return row;
}

export function getPocket(id: string): BindingPocket | undefined {
  return state().pockets.find((d) => d.id === id);
}

export function listCandidates(pocketId?: string, q?: string): MoleculeCandidate[] {
  let rows = [...state().candidates];
  if (pocketId) rows = rows.filter((r) => r.pocketId === pocketId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle) ||
        r.smilesHint.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createCandidate(input: {
  pocketId: string;
  name: string;
  smilesHint?: string;
  status?: CandidateStatus;
  qedScore?: number;
  notes?: string;
}): MoleculeCandidate {
  if (!getPocket(input.pocketId)) throw new Error("pocket_not_found");
  const row: MoleculeCandidate = {
    id: randomUUID(),
    pocketId: input.pocketId,
    name: input.name.trim(),
    smilesHint: (input.smilesHint ?? "").trim(),
    status: input.status ?? "draft",
    qedScore: Math.max(0, Math.min(1, input.qedScore ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().candidates.unshift(row);
  audit("chemist", "candidate.create", row.name);
  return row;
}

export function listDiffusionRuns(pocketId?: string, q?: string): DiffusionRun[] {
  let rows = [...state().diffusionRuns];
  if (pocketId) rows = rows.filter((r) => r.pocketId === pocketId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createDiffusionRun(input: {
  pocketId: string;
  name: string;
  status?: DiffusionStatus;
  steps?: number;
  pocketConditioning?: number;
  notes?: string;
}): DiffusionRun {
  if (!getPocket(input.pocketId)) throw new Error("pocket_not_found");
  const row: DiffusionRun = {
    id: randomUUID(),
    pocketId: input.pocketId,
    name: input.name.trim(),
    status: input.status ?? "queued",
    steps: Math.max(10, Math.round(input.steps ?? 100)),
    pocketConditioning: Math.max(0, Math.min(1, input.pocketConditioning ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().diffusionRuns.unshift(row);
  audit("chemist", "diffusion.create", row.name);
  return row;
}

export function listOptimizePasses(
  candidateId?: string,
  q?: string,
): OptimizePass[] {
  let rows = [...state().optimizePasses];
  if (candidateId) rows = rows.filter((r) => r.candidateId === candidateId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createOptimizePass(input: {
  candidateId: string;
  name: string;
  status?: OptimizeStatus;
  propertyWeight?: number;
  notes?: string;
}): OptimizePass {
  if (!state().candidates.find((c) => c.id === input.candidateId)) {
    throw new Error("candidate_not_found");
  }
  const row: OptimizePass = {
    id: randomUUID(),
    candidateId: input.candidateId,
    name: input.name.trim(),
    status: input.status ?? "planned",
    propertyWeight: Math.max(0, Math.min(1, input.propertyWeight ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().optimizePasses.unshift(row);
  audit("chemist", "optimize.create", row.name);
  return row;
}

export function listProperties(
  candidateId?: string,
  q?: string,
): PropertyLedgerEntry[] {
  let rows = [...state().properties];
  if (candidateId) rows = rows.filter((r) => r.candidateId === candidateId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPropertyEntry(input: {
  candidateId: string;
  name: string;
  solubility?: number;
  clearanceRisk?: number;
  toxicityRisk?: number;
  synthesizability?: number;
  lipophilicity?: number;
  notes?: string;
}): PropertyLedgerEntry {
  if (!state().candidates.find((c) => c.id === input.candidateId)) {
    throw new Error("candidate_not_found");
  }
  const row: PropertyLedgerEntry = {
    id: randomUUID(),
    candidateId: input.candidateId,
    name: input.name.trim(),
    solubility: Math.max(0, Math.min(1, input.solubility ?? 0.5)),
    clearanceRisk: Math.max(0, Math.min(1, input.clearanceRisk ?? 0.3)),
    toxicityRisk: Math.max(0, Math.min(1, input.toxicityRisk ?? 0.3)),
    synthesizability: Math.max(0, Math.min(1, input.synthesizability ?? 0.5)),
    lipophilicity: Math.max(0, Math.min(1, input.lipophilicity ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().properties.unshift(row);
  audit("chemist", "property.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromPocket(
  pocketId: string,
  patch?: Partial<MoleculeInput>,
  planKind?: PlanKind,
): MoleculeInput {
  const base = seedInput();
  const pocket = getPocket(pocketId);
  const candidates = listCandidates(pocketId);
  const runs = listDiffusionRuns(pocketId);
  const props = state().properties.filter((p) =>
    candidates.some((c) => c.id === p.candidateId),
  );
  const opts = state().optimizePasses.filter((o) =>
    candidates.some((c) => c.id === o.candidateId),
  );
  const avgQed =
    candidates.length > 0
      ? candidates.reduce((s, c) => s + c.qedScore, 0) / candidates.length
      : base.qedScore;
  const avgCond =
    runs.length > 0
      ? runs.reduce((s, r) => s + r.pocketConditioning, 0) / runs.length
      : 0.5;
  const avgSol =
    props.length > 0
      ? props.reduce((s, p) => s + p.solubility, 0) / props.length
      : base.solubility;
  const avgClr =
    props.length > 0
      ? props.reduce((s, p) => s + p.clearanceRisk, 0) / props.length
      : base.clearanceRisk;
  const avgTox =
    props.length > 0
      ? props.reduce((s, p) => s + p.toxicityRisk, 0) / props.length
      : base.toxicityRisk;
  const avgSynth =
    props.length > 0
      ? props.reduce((s, p) => s + p.synthesizability, 0) / props.length
      : base.synthesizability;
  const avgLip =
    props.length > 0
      ? props.reduce((s, p) => s + p.lipophilicity, 0) / props.length
      : base.lipophilicity;
  const avgWeight =
    opts.length > 0
      ? opts.reduce((s, o) => s + o.propertyWeight, 0) / opts.length
      : 0.5;
  const plan = planKind ?? state().org.defaultPlan;
  const hydro = pocket?.hydrophobicity ?? base.hydrophobicityMatch;
  return {
    ...base,
    ...patch,
    pocketFit:
      patch?.pocketFit ??
      clamp01(0.35 + avgCond * 0.4 + Math.min(0.2, candidates.length * 0.05)),
    pocketVolumeMatch:
      patch?.pocketVolumeMatch ??
      clamp01(
        0.4 +
          Math.min(0.35, ((pocket?.volumeA3 ?? 400) - 200) / 800) +
          avgCond * 0.2,
      ),
    hydrophobicityMatch: patch?.hydrophobicityMatch ?? clamp01(hydro),
    hbondPotential:
      patch?.hbondPotential ??
      clamp01(0.4 + avgCond * 0.25 + avgQed * 0.2),
    qedScore: patch?.qedScore ?? clamp01(0.3 + avgQed * 0.5 + avgWeight * 0.15),
    solubility: patch?.solubility ?? clamp01(avgSol),
    clearanceRisk:
      patch?.clearanceRisk ??
      clamp01(avgClr + (plan === "affinity_only" ? 0.22 : 0.04)),
    toxicityRisk:
      patch?.toxicityRisk ??
      clamp01(avgTox + (plan === "affinity_only" ? 0.18 : 0.02)),
    synthesizability: patch?.synthesizability ?? clamp01(avgSynth),
    lipophilicity: patch?.lipophilicity ?? clamp01(avgLip),
    family: patch?.family ?? pocket?.family ?? "kinase",
    plan,
  };
}

export function listCompares(): CompareResult[] {
  return [...state().compares].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function createCompare(input: {
  name: string;
  pocketId: string;
  patch?: Partial<MoleculeInput>;
}): CompareResult {
  if (!getPocket(input.pocketId)) throw new Error("pocket_not_found");
  const developInput = inputFromPocket(
    input.pocketId,
    input.patch,
    "pocket_developability",
  );
  const affinityInput: MoleculeInput = {
    ...developInput,
    plan: "affinity_only",
    clearanceRisk: clamp01(developInput.clearanceRisk + 0.24),
    toxicityRisk: clamp01(developInput.toxicityRisk + 0.2),
    qedScore: clamp01(developInput.qedScore - 0.18),
    solubility: clamp01(developInput.solubility - 0.16),
  };
  const pocketDevelopability = scorePocketDevelopability({
    ...developInput,
    plan: "pocket_developability",
  });
  const affinityOnly = scoreAffinityOnly(affinityInput);
  const delta = pocketDevelopability.overall - affinityOnly.overall;
  const winner =
    Math.abs(delta) < 0.5
      ? "tie"
      : delta > 0
        ? "pocket_developability"
        : "affinity_only";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    pocketId: input.pocketId,
    input: developInput,
    pocketDevelopability,
    affinityOnly,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("chemist", "compare.create", `${row.name} → ${row.winner}`);
  return row;
}

export function listAudits(limit = 100): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function exportAuditsCsv(): string {
  const rows = listAudits(500);
  const header = "id,at,actor,action,detail";
  const body = rows
    .map((r) =>
      [r.id, r.at, r.actor, r.action, JSON.stringify(r.detail)].join(","),
    )
    .join("\n");
  return `${header}\n${body}\n`;
}

export function exportCandidatesJson(): string {
  return JSON.stringify({ items: listCandidates() }, null, 2);
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === state().org.bearerToken;
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
  signature: string | null,
  rawBody: string,
  payload: unknown,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = (signature ?? "").replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "bad_signature" };
    }
  } catch {
    return { ok: false, error: "bad_signature" };
  }
  const dup = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (dup) return { ok: true, duplicate: true, id: dup.id };
  const id = randomUUID();
  state().webhookEvents.push({
    id,
    idempotencyKey,
    receivedAt: now(),
    payload,
  });
  audit("webhook", "ingest", idempotencyKey);
  return { ok: true, id };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing for developable-molecule buyers",
    "Binding pocket registry",
    "Pocket search and pagination",
    "Molecule candidate library",
    "Pocket-conditioned diffusion runs",
    "Property-aware optimize passes",
    "Developability property ledger",
    "Pocket+developability vs affinity-only compare",
    "Dual score A pocket + developability plan quality",
    "Dual score B affinity-only baseline",
    "Org settings and bearer auth",
    "Member invite with roles",
    "Idempotent HMAC webhook",
    "Audit log",
    "CSV audit export",
    "JSON candidates export",
    "Rate-limit feedback",
    "Features inventory API",
    "Goldens sample API",
    "Honesty fence and Sources",
    "Offline try.html demo",
    "In-app guide link",
    "Saved onboarding checklist on pockets",
    "Filter candidates and diffusion by pocket",
  ];
}

export function sampleGoldenInput(): MoleculeInput {
  return seedInput();
}

export function scorePlan(
  input: MoleculeInput,
  mode: ScoreMode,
): { quality: MoleculeQuality; readiness: DevelopabilityReadiness } {
  const quality =
    mode === "pocket_developability"
      ? scorePocketDevelopability(input)
      : scoreAffinityOnly(input);
  return { quality, readiness: readinessFromQuality(quality, input) };
}
