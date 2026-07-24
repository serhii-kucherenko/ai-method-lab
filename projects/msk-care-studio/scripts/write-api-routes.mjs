import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app", "api");

const routes = {
  "episodes/route.ts": `import { guard, json } from "@/lib/api";
import { createEpisode, listEpisodes } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listEpisodes(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    const row = createEpisode(body);
    return json(row, { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "streams/route.ts": `import { guard, json } from "@/lib/api";
import { createStream, listStreams } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const episodeId = url.searchParams.get("episodeId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listStreams(episodeId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createStream(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "knowledge/route.ts": `import { guard, json } from "@/lib/api";
import { createKnowledge, listKnowledge } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const episodeId = url.searchParams.get("episodeId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listKnowledge(episodeId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createKnowledge(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "decisions/route.ts": `import { guard, json } from "@/lib/api";
import { createDecision, listDecisions } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const episodeId = url.searchParams.get("episodeId") ?? undefined;
  return json({ items: listDecisions(episodeId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createDecision(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "pathways/route.ts": `import { guard, json } from "@/lib/api";
import { createPathway, listPathways } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const episodeId = url.searchParams.get("episodeId") ?? undefined;
  return json({ items: listPathways(episodeId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createPathway(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "compare/route.ts": `import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createCompare(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "settings/route.ts": `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  return json(updateOrg(body));
}
`,
  "members/route.ts": `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  return json(inviteMember(body.email, body.role ?? "viewer"), { status: 201 });
}
`,
  "audits/route.ts": `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listAudits() });
}
`,
  "features/route.ts": `import { guard, json } from "@/lib/api";
import { listFeatures } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const items = listFeatures();
  return json({ items, count: items.length });
}
`,
  "goldens-sample/route.ts": `import { guard, json } from "@/lib/api";
import { sampleGoldenInput } from "@/store";
import { scoreEvidenceGrounded, scoreUngroundedLlm } from "@/domain/care";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    evidenceGrounded: scoreEvidenceGrounded(input),
    ungroundedLlm: scoreUngroundedLlm(input),
  });
}
`,
  "webhook/route.ts": `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-signature");
  const idempotencyKey = req.headers.get("idempotency-key") ?? "";
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const result = ingestWebhook(body, signature, idempotencyKey);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
  "export/audits/route.ts": `import { guard } from "@/lib/api";
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
  "export/decisions/route.ts": `import { guard } from "@/lib/api";
import { exportDecisionsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const episodeId = url.searchParams.get("episodeId") ?? undefined;
  return new Response(exportDecisionsJson(episodeId), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=decisions.json",
    },
  });
}
`,
};

for (const [rel, content] of Object.entries(routes)) {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, "utf8");
}
console.log("Wrote", Object.keys(routes).length, "API routes");
