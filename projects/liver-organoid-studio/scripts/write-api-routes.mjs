import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
};

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
    masldFocus: body.masldFocus ?? body.assayFocus ?? "",
    sessionBudget: body.sessionBudget,
    notes: body.notes,
  });
  return json({ pack }, { status: 201 });
}
`,
);

w(
  "src/app/api/models/route.ts",
  `import { guard, json } from "@/lib/api";
import { archiveModel, createModel, listModels } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listModels({
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
    const model = archiveModel(body.id);
    if (!model) return json({ error: "not_found" }, { status: 404 });
    return json({ model });
  }
  const model = createModel({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "multicellular_hlo",
    protocolHint: body.protocolHint ?? "",
    complexityFloor: Number(body.complexityFloor ?? 0.4),
    fidelityFloor: Number(body.fidelityFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!model) return json({ error: "bad_pack" }, { status: 400 });
  return json({ model }, { status: 201 });
}
`,
);

w(
  "src/app/api/lineages/route.ts",
  `import { guard, json } from "@/lib/api";
import { archiveLineage, createLineage, listLineages } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listLineages({
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
    const lineage = archiveLineage(body.id);
    if (!lineage) return json({ error: "not_found" }, { status: 404 });
    return json({ lineage });
  }
  const lineage = createLineage({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "stellate_include",
    mixHint: body.mixHint ?? "",
    stellateFloor: Number(body.stellateFloor ?? 0.3),
    cholangiocyteFloor: Number(body.cholangiocyteFloor ?? 0.25),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!lineage) return json({ error: "bad_pack" }, { status: 400 });
  return json({ lineage }, { status: 201 });
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
      modelId: url.searchParams.get("modelId") ?? undefined,
      lineageId: url.searchParams.get("lineageId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createAssayRun({
    packId: body.packId ?? "pack-demo",
    modelId: body.modelId ?? "model-demo",
    lineageId: body.lineageId ?? "lineage-demo",
    label: body.label ?? "Assay soft-sim",
    kind: body.kind ?? "differentiation_day",
    multicellularComplexity: Number(body.multicellularComplexity ?? 0.6),
    hepatocyteLikeFidelity: Number(body.hepatocyteLikeFidelity ?? 0.65),
    differentiationDay: Number(body.differentiationDay ?? 0.7),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ assay: run }, { status: 201 });
}
`,
);

w(
  "src/app/api/masld/route.ts",
  `import { guard, json } from "@/lib/api";
import { archiveMasldCase, createMasldCase, listMasldCases } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listMasldCases({
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
    const row = archiveMasldCase(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ masld: row });
  }
  const masld = createMasldCase({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    lipidAccumulation: Number(body.lipidAccumulation ?? 0.5),
    inflammationCue: Number(body.inflammationCue ?? 0.4),
    phenotypeHint: body.phenotypeHint ?? "lipid,inflammation",
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!masld) return json({ error: "bad_pack" }, { status: 400 });
  return json({ masld }, { status: 201 });
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
    name: body.name ?? "Seed organoid compare",
    packId: body.packId ?? "pack-demo",
    modelId: body.modelId ?? "model-demo",
    lineageId: body.lineageId ?? "lineage-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    masldCaseId: body.masldCaseId ?? "masld-demo",
    lineageBias: body.lineageBias ?? body.bias,
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
  const url = new URL(req.url);
  return json({
    items: listAudits(Number(url.searchParams.get("limit") ?? 50)),
  });
}
`,
);

w(
  "src/app/api/export/route.ts",
  `import { guard } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
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
);

w(
  "src/app/api/webhook/route.ts",
  `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key = req.headers.get("idempotency-key") ?? body.idempotencyKey;
  if (!key) return json({ error: "missing_idempotency_key" }, { status: 400 });
  const result = ingestWebhook(key, body, req.headers.get("x-signature"));
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
  const items = featureInventory();
  return json({ count: items.length, items });
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
  return json({ count: GOLDENS.length, sample: GOLDENS.slice(0, 3) });
}
`,
);

console.log("API routes complete");
