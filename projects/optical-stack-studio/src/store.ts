import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreCatalogOnly, scoreOpenVocab } from "./domain/score";
import {
  readinessFromQuality,
  type BandKind,
  type OpticalInput,
  type OpticalQuality,
  type PlanKind,
  type ScoreMode,
  type StackReadiness,
} from "./domain/types";

export type {
  BandKind,
  OpticalInput,
  OpticalQuality,
  PlanKind,
  ScoreMode,
  StackReadiness,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type BriefStatus = "draft" | "active" | "archived";

export type DesignBrief = {
  id: string;
  name: string;
  goalText: string;
  bandKind: BandKind;
  status: BriefStatus;
  clarity: number;
  notes: string;
  createdAt: string;
};

export type MaterialKind =
  | "SiO2"
  | "TiO2"
  | "Ta2O5"
  | "MgF2"
  | "Al2O3"
  | "Nb2O5"
  | "custom";

export type MaterialSequence = {
  id: string;
  briefId: string;
  name: string;
  materials: MaterialKind[];
  diversity: number;
  notes: string;
  createdAt: string;
};

export type ThicknessPlan = {
  id: string;
  briefId: string;
  sequenceId: string;
  name: string;
  thicknessesNm: number[];
  continuity: number;
  fabricationFeasibility: number;
  notes: string;
  createdAt: string;
};

export type StackStatus = "draft" | "assembled" | "reviewed" | "archived";

export type MultilayerStack = {
  id: string;
  briefId: string;
  sequenceId: string;
  thicknessPlanId: string;
  name: string;
  status: StackStatus;
  layerCount: number;
  coherence: number;
  notes: string;
  createdAt: string;
};

export type SpectrumStatus = "draft" | "predicted" | "reviewed" | "rejected";

export type SpectrumReview = {
  id: string;
  briefId: string;
  stackId: string;
  name: string;
  status: SpectrumStatus;
  spectrumFit: number;
  angleTolerance: number;
  absorptionLoss: number;
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
  briefId: string;
  input: OpticalInput;
  openVocab: OpticalQuality;
  catalogOnly: OpticalQuality;
  winner: "open_vocab" | "catalog_only" | "tie";
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
  briefs: DesignBrief[];
  sequences: MaterialSequence[];
  thicknessPlans: ThicknessPlan[];
  stacks: MultilayerStack[];
  spectra: SpectrumReview[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __ossStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): OpticalInput {
  return {
    briefClarity: 0.76,
    materialDiversity: 0.74,
    thicknessContinuity: 0.72,
    stackCoherence: 0.75,
    spectrumFit: 0.73,
    angleTolerance: 0.7,
    absorptionLoss: 0.22,
    fabricationFeasibility: 0.78,
    catalogCoverage: 0.45,
    noiseLevel: 0.2,
    bandKind: "visible",
    plan: "open_vocab",
  };
}

function seed(): StoreState {
  const briefId = "brief-demo";
  const seqId = "seq-demo";
  const thickId = "thick-demo";
  const stackId = "stack-demo";
  return {
    org: {
      name: "Optical Stack Org",
      webhookUrl: "",
      webhookSecret: "oss-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "open_vocab",
      defaultMode: "open_vocab",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@optical-stack.local", role: "owner" },
      { id: "m2", email: "reader@optical-stack.local", role: "reader" },
      { id: "m3", email: "viewer@optical-stack.local", role: "viewer" },
    ],
    briefs: [
      {
        id: briefId,
        name: "AR coating · visible, AOI ≤ 30°",
        goalText:
          "Broadband anti-reflection for 400–700 nm with R < 0.5% average, AOI up to 30 degrees",
        bandKind: "visible",
        status: "active",
        clarity: 0.82,
        notes: "Demo open-vocabulary brief",
        createdAt: now(),
      },
      {
        id: "brief-demo-2",
        name: "NIR dichroic edge filter",
        goalText: "High-pass dichroic near 850 nm for sensor protection",
        bandKind: "nir",
        status: "draft",
        clarity: 0.68,
        notes: "Draft NIR brief",
        createdAt: now(),
      },
    ],
    sequences: [
      {
        id: seqId,
        briefId,
        name: "SiO2 / TiO2 alternating · 6 layers",
        materials: ["SiO2", "TiO2", "SiO2", "TiO2", "SiO2", "TiO2"],
        diversity: 0.78,
        notes: "Open-vocab discrete material proposal",
        createdAt: now(),
      },
    ],
    thicknessPlans: [
      {
        id: thickId,
        briefId,
        sequenceId: seqId,
        name: "Continuous nm plan · AR stack",
        thicknessesNm: [92, 48, 110, 52, 88, 45],
        continuity: 0.8,
        fabricationFeasibility: 0.84,
        notes: "Continuous thickness tuning demo",
        createdAt: now(),
      },
    ],
    stacks: [
      {
        id: stackId,
        briefId,
        sequenceId: seqId,
        thicknessPlanId: thickId,
        name: "Assembled AR multilayer",
        status: "reviewed",
        layerCount: 6,
        coherence: 0.81,
        notes: "Demo assembled stack",
        createdAt: now(),
      },
    ],
    spectra: [
      {
        id: "spec-demo",
        briefId,
        stackId,
        name: "Predicted R/T · visible AR",
        status: "reviewed",
        spectrumFit: 0.86,
        angleTolerance: 0.74,
        absorptionLoss: 0.18,
        notes: "Soft-sim spectrum review",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail:
          "Demo briefs, materials, thicknesses, stacks, spectra loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__ossStore) g.__ossStore = seed();
  return g.__ossStore;
}

export function resetStore(): void {
  g.__ossStore = seed();
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

export function listBriefs(
  q?: string,
  page = 1,
  pageSize = 50,
): {
  items: DesignBrief[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().briefs].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.goalText.toLowerCase().includes(needle) ||
        r.bandKind.toLowerCase().includes(needle) ||
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

export function createBrief(input: {
  name: string;
  goalText: string;
  bandKind: BandKind;
  status?: BriefStatus;
  clarity?: number;
  notes?: string;
}): DesignBrief {
  const row: DesignBrief = {
    id: randomUUID(),
    name: input.name.trim(),
    goalText: input.goalText.trim(),
    bandKind: input.bandKind,
    status: input.status ?? "draft",
    clarity: Math.max(0, Math.min(1, input.clarity ?? 0.7)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().briefs.unshift(row);
  audit("reader", "brief.create", row.name);
  return row;
}

export function getBrief(id: string): DesignBrief | undefined {
  return state().briefs.find((d) => d.id === id);
}

export function listSequences(briefId?: string, q?: string): MaterialSequence[] {
  let rows = [...state().sequences];
  if (briefId) rows = rows.filter((r) => r.briefId === briefId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.materials.join(" ").toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSequence(input: {
  briefId: string;
  name: string;
  materials: MaterialKind[];
  diversity?: number;
  notes?: string;
}): MaterialSequence {
  if (!getBrief(input.briefId)) throw new Error("brief_not_found");
  const mats =
    input.materials.length > 0 ? input.materials : (["SiO2", "TiO2"] as MaterialKind[]);
  const row: MaterialSequence = {
    id: randomUUID(),
    briefId: input.briefId,
    name: input.name.trim(),
    materials: mats,
    diversity: Math.max(0, Math.min(1, input.diversity ?? 0.65)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().sequences.unshift(row);
  audit("reader", "sequence.create", row.name);
  return row;
}

export function listThicknessPlans(
  briefId?: string,
  q?: string,
): ThicknessPlan[] {
  let rows = [...state().thicknessPlans];
  if (briefId) rows = rows.filter((r) => r.briefId === briefId);
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

export function createThicknessPlan(input: {
  briefId: string;
  sequenceId: string;
  name: string;
  thicknessesNm: number[];
  continuity?: number;
  fabricationFeasibility?: number;
  notes?: string;
}): ThicknessPlan {
  if (!getBrief(input.briefId)) throw new Error("brief_not_found");
  const seq = state().sequences.find((s) => s.id === input.sequenceId);
  if (!seq || seq.briefId !== input.briefId) {
    throw new Error("sequence_not_found");
  }
  const thicknesses =
    input.thicknessesNm.length > 0
      ? input.thicknessesNm.map((n) => Math.max(1, Math.min(500, n)))
      : [80, 40, 90, 45];
  const row: ThicknessPlan = {
    id: randomUUID(),
    briefId: input.briefId,
    sequenceId: input.sequenceId,
    name: input.name.trim(),
    thicknessesNm: thicknesses,
    continuity: Math.max(0, Math.min(1, input.continuity ?? 0.7)),
    fabricationFeasibility: Math.max(
      0,
      Math.min(1, input.fabricationFeasibility ?? 0.75),
    ),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().thicknessPlans.unshift(row);
  audit("reader", "thickness.create", row.name);
  return row;
}

export function listStacks(briefId?: string, q?: string): MultilayerStack[] {
  let rows = [...state().stacks];
  if (briefId) rows = rows.filter((r) => r.briefId === briefId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createStack(input: {
  briefId: string;
  sequenceId: string;
  thicknessPlanId: string;
  name: string;
  status?: StackStatus;
  coherence?: number;
  notes?: string;
}): MultilayerStack {
  if (!getBrief(input.briefId)) throw new Error("brief_not_found");
  const seq = state().sequences.find((s) => s.id === input.sequenceId);
  if (!seq || seq.briefId !== input.briefId) {
    throw new Error("sequence_not_found");
  }
  const plan = state().thicknessPlans.find(
    (t) => t.id === input.thicknessPlanId,
  );
  if (!plan || plan.briefId !== input.briefId) {
    throw new Error("thickness_not_found");
  }
  const row: MultilayerStack = {
    id: randomUUID(),
    briefId: input.briefId,
    sequenceId: input.sequenceId,
    thicknessPlanId: input.thicknessPlanId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    layerCount: Math.max(seq.materials.length, plan.thicknessesNm.length),
    coherence: Math.max(0, Math.min(1, input.coherence ?? 0.7)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().stacks.unshift(row);
  audit("reader", "stack.create", row.name);
  return row;
}

export function listSpectra(briefId?: string, q?: string): SpectrumReview[] {
  let rows = [...state().spectra];
  if (briefId) rows = rows.filter((r) => r.briefId === briefId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSpectrum(input: {
  briefId: string;
  stackId: string;
  name: string;
  status?: SpectrumStatus;
  spectrumFit?: number;
  angleTolerance?: number;
  absorptionLoss?: number;
  notes?: string;
}): SpectrumReview {
  if (!getBrief(input.briefId)) throw new Error("brief_not_found");
  const stack = state().stacks.find((s) => s.id === input.stackId);
  if (!stack || stack.briefId !== input.briefId) {
    throw new Error("stack_not_found");
  }
  const row: SpectrumReview = {
    id: randomUUID(),
    briefId: input.briefId,
    stackId: input.stackId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    spectrumFit: Math.max(0, Math.min(1, input.spectrumFit ?? 0.7)),
    angleTolerance: Math.max(0, Math.min(1, input.angleTolerance ?? 0.65)),
    absorptionLoss: Math.max(0, Math.min(1, input.absorptionLoss ?? 0.25)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().spectra.unshift(row);
  audit("reader", "spectrum.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromBrief(
  briefId: string,
  patch?: Partial<OpticalInput>,
  planKind?: PlanKind,
): OpticalInput {
  const base = seedInput();
  const brief = getBrief(briefId);
  const sequences = listSequences(briefId);
  const plans = listThicknessPlans(briefId);
  const stacks = listStacks(briefId);
  const spectra = listSpectra(briefId);
  const avgDiv =
    sequences.length > 0
      ? sequences.reduce((s, r) => s + r.diversity, 0) / sequences.length
      : base.materialDiversity;
  const avgCont =
    plans.length > 0
      ? plans.reduce((s, r) => s + r.continuity, 0) / plans.length
      : base.thicknessContinuity;
  const avgFab =
    plans.length > 0
      ? plans.reduce((s, r) => s + r.fabricationFeasibility, 0) /
        plans.length
      : base.fabricationFeasibility;
  const avgCoh =
    stacks.length > 0
      ? stacks.reduce((s, r) => s + r.coherence, 0) / stacks.length
      : base.stackCoherence;
  const avgFit =
    spectra.length > 0
      ? spectra.reduce((s, r) => s + r.spectrumFit, 0) / spectra.length
      : base.spectrumFit;
  const avgAngle =
    spectra.length > 0
      ? spectra.reduce((s, r) => s + r.angleTolerance, 0) / spectra.length
      : base.angleTolerance;
  const avgAbs =
    spectra.length > 0
      ? spectra.reduce((s, r) => s + r.absorptionLoss, 0) / spectra.length
      : base.absorptionLoss;
  const plan = planKind ?? state().org.defaultPlan;
  return {
    ...base,
    ...patch,
    briefClarity: patch?.briefClarity ?? clamp01(brief?.clarity ?? base.briefClarity),
    materialDiversity: patch?.materialDiversity ?? clamp01(avgDiv),
    thicknessContinuity: patch?.thicknessContinuity ?? clamp01(avgCont),
    stackCoherence: patch?.stackCoherence ?? clamp01(avgCoh),
    spectrumFit: patch?.spectrumFit ?? clamp01(avgFit),
    angleTolerance: patch?.angleTolerance ?? clamp01(avgAngle),
    absorptionLoss: patch?.absorptionLoss ?? clamp01(avgAbs),
    fabricationFeasibility:
      patch?.fabricationFeasibility ?? clamp01(avgFab),
    catalogCoverage:
      patch?.catalogCoverage ??
      clamp01(
        0.55 -
          Math.min(0.35, sequences.length * 0.08) +
          (plan === "catalog_only" ? 0.25 : 0),
      ),
    noiseLevel:
      patch?.noiseLevel ??
      clamp01(0.28 - Math.min(0.18, (brief?.clarity ?? 0.7) * 0.2)),
    bandKind: patch?.bandKind ?? brief?.bandKind ?? "visible",
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
  briefId: string;
  patch?: Partial<OpticalInput>;
}): CompareResult {
  if (!getBrief(input.briefId)) throw new Error("brief_not_found");
  const openInput = inputFromBrief(input.briefId, input.patch, "open_vocab");
  const catalogInput: OpticalInput = {
    ...openInput,
    plan: "catalog_only",
    briefClarity: clamp01(openInput.briefClarity - 0.32),
    materialDiversity: clamp01(openInput.materialDiversity - 0.28),
    catalogCoverage: clamp01(openInput.catalogCoverage + 0.3),
  };
  const openVocab = scoreOpenVocab({ ...openInput, plan: "open_vocab" });
  const catalogOnly = scoreCatalogOnly(catalogInput);
  const delta = openVocab.overall - catalogOnly.overall;
  const winner =
    Math.abs(delta) < 0.5
      ? "tie"
      : delta > 0
        ? "open_vocab"
        : "catalog_only";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    briefId: input.briefId,
    input: openInput,
    openVocab,
    catalogOnly,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("reader", "compare.create", `${row.name} → ${row.winner}`);
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

export function exportBriefsJson(): string {
  return JSON.stringify({ items: listBriefs().items }, null, 2);
}

export function exportStacksJson(): string {
  return JSON.stringify({ items: listStacks() }, null, 2);
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
    "Marketing landing for optical coatings buyers",
    "Open-vocabulary design briefs with search and pagination",
    "Brief clarity and band kind tracking",
    "Discrete material sequence proposals",
    "Material diversity scoring for open-vocab stacks",
    "Continuous thickness plans in nanometers",
    "Thickness continuity and fabrication feasibility",
    "Assembled multilayer stack registry",
    "Stack layer coherence and status",
    "Predicted spectrum review with AOI tolerance",
    "Absorption loss review on spectra",
    "Open-vocab vs catalog-only compare",
    "Dual score A open-vocabulary plan quality",
    "Dual score B catalog-only baseline",
    "Org settings and bearer auth",
    "Member invite with roles",
    "Idempotent HMAC webhook",
    "Audit log",
    "CSV audit export",
    "JSON briefs export",
    "JSON stacks export",
    "Rate-limit feedback",
    "Features inventory API",
    "Goldens sample API",
    "Honesty fence and Sources",
    "Offline try.html demo",
    "In-app guide link",
    "Filter materials thicknesses stacks spectra by brief",
    "Onboarding checklist on briefs page",
  ];
}

export function sampleGoldenInput(): OpticalInput {
  return seedInput();
}

export function scorePlan(
  input: OpticalInput,
  mode: ScoreMode,
): { quality: OpticalQuality; readiness: StackReadiness } {
  const quality =
    mode === "open_vocab" ? scoreOpenVocab(input) : scoreCatalogOnly(input);
  return { quality, readiness: readinessFromQuality(quality, input) };
}
