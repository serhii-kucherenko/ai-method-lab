import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
};

// --- API routes ---
w(
  "src/app/api/packs/route.ts",
  `import { guard, json } from "@/lib/api";
import { archivePack, createPack, listPacks } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPacks({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const pack = archivePack(body.id);
    if (!pack) return json({ error: "not_found" }, { status: 404 });
    return json({ pack });
  }
  const pack = createPack({
    label: body.label,
    version: body.version,
    assayFocus: body.assayFocus ?? body.studyFocus ?? "",
    sessionBudget: body.sessionBudget,
    notes: body.notes,
  });
  return json({ pack }, { status: 201 });
}
`,
);

w(
  "src/app/api/libraries/route.ts",
  `import { guard, json } from "@/lib/api";
import { archiveLibrary, createLibrary, listLibraries } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listLibraries({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const library = archiveLibrary(body.id);
    if (!library) return json({ error: "not_found" }, { status: 404 });
    return json({ library });
  }
  const library = createLibrary({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    scaffoldHint: body.scaffoldHint,
    memberCount: Number(body.memberCount ?? 1000),
    diversityFloor: Number(body.diversityFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!library) return json({ error: "bad_pack" }, { status: 400 });
  return json({ library }, { status: 201 });
}
`,
);

w(
  "src/app/api/cycles/route.ts",
  `import { guard, json } from "@/lib/api";
import { archiveCycle, createCycle, listCycles } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCycles({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const cycle = archiveCycle(body.id);
    if (!cycle) return json({ error: "not_found" }, { status: 404 });
    return json({ cycle });
  }
  const cycle = createCycle({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    cycleHint: body.cycleHint,
    roundCount: Number(body.roundCount ?? 2),
    enrichmentFloor: Number(body.enrichmentFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!cycle) return json({ error: "bad_pack" }, { status: 400 });
  return json({ cycle }, { status: 201 });
}
`,
);

w(
  "src/app/api/hits/route.ts",
  `import { guard, json } from "@/lib/api";
import { archiveHit, createHit, listHits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listHits({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const hit = archiveHit(body.id);
    if (!hit) return json({ error: "not_found" }, { status: 404 });
    return json({ hit });
  }
  const hit = createHit({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    filterHint: body.filterHint,
    hitCount: Number(body.hitCount ?? 24),
    precisionFloor: Number(body.precisionFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!hit) return json({ error: "bad_pack" }, { status: 400 });
  return json({ hit }, { status: 201 });
}
`,
);

w(
  "src/app/api/assays/route.ts",
  `import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      libraryId: url.searchParams.get("libraryId") ?? undefined,
      cycleId: url.searchParams.get("cycleId") ?? undefined,
      hitId: url.searchParams.get("hitId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const assay = createAssayRun({
    packId: body.packId,
    libraryId: body.libraryId,
    cycleId: body.cycleId,
    hitId: body.hitId,
    cycleDepth: Number(body.cycleDepth ?? 0.5),
    enrichmentFold: Number(body.enrichmentFold ?? 0.5),
    diversityRetention: Number(body.diversityRetention ?? 0.5),
    hitPrecision: Number(body.hitPrecision ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!assay) return json({ error: "bad_refs" }, { status: 400 });
  return json({ assay }, { status: 201 });
}
`,
);

w(
  "src/app/api/compare/route.ts",
  `import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const compare = runCompare({
    name: body.name ?? "DELT compare",
    packId: body.packId ?? "pack-demo",
    libraryId: body.libraryId ?? "library-demo",
    cycleId: body.cycleId ?? "cycle-demo",
    hitId: body.hitId ?? "hit-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    deltBias: body.deltBias ?? body.bias,
    libraryCoverage: body.libraryCoverage,
    selectionBias: body.selectionBias,
    synthesisNoise: body.synthesisNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
`,
);

w(
  "src/app/api/scoreboard/route.ts",
  `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: getScoreboard() });
}
`,
);

w(
  "src/app/api/settings/route.ts",
  `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ org: getOrg() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  return json({ org: updateOrg(body) });
}
`,
);

w(
  "src/app/api/members/route.ts",
  `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const member = inviteMember(body.email, body.role ?? "viewer");
  return json({ member }, { status: 201 });
}
`,
);

w(
  "src/app/api/audit/route.ts",
  `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listAudits() });
}
`,
);

w(
  "src/app/api/export/route.ts",
  `import { guard, json } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new Response(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="delt-compares.csv"',
      },
    });
  }
  return new Response(exportPacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="library-packs.json"',
    },
  });
}
`,
);

w(
  "src/app/api/webhook/route.ts",
  `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    body.idempotencyKey ??
    crypto.randomUUID();
  const signature = req.headers.get("x-signature");
  const result = ingestWebhook(key, body, signature);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

w(
  "src/app/api/features/route.ts",
  `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: featureInventory() });
}
`,
);

w(
  "src/app/api/goldens-sample/route.ts",
  `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: GOLDENS.slice(0, 5), total: GOLDENS.length });
}
`,
);

console.log("APIs done");
