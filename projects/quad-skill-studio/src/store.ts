import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreMultiSkill, scoreSingleGait } from "./domain/loco";
import {
  readinessFromQuality,
  type LocoInput,
  type LocoQuality,
  type LocoReadiness,
  type PlanKind,
  type ScoreMode,
  type SkillKind,
} from "./domain/types";

export type {
  LocoInput,
  LocoQuality,
  LocoReadiness,
  PlanKind,
  ScoreMode,
  SkillKind,
};

export type MemberRole = "owner" | "engineer" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type RobotPlatform = "lab_quad" | "field_quad" | "scout_mini" | "heavy_pack";

export type QuadRobot = {
  id: string;
  name: string;
  platform: RobotPlatform;
  massKg: number;
  legLengthMm: number;
  notes: string;
  createdAt: string;
};

export type TerrainKind =
  | "forest_floor"
  | "rocky_slope"
  | "mud_flat"
  | "stairs"
  | "rubble";

export type TerrainMap = {
  id: string;
  robotId: string;
  name: string;
  kind: TerrainKind;
  roughness: number;
  slopeGrade: number;
  notes: string;
  createdAt: string;
};

export type MotorSkill = {
  id: string;
  robotId: string;
  name: string;
  kind: SkillKind;
  coverage: number;
  stability: number;
  notes: string;
  createdAt: string;
};

export type DatasetKind = "trajectory" | "rl_rollout" | "perception_pack";

export type TrainingDataset = {
  id: string;
  robotId: string;
  name: string;
  kind: DatasetKind;
  density: number;
  episodes: number;
  notes: string;
  createdAt: string;
};

export type TransitionStatus = "draft" | "reviewed" | "smooth" | "jerky";

