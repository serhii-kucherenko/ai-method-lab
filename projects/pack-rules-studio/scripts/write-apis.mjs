import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const routes = {
  "profiles/route.ts": `import { guard, json } from "@/lib/api";
import { createProfile, listProfiles } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Number(url.searchParams.get("pageSize") ?? 20);
  return json(listProfiles(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createProfile(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "rules/route.ts": `import { guard, json } from "@/lib/api";
import { createRule, listRules } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listRules(profileId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createRule(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "preferences/route.ts": `import { guard, json } from "@/lib/api";
import { createPreference, listPreferences } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listPreferences(profileId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createPreference(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "checklists/route.ts": `import { guard, json } from "@/lib/api";
import { createChecklist, listChecklists } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId") ?? undefined;
  return json({ items: listChecklists(profileId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createChecklist(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "optimize/route.ts": `import { guard, json } from "@/lib/api";
import { createOptimize, listOptimizes } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId") ?? undefined;
  return json({ items: listOptimizes(profileId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createOptimize(body), { status: 201 });
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
  try {
    return json(inviteMember(body.email, body.role), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
`,
  "audits/route.ts": `import { guard, json } from "@/lib/api";
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
  "export/checklists/route.ts": `import { guard } from "@/lib/api";
import { exportChecklistsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId") ?? undefined;
  return new Response(exportChecklistsJson(profileId), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
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
import { scorePrefsOnly, scoreRulesPrefs } from "@/domain/pack";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    rulesPrefs: scoreRulesPrefs(input),
    prefsOnly: scorePrefsOnly(input),
  });
}
`,
  "webhook/route.ts": `import { json } from "@/lib/api";
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
};

for (const [rel, body] of Object.entries(routes)) {
  const full = join(root, "src/app/api", rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, body);
}
console.log("wrote", Object.keys(routes).length, "routes");
