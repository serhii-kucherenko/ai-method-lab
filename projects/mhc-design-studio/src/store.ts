import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreClassicalGenerativeBaseline,
  scoreHybridQuantumClassicalDeNovo,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AlleleKind,
  type DesignBias,
  type ScoreMode,
  type MhcDesignInput,
  type MhcDesignQuality,
} from "./domain/types";

export type {
  AlleleKind,
  DesignBias,
  ScoreMode,
  MhcDesignInput,
  MhcDesignQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type PeptidePack = {
  id: string;
  label: string;
  version: string;
  designFocus: string;
  alleleBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type AlleleStatus = "draft" | "active" | "archived";

export type Allele = {
  id: string;
  packId: string;
  label: string;
  kind: AlleleKind;
  alleleHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: AlleleStatus;
  notes: string;
  createdAt: string;
};

export type DesignStatus = "draft" | "open" | "scored" | "archived";

export type DesignRecipe = {
  id: string;
  packId?: string;
  label: string;
  recipeNotes: string;
  lockCondition: string;
  designChannel: string;
  status: DesignStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type DesignRun = {
  id: string;
  designId: string;
  alleleId: string;
  peptideCoverage: number;
  alleleFidelity: number;
  hybridClarity: number;
  packCompleteness: number;
  runNotes: string;
  status: RunStatus;
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
  defaultDesignBias: DesignBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type MhcDesignCompare = {
  id: string;
  name: string;
  designId: string;
  alleleId: string;
  runId: string;
  input: MhcDesignInput;
  hybrid: MhcDesignQuality;
  classical: MhcDesignQuality;
  winner:
    | "hybrid_quantum_classical_de_novo"
    | "classical_generative_baseline"
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
  packs: PeptidePack[];
  alleles: Allele[];
  designs: DesignRecipe[];
  runs: DesignRun[];
  audits: AuditEvent[];
  compares: MhcDesignCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __mhcDesignStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const alleleId = "allele-demo";
  const designId = "design-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Mhc Design Org",
      webhookUrl: "",
      webhookSecret: "mhc-design-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultDesignBias: "balanced",
      defaultMode: "hybrid_quantum_classical_de_novo",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@mhc-design.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Limited-Data MHC Soft-Sim Pack",
        version: "2026.1",
        designFocus:
          "Hybrid quantum–classical de novo vs classical generative baseline",
        alleleBudget: 36,
        status: "active",
        notes:
          "Seed pack for hybrid quantum–classical vs classical generative peptide soft-sim",
        createdAt: now(),
      },
    ],
    alleles: [
      {
        id: alleleId,
        packId,
        label: "HLA class I panel",
        kind: "hla_class_i",
        alleleHint:
          "peptide_coverage,allele_fidelity,hybrid_clarity,pack_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Peptide, allele, hybrid clarity, and completeness for MHC soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim allele — not wet-lab validated / not live ELN write-back",
        createdAt: now(),
      },
    ],
    designs: [
      {
        id: designId,
        packId,
        label: "De novo MHC-binding design recipe",
        recipeNotes: "Hybrid prior for limited-training-data targets",
        lockCondition: "lock_soft_sim",
        designChannel: "soft_sim_hybrid_quantum_classical",
        status: "scored",
        notes: "Seed design for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        designId,
        alleleId,
        peptideCoverage: 0.62,
        alleleFidelity: 0.7,
        hybridClarity: 0.74,
        packCompleteness: 0.68,
        runNotes:
          "Hybrid looks strong but classical generative baseline still leads on generative optimism",
        status: "active",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, alleles, designs, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__mhcDesignStore) g.__mhcDesignStore = seed();
  return g.__mhcDesignStore;
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

export function resetStore(): void {
  g.__mhcDesignStore = seed();
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
  if (patch.defaultDesignBias !== undefined) {
    org.defaultDesignBias = patch.defaultDesignBias;
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
  items: PeptidePack[];
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
        p.designFocus.toLowerCase().includes(q) ||
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
  designFocus: string;
  alleleBudget?: number;
  notes?: string;
}): PeptidePack {
  const pack: PeptidePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    designFocus: input.designFocus,
    alleleBudget: input.alleleBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): PeptidePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listAlleles(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Allele[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().alleles];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.alleleHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAllele(input: {
  packId: string;
  label: string;
  kind: AlleleKind;
  alleleHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): Allele | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Allele = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    alleleHint: input.alleleHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().alleles.unshift(row);
  audit("evaluator", "allele.create", row.label);
  return row;
}

export function archiveAllele(id: string): Allele | null {
  const row = state().alleles.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "allele.archive", id);
  return row;
}

export function listDesigns(opts?: {
  q?: string;
  designChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DesignRecipe[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().designs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.recipeNotes.toLowerCase().includes(q) ||
        c.designChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.designChannel) {
    items = items.filter((c) => c.designChannel === opts.designChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createDesign(input: {
  packId?: string;
  label: string;
  recipeNotes: string;
  lockCondition: string;
  designChannel: string;
  notes?: string;
}): DesignRecipe {
  const row: DesignRecipe = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    recipeNotes: input.recipeNotes,
    lockCondition: input.lockCondition,
    designChannel: input.designChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().designs.unshift(row);
  audit("evaluator", "design.create", row.label);
  return row;
}

export function archiveDesign(id: string): DesignRecipe | null {
  const row = state().designs.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "design.archive", id);
  return row;
}

export function listRuns(opts?: {
  designId?: string;
  alleleId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DesignRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.designId) {
    items = items.filter((r) => r.designId === opts.designId);
  }
  if (opts?.alleleId) {
    items = items.filter((r) => r.alleleId === opts.alleleId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  designId: string;
  alleleId: string;
  peptideCoverage: number;
  alleleFidelity: number;
  hybridClarity: number;
  packCompleteness: number;
  runNotes?: string;
}): DesignRun | null {
  if (!state().designs.some((c) => c.id === input.designId)) {
    return null;
  }
  if (!state().alleles.some((m) => m.id === input.alleleId)) {
    return null;
  }
  const run: DesignRun = {
    id: randomUUID(),
    designId: input.designId,
    alleleId: input.alleleId,
    peptideCoverage: clamp(input.peptideCoverage, 0, 1),
    alleleFidelity: clamp(input.alleleFidelity, 0, 1),
    hybridClarity: clamp(input.hybridClarity, 0, 1),
    packCompleteness: clamp(input.packCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().designs.find((c) => c.id === input.designId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): MhcDesignCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "hold_pack":
      return 0.2;
    case "review":
      return 0.45;
    case "lock_soft_sim":
      return 0.7;
    case "strong_lock":
      return 0.92;
    default: {
      const _exhaustive: string = label;
      void _exhaustive;
      return 0.55;
    }
  }
}

export function runCompare(input: {
  name: string;
  designId: string;
  alleleId: string;
  runId: string;
  designBias?: DesignBias;
  bias?: DesignBias;
  classicalAdherence?: number;
  generativeOptimism?: number;
  designHardness?: number;
  overclaimRisk?: number;
}): MhcDesignCompare | null {
  const design = state().designs.find((c) => c.id === input.designId);
  const allele = state().alleles.find((m) => m.id === input.alleleId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!design || !allele || !run) return null;

  const goldWeight = outcomeWeight(String(design.lockCondition));
  const span = Math.max(0.05, allele.hardnessMax - allele.hardnessMin);
  const mdInput: MhcDesignInput = {
    peptideCoverage: clamp(run.peptideCoverage, 0, 1),
    alleleFidelity: clamp(run.alleleFidelity, 0, 1),
    hybridClarity: clamp(run.hybridClarity, 0, 1),
    packCompleteness: clamp((run.packCompleteness + goldWeight) / 2, 0, 1),
    classicalAdherence: input.classicalAdherence ?? 0.82,
    generativeOptimism: input.generativeOptimism ?? 0.7,
    designHardness: input.designHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    designBias:
      input.designBias ?? input.bias ?? state().org.defaultDesignBias,
    profile: "hybrid_quantum_classical_de_novo",
  };

  const hybrid = scoreHybridQuantumClassicalDeNovo({
    ...mdInput,
    profile: "hybrid_quantum_classical_de_novo",
  });
  const classical = scoreClassicalGenerativeBaseline({
    ...mdInput,
    profile: "classical_generative_baseline",
  });
  const gap = Math.abs(hybrid.overall - classical.overall);
  let winner: MhcDesignCompare["winner"] = "tie";
  if (hybrid.overall > classical.overall + 0.5) {
    winner = "hybrid_quantum_classical_de_novo";
  } else if (classical.overall > hybrid.overall + 0.5) {
    winner = "classical_generative_baseline";
  }

  const compare: MhcDesignCompare = {
    id: randomUUID(),
    name: input.name,
    designId: design.id,
    alleleId: allele.id,
    runId: run.id,
    input: mdInput,
    hybrid,
    classical,
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

export function getScoreboard(): MhcDesignCompare[] {
  return [...state().compares].sort(
    (a, b) => b.hybrid.overall - a.hybrid.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      alleles: state().alleles,
      designs: state().designs,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,hybridOverall,classicalOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.hybrid.overall},${c.classical.overall},${c.createdAt}`,
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
    { id: "peptide-packs", name: "Peptide pack registry" },
    { id: "pack-versions", name: "Versioned peptide packs" },
    { id: "alleles", name: "Allele configs" },
    { id: "allele-editor", name: "Allele / MHC panel editor" },
    { id: "allele-search", name: "Allele search and filter" },
    { id: "seed-packs", name: "Seed peptide packs" },
    { id: "designs", name: "Design recipe registry" },
    { id: "design-filters", name: "Design filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "design-runs", name: "Design soft-sim runs" },
    { id: "design-bias", name: "Design bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Hybrid quantum–classical de novo vs classical generative baseline compare",
    },
    { id: "delta-view", name: "Design delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not wet-lab / not live ELN write-back / not FDA / not authors' system",
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
  ];
}

export function scorePreview(input: MhcDesignInput): {
  hybrid: MhcDesignQuality;
  classical: MhcDesignQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const hybrid = scoreHybridQuantumClassicalDeNovo({
    ...input,
    profile: "hybrid_quantum_classical_de_novo",
  });
  const classical = scoreClassicalGenerativeBaseline({
    ...input,
    profile: "classical_generative_baseline",
  });
  return {
    hybrid,
    classical,
    readiness: readinessFromQuality(hybrid.overall),
  };
}
