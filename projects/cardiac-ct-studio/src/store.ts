import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreAutoOnly, scoreHitlFoundation } from "./domain/score";
import {
  readinessFromQuality,
  type CardiacInput,
  type CardiacQuality,
  type PhenotypeReadiness,
  type PlanKind,
  type ScoreMode,
  type StudyKind,
} from "./domain/types";

export type {
  CardiacInput,
  CardiacQuality,
  PhenotypeReadiness,
  PlanKind,
  ScoreMode,
  StudyKind,
};

export type MemberRole = "owner" | "annotator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type CtStudy = {
  id: string;
  name: string;
  studyKind: StudyKind;
  sliceCount: number;
  contrastQuality: number;
  notes: string;
  createdAt: string;
};

export type AnnotationStatus =
  | "queued"
  | "in_review"
  | "corrected"
  | "accepted"
  | "rejected";

export type AnnotationTask = {
  id: string;
  studyId: string;
  name: string;
  status: AnnotationStatus;
  expertCoverage: number;
  priority: number;
  notes: string;
  createdAt: string;
};

export type StructureName =
  | "lv"
  | "rv"
  | "la"
  | "ra"
  | "aorta"
  | "coronaries"
  | "myocardium"
  | "pulmonary_veins";

export type SegmentStatus = "draft" | "reviewed" | "locked" | "archived";

export type StructureSegment = {
  id: string;
  studyId: string;
  name: string;
  structure: StructureName;
  status: SegmentStatus;
  diceEstimate: number;
  notes: string;
  createdAt: string;
};

export type PhenotypeStatus = "draft" | "reviewed" | "published" | "retracted";

export type PhenotypeReport = {
  id: string;
  studyId: string;
  name: string;
  status: PhenotypeStatus;
  richness: number;
  calciumBurden: number;
  chamberIndex: number;
  notes: string;
  createdAt: string;
};

export type AugmentKind =
  | "intensity"
  | "elastic"
  | "noise"
  | "crop"
  | "mix";

