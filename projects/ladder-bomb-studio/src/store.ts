import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreDroppedFb, scoreFbAware } from "./domain/ladder";
import {
  readinessFromQuality,
  type LadderInput,
  type LadderQuality,
  type ScanProfile,
  type ScanReadiness,
  type ScoreMode,
} from "./domain/types";

export type {
  LadderInput,
  LadderQuality,
  ScanProfile,
  ScanReadiness,
  ScoreMode,
};

export type MemberRole = "owner" | "operator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PlantCriticality = "low" | "medium" | "high" | "safety-critical";

export type Plant = {
  id: string;
  name: string;
  siteCode: string;
  criticality: PlantCriticality;
  plcCount: number;
  notes: string;
  createdAt: string;
};

export type LadderDialect = "ld" | "fbd" | "sfc" | "st" | "il";

export type LadderProgram = {
  id: string;
  plantId: string;
  name: string;
  dialect: LadderDialect;
  fbCount: number;
  lineCount: number;
  notes: string;
  createdAt: string;
};

export type ScanStatus = "queued" | "running" | "complete" | "failed";

export type VerifyScan = {
  id: string;
  programId: string;
  plantId: string;
  name: string;
  mode: ScoreMode;
  status: ScanStatus;
  profile: ScanProfile;
  quality?: LadderQuality;
  readiness?: ScanReadiness;
  createdAt: string;
  updatedAt: string;
};

export type BombTaxonomy =
  | "hidden-timer"
  | "interlock-bypass"
  | "actuator-deny"
  | "nested-fb"
  | "hmi-override"
  | "scan-starve";

export type FindingSeverity = "low" | "medium" | "high" | "critical";

export type BombFinding = {
  id: string;
  scanId: string;
  programId: string;
  plantId: string;
  title: string;
  taxonomy: BombTaxonomy;
  severity: FindingSeverity;
  status: "open" | "triaged" | "resolved";
  suspicion: number;
  detail: string;
  quality?: LadderQuality;
  readiness?: ScanReadiness;
  createdAt: string;
  updatedAt: string;
};

