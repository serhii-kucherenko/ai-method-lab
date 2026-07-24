import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import {
  scoreMultiStep,
  scoreSingleShot,
} from "./domain/graphQuality";
import type {
  ConstructionProfile,
  GraphInput,
  GraphQuality,
  PipelineStage,
} from "./domain/types";

export type MemberRole = "owner" | "engineer" | "analyst";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type CorpusProject = {
  id: string;
  name: string;
  domainTag: string;
  docCount: number;
  createdAt: string;
};

export type GraphEntity = {
  id: string;
  name: string;
  kind: string;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  strength: "strong" | "weak";
};

export type GraphSnapshot = {
  id: string;
  pipelineRunId: string;
  entities: GraphEntity[];
  edges: GraphEdge[];
  quality: GraphQuality;
  input: GraphInput;
};

export type PipelineRun = {
  id: string;
  corpusId: string;
  profile: ConstructionProfile;
  stage: PipelineStage;
  version: number;
  createdAt: string;
  updatedAt: string;
  extractStats?: { mentions: number; docs: number };
  consolidateStats?: { deduped: number; entities: number; edges: number };
  error?: string;
  graphId?: string;
};

export type Citation = {
  entityId: string;
  entityName: string;
  edgeLabel?: string;
};

export type HopStep = {
  from: string;
  to: string;
  label: string;
};

export type AskSession = {
  id: string;
  corpusId: string;
  query: string;
  answer: string;
  citations: Citation[];
  hopTrail: HopStep[];
  qualityMode: "multi_step" | "single_shot";
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
  defaultProfile: ConstructionProfile;
  rateLimitPerMinute: number;
};

export type ScenarioCompare = {
  id: string;
  name: string;
  input: GraphInput;
  multiStep: GraphQuality;
  singleShot: GraphQuality;
  winner: "multi_step" | "single_shot" | "tie";
  createdAt: string;
};

type StoreState = {
  org: OrgSettings;
  members: Member[];
  corpora: CorpusProject[];
  pipelines: PipelineRun[];
  graphs: GraphSnapshot[];
  asks: AskSession[];
  audits: AuditEntry[];
  scenarios: ScenarioCompare[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __grsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const corpusId = "corp-demo";
  const pipeId = "pipe-demo";
  const graphId = "graph-demo";
  const input: GraphInput = {
    docs: 24,
    rawMentions: 96,
    uniqueEntities: 58,
    duplicateRate: 0.35,
    weakEdges: 18,
    strongEdges: 42,
    hopDepthUseful: 3,
    queryCoverage: 0.78,
    profile: "compact",
  };
  const quality = scoreMultiStep(input);
  const entities: GraphEntity[] = [
    { id: "e1", name: "Acetaminophen", kind: "drug" },
    { id: "e2", name: "Hepatotoxicity", kind: "condition" },
    { id: "e3", name: "CYP2E1", kind: "enzyme" },
    { id: "e4", name: "NAPQI", kind: "metabolite" },
    { id: "e5", name: "Glutathione", kind: "molecule" },
  ];
  const edges: GraphEdge[] = [
    { id: "r1", from: "e1", to: "e4", label: "metabolizes_to", strength: "strong" },
    { id: "r2", from: "e4", to: "e2", label: "causes", strength: "strong" },
    { id: "r3", from: "e3", to: "e4", label: "catalyzes", strength: "strong" },
    { id: "r4", from: "e5", to: "e4", label: "detoxifies", strength: "strong" },
    { id: "r5", from: "e1", to: "e2", label: "associated_with", strength: "weak" },
  ];

  return {
    org: {
      name: "Graph RAG Studio Lab",
      webhookUrl: "",
      webhookSecret: "grs-webhook-secret",
      bearerToken: "grs-dev-token",
      defaultProfile: "compact",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "eng@studio.local", role: "engineer" },
      { id: "m3", email: "analyst@studio.local", role: "analyst" },
    ],
    corpora: [
      {
        id: corpusId,
        name: "Pharma safety notes",
        domainTag: "medical",
        docCount: 24,
        createdAt: now(),
      },
    ],
    pipelines: [
      {
        id: pipeId,
        corpusId,
        profile: "compact",
        stage: "ready",
        version: 1,
        createdAt: now(),
        updatedAt: now(),
        extractStats: { mentions: 96, docs: 24 },
        consolidateStats: { deduped: 38, entities: 58, edges: 42 },
        graphId,
      },
    ],
    graphs: [
      {
        id: graphId,
        pipelineRunId: pipeId,
        entities,
        edges,
        quality,
        input,
      },
    ],
    asks: [
      {
        id: "ask-demo",
        corpusId,
        query: "How does acetaminophen relate to liver injury?",
        answer:
          "Acetaminophen metabolizes to NAPQI, which can cause hepatotoxicity when glutathione detoxification is overwhelmed.",
        citations: [
          { entityId: "e1", entityName: "Acetaminophen", edgeLabel: "metabolizes_to" },
          { entityId: "e4", entityName: "NAPQI", edgeLabel: "causes" },
          { entityId: "e2", entityName: "Hepatotoxicity" },
        ],
        hopTrail: [
          { from: "Acetaminophen", to: "NAPQI", label: "metabolizes_to" },
          { from: "NAPQI", to: "Hepatotoxicity", label: "causes" },
        ],
        qualityMode: "multi_step",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo corpus, pipeline, and ask session loaded",
      },
    ],
    scenarios: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__grsStore) g.__grsStore = seed();
  return g.__grsStore;
}

