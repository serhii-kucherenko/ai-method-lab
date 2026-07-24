import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreOrchestrated, scoreSingle } from "./domain/tutor";
import {
  rubricFromQuality,
  type RubricView,
  type ScoreMode,
  type TutorInput,
  type TutorProfile,
  type TutorQuality,
} from "./domain/types";

export type MemberRole = "owner" | "instructor" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type CourseKind =
  | "web"
  | "api"
  | "mobile"
  | "cloud"
  | "secure-sdlc";

export type Course = {
  id: string;
  name: string;
  kind: CourseKind;
  vulnComplexity: number;
  threatCoverage: number;
  notes: string;
  createdAt: string;
};

export type TutorRoleKind =
  | "explainer"
  | "safety"
  | "rubric"
  | "coach";

export type TutorRole = {
  id: string;
  courseId: string;
  name: string;
  kind: TutorRoleKind;
  specialization: number;
  active: boolean;
  createdAt: string;
};

export type LessonSession = {
  id: string;
  courseId: string;
  mode: ScoreMode;
  profile: TutorProfile;
  stage:
    | "queued"
    | "brief"
    | "teach"
    | "quiz"
    | "rubric"
    | "complete"
    | "failed";
  input: TutorInput;
  quality?: TutorQuality;
  rubric?: RubricView;
  courseLabel: string;
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
  defaultProfile: TutorProfile;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  courseId: string;
  input: TutorInput;
  orchestrated: TutorQuality;
  single: TutorQuality;
  winner: "orchestrated" | "single" | "tie";
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
  courses: Course[];
  tutors: TutorRole[];
  lessons: LessonSession[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __stsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): TutorInput {
  return {
    vulnComplexity: 0.66,
    rubricItemCount: 10,
    tutorCoverage: 0.8,
    orchestrationRounds: 4,
    pedagogyDepth: 0.72,
    threatCoverage: 0.7,
    safetyGateStrength: 0.74,
    studentRiskLevel: 0.4,
    exploitHintRisk: 0.35,
    explainerSpecialization: 0.76,
    safetySpecialization: 0.78,
    rubricSpecialization: 0.7,
    profile: "guided",
  };
}

function seed(): StoreState {
  const courseId = "course-demo";
  const lessonId = "lesson-demo";
  const input = seedInput();
  const quality = scoreOrchestrated(input);
  const rubric = rubricFromQuality(quality, input);

  return {
    org: {
      name: "Secure Tutor Org",
      webhookUrl: "",
      webhookSecret: "sts-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "guided",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "instructor@studio.local", role: "instructor" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    courses: [
      {
        id: courseId,
        name: "OWASP web fundamentals",
        kind: "web",
        vulnComplexity: 0.66,
        threatCoverage: 0.7,
        notes: "Demo course for orchestrated secure tutoring",
        createdAt: now(),
      },
    ],
    tutors: [
      {
        id: "t1",
        courseId,
        name: "Concept explainer",
        kind: "explainer",
        specialization: 0.76,
        active: true,
        createdAt: now(),
      },
      {
        id: "t2",
        courseId,
        name: "Safety checker",
        kind: "safety",
        specialization: 0.78,
        active: true,
        createdAt: now(),
      },
      {
        id: "t3",
        courseId,
        name: "Rubric grader",
        kind: "rubric",
        specialization: 0.7,
        active: true,
        createdAt: now(),
      },
      {
        id: "t4",
        courseId,
        name: "Practice coach",
        kind: "coach",
        specialization: 0.64,
        active: true,
        createdAt: now(),
      },
    ],
    lessons: [
      {
        id: lessonId,
        courseId,
        mode: "orchestrated",
        profile: "guided",
        stage: "complete",
        input,
        quality,
        rubric,
        courseLabel: "OWASP web fundamentals",
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
        detail:
          "Demo course, tutor roster, and completed orchestrated lesson loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__stsStore) g.__stsStore = seed();
  return g.__stsStore;
}

export function resetStore(): void {
  g.__stsStore = seed();
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

export function listCourses(q?: string): Course[] {
  const all = [...state().courses].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(needle) ||
      c.kind.toLowerCase().includes(needle) ||
      c.notes.toLowerCase().includes(needle),
  );
}

export function createCourse(input: {
  name: string;
  kind: CourseKind;
  vulnComplexity: number;
  threatCoverage: number;
  notes: string;
}): Course {
  const course: Course = {
    id: randomUUID(),
    name: input.name.trim(),
    kind: input.kind,
    vulnComplexity: Math.max(0, Math.min(1, input.vulnComplexity)),
    threatCoverage: Math.max(0, Math.min(1, input.threatCoverage)),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().courses.unshift(course);
  audit("instructor", "course.create", course.name);
  return course;
}

export function getCourse(id: string): Course | undefined {
  return state().courses.find((c) => c.id === id);
}

export function listTutors(courseId?: string): TutorRole[] {
  let rows = [...state().tutors];
  if (courseId) rows = rows.filter((t) => t.courseId === courseId);
  return rows.sort((a, b) => a.kind.localeCompare(b.kind));
}

export function createTutor(input: {
  courseId: string;
  name: string;
  kind: TutorRoleKind;
  specialization: number;
  active?: boolean;
}): TutorRole {
  const course = getCourse(input.courseId);
  if (!course) throw new Error("course_not_found");
  const tutor: TutorRole = {
    id: randomUUID(),
    courseId: input.courseId,
    name: input.name.trim(),
    kind: input.kind,
    specialization: Math.max(0, Math.min(1, input.specialization)),
    active: input.active ?? true,
    createdAt: now(),
  };
  state().tutors.unshift(tutor);
  audit("instructor", "tutor.create", `${tutor.name} (${tutor.kind})`);
  return tutor;
}

export function setTutorActive(id: string, active: boolean): TutorRole {
  const tutor = state().tutors.find((t) => t.id === id);
  if (!tutor) throw new Error("tutor_not_found");
  tutor.active = active;
  audit("instructor", "tutor.toggle", `${tutor.name} → ${active}`);
  return { ...tutor };
}

export function listLessons(courseId?: string): LessonSession[] {
  let rows = [...state().lessons];
  if (courseId) rows = rows.filter((r) => r.courseId === courseId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function inputFromCourse(
  course: Course,
  tutors: TutorRole[],
  patch?: Partial<TutorInput>,
  profile?: TutorProfile,
): TutorInput {
  const active = tutors.filter((t) => t.active);
  const byKind = (k: TutorRoleKind) =>
    active.find((t) => t.kind === k)?.specialization ?? 0.35;
  const base = seedInput();
  return {
    ...base,
    ...patch,
    vulnComplexity: patch?.vulnComplexity ?? course.vulnComplexity,
    threatCoverage: patch?.threatCoverage ?? course.threatCoverage,
    tutorCoverage:
      patch?.tutorCoverage ?? Math.min(1, active.length / 4),
    explainerSpecialization:
      patch?.explainerSpecialization ?? byKind("explainer"),
    safetySpecialization: patch?.safetySpecialization ?? byKind("safety"),
    rubricSpecialization: patch?.rubricSpecialization ?? byKind("rubric"),
    profile: profile ?? state().org.defaultProfile,
  };
}

export function createLesson(input: {
  courseId: string;
  mode?: ScoreMode;
  profile?: TutorProfile;
  courseLabel?: string;
  tutorInput?: Partial<TutorInput>;
}): LessonSession {
  const course = getCourse(input.courseId);
  if (!course) throw new Error("course_not_found");
  const profile = input.profile ?? state().org.defaultProfile;
  const emb = inputFromCourse(
    course,
    listTutors(course.id),
    input.tutorInput,
    profile,
  );
  const qualityPreview =
    input.mode === "single" ? scoreSingle(emb) : scoreOrchestrated(emb);
  const lesson: LessonSession = {
    id: randomUUID(),
    courseId: input.courseId,
    mode: input.mode ?? "orchestrated",
    profile,
    stage: "queued",
    input: emb,
    rubric: rubricFromQuality(qualityPreview, emb),
    courseLabel: (input.courseLabel ?? course.name).trim(),
    createdAt: now(),
    updatedAt: now(),
  };
  state().lessons.unshift(lesson);
  audit("instructor", "lesson.create", `${lesson.id} ${lesson.mode}`);
  return lesson;
}

const STAGE_ORDER: LessonSession["stage"][] = [
  "queued",
  "brief",
  "teach",
  "quiz",
  "rubric",
  "complete",
];

export function advanceLesson(id: string): LessonSession {
  const lesson = state().lessons.find((r) => r.id === id);
  if (!lesson) throw new Error("lesson_not_found");
  if (lesson.stage === "failed" || lesson.stage === "complete") {
    throw new Error("illegal_stage_advance");
  }
  const idx = STAGE_ORDER.indexOf(lesson.stage);
  const next = STAGE_ORDER[idx + 1];
  if (!next) throw new Error("illegal_stage_advance");

  if (next === "complete") {
    lesson.quality =
      lesson.mode === "orchestrated"
        ? scoreOrchestrated(lesson.input)
        : scoreSingle(lesson.input);
    lesson.rubric = rubricFromQuality(lesson.quality, lesson.input);
  }

  lesson.stage = next;
  lesson.updatedAt = now();
  audit("instructor", "lesson.advance", `${lesson.id} → ${next}`);
  return { ...lesson };
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

export function exportLessonsJson(courseId?: string): string {
  return JSON.stringify(listLessons(courseId), null, 2);
}

export function createCompare(input: {
  name: string;
  courseId: string;
  tutorInput: TutorInput;
}): CompareResult {
  const course = getCourse(input.courseId);
  if (!course) throw new Error("course_not_found");
  const orchestrated = scoreOrchestrated(input.tutorInput);
  const single = scoreSingle(input.tutorInput);
  let winner: CompareResult["winner"] = "tie";
  if (orchestrated.overall > single.overall + 0.01) {
    winner = "orchestrated";
  } else if (single.overall > orchestrated.overall + 0.01) {
    winner = "single";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    courseId: input.courseId,
    input: input.tutorInput,
    orchestrated,
    single,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("instructor", "compare.create", row.name);
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

export function listFeatures(): string[] {
  return [
    "Marketing landing with selling points",
    "Course workspace create",
    "Course search (kind / notes)",
    "Multi-LLM tutor roster",
    "Tutor orchestration toggle",
    "Lesson session console",
    "Orchestrated multi-LLM mode",
    "Single-LLM unchecked baseline",
    "Guided vs strict tutor profile",
    "Brief / teach / quiz / rubric stage advance",
    "Security rubric item editor",
    "Tutor coverage from active roles",
    "Orchestrated vs single compare",
    "Compare winner badge + score bars",
    "Runs audit list",
    "CSV audit export",
    "JSON lesson-run export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on courses",
    "Dual-impl goldens sample API",
    "Pagination on courses / runs / audits",
    "Safety gate + pedagogy fit metrics",
    "Soft simulation disclaimer (not SYNAPSE brand)",
  ];
}