export type TriggerSynth = {
  id: string;
  findingId: string;
  scanId: string;
  label: string;
  steps: string[];
  recoveryScore: number;
  concrete: boolean;
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
  defaultProfile: ScanProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  programId: string;
  input: LadderInput;
  fbAware: LadderQuality;
  droppedFb: LadderQuality;
  winner: "fb-aware" | "dropped-fb" | "tie";
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
  plants: Plant[];
  programs: LadderProgram[];
  scans: VerifyScan[];
  findings: BombFinding[];
  triggers: TriggerSynth[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __lbsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): LadderInput {
  return {
    fbBodyRetention: 0.88,
    nestedFbDepth: 0.62,
    timerCounterComplexity: 0.58,
    interlockBypassRisk: 0.55,
    actuatorReach: 0.6,
    operatorOverrideGap: 0.42,
    hiddenTimerHint: 0.7,
    scanCycleBoundTightness: 0.72,
    symbolicPathCoverage: 0.76,
    triggerRecoverability: 0.74,
    ladderNoise: 0.28,
    fbInstanceCount: 8,
    profile: "balanced",
  };
}

function seed(): StoreState {
  const plantId = "plant-demo";
  const programId = "prog-demo";
  const scanId = "scan-demo";
  const findingId = "find-demo";
  const input = seedInput();
  const quality = scoreFbAware(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Ladder Bomb Org",
      webhookUrl: "",
      webhookSecret: "lbs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "balanced",
      defaultMode: "fb-aware",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "ot-eng@studio.local", role: "operator" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    plants: [
      {
        id: plantId,
        name: "West Pack Line",
        siteCode: "WPL-01",
        criticality: "safety-critical",
        plcCount: 6,
        notes: "Demo plant for ladder logic bomb scans",
        createdAt: now(),
      },
    ],
    programs: [
      {
        id: programId,
        plantId,
        name: "Conveyor interlock LD",
        dialect: "ld",
        fbCount: 8,
        lineCount: 420,
        notes: "Nested FB timers on discharge gate",
        createdAt: now(),
      },
    ],
    scans: [
      {
        id: scanId,
        programId,
        plantId,
        name: "FB-aware formal pass",
        mode: "fb-aware",
        status: "complete",
        profile: "balanced",
        quality,
        readiness,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    findings: [
      {
        id: findingId,
        scanId,
        programId,
        plantId,
        title: "Hidden timer in nested FB can deny gate open",
        taxonomy: "hidden-timer",
        severity: "critical",
        status: "open",
        suspicion: 9,
        detail:
          "FB-aware model retained FB bodies and recovered a delayed-fire path to the actuator coil",
        quality,
        readiness,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    triggers: [
      {
        id: "trig-demo",
        findingId,
        scanId,
        label: "Delayed discharge deny",
        steps: [
          "Hold START true for 2 scan cycles",
          "Assert interlock FB inputs normal",
          "Wait nested TON past preset",
          "Observe GATE_OPEN forced false",
        ],
        recoveryScore: quality.triggerRecovery,
        concrete: true,
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo plant, program, scan, finding, and trigger loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__lbsStore) g.__lbsStore = seed();
  return g.__lbsStore;
}

export function resetStore(): void {
  g.__lbsStore = seed();
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

export function listPlants(q?: string): Plant[] {
  const all = [...state().plants].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.siteCode.toLowerCase().includes(needle) ||
      p.notes.toLowerCase().includes(needle) ||
      p.criticality.toLowerCase().includes(needle),
  );
}

export function createPlant(input: {
  name: string;
  siteCode: string;
  criticality: PlantCriticality;
  plcCount: number;
  notes: string;
}): Plant {
  const plant: Plant = {
    id: randomUUID(),
    name: input.name.trim(),
    siteCode: input.siteCode.trim().toUpperCase(),
    criticality: input.criticality,
    plcCount: Math.max(1, Math.min(200, Math.round(input.plcCount))),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().plants.unshift(plant);
  audit("operator", "plant.create", plant.name);
  return plant;
}

export function getPlant(id: string): Plant | undefined {
  return state().plants.find((p) => p.id === id);
}

export function listPrograms(plantId?: string, q?: string): LadderProgram[] {
  let rows = [...state().programs];
  if (plantId) rows = rows.filter((p) => p.plantId === plantId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.dialect.toLowerCase().includes(needle) ||
        p.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createProgram(input: {
  plantId: string;
  name: string;
  dialect: LadderDialect;
  fbCount: number;
  lineCount: number;
  notes: string;
}): LadderProgram {
  const plant = getPlant(input.plantId);
  if (!plant) throw new Error("plant_not_found");
  const program: LadderProgram = {
    id: randomUUID(),
    plantId: input.plantId,
    name: input.name.trim(),
    dialect: input.dialect,
    fbCount: Math.max(0, Math.min(200, Math.round(input.fbCount))),
    lineCount: Math.max(1, Math.min(50_000, Math.round(input.lineCount))),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().programs.unshift(program);
  audit("operator", "program.create", program.name);
  return program;
}

export function getProgram(id: string): LadderProgram | undefined {
  return state().programs.find((p) => p.id === id);
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromProgram(
  program: LadderProgram,
  plant: Plant,
  patch?: Partial<LadderInput>,
  profile?: ScanProfile,
): LadderInput {
  const base = seedInput();
  const crit =
    plant.criticality === "safety-critical"
      ? 0.85
      : plant.criticality === "high"
        ? 0.7
        : plant.criticality === "medium"
          ? 0.5
          : 0.3;
  return {
    ...base,
    ...patch,
    fbBodyRetention: patch?.fbBodyRetention ?? 0.86,
    nestedFbDepth:
      patch?.nestedFbDepth ??
      clamp01(0.25 + Math.min(1, program.fbCount / 12) * 0.55),
    timerCounterComplexity:
      patch?.timerCounterComplexity ?? clamp01(0.3 + crit * 0.35),
    interlockBypassRisk:
      patch?.interlockBypassRisk ?? clamp01(0.25 + crit * 0.4),
    actuatorReach: patch?.actuatorReach ?? clamp01(0.35 + crit * 0.4),
    operatorOverrideGap:
      patch?.operatorOverrideGap ?? clamp01(0.2 + (1 - crit) * 0.25),
    hiddenTimerHint: patch?.hiddenTimerHint ?? clamp01(0.4 + crit * 0.35),
    scanCycleBoundTightness: patch?.scanCycleBoundTightness ?? 0.7,
    symbolicPathCoverage: patch?.symbolicPathCoverage ?? 0.74,
    triggerRecoverability: patch?.triggerRecoverability ?? 0.72,
    ladderNoise:
      patch?.ladderNoise ??
      clamp01(0.15 + Math.min(1, program.lineCount / 2000) * 0.35),
    fbInstanceCount:
      patch?.fbInstanceCount ?? Math.max(1, Math.min(24, program.fbCount || 1)),
    profile: profile ?? state().org.defaultProfile,
  };
}

export function listScans(programId?: string): VerifyScan[] {
  let rows = [...state().scans];
  if (programId) rows = rows.filter((s) => s.programId === programId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createScan(input: {
  programId: string;
  name: string;
  mode?: ScoreMode;
  profile?: ScanProfile;
  ladderInput?: Partial<LadderInput>;
}): VerifyScan {
  const program = getProgram(input.programId);
  if (!program) throw new Error("program_not_found");
  const plant = getPlant(program.plantId);
  if (!plant) throw new Error("plant_not_found");
  const profile = input.profile ?? state().org.defaultProfile;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromProgram(program, plant, input.ladderInput, profile);
  const quality =
    mode === "dropped-fb" ? scoreDroppedFb(emb) : scoreFbAware(emb);
  const readiness = readinessFromQuality(quality, emb);
  const scan: VerifyScan = {
    id: randomUUID(),
    programId: program.id,
    plantId: plant.id,
    name: input.name.trim(),
    mode,
    status: "complete",
    profile,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().scans.unshift(scan);
  audit("operator", "scan.create", `${scan.name} (${scan.mode})`);
  return scan;
}

export function listFindings(filters?: {
  plantId?: string;
  taxonomy?: BombTaxonomy;
  status?: BombFinding["status"];
}): BombFinding[] {
  let rows = [...state().findings];
  if (filters?.plantId) rows = rows.filter((f) => f.plantId === filters.plantId);
  if (filters?.taxonomy)
    rows = rows.filter((f) => f.taxonomy === filters.taxonomy);
  if (filters?.status) rows = rows.filter((f) => f.status === filters.status);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

const TAXONOMY_TITLES: Record<BombTaxonomy, string> = {
  "hidden-timer": "Hidden timer delayed fire",
  "interlock-bypass": "Interlock bypass path",
  "actuator-deny": "Actuator deny-of-control",
  "nested-fb": "Bomb nested inside FB body",
  "hmi-override": "HMI override gap exploit",
  "scan-starve": "Scan-cycle starve bomb",
};

export function createFinding(input: {
  scanId: string;
  title?: string;
  taxonomy?: BombTaxonomy;
  severity?: FindingSeverity;
}): BombFinding {
  const scan = state().scans.find((s) => s.id === input.scanId);
  if (!scan) throw new Error("scan_not_found");
  const taxonomy = input.taxonomy ?? "hidden-timer";
  const quality = scan.quality;
  const suspicion = Math.max(
    1,
    Math.min(
      10,
      Math.round(
        ((quality?.bombCatchRate ?? 50) / 12) +
          ((quality?.triggerRecovery ?? 40) / 20),
      ),
    ),
  );
  const finding: BombFinding = {
    id: randomUUID(),
    scanId: scan.id,
    programId: scan.programId,
    plantId: scan.plantId,
    title: (input.title ?? TAXONOMY_TITLES[taxonomy]).trim(),
    taxonomy,
    severity:
      input.severity ??
      (suspicion >= 9 ? "critical" : suspicion >= 7 ? "high" : "medium"),
    status: "open",
    suspicion,
    detail: `Detected via ${scan.mode} scan · catch ${quality?.bombCatchRate ?? "?"}`,
    quality,
    readiness: scan.readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().findings.unshift(finding);
  audit("operator", "finding.create", finding.title);
  return finding;
}

export function advanceFinding(
  id: string,
  status: BombFinding["status"],
): BombFinding {
  const finding = state().findings.find((f) => f.id === id);
  if (!finding) throw new Error("finding_not_found");
  finding.status = status;
  finding.updatedAt = now();
  audit("operator", "finding.advance", `${finding.id} → ${status}`);
  return { ...finding };
}

export function listTriggers(findingId?: string): TriggerSynth[] {
  let rows = [...state().triggers];
  if (findingId) rows = rows.filter((t) => t.findingId === findingId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function synthesizeTrigger(input: {
  findingId: string;
  label?: string;
}): TriggerSynth {
  const finding = state().findings.find((f) => f.id === input.findingId);
  if (!finding) throw new Error("finding_not_found");
  const recovery = finding.quality?.triggerRecovery ?? 50;
  const trigger: TriggerSynth = {
    id: randomUUID(),
    findingId: finding.id,
    scanId: finding.scanId,
    label: (input.label ?? `Trigger for ${finding.taxonomy}`).trim(),
    steps: [
      "Set precondition contacts to benign plant state",
      `Drive ${finding.taxonomy} precondition true`,
      "Advance scan cycles until latent path fires",
      "Confirm actuator / operator-control effect",
    ],
    recoveryScore: recovery,
    concrete: recovery >= 55,
    createdAt: now(),
  };
  state().triggers.unshift(trigger);
  audit("operator", "trigger.synthesize", trigger.label);
  return trigger;
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

export function exportFindingsJson(plantId?: string): string {
  return JSON.stringify(listFindings(plantId ? { plantId } : undefined), null, 2);
}

export function createCompare(input: {
  name: string;
  programId: string;
  ladderInput: LadderInput;
}): CompareResult {
  const program = getProgram(input.programId);
  if (!program) throw new Error("program_not_found");
  const fbAware = scoreFbAware(input.ladderInput);
  const droppedFb = scoreDroppedFb(input.ladderInput);
  let winner: CompareResult["winner"] = "tie";
  if (fbAware.overall > droppedFb.overall + 0.01) {
    winner = "fb-aware";
  } else if (droppedFb.overall > fbAware.overall + 0.01) {
    winner = "dropped-fb";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    programId: input.programId,
    input: input.ladderInput,
    fbAware,
    droppedFb,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("operator", "compare.create", row.name);
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
    "Marketing landing with OT buyer outcome",
    "Plant / site registry",
    "Plant search by site code and criticality",
    "IEC 61131-3 ladder program library",
    "Program import notes and dialect tags",
    "Formal verification scan runs",
    "FB-aware formal plan score",
    "Dropped-FB baseline score",
    "Balanced vs strict scan profile",
    "Trigger synthesis for findings",
    "Findings console with bomb taxonomy",
    "Finding triage / resolve advance",
    "FB-aware vs dropped-FB compare",
    "Compare winner badge + score bars",
    "Audit history list",
    "CSV audit export",
    "JSON findings export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on plants",
    "Dual-impl goldens sample API",
    "Pagination on plants / scans / audits",
    "Bomb catch rate + trigger recovery metrics",
    "Soft simulation disclaimer (not ESBMC-LLB brand)",
  ];
}