export function resetStore(): void {
  g.__grsStore = seed();
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

export function listCorpora(q?: string): CorpusProject[] {
  const all = [...state().corpora].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(needle) ||
      c.domainTag.toLowerCase().includes(needle),
  );
}

export function createCorpus(input: {
  name: string;
  domainTag: string;
  docCount: number;
}): CorpusProject {
  const c: CorpusProject = {
    id: randomUUID(),
    name: input.name.trim(),
    domainTag: input.domainTag.trim() || "general",
    docCount: Math.max(1, Math.floor(input.docCount)),
    createdAt: now(),
  };
  state().corpora.unshift(c);
  audit("engineer", "corpus.create", c.name);
  return c;
}

export function getCorpus(id: string): CorpusProject | undefined {
  return state().corpora.find((c) => c.id === id);
}

const STAGE_ORDER: PipelineStage[] = [
  "queued",
  "extract",
  "consolidate",
  "ready",
];

export function listPipelines(corpusId?: string): PipelineRun[] {
  let rows = [...state().pipelines];
  if (corpusId) rows = rows.filter((p) => p.corpusId === corpusId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPipeline(input: {
  corpusId: string;
  profile?: ConstructionProfile;
}): PipelineRun {
  const corpus = getCorpus(input.corpusId);
  if (!corpus) throw new Error("corpus_not_found");
  const profile = input.profile ?? state().org.defaultProfile;
  const run: PipelineRun = {
    id: randomUUID(),
    corpusId: input.corpusId,
    profile,
    stage: "queued",
    version: 1,
    createdAt: now(),
    updatedAt: now(),
  };
  state().pipelines.unshift(run);
  audit("engineer", "pipeline.create", `${run.id} ${profile}`);
  return run;
}

export function advancePipeline(id: string): PipelineRun {
  const run = state().pipelines.find((p) => p.id === id);
  if (!run) throw new Error("pipeline_not_found");
  if (run.stage === "failed" || run.stage === "ready") {
    throw new Error("illegal_stage_advance");
  }
  const idx = STAGE_ORDER.indexOf(run.stage);
  const next = STAGE_ORDER[idx + 1];
  if (!next) throw new Error("illegal_stage_advance");

  const corpus = getCorpus(run.corpusId);
  if (!corpus) throw new Error("corpus_not_found");

  if (next === "extract") {
    const mentions = Math.max(12, corpus.docCount * 4);
    run.extractStats = { mentions, docs: corpus.docCount };
  }

  if (next === "consolidate") {
    const mentions = run.extractStats?.mentions ?? corpus.docCount * 4;
    const deduped = Math.round(mentions * 0.35);
    const entities = mentions - deduped;
    const edges = Math.round(entities * 0.7);
    run.consolidateStats = { deduped, entities, edges };
  }

  if (next === "ready") {
    const mentions = run.extractStats?.mentions ?? 40;
    const entities = run.consolidateStats?.entities ?? 26;
    const edges = run.consolidateStats?.edges ?? 18;
    const input: GraphInput = {
      docs: corpus.docCount,
      rawMentions: mentions,
      uniqueEntities: entities,
      duplicateRate: mentions > 0 ? (mentions - entities) / mentions : 0,
      weakEdges: Math.round(edges * 0.35),
      strongEdges: Math.round(edges * 0.65),
      hopDepthUseful: run.profile === "heavy" ? 3 : 2,
      queryCoverage: run.profile === "heavy" ? 0.82 : 0.7,
      profile: run.profile,
    };
    const quality = scoreMultiStep(input);
    const graph = buildGraphFromStats(run.id, input, quality);
    state().graphs.unshift(graph);
    run.graphId = graph.id;
  }

  run.stage = next;
  run.updatedAt = now();
  audit("engineer", "pipeline.advance", `${run.id} → ${next}`);
  return { ...run };
}

function buildGraphFromStats(
  pipelineRunId: string,
  input: GraphInput,
  quality: GraphQuality,
): GraphSnapshot {
  const names = [
    ["Entity-Alpha", "concept"],
    ["Entity-Beta", "concept"],
    ["Entity-Gamma", "event"],
    ["Entity-Delta", "actor"],
    ["Entity-Epsilon", "metric"],
    ["Entity-Zeta", "doc"],
  ];
  const count = Math.min(names.length, Math.max(3, Math.min(6, input.uniqueEntities)));
  const entities: GraphEntity[] = [];
  for (let i = 0; i < count; i++) {
    const [name, kind] = names[i]!;
    entities.push({ id: `e-${i + 1}`, name, kind });
  }
  const edges: GraphEdge[] = [];
  for (let i = 0; i < entities.length - 1; i++) {
    edges.push({
      id: `r-${i + 1}`,
      from: entities[i]!.id,
      to: entities[i + 1]!.id,
      label: i % 2 === 0 ? "relates_to" : "supports",
      strength: i === 0 ? "strong" : "strong",
    });
  }
  return {
    id: randomUUID(),
    pipelineRunId,
    entities,
    edges,
    quality,
    input,
  };
}

export function listGraphs(q?: string): GraphSnapshot[] {
  let rows = [...state().graphs];
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((g) =>
      g.entities.some((e) => e.name.toLowerCase().includes(needle)),
    );
  }
  return rows;
}

export function getGraph(id: string): GraphSnapshot | undefined {
  return state().graphs.find((g) => g.id === id);
}

export function hopHighlight(
  graphId: string,
  startEntityId: string,
  hops: number,
): { entities: string[]; edges: string[] } {
  const graph = getGraph(graphId);
  if (!graph) throw new Error("graph_not_found");
  const depth = Math.max(1, Math.min(4, hops));
  const entitySet = new Set<string>([startEntityId]);
  const edgeSet = new Set<string>();
  let frontier = new Set<string>([startEntityId]);
  for (let h = 0; h < depth; h++) {
    const next = new Set<string>();
    for (const edge of graph.edges) {
      if (frontier.has(edge.from) || frontier.has(edge.to)) {
        edgeSet.add(edge.id);
        entitySet.add(edge.from);
        entitySet.add(edge.to);
        if (frontier.has(edge.from)) next.add(edge.to);
        if (frontier.has(edge.to)) next.add(edge.from);
      }
    }
    frontier = next;
  }
  return { entities: [...entitySet], edges: [...edgeSet] };
}

export function listAsks(corpusId?: string): AskSession[] {
  let rows = [...state().asks];
  if (corpusId) rows = rows.filter((a) => a.corpusId === corpusId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createAsk(input: {
  corpusId: string;
  query: string;
  mode?: "multi_step" | "single_shot";
}): AskSession {
  const corpus = getCorpus(input.corpusId);
  if (!corpus) throw new Error("corpus_not_found");
  const graph =
    state().graphs.find((g) => {
      const pipe = state().pipelines.find((p) => p.id === g.pipelineRunId);
      return pipe?.corpusId === input.corpusId;
    }) ?? state().graphs[0];

  const mode = input.mode ?? "multi_step";
  const entities = graph?.entities ?? [];
  const edges = graph?.edges ?? [];
  const start = entities[0];
  const mid = entities[1] ?? entities[0];
  const end = entities[2] ?? entities[0];

  const hopTrail: HopStep[] = [];
  if (start && mid) {
    const e1 = edges.find((e) => e.from === start.id && e.to === mid.id);
    hopTrail.push({
      from: start.name,
      to: mid.name,
      label: e1?.label ?? "relates_to",
    });
  }
  if (mid && end && mid.id !== end.id) {
    const e2 = edges.find((e) => e.from === mid.id && e.to === end.id);
    hopTrail.push({
      from: mid.name,
      to: end.name,
      label: e2?.label ?? "supports",
    });
  }

  const citations: Citation[] = hopTrail.map((h, i) => ({
    entityId: entities[i]?.id ?? `e-${i}`,
    entityName: h.to,
    edgeLabel: h.label,
  }));

  const answer =
    mode === "multi_step"
      ? `Based on a consolidated graph (${entities.length} entities), ${input.query.trim()} is answered via ${hopTrail.length}-hop evidence: ${hopTrail.map((h) => `${h.from} → ${h.to}`).join("; ")}.`
      : `Single-shot noisy graph answer for “${input.query.trim()}” — ${entities.length || "many"} raw mentions, limited trail confidence.`;

  const session: AskSession = {
    id: randomUUID(),
    corpusId: input.corpusId,
    query: input.query.trim(),
    answer,
    citations,
    hopTrail,
    qualityMode: mode,
    createdAt: now(),
  };
  state().asks.unshift(session);
  audit("analyst", "ask.create", session.id);
  return session;
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

export function createScenario(input: {
  name: string;
  graphInput: GraphInput;
}): ScenarioCompare {
  const multiStep = scoreMultiStep(input.graphInput);
  const singleShot = scoreSingleShot(input.graphInput);
  let winner: ScenarioCompare["winner"] = "tie";
  if (multiStep.overall > singleShot.overall + 0.01) winner = "multi_step";
  else if (singleShot.overall > multiStep.overall + 0.01) winner = "single_shot";
  const row: ScenarioCompare = {
    id: randomUUID(),
    name: input.name.trim(),
    input: input.graphInput,
    multiStep,
    singleShot,
    winner,
    createdAt: now(),
  };
  state().scenarios.unshift(row);
  audit("engineer", "scenario.compare", row.name);
  return row;
}

export function listScenarios(): ScenarioCompare[] {
  return [...state().scenarios];
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
