import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreDynamicChargeRegulation,
  scoreFixedChargeBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ChargeBias,
  type ChargeKind,
  type GelKind,
  type SaltKind,
  type ScoreMode,
  type HydrogelInput,
  type HydrogelQuality,
} from "./domain/types";

export type {
  ChargeBias,
  ChargeKind,
  GelKind,
  SaltKind,
  ScoreMode,
  HydrogelInput,
  HydrogelQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type GelPack = {
  id: string;
  label: string;
  version: string;
  electrolyteFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type GelSpec = {
  id: string;
  packId: string;
  label: string;
  kind: GelKind;
  networkHint: string;
  permeabilityFloor: number;
  crosslinkDensity: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type ChargeSpec = {
  id: string;
  packId: string;
  label: string;
  kind: ChargeKind;
  regulationHint: string;
  pKaWindow: number;
  regulationFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type SaltRun = {
  id: string;
  packId: string;
  label: string;
  kind: SaltKind;
  saltHint: string;
  ionicStrengthFloor: number;
  mobilityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  gelId: string;
  chargeId: string;
  saltId: string;
  chargeRegulation: number;
  ionMobility: number;
  gelPermeability: number;
  swellingRatio: number;
  runNotes: string;
  status: EntityStatus;
  createdAt: string;
};

export type AuditEvent = {
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
  defaultChargeBias: ChargeBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type HydrogelCompare = {
  id: string;
  name: string;
  packId: string;
  gelId: string;
  chargeId: string;
  saltId: string;
  assayRunId: string;
  input: HydrogelInput;
  regulation: HydrogelQuality;
  fixed: HydrogelQuality;
  winner:
    | "dynamic_charge_regulation"
    | "fixed_charge_baseline"
    | "tie";
  gap: number;
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
  packs: GelPack[];
  gels: GelSpec[];
  charges: ChargeSpec[];
  salts: SaltRun[];
  assayRuns: AssayRun[];
  auditEvents: AuditEvent[];
  compares: HydrogelCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __ionHydrogelStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const gelId = "gel-demo";
  const chargeId = "charge-demo";
  const saltId = "salt-demo";
  const assayRunId = "assay-demo";
  return {
    org: {
      name: "Ion Hydrogel Org",
      webhookUrl: "",
      webhookSecret: "ion-hydrogel-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultChargeBias: "balanced",
      defaultMode: "dynamic_charge_regulation",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@ion-hydrogel.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Weak PE Gel Soft-Sim Pack",
        version: "2026.1",
        electrolyteFocus:
          "Dynamic charge regulation vs fixed-charge baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for gels, charge specs, and salt runs vs fixed soft-sim",
        createdAt: now(),
      },
    ],
    gels: [
      {
        id: gelId,
        packId,
        label: "Weak polyelectrolyte hydrogel",
        kind: "weak_polyelectrolyte",
        networkHint: "carboxylic,mesh,swelling",
        permeabilityFloor: 0.35,
        crosslinkDensity: 0.42,
        metricHint: "Gel permeability and mesh soft-sim",
        status: "active",
        notes:
          "Soft-sim gels — not wet-lab validated membrane manufacturing",
        createdAt: now(),
      },
    ],
    charges: [
      {
        id: chargeId,
        packId,
        label: "Dynamic charge regulation window",
        kind: "dynamic_regulation",
        regulationHint: "pKa,protonation,regulation",
        pKaWindow: 4.5,
        regulationFloor: 0.4,
        metricHint: "Charge regulation strength soft-sim",
        status: "active",
        notes: "Soft-sim charges — not live plant ionics",
        createdAt: now(),
      },
    ],
    salts: [
      {
        id: saltId,
        packId,
        label: "Monovalent NaCl electrolyte draft",
        kind: "monovalent_nacl",
        saltHint: "NaCl,ionic-strength,mobility",
        ionicStrengthFloor: 0.35,
        mobilityFloor: 0.4,
        metricHint: "Salt load and ion mobility soft-sim",
        status: "active",
        notes:
          "Soft-sim salts — not commercial battery cell qualification / not authors’ hydrogel system",
        createdAt: now(),
      },
    ],
    assayRuns: [
      {
        id: assayRunId,
        packId,
        gelId,
        chargeId,
        saltId,
        chargeRegulation: 0.62,
        ionMobility: 0.7,
        gelPermeability: 0.74,
        swellingRatio: 0.68,
        runNotes:
          "Dynamic regulation looks strong but fixed charge still leads when mobility is thin",
        status: "active",
        createdAt: now(),
      },
    ],
    auditEvents: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail:
          "Demo pack, gels, charges, salts, and assay run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__ionHydrogelStore) g.__ionHydrogelStore = seed();
  return g.__ionHydrogelStore;
}

function audit(actor: string, action: string, detail: string): void {
  state().auditEvents.unshift({
    id: randomUUID(),
    at: now(),
    actor,
    action,
    detail,
  });
}

export function resetStore(): void {
  g.__ionHydrogelStore = seed();
}

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  const org = state().org;
  if (patch.name !== undefined) org.name = patch.name;
  if (patch.webhookUrl !== undefined) org.webhookUrl = patch.webhookUrl;
  if (patch.webhookSecret !== undefined) org.webhookSecret = patch.webhookSecret;
  if (patch.bearerToken !== undefined) org.bearerToken = patch.bearerToken;
  if (patch.defaultChargeBias !== undefined) {
    org.defaultChargeBias = patch.defaultChargeBias;
  }
  if (patch.defaultMode !== undefined) org.defaultMode = patch.defaultMode;
  if (patch.rateLimitPerMinute !== undefined) {
    org.rateLimitPerMinute = patch.rateLimitPerMinute;
  }
  audit("owner", "org.update", JSON.stringify(patch));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole): Member {
  const member: Member = { id: randomUUID(), email, role };
  state().members.push(member);
  audit("owner", "member.invite", `${email} as ${role}`);
  return member;
}

export function listPacks(opts?: {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: GelPack[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.electrolyteFocus.toLowerCase().includes(q) ||
        p.version.toLowerCase().includes(q),
    );
  }
  if (opts?.status) {
    items = items.filter((p) => p.status === opts.status);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPack(input: {
  label: string;
  version: string;
  electrolyteFocus: string;
  sessionBudget?: number;
  notes?: string;
}): GelPack {
  const pack: GelPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    electrolyteFocus: input.electrolyteFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): GelPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

function listEntity<
  T extends {
    label: string;
    id: string;
    packId: string;
    status: string;
    metricHint?: string;
  },
>(
  rows: T[],
  opts?: {
    q?: string;
    packId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    extra?: (row: T, q: string) => boolean;
  },
): { items: T[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...rows];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        (m.metricHint?.toLowerCase().includes(q) ?? false) ||
        m.id.includes(q) ||
        (opts.extra?.(m, q) ?? false),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function listGels(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().gels, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.networkHint.toLowerCase().includes(q),
  });
}

export function createGel(input: {
  packId: string;
  label: string;
  kind: GelKind;
  networkHint: string;
  permeabilityFloor: number;
  crosslinkDensity: number;
  metricHint?: string;
  notes?: string;
}): GelSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: GelSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    networkHint: input.networkHint,
    permeabilityFloor: input.permeabilityFloor,
    crosslinkDensity: input.crosslinkDensity,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().gels.unshift(row);
  audit("evaluator", "gel.create", row.label);
  return row;
}

export function archiveGel(id: string): GelSpec | null {
  const row = state().gels.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "gel.archive", id);
  return row;
}

export function listCharges(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().charges, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.regulationHint.toLowerCase().includes(q),
  });
}

export function createCharge(input: {
  packId: string;
  label: string;
  kind: ChargeKind;
  regulationHint: string;
  pKaWindow: number;
  regulationFloor: number;
  metricHint?: string;
  notes?: string;
}): ChargeSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ChargeSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    regulationHint: input.regulationHint,
    pKaWindow: input.pKaWindow,
    regulationFloor: input.regulationFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().charges.unshift(row);
  audit("evaluator", "charge.create", row.label);
  return row;
}

