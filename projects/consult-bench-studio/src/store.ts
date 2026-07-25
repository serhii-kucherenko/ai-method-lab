import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreMultimodal, scoreTextOnly } from "./domain/score";
import {
  readinessFromQuality,
  type ConsultInput,
  type ConsultQuality,
  type ConsultReadiness,
  type DepartmentKind,
  type PlanKind,
  type ScoreMode,
} from "./domain/types";

export type {
  ConsultInput,
  ConsultQuality,
  ConsultReadiness,
  DepartmentKind,
  PlanKind,
  ScoreMode,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type CaseStatus = "draft" | "active" | "archived" | "scored";

export type ConsultCase = {
  id: string;
  title: string;
  department: DepartmentKind;
  status: CaseStatus;
  patientAgeBand: string;
  chiefComplaint: string;
  notes: string;
  createdAt: string;
};

export type TurnStatus = "draft" | "ready" | "scored" | "archived";

export type MultimodalTurn = {
  id: string;
  caseId: string;
  label: string;
  status: TurnStatus;
  patientText: string;
  imageCaption: string;
  hasImage: boolean;
  imageRelevance: number;
  visualGrounding: number;
  turnIndex: number;
  notes: string;
  createdAt: string;
};

export type DepartmentTag = {
  id: string;
  name: string;
  department: DepartmentKind;
  coverage: number;
  caseCount: number;
  notes: string;
  createdAt: string;
};

export type ScoreStatus = "draft" | "computed" | "reviewed" | "rejected";

export type ResponseScoreRecord = {
  id: string;
  caseId: string;
  turnId: string;
  name: string;
  status: ScoreStatus;
  clinicalCoherence: number;
  safetyDiscipline: number;
  turnClarity: number;
  notes: string;
  createdAt: string;
};

export type LeaderboardEntry = {
  id: string;
  modelName: string;
  promptVariant: string;
  multimodalAvg: number;
  textOnlyAvg: number;
  gap: number;
  runs: number;
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
  caseId: string;
  input: ConsultInput;
  multimodal: ConsultQuality;
  textOnly: ConsultQuality;
  winner: "multimodal" | "text_only" | "tie";
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
  cases: ConsultCase[];
  turns: MultimodalTurn[];
  departments: DepartmentTag[];
  scores: ResponseScoreRecord[];
  leaderboard: LeaderboardEntry[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __cbsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): ConsultInput {
  return {
    imageRelevance: 0.82,
    visualGrounding: 0.78,
    clinicalCoherence: 0.76,
    turnClarity: 0.74,
    safetyDiscipline: 0.8,
    textFluency: 0.28,
    departmentFit: 0.77,
    historyCoverage: 0.72,
    urgencyRecognition: 0.7,
    hallucinationRisk: 0.18,
    department: "dermatology",
    plan: "multimodal",
  };
}

function seed(): StoreState {
  const caseId = "case-demo";
  const turnId = "turn-demo";
  return {
    org: {
      name: "Consult Bench Org",
      webhookUrl: "",
      webhookSecret: "cbs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "multimodal",
      defaultMode: "multimodal",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@consult-bench.local", role: "owner" },
      { id: "m2", email: "reader@consult-bench.local", role: "reader" },
      { id: "m3", email: "viewer@consult-bench.local", role: "viewer" },
    ],
    cases: [
      {
        id: caseId,
        title: "Rash with photo follow-up",
        department: "dermatology",
        status: "active",
        patientAgeBand: "30-39",
        chiefComplaint: "Spreading rash after outdoor exposure",
        notes: "Seed consult case with image-dependent next reply",
        createdAt: now(),
      },
    ],
    turns: [
      {
        id: turnId,
        caseId,
        label: "Photo + symptom update",
        status: "ready",
        patientText: "The rash looks worse today — see photo.",
        imageCaption: "Forearm erythematous plaques with central clearing",
        hasImage: true,
        imageRelevance: 0.82,
        visualGrounding: 0.78,
        turnIndex: 1,
        notes: "Seed multimodal turn",
        createdAt: now(),
      },
    ],
    departments: [
      {
        id: "dept-derm",
        name: "Dermatology coverage",
        department: "dermatology",
        coverage: 0.78,
        caseCount: 1,
        notes: "Image-heavy rash consults",
        createdAt: now(),
      },
      {
        id: "dept-rad",
        name: "Radiology coverage",
        department: "radiology",
        coverage: 0.42,
        caseCount: 0,
        notes: "CXR / wound imaging consults",
        createdAt: now(),
      },
    ],
    scores: [
      {
        id: "score-demo",
        caseId,
        turnId,
        name: "Next-response multimodal score",
        status: "computed",
        clinicalCoherence: 0.76,
        safetyDiscipline: 0.8,
        turnClarity: 0.74,
        notes: "Seed score",
        createdAt: now(),
      },
    ],
    leaderboard: [
      {
        id: "lb-demo",
        modelName: "vision-consult-v1",
        promptVariant: "image-first",
        multimodalAvg: 72.4,
        textOnlyAvg: 48.1,
        gap: 24.3,
        runs: 12,
        notes: "Seed leaderboard row",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: randomUUID(),
        at: now(),
        actor: "system",
        action: "store.seed",
        detail: "Consult Bench Studio seed state",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__cbsStore) g.__cbsStore = seed();
  return g.__cbsStore;
}

export function resetStore(): void {
  g.__cbsStore = seed();
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
  const org = state().org;
  Object.assign(org, patch);
  audit("owner", "org.update", JSON.stringify(Object.keys(patch)));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(
  email: string,
  role: MemberRole = "reader",
): Member {
  const row: Member = {
    id: randomUUID(),
    email: email.trim().toLowerCase(),
    role,
  };
  state().members.push(row);
  audit("owner", "member.invite", `${row.email}:${row.role}`);
  return row;
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === state().org.bearerToken;
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
  if (bucket.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: Math.max(0, limit - bucket.count) };
}

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 20,
): { items: T[]; page: number; pageSize: number; total: number } {
  const p = Math.max(1, page);
  const ps = Math.min(100, Math.max(1, pageSize));
  const start = (p - 1) * ps;
  return {
    items: items.slice(start, start + ps),
    page: p,
    pageSize: ps,
    total: items.length,
  };
}

export function listCases(
  q?: string,
  page = 1,
  pageSize = 20,
  department?: DepartmentKind,
) {
  let rows = [...state().cases];
  if (department) rows = rows.filter((c) => c.department === department);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.chiefComplaint.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createCase(input: {
  title: string;
  department: DepartmentKind;
  status?: CaseStatus;
  patientAgeBand?: string;
  chiefComplaint?: string;
  notes?: string;
}): ConsultCase {
  const row: ConsultCase = {
    id: randomUUID(),
    title: input.title.trim(),
    department: input.department,
    status: input.status ?? "draft",
    patientAgeBand: input.patientAgeBand?.trim() || "unspecified",
    chiefComplaint: input.chiefComplaint?.trim() || "",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().cases.unshift(row);
  audit("owner", "case.create", row.id);
  return row;
}

export function listTurns(q?: string, page = 1, pageSize = 20, caseId?: string) {
  let rows = [...state().turns];
  if (caseId) rows = rows.filter((t) => t.caseId === caseId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (t) =>
        t.label.toLowerCase().includes(needle) ||
        t.patientText.toLowerCase().includes(needle) ||
        t.imageCaption.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createTurn(input: {
  caseId: string;
  label: string;
  status?: TurnStatus;
  patientText?: string;
  imageCaption?: string;
  hasImage?: boolean;
  imageRelevance?: number;
  visualGrounding?: number;
  turnIndex?: number;
  notes?: string;
}): MultimodalTurn {
  if (!state().cases.some((c) => c.id === input.caseId)) {
    throw new Error("case_not_found");
  }
  const row: MultimodalTurn = {
    id: randomUUID(),
    caseId: input.caseId,
    label: input.label.trim(),
    status: input.status ?? "draft",
    patientText: input.patientText?.trim() || "",
    imageCaption: input.imageCaption?.trim() || "",
    hasImage: input.hasImage ?? true,
    imageRelevance: input.imageRelevance ?? 0.7,
    visualGrounding: input.visualGrounding ?? 0.65,
    turnIndex: input.turnIndex ?? state().turns.filter((t) => t.caseId === input.caseId).length + 1,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().turns.unshift(row);
  audit("owner", "turn.create", row.id);
  return row;
}

export function listDepartments(q?: string, page = 1, pageSize = 20) {
  let rows = [...state().departments];
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.department.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createDepartment(input: {
  name: string;
  department: DepartmentKind;
  coverage?: number;
  caseCount?: number;
  notes?: string;
}): DepartmentTag {
  const row: DepartmentTag = {
    id: randomUUID(),
    name: input.name.trim(),
    department: input.department,
    coverage: input.coverage ?? 0.5,
    caseCount: input.caseCount ?? 0,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().departments.unshift(row);
  audit("owner", "department.create", row.id);
  return row;
}

export function listScores(q?: string, page = 1, pageSize = 20) {
  let rows = [...state().scores];
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((s) => s.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createScore(input: {
  caseId: string;
  turnId: string;
  name: string;
  status?: ScoreStatus;
  clinicalCoherence?: number;
  safetyDiscipline?: number;
  turnClarity?: number;
  notes?: string;
}): ResponseScoreRecord {
  if (!state().cases.some((c) => c.id === input.caseId)) {
    throw new Error("case_not_found");
  }
  if (!state().turns.some((t) => t.id === input.turnId)) {
    throw new Error("turn_not_found");
  }
  const row: ResponseScoreRecord = {
    id: randomUUID(),
    caseId: input.caseId,
    turnId: input.turnId,
    name: input.name.trim(),
    status: input.status ?? "computed",
    clinicalCoherence: input.clinicalCoherence ?? 0.7,
    safetyDiscipline: input.safetyDiscipline ?? 0.7,
    turnClarity: input.turnClarity ?? 0.7,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().scores.unshift(row);
  audit("owner", "score.create", row.id);
  return row;
}

export function listLeaderboard(q?: string, page = 1, pageSize = 20) {
  let rows = [...state().leaderboard].sort(
    (a, b) => b.multimodalAvg - a.multimodalAvg,
  );
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.modelName.toLowerCase().includes(needle) ||
        r.promptVariant.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function upsertLeaderboard(input: {
  modelName: string;
  promptVariant: string;
  multimodalAvg: number;
  textOnlyAvg: number;
  runs?: number;
  notes?: string;
}): LeaderboardEntry {
  const gap = Math.round((input.multimodalAvg - input.textOnlyAvg) * 100) / 100;
  const existing = state().leaderboard.find(
    (r) =>
      r.modelName === input.modelName.trim() &&
      r.promptVariant === input.promptVariant.trim(),
  );
  if (existing) {
    existing.multimodalAvg = input.multimodalAvg;
    existing.textOnlyAvg = input.textOnlyAvg;
    existing.gap = gap;
    existing.runs = input.runs ?? existing.runs + 1;
    if (input.notes) existing.notes = input.notes;
    audit("owner", "leaderboard.update", existing.id);
    return { ...existing };
  }
  const row: LeaderboardEntry = {
    id: randomUUID(),
    modelName: input.modelName.trim(),
    promptVariant: input.promptVariant.trim(),
    multimodalAvg: input.multimodalAvg,
    textOnlyAvg: input.textOnlyAvg,
    gap,
    runs: input.runs ?? 1,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().leaderboard.unshift(row);
  audit("owner", "leaderboard.create", row.id);
  return row;
}

function buildInputFromCase(caseId: string, plan?: PlanKind): ConsultInput {
  const c = state().cases.find((x) => x.id === caseId);
  const turn = state().turns.find((t) => t.caseId === caseId);
  const score = state().scores.find((s) => s.caseId === caseId);
  const base = seedInput();
  return {
    ...base,
    imageRelevance: turn?.imageRelevance ?? base.imageRelevance,
    visualGrounding: turn?.visualGrounding ?? base.visualGrounding,
    clinicalCoherence: score?.clinicalCoherence ?? base.clinicalCoherence,
    turnClarity: score?.turnClarity ?? base.turnClarity,
    safetyDiscipline: score?.safetyDiscipline ?? base.safetyDiscipline,
    department: c?.department ?? base.department,
    plan: plan ?? state().org.defaultPlan,
  };
}

export function createCompare(input: {
  name: string;
  caseId: string;
  overrides?: Partial<ConsultInput>;
}): CompareResult {
  if (!state().cases.some((c) => c.id === input.caseId)) {
    throw new Error("case_not_found");
  }
  const consultInput: ConsultInput = {
    ...buildInputFromCase(input.caseId, "multimodal"),
    ...input.overrides,
    plan: "multimodal",
  };
  const multimodal = scoreMultimodal(consultInput);
  const textOnly = scoreTextOnly({ ...consultInput, plan: "text_only" });
  let winner: CompareResult["winner"] = "tie";
  if (multimodal.overall > textOnly.overall + 0.5) winner = "multimodal";
  else if (textOnly.overall > multimodal.overall + 0.5) winner = "text_only";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    caseId: input.caseId,
    input: consultInput,
    multimodal,
    textOnly,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("owner", "compare.create", row.id);
  return row;
}

export function listCompares(page = 1, pageSize = 20) {
  return paginate([...state().compares], page, pageSize);
}

export function listAudits(page = 1, pageSize = 50) {
  return paginate([...state().audits], page, pageSize);
}

export function exportCasesCsv(): string {
  const header = "id,title,department,status,chiefComplaint";
  const lines = state().cases.map(
    (c) =>
      `${c.id},"${c.title.replace(/"/g, '""')}",${c.department},${c.status},"${c.chiefComplaint.replace(/"/g, '""')}"`,
  );
  return [header, ...lines].join("\n");
}

export function exportTurnsCsv(): string {
  const header = "id,caseId,label,hasImage,imageRelevance,visualGrounding";
  const lines = state().turns.map(
    (t) =>
      `${t.id},${t.caseId},"${t.label.replace(/"/g, '""')}",${t.hasImage},${t.imageRelevance},${t.visualGrounding}`,
  );
  return [header, ...lines].join("\n");
}

export function exportScoresJson(): unknown {
  return state().scores.map((s) => ({ ...s }));
}

export function ingestWebhook(
  rawBody: string,
  signature: string | null,
  idempotencyKey: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const given = (signature ?? "").replace(/^sha256=/, "");
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "invalid_signature" };
  }
  const key = idempotencyKey?.trim() || randomUUID();
  if (state().webhookEvents.some((e) => e.idempotencyKey === key)) {
    return { ok: true, duplicate: true };
  }
  let payload: unknown = rawBody;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    /* keep raw */
  }
  const row: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey: key,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(row);
  audit("webhook", "webhook.ingest", key);
  return { ok: true, id: row.id };
}

export function scoreConsult(
  input: ConsultInput,
): { multimodal: ConsultQuality; textOnly: ConsultQuality; readiness: ConsultReadiness } {
  const multimodal = scoreMultimodal({ ...input, plan: "multimodal" });
  const textOnly = scoreTextOnly({ ...input, plan: "text_only" });
  const readiness = readinessFromQuality(multimodal, {
    ...input,
    plan: "multimodal",
  });
  return { multimodal, textOnly, readiness };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing for multimodal consult eval buyers",
    "Consult case registry",
    "Case search and department filter",
    "Multimodal turn workspace (text + image caption)",
    "Turn scrub / image-relevance pairing",
    "Department coverage map",
    "Department tag create",
    "Next-response scoring records",
    "Dual score A multimodal vs B text-only",
    "Model / prompt leaderboard",
    "Multimodal vs text-only compare runs",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer token auth",
    "Rate limit feedback",
    "CSV export for cases",
    "CSV export for turns",
    "JSON export for scores",
    "Audit log",
    "Honesty fence + Sources",
    "Goldens sample / dual-impl verify",
    "Pagination on list APIs",
    "Onboarding checklist on cases",
    "In-app guide link",
  ];
}
