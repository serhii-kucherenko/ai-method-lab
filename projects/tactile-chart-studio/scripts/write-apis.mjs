/**
 * Write API routes for Tactile Chart Studio.
 * Run: node scripts/write-apis.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
}

write(
  "src/app/api/charts/route.ts",
  `import { guard, json } from "@/lib/api";
import { createChart, listCharts } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Number(url.searchParams.get("pageSize") ?? 20);
  return json(listCharts(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createChart(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/layers/route.ts",
  `import { guard, json } from "@/lib/api";
import { createLayer, listLayers } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const chartId = url.searchParams.get("chartId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listLayers(chartId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createLayer(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/grammar/route.ts",
  `import { guard, json } from "@/lib/api";
import { createGrammar, listGrammar } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listGrammar(q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createGrammar(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/sessions/route.ts",
  `import { guard, json } from "@/lib/api";
import { createSession, listSessions } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const chartId = url.searchParams.get("chartId") ?? undefined;
  return json({ items: listSessions(chartId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createSession(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/verifies/route.ts",
  `import { guard, json } from "@/lib/api";
import { createVerify, listVerifies } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") ?? undefined;
  return json({ items: listVerifies(sessionId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createVerify(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
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
  const body = await req.json();
  try {
    return json(createCompare(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/settings/route.ts",
  `import { guard, json } from "@/lib/api";
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
);

write(
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
  try {
    return json(inviteMember(body.email, body.role ?? "viewer"), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
);

write(
  "src/app/api/audits/route.ts",
  `import { guard, json } from "@/lib/api";
import { exportAuditsCsv, listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "csv") {
    return new Response(exportAuditsCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  return json({ items: listAudits() });
}
`,
);

write(
  "src/app/api/webhook/route.ts",
  `import { json } from "@/lib/api";
import { checkRateLimit, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const rl = checkRateLimit();
  if (!rl.ok) {
    return json({ error: "rate_limit" }, { status: 429 });
  }
  const body = await req.text();
  const signature = req.headers.get("x-signature");
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
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
);

write(
  "src/app/api/features/route.ts",
  `import { guard, json } from "@/lib/api";
import { listFeatures } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const features = listFeatures();
  return json({ count: features.length, features });
}
`,
);

write(
  "src/app/api/export/layers/route.ts",
  `import { guard } from "@/lib/api";
import { exportLayersJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const chartId = url.searchParams.get("chartId") ?? undefined;
  return new Response(exportLayersJson(chartId), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
`,
);

write(
  "src/app/api/goldens-sample/route.ts",
  `import { guard, json } from "@/lib/api";
import { sampleGoldenInput } from "@/store";
import { scoreTactile, scoreVisual } from "@/domain/tactile";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    tactile: scoreTactile(input),
    visual: scoreVisual(input),
  });
}
`,
);

console.log("apis done");
