/**
 * Write API route handlers for Alzheimer Predict Studio.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const api = join(root, "src/app/api");

function write(rel, body) {
  const p = join(api, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, body);
  console.log("wrote", rel);
}

write(
  "cohorts/route.ts",
  `import { guard, json } from "@/lib/api";
import { createCohort, listCohorts, type CohortModality } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listCohorts(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    modality?: CohortModality;
    size?: number;
    missingnessRate?: number;
    notes?: string;
  };
  if (!body.name || !body.modality || body.size == null || body.missingnessRate == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createCohort({
      name: body.name,
      modality: body.modality,
      size: body.size,
      missingnessRate: body.missingnessRate,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
`,
);

write(
  "features/snapshots/route.ts",
  `import { guard, json } from "@/lib/api";
import { createSnapshot, listSnapshots, type SnapshotStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const cohortId = url.searchParams.get("cohortId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSnapshots(cohortId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    cohortId?: string;
    name?: string;
    status?: SnapshotStatus;
    missingnessRate?: number;
    maskQuality?: number;
    featureCount?: number;
    notes?: string;
  };
  if (!body.cohortId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSnapshot({
        cohortId: body.cohortId,
        name: body.name,
        status: body.status,
        missingnessRate: body.missingnessRate,
        maskQuality: body.maskQuality,
        featureCount: body.featureCount,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "models/route.ts",
  `import { guard, json } from "@/lib/api";
import { createRun, listRuns, type PlanKind, type RunStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const cohortId = url.searchParams.get("cohortId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listRuns(cohortId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    cohortId?: string;
    name?: string;
    status?: RunStatus;
    plan?: PlanKind;
    calibrationPrior?: number;
    notes?: string;
  };
  if (!body.cohortId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createRun({
        cohortId: body.cohortId,
        name: body.name,
        status: body.status,
        plan: body.plan,
        calibrationPrior: body.calibrationPrior,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "uncertainty/route.ts",
  `import { guard, json } from "@/lib/api";
import { createBand, listBands, type BandStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const runId = url.searchParams.get("runId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listBands(runId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    runId?: string;
    name?: string;
    status?: BandStatus;
    lower?: number;
    upper?: number;
    coverageTarget?: number;
    notes?: string;
  };
  if (!body.runId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createBand({
        runId: body.runId,
        name: body.name,
        status: body.status,
        lower: body.lower,
        upper: body.upper,
        coverageTarget: body.coverageTarget,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "explanations/route.ts",
  `import { guard, json } from "@/lib/api";
import { createExplanation, listExplanations } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const runId = url.searchParams.get("runId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listExplanations(runId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    runId?: string;
    name?: string;
    salienceFeature?: string;
    salienceScore?: number;
    notes?: string;
  };
  if (!body.runId || !body.name || !body.salienceFeature) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createExplanation({
        runId: body.runId,
        name: body.name,
        salienceFeature: body.salienceFeature,
        salienceScore: body.salienceScore,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "compare/route.ts",
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
    cohortId?: string;
  };
  if (!body.name || !body.cohortId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({ name: body.name, cohortId: body.cohortId }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
);

write(
  "settings/route.ts",
  `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg, type PlanKind, type ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Partial<{
    name: string;
    webhookUrl: string;
    webhookSecret: string;
    bearerToken: string;
    defaultPlan: PlanKind;
    defaultMode: ScoreMode;
    rateLimitPerMinute: number;
  }>;
  return json(updateOrg(body));
}
`,
);

write(
  "members/route.ts",
  `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers, type MemberRole } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { email?: string; role?: MemberRole };
  if (!body.email || !body.role) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(inviteMember(body.email, body.role), { status: 201 });
}
`,
);

write(
  "audits/route.ts",
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
  "export/audits/route.ts",
  `import { guard } from "@/lib/api";
import { exportAuditsCsv } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportAuditsCsv(), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="audits.csv"',
    },
  });
}
`,
);

write(
  "export/cohorts/route.ts",
  `import { guard } from "@/lib/api";
import { exportCohortsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportCohortsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="cohorts.json"',
    },
  });
}
`,
);

write(
  "features/route.ts",
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
  "goldens-sample/route.ts",
  `import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  const free = scorePlan(input, "imputation_free");
  const fill = scorePlan({ ...input, plan: "impute_then_predict" }, "impute_then_predict");
  return json({ input, imputationFree: free, imputeThenPredict: fill });
}
`,
);

write(
  "webhook/route.ts",
  `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const rawBody = await req.text();
  let payload: unknown = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const signature =
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256");
  const result = ingestWebhook(idempotencyKey, signature, rawBody, payload);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

console.log("API routes ready");
