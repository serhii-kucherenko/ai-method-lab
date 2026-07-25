import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreAttested, scoreFluent } from "./domain/attest";
import {
  readinessFromQuality,
  type AttestInput,
  type AttestProfile,
  type AttestQuality,
  type ScoreMode,
  type ToolBias,
} from "./domain/types";

export type {
  AttestInput,
  AttestProfile,
  AttestQuality,
  ScoreMode,
  ToolBias,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type ClaimStatus = "draft" | "open" | "verified" | "archived";

export type EmpiricalClaim = {
  id: string;
  title: string;
  statement: string;
  domain: string;
  status: ClaimStatus;
  specificity: number;
  notes: string;
  createdAt: string;
};

export type ToolKind = "calc" | "search" | "code" | "retrieval";

export type AttestationStatus = "draft" | "bound" | "stale" | "archived";

export type ToolAttestation = {
  id: string;
  claimId: string;
  toolKind: ToolKind;
  toolName: string;
  payloadDigest: string;
  coverage: number;
  freshness: number;
  status: AttestationStatus;
  notes: string;
  createdAt: string;
};

export type ProofStatus = "draft" | "walking" | "sealed" | "archived";

export type ProofChain = {
  id: string;
  claimId: string;
  name: string;
  status: ProofStatus;
  integrity: number;
  stepCount: number;
  currentStep: number;
  notes: string;
  createdAt: string;
};

export type KernelStep = {
  id: string;
  proofId: string;
  ordinal: number;
  ruleLabel: string;
  premiseRefs: string;
  conclusion: string;
  softSimOk: boolean;
  createdAt: string;
};

export type EvidenceEntry = {
  id: string;
  claimId: string;
  attestationId: string | null;
  sourceLabel: string;
  groundingScore: number;
  citationText: string;
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
  defaultProfile: AttestProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type AttestCompare = {
  id: string;
  name: string;
  claimId: string;
  proofId: string;
  input: AttestInput;
  attested: AttestQuality;
  fluent: AttestQuality;
  winner: "tool_attested" | "fluent_only" | "tie";
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
  claims: EmpiricalClaim[];
  attestations: ToolAttestation[];
  proofs: ProofChain[];
  steps: KernelStep[];
  ledger: EvidenceEntry[];
  audits: AuditEntry[];
  compares: AttestCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __apsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const claimId = "claim-demo";
  const proofId = "proof-demo";
  const attId = "att-demo";
  return {
    org: {
      name: "Attest Proof Org",
      webhookUrl: "",
      webhookSecret: "aps-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "attested",
      defaultMode: "tool_attested",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@attest-proof.local", role: "owner" },
      { id: "m2", email: "reader@attest-proof.local", role: "reader" },
      { id: "m3", email: "viewer@attest-proof.local", role: "viewer" },
    ],
    claims: [
      {
        id: claimId,
        title: "GDP growth Q2 soft-sim",
        statement:
          "Q2 GDP grew 2.1% QoQ after seasonal adjustment (tool-backed).",
        domain: "macro",
        status: "open",
        specificity: 0.78,
        notes: "Seed empirical claim",
        createdAt: now(),
      },
    ],
    attestations: [
      {
        id: attId,
        claimId,
        toolKind: "calc",
        toolName: "seasonal_adjust_v1",
        payloadDigest: "sha256:demo-att-calc",
        coverage: 0.82,
        freshness: 0.88,
        status: "bound",
        notes: "Seed calc attestation",
        createdAt: now(),
      },
    ],
    proofs: [
      {
        id: proofId,
        claimId,
        name: "Soft-sim kernel chain A",
        status: "walking",
        integrity: 0.76,
        stepCount: 3,
        currentStep: 1,
        notes: "Seed proof chain",
        createdAt: now(),
      },
    ],
    steps: [
      {
        id: "step-1",
        proofId,
        ordinal: 1,
        ruleLabel: "tool_attest_intro",
        premiseRefs: "att-demo",
        conclusion: "Calc tool bound to claim",
        softSimOk: true,
        createdAt: now(),
      },
      {
        id: "step-2",
        proofId,
        ordinal: 2,
        ruleLabel: "evidence_ground",
        premiseRefs: "ledger-demo",
        conclusion: "Ledger cites seasonal series",
        softSimOk: true,
        createdAt: now(),
      },
      {
        id: "step-3",
        proofId,
        ordinal: 3,
        ruleLabel: "kernel_close",
        premiseRefs: "step-1,step-2",
        conclusion: "Soft-sim seal candidate",
        softSimOk: false,
        createdAt: now(),
      },
    ],
    ledger: [
      {
        id: "ledger-demo",
        claimId,
        attestationId: attId,
        sourceLabel: "BEA soft-sim series",
        groundingScore: 0.8,
        citationText: "Seasonally adjusted QoQ growth proxy",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: randomUUID(),
        at: now(),
        actor: "system",
        action: "store.seed",
        detail: "Attest Proof Studio seed state",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__apsStore) g.__apsStore = seed();
  return g.__apsStore;
}

export function resetStore(): void {
  g.__apsStore = seed();
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

export function listClaims(
  q?: string,
  page = 1,
  pageSize = 20,
  status?: ClaimStatus,
) {
  let rows = [...state().claims];
  if (status) rows = rows.filter((c) => c.status === status);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.statement.toLowerCase().includes(needle) ||
        c.domain.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createClaim(input: {
  title: string;
  statement?: string;
  domain?: string;
  status?: ClaimStatus;
  specificity?: number;
  notes?: string;
}): EmpiricalClaim {
  const row: EmpiricalClaim = {
    id: randomUUID(),
    title: input.title.trim(),
    statement: input.statement?.trim() || "",
    domain: input.domain?.trim() || "general",
    status: input.status ?? "draft",
    specificity: input.specificity ?? 0.7,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().claims.unshift(row);
  audit("owner", "claim.create", row.id);
  return row;
}

export function archiveClaim(id: string): EmpiricalClaim {
  const row = state().claims.find((c) => c.id === id);
  if (!row) throw new Error("claim_not_found");
  row.status = "archived";
  audit("owner", "claim.archive", id);
  return row;
}

export function listAttestations(
  q?: string,
  page = 1,
  pageSize = 20,
  claimId?: string,
) {
  let rows = [...state().attestations];
  if (claimId) rows = rows.filter((r) => r.claimId === claimId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.toolName.toLowerCase().includes(needle) ||
        r.toolKind.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createAttestation(input: {
  claimId: string;
  toolKind?: ToolKind;
  toolName: string;
  payloadDigest?: string;
  coverage?: number;
  freshness?: number;
  status?: AttestationStatus;
  notes?: string;
}): ToolAttestation {
  if (!state().claims.some((c) => c.id === input.claimId)) {
    throw new Error("claim_not_found");
  }
  const row: ToolAttestation = {
    id: randomUUID(),
    claimId: input.claimId,
    toolKind: input.toolKind ?? "calc",
    toolName: input.toolName.trim(),
    payloadDigest: input.payloadDigest?.trim() || `sha256:${randomUUID()}`,
    coverage: input.coverage ?? 0.7,
    freshness: input.freshness ?? 0.75,
    status: input.status ?? "draft",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().attestations.unshift(row);
  audit("owner", "attestation.create", row.id);
  return row;
}

export function listProofs(
  q?: string,
  page = 1,
  pageSize = 20,
  claimId?: string,
) {
  let rows = [...state().proofs];
  if (claimId) rows = rows.filter((r) => r.claimId === claimId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createProof(input: {
  claimId: string;
  name: string;
  status?: ProofStatus;
  integrity?: number;
  notes?: string;
}): ProofChain {
  if (!state().claims.some((c) => c.id === input.claimId)) {
    throw new Error("claim_not_found");
  }
  const row: ProofChain = {
    id: randomUUID(),
    claimId: input.claimId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    integrity: input.integrity ?? 0.7,
    stepCount: 0,
    currentStep: 0,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().proofs.unshift(row);
  audit("owner", "proof.create", row.id);
  return row;
}

export function advanceProof(id: string): ProofChain {
  const row = state().proofs.find((p) => p.id === id);
  if (!row) throw new Error("proof_not_found");
  if (row.status === "draft") row.status = "walking";
  else if (row.status === "walking") row.status = "sealed";
  else if (row.status === "sealed") row.status = "archived";
  audit("owner", "proof.advance", `${id}:${row.status}`);
  return row;
}

export function listSteps(proofId?: string, page = 1, pageSize = 50) {
  let rows = [...state().steps].sort((a, b) => a.ordinal - b.ordinal);
  if (proofId) rows = rows.filter((r) => r.proofId === proofId);
  return paginate(rows, page, pageSize);
}

export function createStep(input: {
  proofId: string;
  ruleLabel: string;
  premiseRefs?: string;
  conclusion?: string;
  softSimOk?: boolean;
}): KernelStep {
  const proof = state().proofs.find((p) => p.id === input.proofId);
  if (!proof) throw new Error("proof_not_found");
  const ordinal = proof.stepCount + 1;
  const row: KernelStep = {
    id: randomUUID(),
    proofId: input.proofId,
    ordinal,
    ruleLabel: input.ruleLabel.trim(),
    premiseRefs: input.premiseRefs?.trim() || "",
    conclusion: input.conclusion?.trim() || "",
    softSimOk: input.softSimOk ?? false,
    createdAt: now(),
  };
  state().steps.push(row);
  proof.stepCount = ordinal;
  proof.currentStep = ordinal;
  if (proof.status === "draft") proof.status = "walking";
  audit("owner", "kernel.step", row.id);
  return row;
}

export function markStepOk(id: string, softSimOk: boolean): KernelStep {
  const row = state().steps.find((s) => s.id === id);
  if (!row) throw new Error("step_not_found");
  row.softSimOk = softSimOk;
  audit("owner", "kernel.mark", `${id}:${softSimOk}`);
  return row;
}

export function listLedger(
  q?: string,
  page = 1,
  pageSize = 20,
  claimId?: string,
) {
  let rows = [...state().ledger];
  if (claimId) rows = rows.filter((r) => r.claimId === claimId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.sourceLabel.toLowerCase().includes(needle) ||
        r.citationText.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createLedgerEntry(input: {
  claimId: string;
  attestationId?: string | null;
  sourceLabel: string;
  groundingScore?: number;
  citationText?: string;
}): EvidenceEntry {
  if (!state().claims.some((c) => c.id === input.claimId)) {
    throw new Error("claim_not_found");
  }
  const row: EvidenceEntry = {
    id: randomUUID(),
    claimId: input.claimId,
    attestationId: input.attestationId ?? null,
    sourceLabel: input.sourceLabel.trim(),
    groundingScore: input.groundingScore ?? 0.7,
    citationText: input.citationText?.trim() || "",
    createdAt: now(),
  };
  state().ledger.unshift(row);
  audit("owner", "ledger.create", row.id);
  return row;
}

function inputFromClaim(claimId: string, proofId?: string): AttestInput {
  const claim = state().claims.find((c) => c.id === claimId);
  const atts = state().attestations.filter((a) => a.claimId === claimId);
  const proof = proofId
    ? state().proofs.find((p) => p.id === proofId)
    : state().proofs.find((p) => p.claimId === claimId);
  const ledger = state().ledger.filter((e) => e.claimId === claimId);
  const coverage =
    atts.length === 0
      ? 0.2
      : atts.reduce((s, a) => s + a.coverage, 0) / atts.length;
  const freshness =
    atts.length === 0
      ? 0.2
      : atts.reduce((s, a) => s + a.freshness, 0) / atts.length;
  const grounding =
    ledger.length === 0
      ? 0.25
      : ledger.reduce((s, e) => s + e.groundingScore, 0) / ledger.length;
  const kind = atts[0]?.toolKind ?? "calc";
  const toolBias: ToolBias =
    kind === "calc" ||
    kind === "search" ||
    kind === "code" ||
    kind === "retrieval"
      ? kind
      : "balanced";
  return {
    toolCoverage: coverage,
    evidenceGrounding: grounding,
    proofChainIntegrity: proof?.integrity ?? 0.4,
    attestationFreshness: freshness,
    claimSpecificity: claim?.specificity ?? 0.5,
    fluentConfidence: 0.72,
    unsupportedClaims: Math.max(0, 1 - grounding) * 0.4,
    noiseLevel: 0.18,
    toolBias,
    profile: "attested",
  };
}

export function listCompares(page = 1, pageSize = 20) {
  return paginate([...state().compares], page, pageSize);
}

export function createCompare(input: {
  name: string;
  claimId: string;
  proofId?: string;
  fluentConfidence?: number;
  unsupportedClaims?: number;
  noiseLevel?: number;
  toolBias?: ToolBias;
}): AttestCompare {
  if (!state().claims.some((c) => c.id === input.claimId)) {
    throw new Error("claim_not_found");
  }
  const proofId =
    input.proofId ??
    state().proofs.find((p) => p.claimId === input.claimId)?.id ??
    "";
  if (proofId && !state().proofs.some((p) => p.id === proofId)) {
    throw new Error("proof_not_found");
  }
  const base = inputFromClaim(input.claimId, proofId || undefined);
  const snap: AttestInput = {
    ...base,
    fluentConfidence: input.fluentConfidence ?? base.fluentConfidence,
    unsupportedClaims: input.unsupportedClaims ?? base.unsupportedClaims,
    noiseLevel: input.noiseLevel ?? base.noiseLevel,
    toolBias: input.toolBias ?? base.toolBias,
  };
  const attested = scoreAttested({ ...snap, profile: "attested" });
  const fluent = scoreFluent({ ...snap, profile: "fluent" });
  const gap = Math.round((attested.overall - fluent.overall) * 100) / 100;
  let winner: AttestCompare["winner"] = "tie";
  if (gap > 1) winner = "tool_attested";
  else if (gap < -1) winner = "fluent_only";
  const row: AttestCompare = {
    id: randomUUID(),
    name: input.name.trim(),
    claimId: input.claimId,
    proofId,
    input: snap,
    attested,
    fluent,
    winner,
    gap,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("owner", "compare.create", `${row.id}:${winner}`);
  return row;
}

export function listAudits(page = 1, pageSize = 20) {
  return paginate([...state().audits], page, pageSize);
}

export function exportClaimsJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      claims: state().claims,
      attestations: state().attestations,
      proofs: state().proofs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const header =
    "id,name,claimId,winner,gap,attestedOverall,fluentOverall,createdAt";
  const lines = state().compares.map(
    (c) =>
      `${c.id},${JSON.stringify(c.name)},${c.claimId},${c.winner},${c.gap},${c.attested.overall},${c.fluent.overall},${c.createdAt}`,
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
    "claim_registry",
    "claim_search_filter",
    "tool_attestations",
    "attestation_link_claim",
    "proof_chains",
    "kernel_step_walker",
    "evidence_ledger",
    "ledger_filter",
    "dual_score_panel",
    "attested_vs_fluent_compare",
    "honesty_fence",
    "org_settings",
    "member_invite",
    "bearer_auth",
    "rate_limit",
    "idempotent_webhook",
    "export_claims_json",
    "export_compares_csv",
    "features_api",
    "goldens_sample_api",
    "audit_trail",
    "in_app_guide_link",
    "try_html_demo",
  ];
}

export { readinessFromQuality };
