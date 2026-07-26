import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const ensure = (p) => mkdirSync(p, { recursive: true });

const routes = {
  packs: `import { guard, json } from "@/lib/api";
import { archivePack, createPack, listPacks } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listPacks({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (body.action === "archive" && typeof body.id === "string") {
    const row = archivePack(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.label !== "string" ||
    typeof body.version !== "string" ||
    typeof body.programFocus !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createPack({
      label: body.label,
      version: body.version,
      programFocus: body.programFocus,
      eventBudget:
        typeof body.eventBudget === "number" ? body.eventBudget : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    }),
  );
}
`,
  events: `import { guard, json } from "@/lib/api";
import { archiveEvent, createEvent, listEvents } from "@/store";
import type { EventKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listEvents({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (body.action === "archive" && typeof body.id === "string") {
    const row = archiveEvent(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.hazardHint !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createEvent({
    packId: body.packId,
    label: body.label,
    kind: body.kind as EventKind,
    hazardHint: body.hazardHint,
    pediatricCeiling: Number(body.pediatricCeiling ?? 0.5),
    surgeCeiling: Number(body.surgeCeiling ?? 0.5),
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
`,
  liaisons: `import { guard, json } from "@/lib/api";
import { archiveLiaison, createLiaison, listLiaisons } from "@/store";
import type { LiaisonKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listLiaisons({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (body.action === "archive" && typeof body.id === "string") {
    const row = archiveLiaison(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.specialtyHint !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createLiaison({
    packId: body.packId,
    label: body.label,
    kind: body.kind as LiaisonKind,
    specialtyHint: body.specialtyHint,
    coverageFloor: Number(body.coverageFloor ?? 0.4),
    handoffFloor: Number(body.handoffFloor ?? 0.35),
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
`,
  handoffs: `import { guard, json } from "@/lib/api";
import { createHandoff, listHandoffs } from "@/store";
import type { HandoffKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listHandoffs({
      packId: url.searchParams.get("packId") ?? undefined,
      eventId: url.searchParams.get("eventId") ?? undefined,
      liaisonId: url.searchParams.get("liaisonId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.packId !== "string" ||
    typeof body.eventId !== "string" ||
    typeof body.liaisonId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createHandoff({
    packId: body.packId,
    eventId: body.eventId,
    liaisonId: body.liaisonId,
    label: body.label,
    kind: body.kind as HandoffKind,
    pediatricLoad: Number(body.pediatricLoad ?? 0.3),
    handoffLatency: Number(body.handoffLatency ?? 0.3),
    perinatalRisk: Number(body.perinatalRisk ?? 0.25),
    assaySignal: Number(body.assaySignal ?? 0.7),
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "deps_not_found" }, { status: 404 });
  return json(row);
}
`,
  compare: `import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.name !== "string" ||
    typeof body.packId !== "string" ||
    typeof body.eventId !== "string" ||
    typeof body.liaisonId !== "string" ||
    typeof body.handoffId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    eventId: body.eventId,
    liaisonId: body.liaisonId,
    handoffId: body.handoffId,
  });
  if (!row) return json({ error: "deps_not_found" }, { status: 404 });
  return json(row);
}
`,
  scoreboard: `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: getScoreboard() });
}
`,
  settings: `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  return json(updateOrg(body as Parameters<typeof updateOrg>[0]));
}
`,
  members: `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers, type MemberRole } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (typeof body.email !== "string") {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const role = (typeof body.role === "string" ? body.role : "evaluator") as MemberRole;
  return json(inviteMember(body.email, role));
}
`,
  audit: `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listAudits() });
}
`,
  export: `import { NextResponse } from "next/server";
import { guard, json } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new NextResponse(exportComparesCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  return new NextResponse(exportPacksJson(), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
`,
  webhook: `import { guard, json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    \`auto-\${Date.now()}\`;
  const result = ingestWebhook(
    key,
    body,
    req.headers.get("x-signature"),
  );
  if (!result.ok) {
    return json({ error: result.error }, { status: 400 });
  }
  return json(result);
}
`,
  features: `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: featureInventory() });
}
`,
  "goldens-sample": `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: GOLDENS.slice(0, 5), total: GOLDENS.length });
}
`,
};

for (const [name, src] of Object.entries(routes)) {
  const dir = join(root, "src/app/api", name);
  ensure(dir);
  writeFileSync(join(dir, "route.ts"), src);
}
console.log("api routes written", Object.keys(routes).length);
