import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scorePrefsOnly, scoreRulesPrefs } from "./domain/pack";
import {
  readinessFromQuality,
  type PackInput,
  type PackQuality,
  type PackReadiness,
  type ScoreMode,
  type TravelerKind,
} from "./domain/types";

export type {
  PackInput,
  PackQuality,
  PackReadiness,
  ScoreMode,
  TravelerKind,
};

export type MemberRole = "owner" | "planner" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type TripPurpose = "business" | "leisure" | "adventure" | "family";

export type TravelerProfile = {
  id: string;
  name: string;
  destination: string;
  purpose: TripPurpose;
  tripDays: number;
  notes: string;
  createdAt: string;
};

export type RuleKind = "safety" | "luggage" | "dependency" | "policy";

export type HardRule = {
  id: string;
  profileId: string;
  name: string;
  kind: RuleKind;
  severity: number;
  constraint: string;
  notes: string;
  createdAt: string;
};

export type SoftPreference = {
  id: string;
  profileId: string;
  name: string;
  category: string;
  weight: number;
  notes: string;
  createdAt: string;
};

export type ChecklistStatus = "draft" | "ready" | "archived";

export type PackChecklist = {
  id: string;
  profileId: string;
  name: string;
  status: ChecklistStatus;
  itemCount: number;
  notes: string;
  createdAt: string;
};

export type OptimizeStatus = "queued" | "running" | "done";

export type OptimizeRun = {
  id: string;
  profileId: string;
  name: string;
  status: OptimizeStatus;
  preferenceLift: number;
  ruleHold: number;
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
  defaultProfile: TravelerKind;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  profileId: string;
  input: PackInput;
  rulesPrefs: PackQuality;
  prefsOnly: PackQuality;
  winner: "rules_prefs" | "prefs_only" | "tie";
  createdAt: string;
};