export type AugmentPolicy = {
  id: string;
  name: string;
  kind: AugmentKind;
  strength: number;
  preserveAnatomy: boolean;
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
  studyId: string;
  input: CardiacInput;
  hitlFoundation: CardiacQuality;
  autoOnly: CardiacQuality;
  winner: "hitl_foundation" | "auto_only" | "tie";
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
  studies: CtStudy[];
  annotations: AnnotationTask[];
  segments: StructureSegment[];
  phenotypes: PhenotypeReport[];
  augments: AugmentPolicy[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __ccsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): CardiacInput {
  return {
    contrastQuality: 0.74,
    motionArtifact: 0.22,
    expertAnnotationCoverage: 0.78,
    structureCoverage: 0.72,
    foundationPrior: 0.76,
    phenotypeRichness: 0.7,
    sliceQuality: 0.73,
    calciumSignal: 0.68,
    chamberGeometry: 0.71,
    vesselClarity: 0.69,
    studyKind: "ccta",
    plan: "hitl_foundation",
  };
}

function seed(): StoreState {
  const studyId = "study-demo";
  return {
    org: {
      name: "Cardiac CT Org",
      webhookUrl: "",
      webhookSecret: "ccs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "hitl_foundation",
      defaultMode: "hitl_foundation",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@cardiac-ct.local", role: "owner" },
      { id: "m2", email: "annotator@cardiac-ct.local", role: "annotator" },
      { id: "m3", email: "viewer@cardiac-ct.local", role: "viewer" },
    ],
    studies: [
      {
        id: studyId,
        name: "CCTA · demo case A",
        studyKind: "ccta",
        sliceCount: 320,
        contrastQuality: 0.78,
        notes: "Demo study — simulated cardiac CT only",
        createdAt: now(),
      },
      {
        id: "study-demo-2",
        name: "CAC screening panel",
        studyKind: "cac",
        sliceCount: 64,
        contrastQuality: 0.55,
        notes: "Non-contrast calcium scoring demo",
        createdAt: now(),
      },
    ],
    annotations: [
      {
        id: "ann-demo",
        studyId,
        name: "Coronary HITL queue · demo",
        status: "corrected",
        expertCoverage: 0.82,
        priority: 2,
        notes: "Expert corrected auto labels on coronaries",
        createdAt: now(),
      },
    ],
    segments: [
      {
        id: "seg-demo",
        studyId,
        name: "LV myocardium mask",
        structure: "myocardium",
        status: "reviewed",
        diceEstimate: 0.91,
        notes: "Multi-structure demo segment",
        createdAt: now(),
      },
      {
        id: "seg-demo-2",
        studyId,
        name: "Coronary tree",
        structure: "coronaries",
        status: "reviewed",
        diceEstimate: 0.86,
        notes: "HITL-refined coronary segment",
        createdAt: now(),
      },
    ],
    phenotypes: [
      {
        id: "pheno-demo",
        studyId,
        name: "Foundation phenotype pack",
        status: "reviewed",
        richness: 0.74,
        calciumBurden: 0.42,
        chamberIndex: 0.61,
        notes: "Demo phenotype after HITL segments",
        createdAt: now(),
      },
    ],
    augments: [
      {
        id: "aug-demo",
        name: "Anatomy-preserving intensity",
        kind: "intensity",
        strength: 0.35,
        preserveAnatomy: true,
        notes: "Default cardiac CT augment policy",
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
          "Demo studies, annotations, segments, phenotypes, augments loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__ccsStore) g.__ccsStore = seed();
  return g.__ccsStore;
}

export function resetStore(): void {
  g.__ccsStore = seed();
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

export function listStudies(
  q?: string,
  page = 1,
  pageSize = 50,
): {
  items: CtStudy[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().studies].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.studyKind.toLowerCase().includes(needle) ||
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

export function createStudy(input: {
  name: string;
  studyKind: StudyKind;
  sliceCount: number;
  contrastQuality: number;
  notes?: string;
}): CtStudy {
  const row: CtStudy = {
    id: randomUUID(),
    name: input.name.trim(),
    studyKind: input.studyKind,
    sliceCount: Math.max(8, Math.min(2000, Math.round(input.sliceCount))),
    contrastQuality: Math.max(0, Math.min(1, input.contrastQuality)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().studies.unshift(row);
  audit("annotator", "study.create", row.name);
  return row;
}

export function getStudy(id: string): CtStudy | undefined {
  return state().studies.find((d) => d.id === id);
}

export function listAnnotations(
  studyId?: string,
  q?: string,
): AnnotationTask[] {
  let rows = [...state().annotations];
  if (studyId) rows = rows.filter((r) => r.studyId === studyId);
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

export function createAnnotation(input: {
  studyId: string;
  name: string;
  status?: AnnotationStatus;
  expertCoverage?: number;
  priority?: number;
  notes?: string;
}): AnnotationTask {
  if (!getStudy(input.studyId)) throw new Error("study_not_found");
  const row: AnnotationTask = {
    id: randomUUID(),
    studyId: input.studyId,
    name: input.name.trim(),
    status: input.status ?? "queued",
    expertCoverage: Math.max(0, Math.min(1, input.expertCoverage ?? 0.5)),
    priority: Math.max(1, Math.min(5, Math.round(input.priority ?? 3))),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().annotations.unshift(row);
  audit("annotator", "annotation.create", row.name);
  return row;
}

export function listSegments(studyId?: string, q?: string): StructureSegment[] {
  let rows = [...state().segments];
  if (studyId) rows = rows.filter((r) => r.studyId === studyId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.structure.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSegment(input: {
  studyId: string;
  name: string;
  structure: StructureName;
  status?: SegmentStatus;
  diceEstimate?: number;
  notes?: string;
}): StructureSegment {
  if (!getStudy(input.studyId)) throw new Error("study_not_found");
  const row: StructureSegment = {
    id: randomUUID(),
    studyId: input.studyId,
    name: input.name.trim(),
    structure: input.structure,
    status: input.status ?? "draft",
    diceEstimate: Math.max(0, Math.min(1, input.diceEstimate ?? 0.8)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().segments.unshift(row);
  audit("annotator", "segment.create", row.name);
  return row;
}

export function listPhenotypes(
  studyId?: string,
  q?: string,
): PhenotypeReport[] {
  let rows = [...state().phenotypes];
  if (studyId) rows = rows.filter((r) => r.studyId === studyId);
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

export function createPhenotype(input: {
  studyId: string;
  name: string;
  status?: PhenotypeStatus;
  richness?: number;
  calciumBurden?: number;
  chamberIndex?: number;
  notes?: string;
}): PhenotypeReport {
  if (!getStudy(input.studyId)) throw new Error("study_not_found");
  const row: PhenotypeReport = {
    id: randomUUID(),
    studyId: input.studyId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    richness: Math.max(0, Math.min(1, input.richness ?? 0.6)),
    calciumBurden: Math.max(0, Math.min(1, input.calciumBurden ?? 0.4)),
    chamberIndex: Math.max(0, Math.min(1, input.chamberIndex ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().phenotypes.unshift(row);
  audit("annotator", "phenotype.create", row.name);
  return row;
}

export function listAugments(q?: string): AugmentPolicy[] {
  let rows = [...state().augments];
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createAugment(input: {
  name: string;
  kind: AugmentKind;
  strength?: number;
  preserveAnatomy?: boolean;
  notes?: string;
}): AugmentPolicy {
  const row: AugmentPolicy = {
    id: randomUUID(),
    name: input.name.trim(),
    kind: input.kind,
    strength: Math.max(0, Math.min(1, input.strength ?? 0.4)),
    preserveAnatomy: input.preserveAnatomy ?? true,
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().augments.unshift(row);
  audit("annotator", "augment.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromStudy(
  studyId: string,
  patch?: Partial<CardiacInput>,
  planKind?: PlanKind,
): CardiacInput {
  const base = seedInput();
  const study = getStudy(studyId);
  const anns = listAnnotations(studyId);
  const segs = listSegments(studyId);
  const phenos = listPhenotypes(studyId);
  const avgExpert =
    anns.length > 0
      ? anns.reduce((s, r) => s + r.expertCoverage, 0) / anns.length
      : base.expertAnnotationCoverage;
  const avgDice =
    segs.length > 0
      ? segs.reduce((s, r) => s + r.diceEstimate, 0) / segs.length
      : base.structureCoverage;
  const avgRich =
    phenos.length > 0
      ? phenos.reduce((s, r) => s + r.richness, 0) / phenos.length
      : base.phenotypeRichness;
  const plan = planKind ?? state().org.defaultPlan;
  return {
    ...base,
    ...patch,
    contrastQuality:
      patch?.contrastQuality ??
      clamp01(study?.contrastQuality ?? base.contrastQuality),
    motionArtifact:
      patch?.motionArtifact ??
      clamp01(0.35 - Math.min(0.25, (study?.sliceCount ?? 200) / 2000)),
    expertAnnotationCoverage:
      patch?.expertAnnotationCoverage ?? clamp01(avgExpert),
    structureCoverage:
      patch?.structureCoverage ??
      clamp01(avgDice * 0.7 + segs.length * 0.04),
    foundationPrior:
      patch?.foundationPrior ?? clamp01(0.55 + avgRich * 0.3),
    phenotypeRichness: patch?.phenotypeRichness ?? clamp01(avgRich),
    sliceQuality:
      patch?.sliceQuality ??
      clamp01(0.45 + Math.min(0.4, (study?.sliceCount ?? 200) / 800)),
    calciumSignal:
      patch?.calciumSignal ??
      clamp01(
        study?.studyKind === "cac" || study?.studyKind === "ccta"
          ? 0.72
          : 0.48,
      ),
    chamberGeometry:
      patch?.chamberGeometry ??
      clamp01(
        study?.studyKind === "morphology" || study?.studyKind === "mixed"
          ? 0.74
          : 0.58,
      ),
    vesselClarity:
      patch?.vesselClarity ??
      clamp01(study?.studyKind === "ccta" ? 0.75 : 0.52),
    studyKind: patch?.studyKind ?? study?.studyKind ?? "ccta",
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
  studyId: string;
  patch?: Partial<CardiacInput>;
}): CompareResult {
  if (!getStudy(input.studyId)) throw new Error("study_not_found");
  const hitlInput = inputFromStudy(
    input.studyId,
    input.patch,
    "hitl_foundation",
  );
  const autoInput: CardiacInput = {
    ...hitlInput,
    plan: "auto_only",
    expertAnnotationCoverage: clamp01(
      hitlInput.expertAnnotationCoverage - 0.35,
    ),
    foundationPrior: clamp01(hitlInput.foundationPrior - 0.08),
    phenotypeRichness: clamp01(hitlInput.phenotypeRichness - 0.12),
  };
  const hitlFoundation = scoreHitlFoundation({
    ...hitlInput,
    plan: "hitl_foundation",
  });
  const autoOnly = scoreAutoOnly(autoInput);
  const delta = hitlFoundation.overall - autoOnly.overall;
  const winner =
    Math.abs(delta) < 0.5
      ? "tie"
      : delta > 0
        ? "hitl_foundation"
        : "auto_only";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    studyId: input.studyId,
    input: hitlInput,
    hitlFoundation,
    autoOnly,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("annotator", "compare.create", `${row.name} → ${row.winner}`);
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

export function exportStudiesJson(): string {
  return JSON.stringify({ items: listStudies().items }, null, 2);
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
    "Marketing landing for cardiac CT imaging buyers",
    "CT study registry with search and pagination",
    "HITL annotation queue with status and priority",
    "Expert annotation coverage tracking",
    "Multi-structure segmentation (chambers, vessels, myocardium)",
    "Segment Dice estimate review",
    "Phenotype report drafting and publish status",
    "Calcium burden and chamber index phenotypes",
    "Cardiac CT augmentation policies",
    "Anatomy-preserving augment flag",
    "HITL vs auto-only compare",
    "Dual score A HITL + foundation phenotyping",
    "Dual score B auto-only baseline",
    "Org settings and bearer auth",
    "Member invite with roles",
    "Idempotent HMAC webhook",
    "Audit log",
    "CSV audit export",
    "JSON studies export",
    "Rate-limit feedback",
    "Features inventory API",
    "Goldens sample API",
    "Honesty fence and Sources",
    "Offline try.html demo",
    "In-app guide link",
    "Filter annotations and segments by study",
    "Onboarding checklist on studies page",
  ];
}

export function sampleGoldenInput(): CardiacInput {
  return seedInput();
}

export function scorePlan(
  input: CardiacInput,
  mode: ScoreMode,
): { quality: CardiacQuality; readiness: PhenotypeReadiness } {
  const quality =
    mode === "hitl_foundation"
      ? scoreHitlFoundation(input)
      : scoreAutoOnly(input);
  return { quality, readiness: readinessFromQuality(quality, input) };
}
