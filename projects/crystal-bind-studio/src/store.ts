import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreMultimodal, scoreSingle } from "./domain/bind";
import {
  readinessFromQuality,
  type BindInput,
  type BindProfile,
  type BindQuality,
  type ModalityBias,
  type ScoreMode,
} from "./domain/types";

export type {
  BindInput,
  BindProfile,
  BindQuality,
  ModalityBias,
  ScoreMode,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "draft" | "ready" | "archived";

export type CrystalPack = {
  id: string;
  name: string;
  formula: string;
  spaceGroup: string;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type StructureLane = {
  id: string;
  packId: string;
  name: string;
  fidelity: number;
  atomCountProxy: number;
  notes: string;
  createdAt: string;
};

export type DiffractionLane = {
  id: string;
  packId: string;
  name: string;
  matchScore: number;
  peakRichness: number;
  notes: string;
  createdAt: string;
};

export type DosLane = {
  id: string;
  packId: string;
  name: string;
  alignment: number;
  bandGapProxy: number;
  notes: string;
  createdAt: string;
};

export type LanguageLane = {
  id: string;
  packId: string;
  name: string;
  clarity: number;
  descriptorText: string;
  notes: string;
  createdAt: string;
};

export type BindStatus = "draft" | "projected" | "reviewed" | "archived";

export type BindProjection = {
  id: string;
  packId: string;
  name: string;
  status: BindStatus;
  coherence: number;
  crossModalAgreement: number;
  noiseLevel: number;
  retrievalPrecision: number;
  modalityBias: ModalityBias;
  profile: BindProfile;
  multimodalOverall: number | null;
  singleOverall: number | null;
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
  defaultProfile: BindProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type RetrieveCompare = {
  id: string;
  name: string;
  packId: string;
  bindId: string;
  input: BindInput;
  multimodal: BindQuality;
  single: BindQuality;
  winner: "multimodal_bind" | "single_modality" | "tie";
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
  packs: CrystalPack[];
  structures: StructureLane[];
  diffractions: DiffractionLane[];
  doses: DosLane[];
  languages: LanguageLane[];
  binds: BindProjection[];
  audits: AuditEntry[];
  retrieves: RetrieveCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __cbsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): BindInput {
  return {
    structureFidelity: 0.78,
    diffractionMatch: 0.74,
    dosAlignment: 0.71,
    languageClarity: 0.76,
    bindCoherence: 0.73,
    crossModalAgreement: 0.7,
    retrievalPrecision: 0.72,
    noiseLevel: 0.18,
    modalityBias: "balanced",
    profile: "multimodal",
  };
}

function seed(): StoreState {
  const packId = "pack-demo";
  const bindId = "bind-demo";
  return {
    org: {
      name: "Crystal Bind Org",
      webhookUrl: "",
      webhookSecret: "cbs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "multimodal",
      defaultMode: "multimodal_bind",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@crystal-bind.local", role: "owner" },
      { id: "m2", email: "reader@crystal-bind.local", role: "reader" },
      { id: "m3", email: "viewer@crystal-bind.local", role: "viewer" },
    ],
    packs: [
      {
        id: packId,
        name: "TiO2 anatase pack",
        formula: "TiO2",
        spaceGroup: "I41/amd",
        status: "ready",
        notes: "Seed crystal pack for multimodal bind",
        createdAt: now(),
      },
    ],
    structures: [
      {
        id: "struct-demo",
        packId,
        name: "Anatase lattice lane",
        fidelity: 0.78,
        atomCountProxy: 12,
        notes: "Seed structure descriptor",
        createdAt: now(),
      },
    ],
    diffractions: [
      {
        id: "diff-demo",
        packId,
        name: "PXRD fingerprint lane",
        matchScore: 0.74,
        peakRichness: 0.68,
        notes: "Seed diffraction soft-sim",
        createdAt: now(),
      },
    ],
    doses: [
      {
        id: "dos-demo",
        packId,
        name: "DOS alignment lane",
        alignment: 0.71,
        bandGapProxy: 3.2,
        notes: "Seed DOS soft-sim",
        createdAt: now(),
      },
    ],
    languages: [
      {
        id: "lang-demo",
        packId,
        name: "Coatings brief descriptor",
        clarity: 0.76,
        descriptorText: "Anatase TiO2 photocatalytic coating candidate",
        notes: "Seed language lane",
        createdAt: now(),
      },
    ],
    binds: [
      {
        id: bindId,
        packId,
        name: "Four-lane bind projection",
        status: "projected",
        coherence: 0.73,
        crossModalAgreement: 0.7,
        noiseLevel: 0.18,
        retrievalPrecision: 0.72,
        modalityBias: "balanced",
        profile: "multimodal",
        multimodalOverall: null,
        singleOverall: null,
        notes: "Seed bind projection",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: randomUUID(),
        at: now(),
        actor: "system",
        action: "store.seed",
        detail: "Crystal Bind Studio seed state",
      },
    ],
    retrieves: [],
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

export function listPacks(q?: string, page = 1, pageSize = 20, status?: PackStatus) {
  let rows = [...state().packs];
  if (status) rows = rows.filter((p) => p.status === status);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.formula.toLowerCase().includes(needle) ||
        p.notes.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createPack(input: {
  name: string;
  formula?: string;
  spaceGroup?: string;
  status?: PackStatus;
  notes?: string;
}): CrystalPack {
  const row: CrystalPack = {
    id: randomUUID(),
    name: input.name.trim(),
    formula: input.formula?.trim() || "CxHyOz",
    spaceGroup: input.spaceGroup?.trim() || "P1",
    status: input.status ?? "draft",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().packs.unshift(row);
  audit("owner", "pack.create", row.id);
  return row;
}

export function listStructures(q?: string, page = 1, pageSize = 20, packId?: string) {
  let rows = [...state().structures];
  if (packId) rows = rows.filter((r) => r.packId === packId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createStructure(input: {
  packId: string;
  name: string;
  fidelity?: number;
  atomCountProxy?: number;
  notes?: string;
}): StructureLane {
  if (!state().packs.some((p) => p.id === input.packId)) {
    throw new Error("pack_not_found");
  }
  const row: StructureLane = {
    id: randomUUID(),
    packId: input.packId,
    name: input.name.trim(),
    fidelity: input.fidelity ?? 0.7,
    atomCountProxy: input.atomCountProxy ?? 8,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().structures.unshift(row);
  audit("owner", "structure.create", row.id);
  return row;
}

export function listDiffractions(q?: string, page = 1, pageSize = 20, packId?: string) {
  let rows = [...state().diffractions];
  if (packId) rows = rows.filter((r) => r.packId === packId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createDiffraction(input: {
  packId: string;
  name: string;
  matchScore?: number;
  peakRichness?: number;
  notes?: string;
}): DiffractionLane {
  if (!state().packs.some((p) => p.id === input.packId)) {
    throw new Error("pack_not_found");
  }
  const row: DiffractionLane = {
    id: randomUUID(),
    packId: input.packId,
    name: input.name.trim(),
    matchScore: input.matchScore ?? 0.7,
    peakRichness: input.peakRichness ?? 0.65,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().diffractions.unshift(row);
  audit("owner", "diffraction.create", row.id);
  return row;
}

export function listDoses(q?: string, page = 1, pageSize = 20, packId?: string) {
  let rows = [...state().doses];
  if (packId) rows = rows.filter((r) => r.packId === packId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createDos(input: {
  packId: string;
  name: string;
  alignment?: number;
  bandGapProxy?: number;
  notes?: string;
}): DosLane {
  if (!state().packs.some((p) => p.id === input.packId)) {
    throw new Error("pack_not_found");
  }
  const row: DosLane = {
    id: randomUUID(),
    packId: input.packId,
    name: input.name.trim(),
    alignment: input.alignment ?? 0.7,
    bandGapProxy: input.bandGapProxy ?? 2.5,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().doses.unshift(row);
  audit("owner", "dos.create", row.id);
  return row;
}

export function listLanguages(q?: string, page = 1, pageSize = 20, packId?: string) {
  let rows = [...state().languages];
  if (packId) rows = rows.filter((r) => r.packId === packId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.descriptorText.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createLanguage(input: {
  packId: string;
  name: string;
  clarity?: number;
  descriptorText?: string;
  notes?: string;
}): LanguageLane {
  if (!state().packs.some((p) => p.id === input.packId)) {
    throw new Error("pack_not_found");
  }
  const row: LanguageLane = {
    id: randomUUID(),
    packId: input.packId,
    name: input.name.trim(),
    clarity: input.clarity ?? 0.7,
    descriptorText: input.descriptorText?.trim() || "",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().languages.unshift(row);
  audit("owner", "language.create", row.id);
  return row;
}

export function listBinds(q?: string, page = 1, pageSize = 20, packId?: string) {
  let rows = [...state().binds];
  if (packId) rows = rows.filter((r) => r.packId === packId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createBind(input: {
  packId: string;
  name: string;
  status?: BindStatus;
  coherence?: number;
  crossModalAgreement?: number;
  noiseLevel?: number;
  retrievalPrecision?: number;
  modalityBias?: ModalityBias;
  profile?: BindProfile;
  notes?: string;
}): BindProjection {
  if (!state().packs.some((p) => p.id === input.packId)) {
    throw new Error("pack_not_found");
  }
  const row: BindProjection = {
    id: randomUUID(),
    packId: input.packId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    coherence: input.coherence ?? 0.7,
    crossModalAgreement: input.crossModalAgreement ?? 0.65,
    noiseLevel: input.noiseLevel ?? 0.2,
    retrievalPrecision: input.retrievalPrecision ?? 0.7,
    modalityBias: input.modalityBias ?? "balanced",
    profile: input.profile ?? "multimodal",
    multimodalOverall: null,
    singleOverall: null,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().binds.unshift(row);
  audit("owner", "bind.create", row.id);
  return row;
}

function inputFromBind(row: BindProjection): BindInput {
  const structure =
    state().structures.find((s) => s.packId === row.packId)?.fidelity ?? 0.65;
  const diffraction =
    state().diffractions.find((s) => s.packId === row.packId)?.matchScore ?? 0.65;
  const dos =
    state().doses.find((s) => s.packId === row.packId)?.alignment ?? 0.65;
  const language =
    state().languages.find((s) => s.packId === row.packId)?.clarity ?? 0.65;
  return {
    structureFidelity: structure,
    diffractionMatch: diffraction,
    dosAlignment: dos,
    languageClarity: language,
    bindCoherence: row.coherence,
    crossModalAgreement: row.crossModalAgreement,
    retrievalPrecision: row.retrievalPrecision,
    noiseLevel: row.noiseLevel,
    modalityBias: row.modalityBias,
    profile: row.profile,
  };
}

export function scoreBind(id: string): BindProjection {
  const row = state().binds.find((p) => p.id === id);
  if (!row) throw new Error("bind_not_found");
  const input = inputFromBind(row);
  const multimodal = scoreMultimodal({ ...input, profile: "multimodal" });
  const single = scoreSingle({ ...input, profile: "single" });
  row.multimodalOverall = multimodal.overall;
  row.singleOverall = single.overall;
  row.status = "projected";
  audit(
    "owner",
    "bind.score",
    `${id}:${multimodal.overall}/${single.overall}`,
  );
  return { ...row };
}

export function listRetrieves(q?: string, page = 1, pageSize = 20) {
  let rows = [...state().retrieves];
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((c) => c.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createRetrieve(input: {
  name: string;
  bindId?: string;
  packId?: string;
  bindInput?: Partial<BindInput>;
}): RetrieveCompare {
  const bind = input.bindId
    ? state().binds.find((p) => p.id === input.bindId)
    : state().binds[0];
  const base = bind ? inputFromBind(bind) : seedInput();
  const bindInput: BindInput = { ...base, ...input.bindInput };
  const multimodal = scoreMultimodal({ ...bindInput, profile: "multimodal" });
  const single = scoreSingle({ ...bindInput, profile: "single" });
  const gap = Math.round((multimodal.overall - single.overall) * 100) / 100;
  let winner: RetrieveCompare["winner"] = "tie";
  if (gap > 0.5) winner = "multimodal_bind";
  else if (gap < -0.5) winner = "single_modality";
  const row: RetrieveCompare = {
    id: randomUUID(),
    name: input.name.trim(),
    packId: input.packId ?? bind?.packId ?? "none",
    bindId: bind?.id ?? "none",
    input: bindInput,
    multimodal,
    single,
    winner,
    gap,
    createdAt: now(),
  };
  state().retrieves.unshift(row);
  audit("owner", "retrieve.create", `${row.id}:${winner}`);
  return row;
}

export function listAudits(page = 1, pageSize = 50) {
  return paginate([...state().audits], page, pageSize);
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      packs: state().packs,
      structures: state().structures,
      diffractions: state().diffractions,
      doses: state().doses,
      languages: state().languages,
      binds: state().binds,
    },
    null,
    2,
  );
}

export function exportRetrievesCsv(): string {
  const header =
    "id,name,winner,gap,multimodalOverall,singleOverall,createdAt\n";
  const lines = state().retrieves.map(
    (c) =>
      `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.multimodal.overall},${c.single.overall},${c.createdAt}`,
  );
  return header + lines.join("\n");
}

export function listFeatures(): string[] {
  return [
    "marketing_landing",
    "crystal_pack_registry",
    "pack_search_filter",
    "structure_descriptor_lane",
    "diffraction_descriptor_lane",
    "dos_descriptor_lane",
    "language_descriptor_lane",
    "bind_space_explorer",
    "bind_projection_scoring",
    "dual_score_panel",
    "multimodal_vs_single_retrieve",
    "honesty_fence",
    "org_settings",
    "member_invite",
    "bearer_auth",
    "rate_limit",
    "idempotent_webhook",
    "export_packs_json",
    "export_retrieves_csv",
    "features_api",
    "goldens_sample_api",
    "audit_trail",
    "onboarding_checklist",
    "in_app_guide_link",
    "try_html_demo",
  ];
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

export function bindReadiness(overall: number) {
  return readinessFromQuality(overall);
}
