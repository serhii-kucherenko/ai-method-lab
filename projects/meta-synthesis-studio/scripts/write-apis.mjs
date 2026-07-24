import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function w(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

w(
  "src/app/api/questions/route.ts",
  `import { guard, json } from "@/lib/api";
import { createQuestion, listQuestions } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Number(url.searchParams.get("pageSize") ?? 20);
  return json(listQuestions(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    const row = createQuestion(body);
    return json(row, { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

w(
  "src/app/api/searches/route.ts",
  `import { guard, json } from "@/lib/api";
import { createSearch, listSearches } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const questionId = url.searchParams.get("questionId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSearches(questionId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createSearch(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

w(
  "src/app/api/screens/route.ts",
  `import { guard, json } from "@/lib/api";
import { createScreen, listScreens } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const questionId = url.searchParams.get("questionId") ?? undefined;
  return json({ items: listScreens(questionId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createScreen(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

w(
  "src/app/api/effects/route.ts",
  `import { guard, json } from "@/lib/api";
import { createEffect, exportEffectsJson, listEffects } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const questionId = url.searchParams.get("questionId") ?? undefined;
  if (url.searchParams.get("export") === "json") {
    return new Response(exportEffectsJson(questionId), {
      headers: { "content-type": "application/json" },
    });
  }
  return json({ items: listEffects(questionId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createEffect(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

w(
  "src/app/api/analyses/route.ts",
  `import { guard, json } from "@/lib/api";
import { createAnalysis, listAnalyses } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const questionId = url.searchParams.get("questionId") ?? undefined;
  return json({ items: listAnalyses(questionId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createAnalysis(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

w(
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
  const body = await req.json();
  try {
    return json(createCompare(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

w(
  "src/app/api/settings/route.ts",
  `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  return json(updateOrg(body));
}
`,
);

w(
  "src/app/api/members/route.ts",
  `import { guard, json } from "@/lib/api";
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
  return json(inviteMember(body.email, body.role), { status: 201 });
}
`,
);

w(
  "src/app/api/audits/route.ts",
  `import { guard, json } from "@/lib/api";
import { exportAuditsCsv, listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("export") === "csv") {
    return new Response(exportAuditsCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  return json({ items: listAudits() });
}
`,
);

w(
  "src/app/api/features/route.ts",
  `import { guard, json } from "@/lib/api";
import { listFeatures } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listFeatures() });
}
`,
);

w(
  "src/app/api/goldens-sample/route.ts",
  `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";
import { scoreAdhoc, scoreAgentic } from "@/domain/synthesis";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const g = GOLDENS[0];
  return json({
    id: g.id,
    input: g.input,
    agentic: scoreAgentic(g.input),
    adhoc: scoreAdhoc(g.input),
  });
}
`,
);

w(
  "src/app/api/webhook/route.ts",
  `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.text();
  const signature =
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256");
  const idempotencyKey = req.headers.get("idempotency-key") ?? "missing";
  const result = ingestWebhook(body, signature, idempotencyKey);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

console.log("API routes done");
