import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const api = join(root, "src/app/api");

function ens(rel) {
  mkdirSync(join(api, rel), { recursive: true });
}

function write(rel, body) {
  ens(dirname(rel));
  writeFileSync(join(api, rel), body);
}

write(
  "pockets/route.ts",
  `import { guard, json } from "@/lib/api";
import { createPocket, listPockets, type PocketFamily } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listPockets(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    family?: PocketFamily;
    volumeA3?: number;
    hydrophobicity?: number;
    notes?: string;
  };
  if (!body.name || !body.family || body.volumeA3 == null || body.hydrophobicity == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createPocket({
      name: body.name,
      family: body.family,
      volumeA3: body.volumeA3,
      hydrophobicity: body.hydrophobicity,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
`,
);

write(
  "candidates/route.ts",
  `import { guard, json } from "@/lib/api";
import {
  createCandidate,
  listCandidates,
  type CandidateStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listCandidates(
      url.searchParams.get("pocketId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    pocketId?: string;
    name?: string;
    smilesHint?: string;
    status?: CandidateStatus;
    qedScore?: number;
    notes?: string;
  };
  if (!body.pocketId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCandidate({
        pocketId: body.pocketId,
        name: body.name,
        smilesHint: body.smilesHint,
        status: body.status,
        qedScore: body.qedScore,
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
  "diffusion/route.ts",
  `import { guard, json } from "@/lib/api";
import {
  createDiffusionRun,
  listDiffusionRuns,
  type DiffusionStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listDiffusionRuns(
      url.searchParams.get("pocketId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    pocketId?: string;
    name?: string;
    status?: DiffusionStatus;
    steps?: number;
    pocketConditioning?: number;
    notes?: string;
  };
  if (!body.pocketId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createDiffusionRun({
        pocketId: body.pocketId,
        name: body.name,
        status: body.status,
        steps: body.steps,
        pocketConditioning: body.pocketConditioning,
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
  "optimize/route.ts",
  `import { guard, json } from "@/lib/api";
import {
  createOptimizePass,
  listOptimizePasses,
  type OptimizeStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listOptimizePasses(
      url.searchParams.get("candidateId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    candidateId?: string;
    name?: string;
    status?: OptimizeStatus;
    propertyWeight?: number;
    notes?: string;
  };
  if (!body.candidateId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createOptimizePass({
        candidateId: body.candidateId,
        name: body.name,
        status: body.status,
        propertyWeight: body.propertyWeight,
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
  "properties/route.ts",
  `import { guard, json } from "@/lib/api";
import { createPropertyEntry, listProperties } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listProperties(
      url.searchParams.get("candidateId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    candidateId?: string;
    name?: string;
    solubility?: number;
    clearanceRisk?: number;
    toxicityRisk?: number;
    synthesizability?: number;
    lipophilicity?: number;
    notes?: string;
  };
  if (!body.candidateId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createPropertyEntry({
        candidateId: body.candidateId,
        name: body.name,
        solubility: body.solubility,
        clearanceRisk: body.clearanceRisk,
        toxicityRisk: body.toxicityRisk,
        synthesizability: body.synthesizability,
        lipophilicity: body.lipophilicity,
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
  const body = (await req.json()) as { name?: string; pocketId?: string };
  if (!body.name || !body.pocketId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({ name: body.name, pocketId: body.pocketId }),
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
import { getOrg, updateOrg, type OrgSettings } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Partial<OrgSettings>;
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
      "content-disposition": "attachment; filename=audits.csv",
    },
  });
}
`,
);

write(
  "export/candidates/route.ts",
  `import { guard } from "@/lib/api";
import { exportCandidatesJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportCandidatesJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=candidates.json",
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
  const develop = scorePlan(input, "pocket_developability");
  const affinity = scorePlan(
    { ...input, plan: "affinity_only" },
    "affinity_only",
  );
  return json({ input, develop, affinity });
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
    payload = JSON.parse(rawBody);
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }
  const key =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!key) return json({ error: "missing_idempotency_key" }, { status: 400 });
  const result = ingestWebhook(
    key,
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256"),
    rawBody,
    payload,
  );
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

console.log("API routes written");