export type GaitTransition = {
  id: string;
  robotId: string;
  name: string;
  fromSkill: SkillKind;
  toSkill: SkillKind;
  status: TransitionStatus;
  smoothness: number;
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
  robotId: string;
  input: LocoInput;
  multiSkill: LocoQuality;
  singleGait: LocoQuality;
  winner: "multi_skill" | "single_gait" | "tie";
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
  robots: QuadRobot[];
  terrains: TerrainMap[];
  skills: MotorSkill[];
  datasets: TrainingDataset[];
  transitions: GaitTransition[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __qssStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): LocoInput {
  return {
    terrainRoughness: 0.42,
    perceptionQuality: 0.86,
    skillCoverage: 0.78,
    transitionSmoothness: 0.84,
    gaitStability: 0.8,
    energyEfficiency: 0.72,
    slipRisk: 0.18,
    slopeGrade: 0.35,
    trajectoryDensity: 0.74,
    skill: "trot",
    plan: "multi_skill",
  };
}

function seed(): StoreState {
  const robotId = "rob-demo";
  return {
    org: {
      name: "Quad Skill Org",
      webhookUrl: "",
      webhookSecret: "qss-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPlan: "multi_skill",
      defaultMode: "multi_skill",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@quad-skill.local", role: "owner" },
      { id: "m2", email: "engineer@quad-skill.local", role: "engineer" },
      { id: "m3", email: "viewer@quad-skill.local", role: "viewer" },
    ],
    robots: [
      {
        id: robotId,
        name: "Trail Scout · demo quad",
        platform: "field_quad",
        massKg: 28,
        legLengthMm: 340,
        notes: "Demo robot — simulated locomotion only",
        createdAt: now(),
      },
    ],
    terrains: [
      {
        id: "ter-demo",
        robotId,
        name: "Rocky forest cut",
        kind: "rocky_slope",
        roughness: 0.62,
        slopeGrade: 0.44,
        notes: "Wild-terrain map with mid-slope rubble",
        createdAt: now(),
      },
      {
        id: "ter-demo-2",
        robotId,
        name: "Mud flats after rain",
        kind: "mud_flat",
        roughness: 0.38,
        slopeGrade: 0.12,
        notes: "Slip-sensitive soft ground",
        createdAt: now(),
      },
    ],
    skills: [
      {
        id: "sk-demo",
        robotId,
        name: "Perceptive trot",
        kind: "trot",
        coverage: 0.82,
        stability: 0.86,
        notes: "Default open-trail gait",
        createdAt: now(),
      },
      {
        id: "sk-demo-2",
        robotId,
        name: "Crawl over rubble",
        kind: "crawl",
        coverage: 0.74,
        stability: 0.9,
        notes: "Low-COM skill for rough patches",
        createdAt: now(),
      },
    ],
    datasets: [
      {
        id: "ds-demo",
        robotId,
        name: "Wild-trail RL pack",
        kind: "rl_rollout",
        density: 0.76,
        episodes: 4200,
        notes: "Trajectory + reward traces for multi-skill training",
        createdAt: now(),
      },
    ],
    transitions: [
      {
        id: "tr-demo",
        robotId,
        name: "Trot → crawl on rubble",
        fromSkill: "trot",
        toSkill: "crawl",
        status: "smooth",
        smoothness: 0.88,
        notes: "Reviewed transition for rocky mid-trail",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo robot, terrains, skills, datasets, transitions loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__qssStore) g.__qssStore = seed();
  return g.__qssStore;
}

export function resetStore(): void {
  g.__qssStore = seed();
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

export function listRobots(
  q?: string,
  page = 1,
  pageSize = 50,
): {
  items: QuadRobot[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().robots].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.platform.toLowerCase().includes(needle) ||
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

export function createRobot(input: {
  name: string;
  platform: RobotPlatform;
  massKg: number;
  legLengthMm: number;
  notes?: string;
}): QuadRobot {
  const row: QuadRobot = {
    id: randomUUID(),
    name: input.name.trim(),
    platform: input.platform,
    massKg: Math.max(5, Math.min(120, input.massKg)),
    legLengthMm: Math.max(120, Math.min(800, input.legLengthMm)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().robots.unshift(row);
  audit("engineer", "robot.create", row.name);
  return row;
}

export function getRobot(id: string): QuadRobot | undefined {
  return state().robots.find((d) => d.id === id);
}

export function listTerrains(robotId?: string, q?: string): TerrainMap[] {
  let rows = [...state().terrains];
  if (robotId) rows = rows.filter((r) => r.robotId === robotId);
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

export function createTerrain(input: {
  robotId: string;
  name: string;
  kind: TerrainKind;
  roughness?: number;
  slopeGrade?: number;
  notes?: string;
}): TerrainMap {
  if (!getRobot(input.robotId)) throw new Error("robot_not_found");
  const row: TerrainMap = {
    id: randomUUID(),
    robotId: input.robotId,
    name: input.name.trim(),
    kind: input.kind,
    roughness: Math.max(0, Math.min(1, input.roughness ?? 0.5)),
    slopeGrade: Math.max(0, Math.min(1, input.slopeGrade ?? 0.3)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().terrains.unshift(row);
  audit("engineer", "terrain.create", row.name);
  return row;
}

export function listSkills(robotId?: string, q?: string): MotorSkill[] {
  let rows = [...state().skills];
  if (robotId) rows = rows.filter((r) => r.robotId === robotId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSkill(input: {
  robotId: string;
  name: string;
  kind: SkillKind;
  coverage?: number;
  stability?: number;
  notes?: string;
}): MotorSkill {
  if (!getRobot(input.robotId)) throw new Error("robot_not_found");
  const row: MotorSkill = {
    id: randomUUID(),
    robotId: input.robotId,
    name: input.name.trim(),
    kind: input.kind,
    coverage: Math.max(0, Math.min(1, input.coverage ?? 0.5)),
    stability: Math.max(0, Math.min(1, input.stability ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().skills.unshift(row);
  audit("engineer", "skill.create", row.name);
  return row;
}

export function listDatasets(robotId?: string, q?: string): TrainingDataset[] {
  let rows = [...state().datasets];
  if (robotId) rows = rows.filter((r) => r.robotId === robotId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createDataset(input: {
  robotId: string;
  name: string;
  kind: DatasetKind;
  density?: number;
  episodes?: number;
  notes?: string;
}): TrainingDataset {
  if (!getRobot(input.robotId)) throw new Error("robot_not_found");
  const row: TrainingDataset = {
    id: randomUUID(),
    robotId: input.robotId,
    name: input.name.trim(),
    kind: input.kind,
    density: Math.max(0, Math.min(1, input.density ?? 0.5)),
    episodes: Math.max(1, Math.round(input.episodes ?? 100)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().datasets.unshift(row);
  audit("engineer", "dataset.create", row.name);
  return row;
}

export function listTransitions(
  robotId?: string,
  q?: string,
): GaitTransition[] {
  let rows = [...state().transitions];
  if (robotId) rows = rows.filter((r) => r.robotId === robotId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.status.toLowerCase().includes(needle) ||
        r.fromSkill.toLowerCase().includes(needle) ||
        r.toSkill.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createTransition(input: {
  robotId: string;
  name: string;
  fromSkill: SkillKind;
  toSkill: SkillKind;
  status?: TransitionStatus;
  smoothness?: number;
  notes?: string;
}): GaitTransition {
  if (!getRobot(input.robotId)) throw new Error("robot_not_found");
  const row: GaitTransition = {
    id: randomUUID(),
    robotId: input.robotId,
    name: input.name.trim(),
    fromSkill: input.fromSkill,
    toSkill: input.toSkill,
    status: input.status ?? "draft",
    smoothness: Math.max(0, Math.min(1, input.smoothness ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().transitions.unshift(row);
  audit("engineer", "transition.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromRobot(
  robotId: string,
  patch?: Partial<LocoInput>,
  planKind?: PlanKind,
): LocoInput {
  const base = seedInput();
  const terrains = listTerrains(robotId);
  const skills = listSkills(robotId);
  const datasets = listDatasets(robotId);
  const transitions = listTransitions(robotId);
  const avgRough =
    terrains.length > 0
      ? terrains.reduce((s, t) => s + t.roughness, 0) / terrains.length
      : base.terrainRoughness;
  const avgSlope =
    terrains.length > 0
      ? terrains.reduce((s, t) => s + t.slopeGrade, 0) / terrains.length
      : base.slopeGrade;
  const avgCover =
    skills.length > 0
      ? skills.reduce((s, k) => s + k.coverage, 0) / skills.length
      : 0.5;
  const avgStab =
    skills.length > 0
      ? skills.reduce((s, k) => s + k.stability, 0) / skills.length
      : 0.5;
  const avgDense =
    datasets.length > 0
      ? datasets.reduce((s, d) => s + d.density, 0) / datasets.length
      : 0.5;
  const avgSmooth =
    transitions.length > 0
      ? transitions.reduce((s, t) => s + t.smoothness, 0) / transitions.length
      : 0.5;
  const plan = planKind ?? state().org.defaultPlan;
  return {
    ...base,
    ...patch,
    terrainRoughness: patch?.terrainRoughness ?? clamp01(avgRough),
    perceptionQuality:
      patch?.perceptionQuality ??
      clamp01(0.4 + avgDense * 0.35 + Math.min(0.2, datasets.length * 0.05)),
    skillCoverage:
      patch?.skillCoverage ??
      clamp01(0.3 + Math.min(0.35, skills.length * 0.08) + avgCover * 0.35),
    transitionSmoothness:
      patch?.transitionSmoothness ??
      clamp01(
        0.3 + Math.min(0.3, transitions.length * 0.08) + avgSmooth * 0.4,
      ),
    gaitStability: patch?.gaitStability ?? clamp01(0.35 + avgStab * 0.5),
    energyEfficiency:
      patch?.energyEfficiency ??
      clamp01(0.4 + avgCover * 0.25 + (1 - avgRough) * 0.2),
    slipRisk:
      patch?.slipRisk ??
      clamp01(
        avgRough * 0.35 +
          avgSlope * 0.2 +
          (plan === "single_gait" ? 0.28 : 0.08),
      ),
    slopeGrade: patch?.slopeGrade ?? clamp01(avgSlope),
    trajectoryDensity: patch?.trajectoryDensity ?? clamp01(avgDense),
    skill:
      patch?.skill ??
      skills.find((s) => s.kind === "crawl" || s.kind === "climb")?.kind ??
      skills[0]?.kind ??
      "trot",
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
  robotId: string;
  patch?: Partial<LocoInput>;
}): CompareResult {
  if (!getRobot(input.robotId)) throw new Error("robot_not_found");
  const multiInput = inputFromRobot(input.robotId, input.patch, "multi_skill");
  const singleInput: LocoInput = {
    ...multiInput,
    plan: "single_gait",
    slipRisk: clamp01(multiInput.slipRisk + 0.28),
    transitionSmoothness: clamp01(multiInput.transitionSmoothness - 0.22),
    skillCoverage: clamp01(multiInput.skillCoverage - 0.18),
  };
  const multiSkill = scoreMultiSkill({ ...multiInput, plan: "multi_skill" });
  const singleGait = scoreSingleGait(singleInput);
  const delta = multiSkill.overall - singleGait.overall;
  const winner =
    Math.abs(delta) < 0.5 ? "tie" : delta > 0 ? "multi_skill" : "single_gait";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    robotId: input.robotId,
    input: multiInput,
    multiSkill,
    singleGait,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("engineer", "compare.create", `${row.name} → ${row.winner}`);
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

export function exportTransitionsJson(): string {
  return JSON.stringify({ items: listTransitions() }, null, 2);
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
    "Marketing landing for wild-quadruped locomotion buyers",
    "Quadruped robot registry",
    "Robot search and pagination",
    "Terrain map library",
    "Multi-skill motor library",
    "Trajectory / RL dataset curator",
    "Gait transition review",
    "Multi-skill vs single-gait compare",
    "Dual score A multi-skill perceptive quality",
    "Dual score B single-gait stall baseline",
    "Org settings and bearer auth",
    "Member invite with roles",
    "Idempotent HMAC webhook",
    "Audit log",
    "CSV audit export",
    "JSON transitions export",
    "Rate-limit feedback",
    "Features inventory API",
    "Goldens sample API",
    "Honesty fence and Sources",
    "Offline try.html demo",
    "In-app guide link",
    "Saved onboarding checklist on robots",
    "Filter terrains and transitions by robot",
  ];
}

export function sampleGoldenInput(): LocoInput {
  return seedInput();
}

export function scorePlan(
  input: LocoInput,
  mode: ScoreMode,
): { quality: LocoQuality; readiness: LocoReadiness } {
  const quality =
    mode === "multi_skill" ? scoreMultiSkill(input) : scoreSingleGait(input);
  return { quality, readiness: readinessFromQuality(quality, input) };
}
