/**
 * Write API route handlers for Thorax Localize Studio.
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
  "exams/route.ts",
  `import { guard, json } from "@/lib/api";
import { createExam, listExams, type ExamKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listExams(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    examKind?: ExamKind;
    viewCount?: number;
    imageQuality?: number;
    notes?: string;
  };
  if (!body.name || !body.examKind || body.viewCount == null || body.imageQuality == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createExam({
      name: body.name,
      examKind: body.examKind,
      viewCount: body.viewCount,
      imageQuality: body.imageQuality,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
`,
);

write(
  "findings/route.ts",
  `import { guard, json } from "@/lib/api";
import {
  createFinding,
  listFindings,
  type DiseaseLabel,
  type FindingStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const examId = url.searchParams.get("examId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listFindings(examId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    examId?: string;
    name?: string;
    disease?: DiseaseLabel;
    status?: FindingStatus;
    confidence?: number;
    notes?: string;
  };
  if (!body.examId || !body.name || !body.disease) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createFinding({
        examId: body.examId,
        name: body.name,
        disease: body.disease,
        status: body.status,
        confidence: body.confidence,
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
  "lesions/route.ts",
  `import { guard, json } from "@/lib/api";
import { createLesion, listLesions, type LesionStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const examId = url.searchParams.get("examId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listLesions(examId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    examId?: string;
    findingId?: string;
    name?: string;
    status?: LesionStatus;
    boundaryClarity?: number;
    laterality?: "left" | "right" | "bilateral" | "midline";
    notes?: string;
  };
  if (!body.examId || !body.findingId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createLesion({
        examId: body.examId,
        findingId: body.findingId,
        name: body.name,
        status: body.status,
        boundaryClarity: body.boundaryClarity,
        laterality: body.laterality,
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
  "maps/route.ts",
  `import { guard, json } from "@/lib/api";
import { createMap, listMaps, type MapStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const examId = url.searchParams.get("examId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listMaps(examId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    examId?: string;
    lesionId?: string;
    name?: string;
    status?: MapStatus;
    peakStrength?: number;
    coherence?: number;
    notes?: string;
  };
  if (!body.examId || !body.lesionId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createMap({
        examId: body.examId,
        lesionId: body.lesionId,
        name: body.name,
        status: body.status,
        peakStrength: body.peakStrength,
        coherence: body.coherence,
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
  "validation/route.ts",
  `import { guard, json } from "@/lib/api";
import {
  createValidation,
  listValidations,
  type ValidationStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const examId = url.searchParams.get("examId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listValidations(examId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    examId?: string;
    name?: string;
    status?: ValidationStatus;
    confidence?: number;
    priority?: number;
    notes?: string;
  };
  if (!body.examId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createValidation({
        examId: body.examId,
        name: body.name,
        status: body.status,
        confidence: body.confidence,
        priority: body.priority,
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
    examId?: string;
  };
  if (!body.name || !body.examId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({ name: body.name, examId: body.examId }),
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
  "export/exams/route.ts",
  `import { guard } from "@/lib/api";
import { exportExamsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportExamsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="exams.json"',
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
  const localize = scorePlan(input, "classify_localize");
  const classify = scorePlan({ ...input, plan: "classify_only" }, "classify_only");
  return json({ input, classifyLocalize: localize, classifyOnly: classify });
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
