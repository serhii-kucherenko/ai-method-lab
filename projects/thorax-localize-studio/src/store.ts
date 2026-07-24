import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreClassifyLocalize, scoreClassifyOnly } from "./domain/score";
import {
  readinessFromQuality,
  type ExamKind,
  type LocalizeReadiness,
  type PlanKind,
  type ScoreMode,
  type ThoraxInput,
  type ThoraxQuality,
} from "./domain/types";

export type {
  ExamKind,
  LocalizeReadiness,
  PlanKind,
  ScoreMode,
  ThoraxInput,
  ThoraxQuality,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type CxrExam = {
  id: string;
  name: string;
  examKind: ExamKind;
  viewCount: number;
  imageQuality: number;
  notes: string;
  createdAt: string;
};

export type DiseaseLabel =
  | "pneumonia"
  | "effusion"
  | "consolidation"
  | "pneumothorax"
  | "cardiomegaly"
  | "nodule"
  | "atelectasis"
  | "edema";

export type FindingStatus =
  | "detected"
  | "reviewed"
  | "confirmed"
  | "dismissed";

export type DiseaseFinding = {
  id: string;
  examId: string;
  name: string;
  disease: DiseaseLabel;
  status: FindingStatus;
  confidence: number;
  notes: string;
  createdAt: string;
};

export type LesionStatus = "draft" | "mapped" | "reviewed" | "archived";

export type LesionRecord = {
  id: string;
  examId: string;
  findingId: string;
  name: string;
  status: LesionStatus;
  boundaryClarity: number;
  laterality: "left" | "right" | "bilateral" | "midline";
  notes: string;
  createdAt: string;
};

export type MapStatus = "draft" | "bloomed" | "reviewed" | "rejected";

export type ActivationMap = {
  id: string;
  examId: string;
  lesionId: string;
  name: string;
  status: MapStatus;
  peakStrength: number;
  coherence: number;
  notes: string;
  createdAt: string;
};

export type ValidationStatus =
  | "queued"
  | "in_review"
  | "accepted"
  | "rejected"
  | "needs_remap";

export type ValidationCase = {
  id: string;
  examId: string;
  name: string;
  status: ValidationStatus;
  confidence: number;
  priority: number;
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
  examId: string;
  input: ThoraxInput;
  classifyLocalize: ThoraxQuality;
  classifyOnly: ThoraxQuality;
  winner: "classify_localize" | "classify_only" | "tie";
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
  exams: CxrExam[];
  findings: DiseaseFinding[];
  lesions: LesionRecord[];
  maps: ActivationMap[];
  validations: ValidationCase[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __tlsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): ThoraxInput {
  return {
    imageQuality: 0.74,
    viewClarity: 0.72,
    diseaseSignal: 0.76,
    localizationCoverage: 0.78,
    mapPeakStrength: 0.74,
    mapCoherence: 0.71,
    findingRichness: 0.7,
    lesionBoundaryClarity: 0.69,
    validationConfidence: 0.73,
    noiseLevel: 0.22,
    examKind: "pa",
    plan: "classify_localize",
  };
}

function seed(): StoreState {
  const examId = "exam-demo";
  const findingId = "find-demo";
  const lesionId = "lesion-demo";
  return {
    org: {
      name: "Thorax Localize Org",
      webhookUrl: "",
      webhookSecret: "tls-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "classify_localize",
      defaultMode: "classify_localize",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@thorax-localize.local", role: "owner" },
      { id: "m2", email: "reader@thorax-localize.local", role: "reader" },
      { id: "m3", email: "viewer@thorax-localize.local", role: "viewer" },
    ],
    exams: [
      {
        id: examId,
        name: "PA CXR · demo case A",
        examKind: "pa",
        viewCount: 2,
        imageQuality: 0.78,
        notes: "Demo exam — simulated chest radiograph only",
        createdAt: now(),
      },
      {
        id: "exam-demo-2",
        name: "Portable ICU panel",
        examKind: "portable",
        viewCount: 1,
        imageQuality: 0.55,
        notes: "Portable AP demo with higher noise",
        createdAt: now(),
      },
    ],
    findings: [
      {
        id: findingId,
        examId,
        name: "Right lower lobe opacity",
        disease: "pneumonia",
        status: "confirmed",
        confidence: 0.84,
        notes: "Multi-disease console demo finding",
        createdAt: now(),
      },
    ],
    lesions: [
      {
        id: lesionId,
        examId,
        findingId,
        name: "RLL consolidation locus",
        status: "reviewed",
        boundaryClarity: 0.81,
        laterality: "right",
        notes: "Lesion record linked to pneumonia finding",
        createdAt: now(),
      },
    ],
    maps: [
      {
        id: "map-demo",
        examId,
        lesionId,
        name: "PCAM-style RLL bloom",
        status: "reviewed",
        peakStrength: 0.86,
        coherence: 0.79,
        notes: "Probabilistic activation map demo",
        createdAt: now(),
      },
    ],
    validations: [
      {
        id: "val-demo",
        examId,
        name: "Clinical validation · demo",
        status: "accepted",
        confidence: 0.8,
        priority: 2,
        notes: "Reader accepted localize plan",
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
          "Demo exams, findings, lesions, maps, validations loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__tlsStore) g.__tlsStore = seed();
  return g.__tlsStore;
}

export function resetStore(): void {
  g.__tlsStore = seed();
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

export function listExams(
  q?: string,
  page = 1,
  pageSize = 50,
): {
  items: CxrExam[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().exams].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.examKind.toLowerCase().includes(needle) ||
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

export function createExam(input: {
  name: string;
  examKind: ExamKind;
  viewCount: number;
  imageQuality: number;
  notes?: string;
}): CxrExam {
  const row: CxrExam = {
    id: randomUUID(),
    name: input.name.trim(),
    examKind: input.examKind,
    viewCount: Math.max(1, Math.min(6, Math.round(input.viewCount))),
    imageQuality: Math.max(0, Math.min(1, input.imageQuality)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().exams.unshift(row);
  audit("reader", "exam.create", row.name);
  return row;
}

export function getExam(id: string): CxrExam | undefined {
  return state().exams.find((d) => d.id === id);
}

export function listFindings(examId?: string, q?: string): DiseaseFinding[] {
  let rows = [...state().findings];
  if (examId) rows = rows.filter((r) => r.examId === examId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.disease.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createFinding(input: {
  examId: string;
  name: string;
  disease: DiseaseLabel;
  status?: FindingStatus;
  confidence?: number;
  notes?: string;
}): DiseaseFinding {
  if (!getExam(input.examId)) throw new Error("exam_not_found");
  const row: DiseaseFinding = {
    id: randomUUID(),
    examId: input.examId,
    name: input.name.trim(),
    disease: input.disease,
    status: input.status ?? "detected",
    confidence: Math.max(0, Math.min(1, input.confidence ?? 0.6)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().findings.unshift(row);
  audit("reader", "finding.create", row.name);
  return row;
}

export function listLesions(examId?: string, q?: string): LesionRecord[] {
  let rows = [...state().lesions];
  if (examId) rows = rows.filter((r) => r.examId === examId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle) ||
        r.laterality.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createLesion(input: {
  examId: string;
  findingId: string;
  name: string;
  status?: LesionStatus;
  boundaryClarity?: number;
  laterality?: LesionRecord["laterality"];
  notes?: string;
}): LesionRecord {
  if (!getExam(input.examId)) throw new Error("exam_not_found");
  const finding = state().findings.find((f) => f.id === input.findingId);
  if (!finding || finding.examId !== input.examId) {
    throw new Error("finding_not_found");
  }
  const row: LesionRecord = {
    id: randomUUID(),
    examId: input.examId,
    findingId: input.findingId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    boundaryClarity: Math.max(0, Math.min(1, input.boundaryClarity ?? 0.7)),
    laterality: input.laterality ?? "right",
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().lesions.unshift(row);
  audit("reader", "lesion.create", row.name);
  return row;
}

export function listMaps(examId?: string, q?: string): ActivationMap[] {
  let rows = [...state().maps];
  if (examId) rows = rows.filter((r) => r.examId === examId);
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

export function createMap(input: {
  examId: string;
  lesionId: string;
  name: string;
  status?: MapStatus;
  peakStrength?: number;
  coherence?: number;
  notes?: string;
}): ActivationMap {
  if (!getExam(input.examId)) throw new Error("exam_not_found");
  const lesion = state().lesions.find((l) => l.id === input.lesionId);
  if (!lesion || lesion.examId !== input.examId) {
    throw new Error("lesion_not_found");
  }
  const row: ActivationMap = {
    id: randomUUID(),
    examId: input.examId,
    lesionId: input.lesionId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    peakStrength: Math.max(0, Math.min(1, input.peakStrength ?? 0.7)),
    coherence: Math.max(0, Math.min(1, input.coherence ?? 0.65)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().maps.unshift(row);
  audit("reader", "map.create", row.name);
  return row;
}

export function listValidations(
  examId?: string,
  q?: string,
): ValidationCase[] {
  let rows = [...state().validations];
  if (examId) rows = rows.filter((r) => r.examId === examId);
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

export function createValidation(input: {
  examId: string;
  name: string;
  status?: ValidationStatus;
  confidence?: number;
  priority?: number;
  notes?: string;
}): ValidationCase {
  if (!getExam(input.examId)) throw new Error("exam_not_found");
  const row: ValidationCase = {
    id: randomUUID(),
    examId: input.examId,
    name: input.name.trim(),
    status: input.status ?? "queued",
    confidence: Math.max(0, Math.min(1, input.confidence ?? 0.5)),
    priority: Math.max(1, Math.min(5, Math.round(input.priority ?? 3))),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().validations.unshift(row);
  audit("reader", "validation.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromExam(
  examId: string,
  patch?: Partial<ThoraxInput>,
  planKind?: PlanKind,
): ThoraxInput {
  const base = seedInput();
  const exam = getExam(examId);
  const findings = listFindings(examId);
  const lesions = listLesions(examId);
  const maps = listMaps(examId);
  const vals = listValidations(examId);
  const avgConf =
    findings.length > 0
      ? findings.reduce((s, r) => s + r.confidence, 0) / findings.length
      : base.diseaseSignal;
  const avgBoundary =
    lesions.length > 0
      ? lesions.reduce((s, r) => s + r.boundaryClarity, 0) / lesions.length
      : base.lesionBoundaryClarity;
  const avgPeak =
    maps.length > 0
      ? maps.reduce((s, r) => s + r.peakStrength, 0) / maps.length
      : base.mapPeakStrength;
  const avgCoh =
    maps.length > 0
      ? maps.reduce((s, r) => s + r.coherence, 0) / maps.length
      : base.mapCoherence;
  const avgVal =
    vals.length > 0
      ? vals.reduce((s, r) => s + r.confidence, 0) / vals.length
      : base.validationConfidence;
  const plan = planKind ?? state().org.defaultPlan;
  return {
    ...base,
    ...patch,
    imageQuality:
      patch?.imageQuality ??
      clamp01(exam?.imageQuality ?? base.imageQuality),
    viewClarity:
      patch?.viewClarity ??
      clamp01(0.45 + Math.min(0.4, (exam?.viewCount ?? 1) / 4)),
    diseaseSignal: patch?.diseaseSignal ?? clamp01(avgConf),
    localizationCoverage:
      patch?.localizationCoverage ??
      clamp01(
        lesions.length > 0
          ? 0.35 + lesions.length * 0.12 + avgBoundary * 0.35
          : 0.2,
      ),
    mapPeakStrength: patch?.mapPeakStrength ?? clamp01(avgPeak),
    mapCoherence: patch?.mapCoherence ?? clamp01(avgCoh),
    findingRichness:
      patch?.findingRichness ??
      clamp01(0.3 + findings.length * 0.1 + avgConf * 0.35),
    lesionBoundaryClarity:
      patch?.lesionBoundaryClarity ?? clamp01(avgBoundary),
    validationConfidence:
      patch?.validationConfidence ?? clamp01(avgVal),
    noiseLevel:
      patch?.noiseLevel ??
      clamp01(
        exam?.examKind === "portable"
          ? 0.42
          : 0.32 - Math.min(0.2, (exam?.imageQuality ?? 0.7) * 0.25),
      ),
    examKind: patch?.examKind ?? exam?.examKind ?? "pa",
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
  examId: string;
  patch?: Partial<ThoraxInput>;
}): CompareResult {
  if (!getExam(input.examId)) throw new Error("exam_not_found");
  const locInput = inputFromExam(
    input.examId,
    input.patch,
    "classify_localize",
  );
  const classInput: ThoraxInput = {
    ...locInput,
    plan: "classify_only",
    localizationCoverage: clamp01(locInput.localizationCoverage - 0.35),
    mapPeakStrength: clamp01(locInput.mapPeakStrength - 0.12),
    mapCoherence: clamp01(locInput.mapCoherence - 0.1),
  };
  const classifyLocalize = scoreClassifyLocalize({
    ...locInput,
    plan: "classify_localize",
  });
  const classifyOnly = scoreClassifyOnly(classInput);
  const delta = classifyLocalize.overall - classifyOnly.overall;
  const winner =
    Math.abs(delta) < 0.5
      ? "tie"
      : delta > 0
        ? "classify_localize"
        : "classify_only";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    examId: input.examId,
    input: locInput,
    classifyLocalize,
    classifyOnly,
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

export function exportExamsJson(): string {
  return JSON.stringify({ items: listExams().items }, null, 2);
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
    "Marketing landing for CXR localize buyers",
    "Chest X-ray exam registry with search and pagination",
    "Multi-disease finding console",
    "Disease confidence and status tracking",
    "Lesion localization records with laterality",
    "Lesion boundary clarity review",
    "Probabilistic activation maps (PCAM-style)",
    "Map peak strength and coherence",
    "Clinical validation queue with priority",
    "Classify+localize vs classify-only compare",
    "Dual score A classify + localize plan quality",
    "Dual score B classify-only baseline",
    "Org settings and bearer auth",
    "Member invite with roles",
    "Idempotent HMAC webhook",
    "Audit log",
    "CSV audit export",
    "JSON exams export",
    "Rate-limit feedback",
    "Features inventory API",
    "Goldens sample API",
    "Honesty fence and Sources",
    "Offline try.html demo",
    "In-app guide link",
    "Filter findings lesions maps by exam",
    "Onboarding checklist on exams page",
  ];
}

export function sampleGoldenInput(): ThoraxInput {
  return seedInput();
}

export function scorePlan(
  input: ThoraxInput,
  mode: ScoreMode,
): { quality: ThoraxQuality; readiness: LocalizeReadiness } {
  const quality =
    mode === "classify_localize"
      ? scoreClassifyLocalize(input)
      : scoreClassifyOnly(input);
  return { quality, readiness: readinessFromQuality(quality, input) };
}