export type PlanRun = {
  id: string;
  profileId: string;
  name: string;
  mode: ScoreMode;
  profile: TravelerKind;
  quality?: PackQuality;
  readiness?: PackReadiness;
  createdAt: string;
  updatedAt: string;
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
  profiles: TravelerProfile[];
  rules: HardRule[];
  preferences: SoftPreference[];
  checklists: PackChecklist[];
  optimizes: OptimizeRun[];
  plans: PlanRun[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __prsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): PackInput {
  return {
    safetyRuleCoverage: 0.82,
    luggageLimitHeadroom: 0.74,
    dependencySatisfaction: 0.78,
    preferenceFit: 0.7,
    ruleStrictness: 0.8,
    preferenceWeight: 0.62,
    itemCount: 28,
    liquidVolumeRisk: 0.22,
    batteryPolicyCompliance: 0.86,
    weatherAdaptability: 0.72,
    tripDays: 7,
    profile: "compliant",
  };
}

function seed(): StoreState {
  const profileId = "profile-demo";
  const input = seedInput();
  const quality = scoreRulesPrefs(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Travel Pack Org",
      webhookUrl: "",
      webhookSecret: "prs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "compliant",
      defaultMode: "rules_prefs",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "planner@studio.local", role: "planner" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    profiles: [
      {
        id: profileId,
        name: "Alex · Lisbon weekender",
        destination: "Lisbon",
        purpose: "leisure",
        tripDays: 5,
        notes: "Demo traveler for rule-compliant packing",
        createdAt: now(),
      },
    ],
    rules: [
      {
        id: "rule-demo",
        profileId,
        name: "Cabin liquids ≤100ml",
        kind: "safety",
        severity: 0.9,
        constraint: "liquids_max_100ml_cabin",
        notes: "Hard TSA-style cabin liquid rule",
        createdAt: now(),
      },
    ],
    preferences: [
      {
        id: "pref-demo",
        profileId,
        name: "Prefer breathable layers",
        category: "clothing",
        weight: 0.7,
        notes: "Soft climate preference",
        createdAt: now(),
      },
    ],
    checklists: [
      {
        id: "checklist-demo",
        profileId,
        name: "Lisbon · rule-compliant draft",
        status: "ready",
        itemCount: 24,
        notes: "Demo checklist after hard-rule pass",
        createdAt: now(),
      },
    ],
    optimizes: [
      {
        id: "opt-demo",
        profileId,
        name: "Lift clothing prefs under luggage cap",
        status: "done",
        preferenceLift: 0.12,
        ruleHold: 0.98,
        notes: "Demo optimize pass",
        createdAt: now(),
      },
    ],
    plans: [
      {
        id: "plan-demo",
        profileId,
        name: "Rules + prefs packing plan",
        mode: "rules_prefs",
        profile: "compliant",
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
        detail: "Demo profile, rule, preference, checklist, and optimize loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__prsStore) g.__prsStore = seed();
  return g.__prsStore;
}

export function resetStore(): void {
  g.__prsStore = seed();
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

export function listProfiles(q?: string, page = 1, pageSize = 50): {
  items: TravelerProfile[];
  total: number;
  page: number;
  pageSize: number;
} {
  let rows = [...state().profiles].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.destination.toLowerCase().includes(needle) ||
        r.purpose.toLowerCase().includes(needle) ||
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

export function createProfile(input: {
  name: string;
  destination: string;
  purpose: TripPurpose;
  tripDays?: number;
  notes?: string;
}): TravelerProfile {
  const row: TravelerProfile = {
    id: randomUUID(),
    name: input.name.trim(),
    destination: input.destination.trim(),
    purpose: input.purpose,
    tripDays: Math.max(1, Math.min(30, Math.round(input.tripDays ?? 5))),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().profiles.unshift(row);
  audit("planner", "profile.create", row.name);
  return row;
}

export function getProfile(id: string): TravelerProfile | undefined {
  return state().profiles.find((p) => p.id === id);
}

export function listRules(profileId?: string, q?: string): HardRule[] {
  let rows = [...state().rules];
  if (profileId) rows = rows.filter((r) => r.profileId === profileId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.kind.toLowerCase().includes(needle) ||
        r.constraint.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createRule(input: {
  profileId: string;
  name: string;
  kind: RuleKind;
  severity?: number;
  constraint: string;
  notes?: string;
}): HardRule {
  const profile = getProfile(input.profileId);
  if (!profile) throw new Error("profile_not_found");
  const row: HardRule = {
    id: randomUUID(),
    profileId: input.profileId,
    name: input.name.trim(),
    kind: input.kind,
    severity: Math.max(0, Math.min(1, input.severity ?? 0.7)),
    constraint: input.constraint.trim(),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().rules.unshift(row);
  audit("planner", "rule.create", row.name);
  return row;
}

export function listPreferences(profileId?: string, q?: string): SoftPreference[] {
  let rows = [...state().preferences];
  if (profileId) rows = rows.filter((p) => p.profileId === profileId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPreference(input: {
  profileId: string;
  name: string;
  category: string;
  weight?: number;
  notes?: string;
}): SoftPreference {
  const profile = getProfile(input.profileId);
  if (!profile) throw new Error("profile_not_found");
  const row: SoftPreference = {
    id: randomUUID(),
    profileId: input.profileId,
    name: input.name.trim(),
    category: input.category.trim(),
    weight: Math.max(0, Math.min(1, input.weight ?? 0.5)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().preferences.unshift(row);
  audit("planner", "preference.create", row.name);
  return row;
}

export function listChecklists(profileId?: string): PackChecklist[] {
  let rows = [...state().checklists];
  if (profileId) rows = rows.filter((c) => c.profileId === profileId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createChecklist(input: {
  profileId: string;
  name: string;
  status?: ChecklistStatus;
  itemCount?: number;
  notes?: string;
}): PackChecklist {
  const profile = getProfile(input.profileId);
  if (!profile) throw new Error("profile_not_found");
  const row: PackChecklist = {
    id: randomUUID(),
    profileId: input.profileId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    itemCount: Math.max(1, Math.round(input.itemCount ?? 20)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().checklists.unshift(row);
  audit("planner", "checklist.create", row.name);
  return row;
}

export function listOptimizes(profileId?: string): OptimizeRun[] {
  let rows = [...state().optimizes];
  if (profileId) rows = rows.filter((o) => o.profileId === profileId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createOptimize(input: {
  profileId: string;
  name: string;
  status?: OptimizeStatus;
  preferenceLift?: number;
  ruleHold?: number;
  notes?: string;
}): OptimizeRun {
  const profile = getProfile(input.profileId);
  if (!profile) throw new Error("profile_not_found");
  const row: OptimizeRun = {
    id: randomUUID(),
    profileId: input.profileId,
    name: input.name.trim(),
    status: input.status ?? "done",
    preferenceLift: Math.max(0, Math.min(1, input.preferenceLift ?? 0.1)),
    ruleHold: Math.max(0, Math.min(1, input.ruleHold ?? 0.95)),
    notes: (input.notes ?? "").trim(),
    createdAt: now(),
  };
  state().optimizes.unshift(row);
  audit("planner", "optimize.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromProfile(
  profileId: string,
  patch?: Partial<PackInput>,
  profileKind?: TravelerKind,
): PackInput {
  const base = seedInput();
  const profile = getProfile(profileId);
  const rules = listRules(profileId);
  const prefs = listPreferences(profileId);
  const checklists = listChecklists(profileId);
  const optimizes = listOptimizes(profileId);
  const avgSeverity =
    rules.length > 0
      ? rules.reduce((s, r) => s + r.severity, 0) / rules.length
      : 0.55;
  const avgWeight =
    prefs.length > 0
      ? prefs.reduce((s, p) => s + p.weight, 0) / prefs.length
      : 0.5;
  const items =
    checklists.length > 0
      ? checklists.reduce((s, c) => s + c.itemCount, 0) / checklists.length
      : 22;
  const lift =
    optimizes.length > 0
      ? optimizes.reduce((s, o) => s + o.preferenceLift, 0) / optimizes.length
      : 0.08;
  const hold =
    optimizes.length > 0
      ? optimizes.reduce((s, o) => s + o.ruleHold, 0) / optimizes.length
      : 0.9;
  return {
    ...base,
    ...patch,
    safetyRuleCoverage:
      patch?.safetyRuleCoverage ??
      clamp01(0.4 + Math.min(0.5, rules.length * 0.12) + avgSeverity * 0.15),
    luggageLimitHeadroom:
      patch?.luggageLimitHeadroom ??
      clamp01(0.45 + hold * 0.35 - Math.min(0.25, items / 200)),
    dependencySatisfaction:
      patch?.dependencySatisfaction ??
      clamp01(0.4 + Math.min(0.4, rules.filter((r) => r.kind === "dependency").length * 0.2)),
    preferenceFit:
      patch?.preferenceFit ?? clamp01(0.4 + avgWeight * 0.35 + lift * 0.4),
    ruleStrictness: patch?.ruleStrictness ?? clamp01(0.45 + avgSeverity * 0.4),
    preferenceWeight: patch?.preferenceWeight ?? clamp01(0.35 + avgWeight * 0.45),
    itemCount: patch?.itemCount ?? Math.max(4, Math.min(80, Math.round(items))),
    tripDays: patch?.tripDays ?? profile?.tripDays ?? 5,
    profile: profileKind ?? state().org.defaultProfile,
  };
}

export function listPlans(profileId?: string): PlanRun[] {
  let rows = [...state().plans];
  if (profileId) rows = rows.filter((p) => p.profileId === profileId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPlan(input: {
  profileId: string;
  name: string;
  mode?: ScoreMode;
  profile?: TravelerKind;
  packInput?: Partial<PackInput>;
}): PlanRun {
  const traveler = getProfile(input.profileId);
  if (!traveler) throw new Error("profile_not_found");
  const profile = input.profile ?? state().org.defaultProfile;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromProfile(input.profileId, input.packInput, profile);
  const quality =
    mode === "prefs_only" ? scorePrefsOnly(emb) : scoreRulesPrefs(emb);
  const readiness = readinessFromQuality(quality, emb);
  const row: PlanRun = {
    id: randomUUID(),
    profileId: input.profileId,
    name: input.name.trim(),
    mode,
    profile,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().plans.unshift(row);
  audit("planner", "plan.create", `${row.name} (${row.mode})`);
  return row;
}

export function listAudits(): AuditEntry[] {
  return [...state().audits];
}

export function exportAuditsCsv(): string {
  const header = "id,at,actor,action,detail";
  const lines = listAudits().map(
    (a) =>
      `${a.id},${a.at},${a.actor},${a.action},"${a.detail.replace(/"/g, '""')}"`,
  );
  return [header, ...lines].join("\n");
}

export function exportChecklistsJson(profileId?: string): string {
  return JSON.stringify(listChecklists(profileId), null, 2);
}

export function createCompare(input: {
  name: string;
  profileId: string;
  packInput?: Partial<PackInput>;
}): CompareResult {
  const traveler = getProfile(input.profileId);
  if (!traveler) throw new Error("profile_not_found");
  const emb = inputFromProfile(input.profileId, input.packInput);
  const rulesPrefs = scoreRulesPrefs(emb);
  const prefsOnly = scorePrefsOnly(emb);
  let winner: CompareResult["winner"] = "tie";
  if (rulesPrefs.overall > prefsOnly.overall + 0.5) winner = "rules_prefs";
  else if (prefsOnly.overall > rulesPrefs.overall + 0.5) winner = "prefs_only";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim() || `Compare · ${traveler.name}`,
    profileId: input.profileId,
    input: emb,
    rulesPrefs,
    prefsOnly,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("planner", "compare.create", `${row.name} → ${row.winner}`);
  return row;
}

export function listCompares(): CompareResult[] {
  return [...state().compares].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function checkBearer(auth: string | null): boolean {
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === state().org.bearerToken;
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const s = state();
  const nowMs = Date.now();
  if (nowMs - s.rateBucket.windowStart > 60_000) {
    s.rateBucket = { windowStart: nowMs, count: 0 };
  }
  s.rateBucket.count += 1;
  const limit = s.org.rateLimitPerMinute;
  return {
    ok: s.rateBucket.count <= limit,
    remaining: Math.max(0, limit - s.rateBucket.count),
  };
}

export function signWebhook(body: string): string {
  return createHmac("sha256", state().org.webhookSecret)
    .update(body)
    .digest("hex");
}

export function ingestWebhook(
  body: string,
  signature: string | null,
  idempotencyKey: string,
): { ok: boolean; duplicate: boolean; id?: string; error?: string } {
  const expected = signWebhook(body);
  const sig = (signature ?? "").replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(sig, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, duplicate: false, error: "invalid_signature" };
    }
  } catch {
    return { ok: false, duplicate: false, error: "invalid_signature" };
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) {
    return { ok: true, duplicate: true, id: existing.id };
  }
  let payload: unknown = body;
  try {
    payload = JSON.parse(body);
  } catch {
    /* keep raw */
  }
  const row: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(row);
  audit("webhook", "ingest", idempotencyKey);
  return { ok: true, duplicate: false, id: row.id };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing for travel packing teams",
    "Traveler profile registry",
    "Hard rules (safety, luggage, deps)",
    "Soft preference capture",
    "Rule-compliant checklist generate",
    "Rules+prefs plan score",
    "Prefs-only baseline score",
    "Rules+prefs vs prefs-only compare",
    "Preference learning / optimize passes",
    "Pack readiness checklist",
    "Org settings",
    "Member invite",
    "Webhook HMAC + idempotency",
    "Bearer auth",
    "Rate-limit feedback",
    "Audit log",
    "CSV audit export",
    "JSON checklist export",
    "Profile search + pagination",
    "Honesty fence + Sources",
    "Features inventory API",
    "Rule gap / preference gap signals",
    "Onboarding checklist on profiles",
    "Offline try.html demo",
    "In-app guide link",
  ];
}

export function sampleGoldenInput(): PackInput {
  return seedInput();
}
