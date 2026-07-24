import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

write(
  "src/app/api/rules/route.ts",
  `import { guard, json } from "@/lib/api";
import { createRulePack, listRulePacks } from "@/store";
import type { DomainKind, RulePackStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listRulePacks(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    domainKind?: DomainKind;
    status?: RulePackStatus;
    coverage?: number;
    ruleCount?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.domainKind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createRulePack({
      name: body.name,
      domainKind: body.domainKind,
      status: body.status,
      coverage: body.coverage,
      ruleCount: body.ruleCount,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/debates/route.ts",
  `import { guard, json } from "@/lib/api";
import { createDebate, listDebates } from "@/store";
import type { DebateStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const rulePackId = url.searchParams.get("rulePackId") ?? undefined;
  return json({ items: listDebates(rulePackId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    rulePackId?: string;
    name?: string;
    status?: DebateStatus;
    turnCount?: number;
    depth?: number;
    challengerPressure?: number;
    consensusStrength?: number;
    notes?: string;
  };
  if (!body.rulePackId || !body.name?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createDebate({
      rulePackId: body.rulePackId,
      name: body.name,
      status: body.status,
      turnCount: body.turnCount,
      depth: body.depth,
      challengerPressure: body.challengerPressure,
      consensusStrength: body.consensusStrength,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/scores/route.ts",
  `import { guard, json } from "@/lib/api";
import { createScore, listScores } from "@/store";
import type { GameScoreStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const rulePackId = url.searchParams.get("rulePackId") ?? undefined;
  return json({ items: listScores(rulePackId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    rulePackId?: string;
    debateId?: string;
    name?: string;
    status?: GameScoreStatus;
    bayesianUpdate?: number;
    teamCoordination?: number;
    evidenceGrounding?: number;
    notes?: string;
  };
  if (!body.rulePackId || !body.debateId || !body.name?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createScore({
      rulePackId: body.rulePackId,
      debateId: body.debateId,
      name: body.name,
      status: body.status,
      bayesianUpdate: body.bayesianUpdate,
      teamCoordination: body.teamCoordination,
      evidenceGrounding: body.evidenceGrounding,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/flags/route.ts",
  `import { guard, json } from "@/lib/api";
import { createFlag, listFlags, resolveFlag } from "@/store";
import type { FlagSeverity, FlagStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const rulePackId = url.searchParams.get("rulePackId") ?? undefined;
  return json({ items: listFlags(rulePackId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    rulePackId?: string;
    debateId?: string;
    name?: string;
    severity?: FlagSeverity;
    status?: FlagStatus;
    fluencyBias?: number;
    contradictionRate?: number;
    notes?: string;
    id?: string;
    resolve?: boolean;
  };
  if (body.resolve && body.id) {
    try {
      const item = resolveFlag(body.id, body.status ?? "resolved");
      return json({ item });
    } catch (e) {
      return json({ error: String(e) }, { status: 400 });
    }
  }
  if (!body.rulePackId || !body.debateId || !body.name?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createFlag({
      rulePackId: body.rulePackId,
      debateId: body.debateId,
      name: body.name,
      severity: body.severity,
      status: body.status,
      fluencyBias: body.fluencyBias,
      contradictionRate: body.contradictionRate,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/agents/route.ts",
  `import { guard, json } from "@/lib/api";
import { createAgent, listAgents } from "@/store";
import type { AgentRole } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listAgents(q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    role?: AgentRole;
    temperature?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.role) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createAgent({
      name: body.name,
      role: body.role,
      temperature: body.temperature,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/compare/route.ts",
  `import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    rulePackId?: string;
  };
  if (!body.name?.trim() || !body.rulePackId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createCompare({
      name: body.name,
      rulePackId: body.rulePackId,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/settings/route.ts",
  `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";
import type { PlanKind, ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ org: getOrg() });
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    defaultPlan?: PlanKind;
    defaultMode?: ScoreMode;
    rateLimitPerMinute?: number;
  };
  const org = updateOrg(body);
  return json({ org });
}
`,
);

write(
  "src/app/api/members/route.ts",
  `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";
import type { MemberRole } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { email?: string; role?: MemberRole };
  if (!body.email?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const item = inviteMember(body.email, body.role ?? "reader");
  return json({ item }, { status: 201 });
}
`,
);

write(
  "src/app/api/audits/route.ts",
  `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "100");
  return json({ items: listAudits(limit) });
}
`,
);

write(
  "src/app/api/export/audits/route.ts",
  `import { guard } from "@/lib/api";
import { exportAuditsCsv } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportAuditsCsv(), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=audits.csv",
    },
  });
}
`,
);

write(
  "src/app/api/export/rules/route.ts",
  `import { guard } from "@/lib/api";
import { exportRulePacksJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportRulePacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=rules.json",
    },
  });
}
`,
);

write(
  "src/app/api/export/debates/route.ts",
  `import { guard } from "@/lib/api";
import { exportDebatesJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportDebatesJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=debates.json",
    },
  });
}
`,
);

write(
  "src/app/api/features/route.ts",
  `import { guard, json } from "@/lib/api";
import { listFeatures } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const items = listFeatures();
  return json({ items, count: items.length });
}
`,
);

write(
  "src/app/api/goldens-sample/route.ts",
  `import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    multiAgent: scorePlan(input, "multi_agent"),
    singleAgent: scorePlan({ ...input, plan: "single_agent" }, "single_agent"),
  });
}
`,
);

write(
  "src/app/api/webhook/route.ts",
  `import { json } from "@/lib/api";
import { receiveWebhook } from "@/store";

export async function POST(req: Request) {
  const idempotencyKey =
    req.headers.get("idempotency-key") ?? req.headers.get("x-idempotency-key");
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const signature =
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256");
  const payload = await req.json().catch(() => ({}));
  const result = receiveWebhook(idempotencyKey, payload, signature);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

console.log("api routes done");
