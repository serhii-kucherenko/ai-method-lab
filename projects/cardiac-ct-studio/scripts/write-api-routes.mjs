/**
 * Write API route handlers for Cardiac CT Studio.
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
  "studies/route.ts",
  `import { guard, json } from "@/lib/api";
import { createStudy, listStudies, type StudyKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listStudies(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    studyKind?: StudyKind;
    sliceCount?: number;
    contrastQuality?: number;
    notes?: string;
  };
  if (!body.name || !body.studyKind || body.sliceCount == null || body.contrastQuality == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createStudy({
      name: body.name,
      studyKind: body.studyKind,
      sliceCount: body.sliceCount,
      contrastQuality: body.contrastQuality,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
`,
);

write(
  "annotations/route.ts",
  `import { guard, json } from "@/lib/api";
import { createAnnotation, listAnnotations, type AnnotationStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const studyId = url.searchParams.get("studyId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listAnnotations(studyId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    studyId?: string;
    name?: string;
    status?: AnnotationStatus;
    expertCoverage?: number;
    priority?: number;
    notes?: string;
  };
  if (!body.studyId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createAnnotation({
        studyId: body.studyId,
        name: body.name,
        status: body.status,
        expertCoverage: body.expertCoverage,
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
  "segments/route.ts",
  `import { guard, json } from "@/lib/api";
import { createSegment, listSegments, type SegmentStatus, type StructureName } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const studyId = url.searchParams.get("studyId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSegments(studyId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    studyId?: string;
    name?: string;
    structure?: StructureName;
    status?: SegmentStatus;
    diceEstimate?: number;
    notes?: string;
  };
  if (!body.studyId || !body.name || !body.structure) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSegment({
        studyId: body.studyId,
        name: body.name,
        structure: body.structure,
        status: body.status,
        diceEstimate: body.diceEstimate,
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
  "phenotypes/route.ts",
  `import { guard, json } from "@/lib/api";
import { createPhenotype, listPhenotypes, type PhenotypeStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const studyId = url.searchParams.get("studyId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listPhenotypes(studyId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    studyId?: string;
    name?: string;
    status?: PhenotypeStatus;
    richness?: number;
    calciumBurden?: number;
    chamberIndex?: number;
    notes?: string;
  };
  if (!body.studyId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createPhenotype({
        studyId: body.studyId,
        name: body.name,
        status: body.status,
        richness: body.richness,
        calciumBurden: body.calciumBurden,
        chamberIndex: body.chamberIndex,
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
  "augment/route.ts",
  `import { guard, json } from "@/lib/api";
import { createAugment, listAugments, type AugmentKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listAugments(q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    kind?: AugmentKind;
    strength?: number;
    preserveAnatomy?: boolean;
    notes?: string;
  };
  if (!body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createAugment({
      name: body.name,
      kind: body.kind,
      strength: body.strength,
      preserveAnatomy: body.preserveAnatomy,
      notes: body.notes,
    }),
    { status: 201 },
  );
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
    studyId?: string;
  };
  if (!body.name || !body.studyId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({ name: body.name, studyId: body.studyId }),
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
  "export/studies/route.ts",
  `import { guard } from "@/lib/api";
import { exportStudiesJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportStudiesJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="studies.json"',
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
  const hitl = scorePlan(input, "hitl_foundation");
  const auto = scorePlan({ ...input, plan: "auto_only" }, "auto_only");
  return json({ input, hitlFoundation: hitl, autoOnly: auto });
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
