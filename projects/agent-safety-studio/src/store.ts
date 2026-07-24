import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreStructural, scoreThreshold } from "./domain/safety";
import {
  readinessFromQuality,
  type DeployMode,
  type MonitorProfile,
  type MonitorReadiness,
  type SafetyInput,
  type SafetyQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  DeployMode,
  MonitorProfile,
  MonitorReadiness,
  SafetyInput,
  SafetyQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "operator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type FleetKind =
  | "iac"
  | "coding"
  | "ops"
  | "security"
  | "multi-agent";

export type AgentFleet = {
  id: string;
  name: string;
  kind: FleetKind;
  agentCount: number;
  riskPressure: number;
  notes: string;
  createdAt: string;
};

export type CheckKind =
  | "cfg"
  | "dfg"
  | "privilege"
  | "logging"
  | "deny-guard"
  | "sink"
  | "hardening";

export type SafetyMonitor = {
  id: string;
  fleetId: string;
  name: string;
  checkKind: CheckKind;
  coverage: number;
  active: boolean;
  deployMode: DeployMode;
  createdAt: string;
};

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export type AlertEvent = {
  id: string;
  fleetId: string;
  monitorId: string;
  title: string;
  severity: AlertSeverity;
  status: "open" | "acked" | "resolved";
  suspicion: number;
  detail: string;
  quality?: SafetyQuality;
  readiness?: MonitorReadiness;
  createdAt: string;
  updatedAt: string;
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
  defaultProfile: MonitorProfile;
  defaultDeployMode: DeployMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  fleetId: string;
  input: SafetyInput;
  structural: SafetyQuality;
  threshold: SafetyQuality;
  winner: "structural" | "threshold" | "tie";
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
  fleets: AgentFleet[];
  monitors: SafetyMonitor[];
  alerts: AlertEvent[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __assStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): SafetyInput {
  return {
    cfgDelta: 0.62,
    dfgDelta: 0.58,
    privilegeBroadening: 0.55,
    loggingDegradation: 0.4,
    denyGuardRemoval: 0.48,
    newSensitiveSinks: 0.52,
    taskJustification: 0.35,
    monitorCoverage: 0.78,
    suspicionThreshold: 6,
    codeDiffNoise: 0.42,
    hardeningRegression: 0.45,
    checkKindCount: 6,
    deployMode: "sync",
    profile: "balanced",
  };
}

function seed(): StoreState {
  const fleetId = "fleet-demo";
  const monitorId = "mon-demo";
  const input = seedInput();
  const quality = scoreStructural(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Agent Safety Org",
      webhookUrl: "",
      webhookSecret: "ass-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "balanced",
      defaultDeployMode: "sync",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "operator@studio.local", role: "operator" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    fleets: [
      {
        id: fleetId,
        name: "IaC coding agents",
        kind: "iac",
        agentCount: 12,
        riskPressure: 0.66,
        notes: "Demo fleet for structural deployment monitoring",
        createdAt: now(),
      },
    ],
    monitors: [
      {
        id: monitorId,
        fleetId,
        name: "CFG delta scan",
        checkKind: "cfg",
        coverage: 0.82,
        active: true,
        deployMode: "sync",
        createdAt: now(),
      },
      {
        id: "mon-dfg",
        fleetId,
        name: "DFG delta scan",
        checkKind: "dfg",
        coverage: 0.78,
        active: true,
        deployMode: "sync",
        createdAt: now(),
      },
      {
        id: "mon-priv",
        fleetId,
        name: "Privilege broaden",
        checkKind: "privilege",
        coverage: 0.74,
        active: true,
        deployMode: "async",
        createdAt: now(),
      },
      {
        id: "mon-deny",
        fleetId,
        name: "Deny-guard removal",
        checkKind: "deny-guard",
        coverage: 0.7,
        active: true,
        deployMode: "sync",
        createdAt: now(),
      },
    ],
    alerts: [
      {
        id: "alert-demo",
        fleetId,
        monitorId,
        title: "Privilege broaden without task justification",
        severity: "high",
        status: "open",
        suspicion: 8,
        detail: "Structural delta flagged new admin-capable path in IaC synth",
        quality,
        readiness,
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
        detail: "Demo fleet, structural monitors, and open alert loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__assStore) g.__assStore = seed();
  return g.__assStore;
}

export function resetStore(): void {
  g.__assStore = seed();
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

export function listFleets(q?: string): AgentFleet[] {
  const all = [...state().fleets].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (f) =>
      f.name.toLowerCase().includes(needle) ||
      f.kind.toLowerCase().includes(needle) ||
      f.notes.toLowerCase().includes(needle),
  );
}

export function createFleet(input: {
  name: string;
  kind: FleetKind;
  agentCount: number;
  riskPressure: number;
  notes: string;
}): AgentFleet {
  const fleet: AgentFleet = {
    id: randomUUID(),
    name: input.name.trim(),
    kind: input.kind,
    agentCount: Math.max(1, Math.min(500, Math.round(input.agentCount))),
    riskPressure: Math.max(0, Math.min(1, input.riskPressure)),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().fleets.unshift(fleet);
  audit("operator", "fleet.create", fleet.name);
  return fleet;
}

export function getFleet(id: string): AgentFleet | undefined {
  return state().fleets.find((f) => f.id === id);
}

export function listMonitors(fleetId?: string): SafetyMonitor[] {
  let rows = [...state().monitors];
  if (fleetId) rows = rows.filter((m) => m.fleetId === fleetId);
  return rows.sort((a, b) => a.checkKind.localeCompare(b.checkKind));
}

export function createMonitor(input: {
  fleetId: string;
  name: string;
  checkKind: CheckKind;
  coverage: number;
  deployMode?: DeployMode;
  active?: boolean;
}): SafetyMonitor {
  const fleet = getFleet(input.fleetId);
  if (!fleet) throw new Error("fleet_not_found");
  const monitor: SafetyMonitor = {
    id: randomUUID(),
    fleetId: input.fleetId,
    name: input.name.trim(),
    checkKind: input.checkKind,
    coverage: Math.max(0, Math.min(1, input.coverage)),
    active: input.active ?? true,
    deployMode: input.deployMode ?? state().org.defaultDeployMode,
    createdAt: now(),
  };
  state().monitors.unshift(monitor);
  audit("operator", "monitor.create", `${monitor.name} (${monitor.checkKind})`);
  return monitor;
}

export function setMonitorActive(id: string, active: boolean): SafetyMonitor {
  const monitor = state().monitors.find((m) => m.id === id);
  if (!monitor) throw new Error("monitor_not_found");
  monitor.active = active;
  audit("operator", "monitor.toggle", `${monitor.name} → ${active}`);
  return { ...monitor };
}

export function listAlerts(fleetId?: string): AlertEvent[] {
  let rows = [...state().alerts];
  if (fleetId) rows = rows.filter((a) => a.fleetId === fleetId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function inputFromFleet(
  fleet: AgentFleet,
  monitors: SafetyMonitor[],
  patch?: Partial<SafetyInput>,
  profile?: MonitorProfile,
): SafetyInput {
  const active = monitors.filter((m) => m.active);
  const byKind = (k: CheckKind) =>
    active.find((m) => m.checkKind === k)?.coverage ?? 0.35;
  const base = seedInput();
  const syncCount = active.filter((m) => m.deployMode === "sync").length;
  return {
    ...base,
    ...patch,
    privilegeBroadening:
      patch?.privilegeBroadening ??
      clamp01(fleet.riskPressure * 0.7 + (1 - byKind("privilege")) * 0.3),
    loggingDegradation:
      patch?.loggingDegradation ?? clamp01(0.25 + (1 - byKind("logging")) * 0.4),
    denyGuardRemoval:
      patch?.denyGuardRemoval ??
      clamp01(fleet.riskPressure * 0.55 + (1 - byKind("deny-guard")) * 0.35),
    newSensitiveSinks:
      patch?.newSensitiveSinks ??
      clamp01(fleet.riskPressure * 0.5 + (1 - byKind("sink")) * 0.4),
    monitorCoverage:
      patch?.monitorCoverage ?? Math.min(1, active.length / 7),
    checkKindCount: patch?.checkKindCount ?? Math.max(1, active.length),
    cfgDelta: patch?.cfgDelta ?? byKind("cfg"),
    dfgDelta: patch?.dfgDelta ?? byKind("dfg"),
    hardeningRegression:
      patch?.hardeningRegression ??
      clamp01(0.3 + (1 - byKind("hardening")) * 0.35),
    deployMode:
      patch?.deployMode ??
      (syncCount >= active.length / 2 ? "sync" : "async"),
    profile: profile ?? state().org.defaultProfile,
  };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function createAlert(input: {
  fleetId: string;
  monitorId?: string;
  title: string;
  severity?: AlertSeverity;
  mode?: ScoreMode;
  profile?: MonitorProfile;
  safetyInput?: Partial<SafetyInput>;
}): AlertEvent {
  const fleet = getFleet(input.fleetId);
  if (!fleet) throw new Error("fleet_not_found");
  const monitors = listMonitors(fleet.id);
  const monitor =
    monitors.find((m) => m.id === input.monitorId) ?? monitors[0];
  if (!monitor) throw new Error("monitor_not_found");
  const profile = input.profile ?? state().org.defaultProfile;
  const emb = inputFromFleet(fleet, monitors, input.safetyInput, profile);
  const quality =
    input.mode === "threshold"
      ? scoreThreshold(emb)
      : scoreStructural(emb);
  const readiness = readinessFromQuality(quality, emb);
  const suspicion = Math.max(
    1,
    Math.min(
      10,
      Math.round(
        quality.postureRegressionScore / 10 +
          (1 - emb.taskJustification) * 3,
      ),
    ),
  );
  const alert: AlertEvent = {
    id: randomUUID(),
    fleetId: fleet.id,
    monitorId: monitor.id,
    title: input.title.trim(),
    severity: input.severity ?? (suspicion >= 8 ? "critical" : "high"),
    status: "open",
    suspicion,
    detail: `Scored via ${quality.mode} monitor · catch ${quality.structuralCatchRate}`,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().alerts.unshift(alert);
  audit("operator", "alert.create", alert.title);
  return alert;
}

export function advanceAlert(
  id: string,
  status: AlertEvent["status"],
): AlertEvent {
  const alert = state().alerts.find((a) => a.id === id);
  if (!alert) throw new Error("alert_not_found");
  alert.status = status;
  alert.updatedAt = now();
  audit("operator", "alert.advance", `${alert.id} → ${status}`);
  return { ...alert };
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

export function exportAlertsJson(fleetId?: string): string {
  return JSON.stringify(listAlerts(fleetId), null, 2);
}

export function createCompare(input: {
  name: string;
  fleetId: string;
  safetyInput: SafetyInput;
}): CompareResult {
  const fleet = getFleet(input.fleetId);
  if (!fleet) throw new Error("fleet_not_found");
  const structural = scoreStructural(input.safetyInput);
  const threshold = scoreThreshold(input.safetyInput);
  let winner: CompareResult["winner"] = "tie";
  if (structural.overall > threshold.overall + 0.01) {
    winner = "structural";
  } else if (threshold.overall > structural.overall + 0.01) {
    winner = "threshold";
  }
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    fleetId: input.fleetId,
    input: input.safetyInput,
    structural,
    threshold,
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
    "Marketing landing with selling points",
    "Agent deployment fleet workspace",
    "Fleet search (kind / notes)",
    "Structural monitor roster",
    "Monitor active toggle",
    "Sync vs async deploy mode",
    "Regression alert console",
    "Structural monitoring plan score",
    "Unchecked / threshold-only baseline",
    "Balanced vs strict monitor profile",
    "Alert ack / resolve advance",
    "CFG / DFG / privilege check kinds",
    "Monitor coverage from active checks",
    "Structural vs threshold compare",
    "Compare winner badge + score bars",
    "Runs audit list",
    "CSV audit export",
    "JSON alert export",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotent ingest",
    "Bearer auth + rate limit",
    "Honesty fence + Sources",
    "Onboarding checklist on fleets",
    "Dual-impl goldens sample API",
    "Pagination on fleets / runs / audits",
    "Catch rate + sync block metrics",
    "Soft simulation disclaimer (not IFG brand)",
  ];
}