export function archiveCharge(id: string): ChargeSpec | null {
  const row = state().charges.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "charge.archive", id);
  return row;
}

export function listSalts(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().salts, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.saltHint.toLowerCase().includes(q),
  });
}

export function createSalt(input: {
  packId: string;
  label: string;
  kind: SaltKind;
  saltHint: string;
  ionicStrengthFloor: number;
  mobilityFloor: number;
  metricHint?: string;
  notes?: string;
}): SaltRun | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: SaltRun = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    saltHint: input.saltHint,
    ionicStrengthFloor: input.ionicStrengthFloor,
    mobilityFloor: input.mobilityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().salts.unshift(row);
  audit("evaluator", "salt.create", row.label);
  return row;
}

export function archiveSalt(id: string): SaltRun | null {
  const row = state().salts.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "salt.archive", id);
  return row;
}

export function listAssayRuns(opts?: {
  packId?: string;
  gelId?: string;
  chargeId?: string;
  saltId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AssayRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().assayRuns];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.gelId) items = items.filter((r) => r.gelId === opts.gelId);
  if (opts?.chargeId)
    items = items.filter((r) => r.chargeId === opts.chargeId);
  if (opts?.saltId) items = items.filter((r) => r.saltId === opts.saltId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssayRun(input: {
  packId: string;
  gelId: string;
  chargeId: string;
  saltId: string;
  chargeRegulation: number;
  ionMobility: number;
  gelPermeability: number;
  swellingRatio: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().gels.some((m) => m.id === input.gelId)) return null;
  if (!state().charges.some((m) => m.id === input.chargeId)) return null;
  if (!state().salts.some((m) => m.id === input.saltId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    gelId: input.gelId,
    chargeId: input.chargeId,
    saltId: input.saltId,
    chargeRegulation: clamp(input.chargeRegulation, 0, 1),
    ionMobility: clamp(input.ionMobility, 0, 1),
    gelPermeability: clamp(input.gelPermeability, 0, 1),
    swellingRatio: clamp(input.swellingRatio, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().assayRuns.unshift(run);
  audit("evaluator", "assay.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): HydrogelCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  gelId: string;
  chargeId: string;
  saltId: string;
  assayRunId: string;
  chargeBias?: ChargeBias;
  bias?: ChargeBias;
  fixedChargeDensity?: number;
  saltLoad?: number;
  bindingStrength?: number;
  overclaimRisk?: number;
}): HydrogelCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const gel = state().gels.find((m) => m.id === input.gelId);
  const charge = state().charges.find((m) => m.id === input.chargeId);
  const salt = state().salts.find((m) => m.id === input.saltId);
  const assayRun = state().assayRuns.find((r) => r.id === input.assayRunId);
  if (!pack || !gel || !charge || !salt || !assayRun) return null;

  const span = Math.max(0.05, 1 - charge.regulationFloor);
  const hydrogelInput: HydrogelInput = {
    chargeRegulation: clamp(assayRun.chargeRegulation, 0, 1),
    fixedChargeDensity: input.fixedChargeDensity ?? 0.82,
    ionMobility: clamp(assayRun.ionMobility, 0, 1),
    bindingStrength: input.bindingStrength ?? 0.7,
    saltLoad: input.saltLoad ?? clamp(0.2 + span * 0.5, 0, 1),
    gelPermeability: clamp(assayRun.gelPermeability, 0, 1),
    swellingRatio: clamp(assayRun.swellingRatio, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    chargeBias: input.chargeBias ?? input.bias ?? state().org.defaultChargeBias,
    profile: "dynamic_charge_regulation",
  };

  const regulation = scoreDynamicChargeRegulation({
    ...hydrogelInput,
    profile: "dynamic_charge_regulation",
  });
  const fixed = scoreFixedChargeBaseline({
    ...hydrogelInput,
    profile: "fixed_charge_baseline",
  });
  const gap = Math.abs(regulation.overall - fixed.overall);
  let winner: HydrogelCompare["winner"] = "tie";
  if (regulation.overall > fixed.overall + 0.5) {
    winner = "dynamic_charge_regulation";
  } else if (fixed.overall > regulation.overall + 0.5) {
    winner = "fixed_charge_baseline";
  }

  const compare: HydrogelCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    gelId: gel.id,
    chargeId: charge.id,
    saltId: salt.id,
    assayRunId: assayRun.id,
    input: hydrogelInput,
    regulation,
    fixed,
    winner,
    gap: round2(gap),
    createdAt: now(),
  };
  state().compares.unshift(compare);
  audit(
    "evaluator",
    "compare.run",
    `${compare.name} winner=${winner} gap=${compare.gap}`,
  );
  return compare;
}

export function getScoreboard(): HydrogelCompare[] {
  return [...state().compares].sort(
    (a, b) => b.regulation.overall - a.regulation.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      gels: state().gels,
      charges: state().charges,
      salts: state().salts,
      assayRuns: state().assayRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,regulationOverall,fixedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.regulation.overall},${c.fixed.overall},${c.createdAt}`,
    ),
  ];
  return rows.join("\n");
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  const expected = state().org.bearerToken;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
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
  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
  };
}

export function ingestWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const body = JSON.stringify(payload ?? {});
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  if (!signature || signature !== `sha256=${expected}`) {
    return { ok: false, error: "bad_signature" };
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, id: existing.id };
  const event: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(event);
  audit("webhook", "webhook.ingest", idempotencyKey);
  return { ok: true, id: event.id };
}

export function featureInventory(): { id: string; name: string }[] {
  return [
    { id: "landing", name: "Marketing landing" },
    { id: "pricing", name: "Pricing tiers" },
    { id: "demo", name: "Guided demo" },
    { id: "onboarding", name: "Onboarding checklist" },
    { id: "flows", name: "Multi-flow index" },
    { id: "gel-packs", name: "Gel pack registry" },
    { id: "pack-versions", name: "Versioned gel packs" },
    { id: "gels", name: "Gel network registry" },
    { id: "gel-editor", name: "Gel network editor" },
    { id: "gel-search", name: "Gel search and filter" },
    { id: "charges", name: "Charge regulation configs" },
    { id: "charge-editor", name: "Charge regulation editor" },
    { id: "salts", name: "Salt run registry" },
    { id: "salt-filters", name: "Salt electrolyte filters" },
    { id: "assay-runs", name: "Assay run soft-sim" },
    { id: "charge-bias", name: "Charge bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Dynamic charge regulation vs fixed-charge baseline compare",
    },
    { id: "delta-view", name: "Ion transport delta view" },
    { id: "scoreboard", name: "Hydrogel scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not membrane manufacturing / not live plant ionics / not battery cell qualification",
    },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "HMAC webhook ingest" },
    { id: "export-json", name: "Export packs JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "pagination", name: "Pagination on list APIs" },
    { id: "search", name: "Search across packs and gels" },
    { id: "assays-page", name: "Assay runs workspace" },
  ];
}

export function scorePreview(input: HydrogelInput): {
  regulation: HydrogelQuality;
  fixed: HydrogelQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const regulation = scoreDynamicChargeRegulation({
    ...input,
    profile: "dynamic_charge_regulation",
  });
  const fixed = scoreFixedChargeBaseline({
    ...input,
    profile: "fixed_charge_baseline",
  });
  return {
    regulation,
    fixed,
    readiness: readinessFromQuality(regulation.overall),
  };
}
