/**
 * Generate remaining Cardiac Pocus Studio surfaces from templates.
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
};

// API routes
const apis = {
  "src/app/api/packs/route.ts": `import { guard, json } from "@/lib/api";
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
      examBudget:
        typeof body.examBudget === "number" ? body.examBudget : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    }),
  );
}
`,
  "src/app/api/exams/route.ts": `import { guard, json } from "@/lib/api";
import { archiveExam, createExam, listExams, type ExamKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listExams({
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
    const row = archiveExam(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.siteHint !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createExam({
    packId: body.packId,
    label: body.label,
    kind: body.kind as ExamKind,
    siteHint: body.siteHint,
    viewFloor: typeof body.viewFloor === "number" ? body.viewFloor : 0.4,
    probeFloor: typeof body.probeFloor === "number" ? body.probeFloor : 0.4,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
`,
  "src/app/api/patterns/route.ts": `import { guard, json } from "@/lib/api";
import {
  archivePattern,
  createPattern,
  listPatterns,
  type PatternKind,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listPatterns({
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
    const row = archivePattern(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.modelHint !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createPattern({
    packId: body.packId,
    label: body.label,
    kind: body.kind as PatternKind,
    modelHint: body.modelHint,
    cardiacFloor:
      typeof body.cardiacFloor === "number" ? body.cardiacFloor : 0.4,
    associationFloor:
      typeof body.associationFloor === "number" ? body.associationFloor : 0.35,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
`,
  "src/app/api/assays/route.ts": `import { guard, json } from "@/lib/api";
import { createAssay, listAssays, type AssayKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listAssays({
      packId: url.searchParams.get("packId") ?? undefined,
      examId: url.searchParams.get("examId") ?? undefined,
      patternId: url.searchParams.get("patternId") ?? undefined,
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
    typeof body.examId !== "string" ||
    typeof body.patternId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createAssay({
    packId: body.packId,
    examId: body.examId,
    patternId: body.patternId,
    label: body.label,
    kind: body.kind as AssayKind,
    cardiacPatternSignal:
      typeof body.cardiacPatternSignal === "number"
        ? body.cardiacPatternSignal
        : 0.5,
    lungBaselineSignal:
      typeof body.lungBaselineSignal === "number"
        ? body.lungBaselineSignal
        : 0.4,
    probeQuality:
      typeof body.probeQuality === "number" ? body.probeQuality : 0.6,
    assayReadout:
      typeof body.assayReadout === "number" ? body.assayReadout : 0.6,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "refs_not_found" }, { status: 404 });
  return json(row);
}
`,
  "src/app/api/compare/route.ts": `import { guard, json } from "@/lib/api";
import { listCompares, runCompare, type ImagingBias } from "@/store";

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
    typeof body.examId !== "string" ||
    typeof body.patternId !== "string" ||
    typeof body.assayId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    examId: body.examId,
    patternId: body.patternId,
    assayId: body.assayId,
    imagingBias:
      typeof body.imagingBias === "string"
        ? (body.imagingBias as ImagingBias)
        : undefined,
    overclaimRisk:
      typeof body.overclaimRisk === "number" ? body.overclaimRisk : undefined,
  });
  if (!row) return json({ error: "refs_not_found" }, { status: 404 });
  return json(row);
}
`,
  "src/app/api/scoreboard/route.ts": `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: getScoreboard() });
}
`,
  "src/app/api/settings/route.ts": `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg, type ImagingBias, type ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  return json(
    updateOrg({
      name: typeof body.name === "string" ? body.name : undefined,
      webhookUrl:
        typeof body.webhookUrl === "string" ? body.webhookUrl : undefined,
      webhookSecret:
        typeof body.webhookSecret === "string" ? body.webhookSecret : undefined,
      bearerToken:
        typeof body.bearerToken === "string" ? body.bearerToken : undefined,
      defaultImagingBias:
        typeof body.defaultImagingBias === "string"
          ? (body.defaultImagingBias as ImagingBias)
          : undefined,
      defaultMode:
        typeof body.defaultMode === "string"
          ? (body.defaultMode as ScoreMode)
          : undefined,
      rateLimitPerMinute:
        typeof body.rateLimitPerMinute === "number"
          ? body.rateLimitPerMinute
          : undefined,
    }),
  );
}
`,
  "src/app/api/members/route.ts": `import { guard, json } from "@/lib/api";
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
  if (typeof body.email !== "string" || typeof body.role !== "string") {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(inviteMember(body.email, body.role as MemberRole));
}
`,
  "src/app/api/audit/route.ts": `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "50");
  return json({ items: listAudits(limit) });
}
`,
  "src/app/api/export/route.ts": `import { guard, json } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new Response(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="compares.csv"',
      },
    });
  }
  return new Response(exportPacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="packs.json"',
    },
  });
}
`,
  "src/app/api/webhook/route.ts": `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    (typeof body === "object" &&
    body &&
    "idempotencyKey" in body &&
    typeof (body as { idempotencyKey: unknown }).idempotencyKey === "string"
      ? (body as { idempotencyKey: string }).idempotencyKey
      : null);
  if (!key) return json({ error: "missing_idempotency_key" }, { status: 400 });
  const result = ingestWebhook(
    key,
    body,
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256"),
  );
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
  "src/app/api/features/route.ts": `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: featureInventory() });
}
`,
  "src/app/api/goldens-sample/route.ts": `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: GOLDENS.slice(0, 3), total: GOLDENS.length });
}
`,
};

for (const [rel, content] of Object.entries(apis)) w(rel, content);
console.log("wrote", Object.keys(apis).length, "api routes");
