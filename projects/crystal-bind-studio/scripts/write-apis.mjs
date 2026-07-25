import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function w(rel, s) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, s);
}

function laneRoute(listFn, createFn) {
  return `import { guard, json } from "@/lib/api";
import { ${createFn}, ${listFn} } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  const packId = url.searchParams.get("packId") ?? undefined;
  return json(${listFn}(q, page, pageSize, packId));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(${createFn}(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, { status: 400 });
  }
}
`;
}

w(
  "src/app/api/packs/route.ts",
  `import { guard, json } from "@/lib/api";
import { createPack, listPacks, type PackStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  const status = (url.searchParams.get("status") as PackStatus | null) ?? undefined;
  return json(listPacks(q, page, pageSize, status ?? undefined));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createPack(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, { status: 400 });
  }
}
`,
);

w("src/app/api/structure/route.ts", laneRoute("listStructures", "createStructure"));
w("src/app/api/diffraction/route.ts", laneRoute("listDiffractions", "createDiffraction"));
w("src/app/api/dos/route.ts", laneRoute("listDoses", "createDos"));
w("src/app/api/language/route.ts", laneRoute("listLanguages", "createLanguage"));

w(
  "src/app/api/bind/route.ts",
  `import { guard, json } from "@/lib/api";
import { createBind, listBinds, scoreBind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  const packId = url.searchParams.get("packId") ?? undefined;
  return json(listBinds(q, page, pageSize, packId));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    if (body.action === "score" && body.id) {
      return json(scoreBind(body.id));
    }
    return json(createBind(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, { status: 400 });
  }
}
`,
);

w(
  "src/app/api/retrieve/route.ts",
  `import { guard, json } from "@/lib/api";
import { createRetrieve, listRetrieves } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listRetrieves(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createRetrieve(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, { status: 400 });
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

export async function PATCH(req: Request) {
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
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listAudits(page, pageSize));
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

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: GOLDENS.slice(0, 3) });
}
`,
);

w(
  "src/app/api/webhook/route.ts",
  `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");
  const idempotencyKey = req.headers.get("idempotency-key");
  const result = ingestWebhook(rawBody, signature, idempotencyKey);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

w(
  "src/app/api/export/route.ts",
  `import { guard } from "@/lib/api";
import { exportPacksJson, exportRetrievesCsv } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "packs";
  if (kind === "retrieves") {
    return new Response(exportRetrievesCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  return new Response(exportPacksJson(), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
`,
);

console.log("api ok");
