import { randomUUID } from "node:crypto";
import { penalty, type PenaltyInput, type PenaltyResult } from "./domain/penalty.js";

export type OrgRole = "analyst" | "auditor" | "admin";

type User = { id: string; email: string; password: string };
type Org = { id: string; name: string; created_by: string };
type Citation = {
  id: string;
  org_id: string;
  classification: string;
  gravity_tier: string;
  gbp_amount: number;
  size_pct: number;
  history_pct: number;
  good_faith_pct: number;
  quick_fix_pct: number;
  use_statutory_max: boolean;
  additive_cheat: boolean;
  created_at: string;
};

export type Store = {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  tokens: Map<string, string>;
  orgs: Map<string, Org>;
  members: Map<string, OrgRole>;
  citations: Map<string, Citation>;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

function memberKey(orgId: string, userId: string): string {
  return `${orgId}::${userId}`;
}

export function createStore(opts: { rateLimit?: number } = {}): Store {
  return {
    users: new Map(),
    usersByEmail: new Map(),
    tokens: new Map(),
    orgs: new Map(),
    members: new Map(),
    citations: new Map(),
    rateLimit: opts.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(store: Store, email: string, password: string) {
  const id = randomUUID();
  store.users.set(id, { id, email, password });
  store.usersByEmail.set(email, id);
  return { id, email };
}

export function findUserByEmail(store: Store, email: string) {
  const id = store.usersByEmail.get(email);
  return id ? store.users.get(id) : undefined;
}

export function issueToken(store: Store, userId: string): string {
  const token = randomUUID();
  store.tokens.set(token, userId);
  return token;
}

export function resolveToken(store: Store, token: string): string | null {
  return store.tokens.get(token) ?? null;
}

export function createOrg(store: Store, userId: string, name: string) {
  const id = randomUUID();
  store.orgs.set(id, { id, name, created_by: userId });
  store.members.set(memberKey(id, userId), "admin");
  return { id, name };
}

export function getOrg(store: Store, id: string) {
  const org = store.orgs.get(id);
  return org ? { id: org.id, name: org.name } : undefined;
}

export function assertAccess(
  store: Store,
  orgId: string,
  userId: string,
  roles: OrgRole[],
): OrgRole | null {
  const role = store.members.get(memberKey(orgId, userId));
  if (!role || !roles.includes(role)) return null;
  return role;
}

export type CitationCreate = PenaltyInput & {
  classification: string;
  gravity_tier: string;
  gbp_amount: number;
  size_pct: number;
  history_pct: number;
  good_faith_pct: number;
  quick_fix_pct: number;
};

export function createCitation(store: Store, orgId: string, input: CitationCreate) {
  const id = randomUUID();
  const citation: Citation = {
    id,
    org_id: orgId,
    classification: input.classification,
    gravity_tier: input.gravity_tier,
    gbp_amount: input.gbp_amount,
    size_pct: input.size_pct,
    history_pct: input.history_pct,
    good_faith_pct: input.good_faith_pct,
    quick_fix_pct: input.quick_fix_pct,
    use_statutory_max: input.use_statutory_max === true,
    additive_cheat: input.additive_cheat === true,
    created_at: new Date().toISOString(),
  };
  store.citations.set(id, citation);
  return getCitation(store, orgId, id);
}

export function getCitation(store: Store, orgId: string, id: string) {
  const citation = store.citations.get(id);
  if (!citation || citation.org_id !== orgId) return undefined;
  const { created_at: _c, ...rest } = citation;
  return rest;
}

export function listCitations(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number } = {},
) {
  const all = [...store.citations.values()]
    .filter((c) => c.org_id === orgId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    citations: all.slice(offset, offset + limit).map((c) => {
      const { created_at: _c, ...rest } = c;
      return rest;
    }),
    total,
    limit,
    offset,
  };
}

export function runForecast(
  store: Store,
  orgId: string,
  citationId: string,
): PenaltyResult | null {
  const citation = getCitation(store, orgId, citationId);
  if (!citation) return null;
  const { id: _id, org_id: _org, ...input } = citation;
  return penalty(input);
}

export function addMember(
  store: Store,
  orgId: string,
  userId: string,
  role: OrgRole,
): { ok: true } | { ok: false; error: string } {
  if (!getOrg(store, orgId)) return { ok: false, error: "org_not_found" };
  if (!store.users.get(userId)) return { ok: false, error: "user_not_found" };
  store.members.set(memberKey(orgId, userId), role);
  return { ok: true };
}

export function patchCitation(
  store: Store,
  orgId: string,
  citationId: string,
  patch: Partial<CitationCreate>,
) {
  const existing = store.citations.get(citationId);
  if (!existing || existing.org_id !== orgId) return null;
  const next: Citation = {
    ...existing,
    classification: patch.classification ?? existing.classification,
    gravity_tier: patch.gravity_tier ?? existing.gravity_tier,
    gbp_amount: patch.gbp_amount ?? existing.gbp_amount,
    size_pct: patch.size_pct ?? existing.size_pct,
    history_pct: patch.history_pct ?? existing.history_pct,
    good_faith_pct: patch.good_faith_pct ?? existing.good_faith_pct,
    quick_fix_pct: patch.quick_fix_pct ?? existing.quick_fix_pct,
    use_statutory_max:
      patch.use_statutory_max !== undefined
        ? patch.use_statutory_max
        : existing.use_statutory_max,
    additive_cheat:
      patch.additive_cheat !== undefined ? patch.additive_cheat : existing.additive_cheat,
  };
  store.citations.set(citationId, next);
  return getCitation(store, orgId, citationId);
}

