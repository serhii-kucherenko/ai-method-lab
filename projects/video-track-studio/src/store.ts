import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreFluency, scoreTrackAware } from "./domain/track";
import {
  readinessFromQuality,
  type ProbeBias,
  type ScoreMode,
  type TrackInput,
  type TrackProfile,
  type TrackQuality,
} from "./domain/types";

export type {
  ProbeBias,
  ScoreMode,
  TrackInput,
  TrackProfile,
  TrackQuality,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type ClipStatus = "draft" | "ready" | "probing" | "archived";

export type Clip = {
  id: string;
  title: string;
  showLabel: string;
  durationMin: number;
  frameCount: number;
  status: ClipStatus;
  notes: string;
  createdAt: string;
};

export type GenderCue = "same" | "cross" | "unknown";

export type Character = {
  id: string;
  clipId: string;
  name: string;
  genderCue: GenderCue;
  castRank: number;
  outfitChangeCount: number;
  notes: string;
  createdAt: string;
};

export type ProbeKind =
  | "name_swap"
  | "gender_swap"
  | "open_ended"
  | "frame_boost";

export type ProbeStatus = "draft" | "running" | "scored" | "archived";

export type TrackProbe = {
  id: string;
  clipId: string;
  characterId: string;
  probeKind: ProbeKind;
  swapTargetName: string;
  sensitivity: number;
  temporalCoverage: number;
  identityBind: number;
  fluencyPrior: number;
  noise: number;
  status: ProbeStatus;
  notes: string;
  createdAt: string;
};

export type FailureTaxonomy =
  | "name_invariant"
  | "gender_cue"
  | "option_bias"
  | "open_ended_collapse"
  | "shallow_frames";

export type FailureDiagnosis = {
  id: string;
  probeId: string;
  taxonomy: FailureTaxonomy;
  severity: number;
  evidenceNote: string;
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
  defaultProfile: TrackProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type TrackCompare = {
  id: string;
  name: string;
  clipId: string;
  characterId: string;
  probeId: string;
  input: TrackInput;
  trackAware: TrackQuality;
  fluency: TrackQuality;
  winner: "track_aware" | "fluency_only" | "tie";
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
  clips: Clip[];
  characters: Character[];
  probes: TrackProbe[];
  failures: FailureDiagnosis[];
  audits: AuditEntry[];
  compares: TrackCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __vtsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const clipId = "clip-demo";
  const charId = "char-demo";
  const probeId = "probe-demo";
  return {
    org: {
      name: "Video Track Org",
      webhookUrl: "",
      webhookSecret: "vts-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "track_aware",
      defaultMode: "track_aware",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@video-track.local", role: "owner" },
      { id: "m2", email: "reader@video-track.local", role: "reader" },
      { id: "m3", email: "viewer@video-track.local", role: "viewer" },
    ],
    clips: [
      {
        id: clipId,
        title: "BBT S01E03 soft-sim episode",
        showLabel: "Big Bang Theory",
        durationMin: 22,
        frameCount: 16,
        status: "ready",
        notes: "Seed long-form clip",
        createdAt: now(),
      },
    ],
    characters: [
      {
        id: charId,
        clipId,
        name: "Sheldon",
        genderCue: "same",
        castRank: 1,
        outfitChangeCount: 3,
        notes: "Seed named character",
        createdAt: now(),
      },
    ],
    probes: [
      {
        id: probeId,
        clipId,
        characterId: charId,
        probeKind: "name_swap",
        swapTargetName: "Leonard",
        sensitivity: 0.28,
        temporalCoverage: 0.55,
        identityBind: 0.32,
        fluencyPrior: 0.74,
        noise: 0.2,
        status: "scored",
        notes: "Seed name-swap probe",
        createdAt: now(),
      },
    ],
    failures: [
      {
        id: "fail-demo",
        probeId,
        taxonomy: "name_invariant",
        severity: 0.72,
        evidenceNote:
          "Swap to Leonard rarely changes answer — soft-sim name invariance.",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: randomUUID(),
        at: now(),
        actor: "system",
        action: "store.seed",
        detail: "Video Track Studio seed state",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__vtsStore) g.__vtsStore = seed();
  return g.__vtsStore;
}

export function resetStore(): void {
  g.__vtsStore = seed();
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

export function listClips(
  q?: string,
  page = 1,
  pageSize = 20,
  status?: ClipStatus,
) {
  let rows = [...state().clips];
  if (status) rows = rows.filter((c) => c.status === status);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.showLabel.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createClip(input: {
  title: string;
  showLabel?: string;
  durationMin?: number;
  frameCount?: number;
  status?: ClipStatus;
  notes?: string;
}): Clip {
  const row: Clip = {
    id: randomUUID(),
    title: input.title.trim(),
    showLabel: input.showLabel?.trim() || "Unknown show",
    durationMin: input.durationMin ?? 22,
    frameCount: input.frameCount ?? 16,
    status: input.status ?? "draft",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().clips.unshift(row);
  audit("owner", "clip.create", row.id);
  return row;
}

export function archiveClip(id: string): Clip {
  const row = state().clips.find((c) => c.id === id);
  if (!row) throw new Error("clip_not_found");
  row.status = "archived";
  audit("owner", "clip.archive", id);
  return row;
}

export function listCharacters(
  q?: string,
  page = 1,
  pageSize = 20,
  clipId?: string,
) {
  let rows = [...state().characters];
  if (clipId) rows = rows.filter((r) => r.clipId === clipId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createCharacter(input: {
  clipId: string;
  name: string;
  genderCue?: GenderCue;
  castRank?: number;
  outfitChangeCount?: number;
  notes?: string;
}): Character {
  if (!state().clips.some((c) => c.id === input.clipId)) {
    throw new Error("clip_not_found");
  }
  const row: Character = {
    id: randomUUID(),
    clipId: input.clipId,
    name: input.name.trim(),
    genderCue: input.genderCue ?? "unknown",
    castRank: input.castRank ?? 1,
    outfitChangeCount: input.outfitChangeCount ?? 1,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().characters.unshift(row);
  audit("owner", "character.create", row.id);
  return row;
}

export function listProbes(
  q?: string,
  page = 1,
  pageSize = 20,
  clipId?: string,
) {
  let rows = [...state().probes];
  if (clipId) rows = rows.filter((r) => r.clipId === clipId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.probeKind.toLowerCase().includes(needle) ||
        r.swapTargetName.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createProbe(input: {
  clipId: string;
  characterId: string;
  probeKind?: ProbeKind;
  swapTargetName?: string;
  sensitivity?: number;
  temporalCoverage?: number;
  identityBind?: number;
  fluencyPrior?: number;
  noise?: number;
  status?: ProbeStatus;
  notes?: string;
}): TrackProbe {
  if (!state().clips.some((c) => c.id === input.clipId)) {
    throw new Error("clip_not_found");
  }
  if (!state().characters.some((c) => c.id === input.characterId)) {
    throw new Error("character_not_found");
  }
  const row: TrackProbe = {
    id: randomUUID(),
    clipId: input.clipId,
    characterId: input.characterId,
    probeKind: input.probeKind ?? "name_swap",
    swapTargetName: input.swapTargetName?.trim() || "Other cast",
    sensitivity: input.sensitivity ?? 0.35,
    temporalCoverage: input.temporalCoverage ?? 0.5,
    identityBind: input.identityBind ?? 0.4,
    fluencyPrior: input.fluencyPrior ?? 0.7,
    noise: input.noise ?? 0.2,
    status: input.status ?? "draft",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().probes.unshift(row);
  const clip = state().clips.find((c) => c.id === input.clipId);
  if (clip && clip.status === "ready") clip.status = "probing";
  audit("owner", "probe.create", row.id);
  return row;
}

export function listFailures(
  q?: string,
  page = 1,
  pageSize = 20,
  probeId?: string,
) {
  let rows = [...state().failures];
  if (probeId) rows = rows.filter((r) => r.probeId === probeId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.taxonomy.toLowerCase().includes(needle) ||
        r.evidenceNote.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createFailure(input: {
  probeId: string;
  taxonomy?: FailureTaxonomy;
  severity?: number;
  evidenceNote?: string;
}): FailureDiagnosis {
  if (!state().probes.some((p) => p.id === input.probeId)) {
    throw new Error("probe_not_found");
  }
  const row: FailureDiagnosis = {
    id: randomUUID(),
    probeId: input.probeId,
    taxonomy: input.taxonomy ?? "name_invariant",
    severity: input.severity ?? 0.6,
    evidenceNote: input.evidenceNote?.trim() || "",
    createdAt: now(),
  };
  state().failures.unshift(row);
  audit("owner", "failure.create", row.id);
  return row;
}

function inputFromProbe(probeId: string): TrackInput {
  const probe = state().probes.find((p) => p.id === probeId);
  const character = probe
    ? state().characters.find((c) => c.id === probe.characterId)
    : undefined;
  const failures = state().failures.filter((f) => f.probeId === probeId);
  const genderCue =
    failures.some((f) => f.taxonomy === "gender_cue") ||
    character?.genderCue === "cross"
      ? 0.55
      : 0.25;
  const kind = probe?.probeKind ?? "name_swap";
  const probeBias: ProbeBias =
    kind === "name_swap" ||
    kind === "gender_swap" ||
    kind === "open_ended" ||
    kind === "frame_boost"
      ? kind
      : "balanced";
  const outfit =
    character && character.outfitChangeCount > 0
      ? Math.min(1, character.outfitChangeCount / 5)
      : 0.4;
  return {
    nameSensitivity: probe?.sensitivity ?? 0.3,
    identityBind: probe?.identityBind ?? 0.35,
    temporalCoverage: probe?.temporalCoverage ?? 0.45,
    outfitOrderFidelity: outfit,
    probeSpecificity: 0.65,
    fluencyPrior: probe?.fluencyPrior ?? 0.7,
    genderCueReliance: genderCue,
    noiseLevel: probe?.noise ?? 0.2,
    probeBias,
    profile: "track_aware",
  };
}

export function listCompares(page = 1, pageSize = 20) {
  return paginate([...state().compares], page, pageSize);
}

export function createCompare(input: {
  name: string;
  clipId: string;
  characterId: string;
  probeId: string;
  fluencyPrior?: number;
  genderCueReliance?: number;
  noiseLevel?: number;
  probeBias?: ProbeBias;
}): TrackCompare {
  if (!state().clips.some((c) => c.id === input.clipId)) {
    throw new Error("clip_not_found");
  }
  if (!state().characters.some((c) => c.id === input.characterId)) {
    throw new Error("character_not_found");
  }
  if (!state().probes.some((p) => p.id === input.probeId)) {
    throw new Error("probe_not_found");
  }
  const base = inputFromProbe(input.probeId);
  const snap: TrackInput = {
    ...base,
    fluencyPrior: input.fluencyPrior ?? base.fluencyPrior,
    genderCueReliance: input.genderCueReliance ?? base.genderCueReliance,
    noiseLevel: input.noiseLevel ?? base.noiseLevel,
    probeBias: input.probeBias ?? base.probeBias,
  };
  const trackAware = scoreTrackAware({ ...snap, profile: "track_aware" });
  const fluency = scoreFluency({ ...snap, profile: "fluency" });
  const gap = Math.round((trackAware.overall - fluency.overall) * 100) / 100;
  let winner: TrackCompare["winner"] = "tie";
  if (gap > 1) winner = "track_aware";
  else if (gap < -1) winner = "fluency_only";
  const row: TrackCompare = {
    id: randomUUID(),
    name: input.name.trim(),
    clipId: input.clipId,
    characterId: input.characterId,
    probeId: input.probeId,
    input: snap,
    trackAware,
    fluency,
    winner,
    gap,
    createdAt: now(),
  };
  state().compares.unshift(row);
  const probe = state().probes.find((p) => p.id === input.probeId);
  if (probe) probe.status = "scored";
  audit("owner", "compare.create", `${row.id}:${winner}`);
  return row;
}

export function listAudits(page = 1, pageSize = 20) {
  return paginate([...state().audits], page, pageSize);
}

export function exportClipsJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      clips: state().clips,
      characters: state().characters,
      probes: state().probes,
      failures: state().failures,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const header =
    "id,name,clipId,probeId,winner,gap,trackAwareOverall,fluencyOverall,createdAt";
  const lines = state().compares.map(
    (c) =>
      `${c.id},${JSON.stringify(c.name)},${c.clipId},${c.probeId},${c.winner},${c.gap},${c.trackAware.overall},${c.fluency.overall},${c.createdAt}`,
  );
  return [header, ...lines].join("\n");
}

export function receiveWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  if (signature) {
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "bad_signature" };
    }
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, id: existing.id };
  const id = randomUUID();
  state().webhookEvents.push({
    id,
    idempotencyKey,
    receivedAt: now(),
    payload,
  });
  audit("webhook", "webhook.receive", idempotencyKey);
  return { ok: true, id };
}

export function featureInventory(): string[] {
  return [
    "marketing_landing",
    "pricing_tiers",
    "guided_demo",
    "onboarding_checklist_page",
    "clip_registry",
    "clip_search_filter",
    "character_registry",
    "character_bound_to_clip",
    "track_probes",
    "probe_kinds",
    "failure_diagnosis",
    "failure_taxonomy",
    "dual_score_panel",
    "track_vs_fluency_compare",
    "honesty_fence",
    "org_settings",
    "member_invite",
    "bearer_auth",
    "rate_limit",
    "idempotent_webhook",
    "export_clips_json",
    "export_compares_csv",
    "features_api",
    "goldens_sample_api",
    "audit_trail",
    "in_app_guide_link",
    "try_html_demo",
  ];
}

export { readinessFromQuality };
