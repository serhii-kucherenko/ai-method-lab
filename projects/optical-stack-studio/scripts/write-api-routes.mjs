import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function w(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

w(
  "src/app/api/briefs/route.ts",
  `import { guard, json } from "@/lib/api";
import { createBrief, listBriefs, type BandKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listBriefs(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    goalText?: string;
    bandKind?: BandKind;
    clarity?: number;
    notes?: string;
  };
  if (!body.name || !body.goalText || !body.bandKind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createBrief({
      name: body.name,
      goalText: body.goalText,
      bandKind: body.bandKind,
      clarity: body.clarity,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
`,
);

w(
  "src/app/api/materials/route.ts",
  `import { guard, json } from "@/lib/api";
import { createSequence, listSequences, type MaterialKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const briefId = url.searchParams.get("briefId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSequences(briefId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    briefId?: string;
    name?: string;
    materials?: MaterialKind[];
    diversity?: number;
    notes?: string;
  };
  if (!body.briefId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSequence({
        briefId: body.briefId,
        name: body.name,
        materials: body.materials ?? ["SiO2", "TiO2"],
        diversity: body.diversity,
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

w(
  "src/app/api/thicknesses/route.ts",
  `import { guard, json } from "@/lib/api";
import { createThicknessPlan, listThicknessPlans } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const briefId = url.searchParams.get("briefId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listThicknessPlans(briefId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    briefId?: string;
    sequenceId?: string;
    name?: string;
    thicknessesNm?: number[];
    continuity?: number;
    fabricationFeasibility?: number;
    notes?: string;
  };
  if (!body.briefId || !body.sequenceId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createThicknessPlan({
        briefId: body.briefId,
        sequenceId: body.sequenceId,
        name: body.name,
        thicknessesNm: body.thicknessesNm ?? [80, 40, 90, 45],
        continuity: body.continuity,
        fabricationFeasibility: body.fabricationFeasibility,
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

w(
  "src/app/api/stacks/route.ts",
  `import { guard, json } from "@/lib/api";
import { createStack, listStacks, type StackStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const briefId = url.searchParams.get("briefId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listStacks(briefId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    briefId?: string;
    sequenceId?: string;
    thicknessPlanId?: string;
    name?: string;
    status?: StackStatus;
    coherence?: number;
    notes?: string;
  };
  if (!body.briefId || !body.sequenceId || !body.thicknessPlanId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createStack({
        briefId: body.briefId,
        sequenceId: body.sequenceId,
        thicknessPlanId: body.thicknessPlanId,
        name: body.name,
        status: body.status,
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

w(
  "src/app/api/spectra/route.ts",
  `import { guard, json } from "@/lib/api";
import { createSpectrum, listSpectra, type SpectrumStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const briefId = url.searchParams.get("briefId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSpectra(briefId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    briefId?: string;
    stackId?: string;
    name?: string;
    status?: SpectrumStatus;
    spectrumFit?: number;
    angleTolerance?: number;
    absorptionLoss?: number;
    notes?: string;
  };
  if (!body.briefId || !body.stackId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSpectrum({
        briefId: body.briefId,
        stackId: body.stackId,
        name: body.name,
        status: body.status,
        spectrumFit: body.spectrumFit,
        angleTolerance: body.angleTolerance,
        absorptionLoss: body.absorptionLoss,
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

w(
  "src/app/api/compare/route.ts",
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
  const body = (await req.json()) as { name?: string; briefId?: string };
  if (!body.name || !body.briefId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(createCompare({ name: body.name, briefId: body.briefId }), {
      status: 201,
    });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
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

w(
  "src/app/api/audits/route.ts",
  `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listAudits() });
}
`,
);

w(
  "src/app/api/export/audits/route.ts",
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

w(
  "src/app/api/export/briefs/route.ts",
  `import { guard } from "@/lib/api";
import { exportBriefsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportBriefsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=briefs.json",
    },
  });
}
`,
);

w(
  "src/app/api/export/stacks/route.ts",
  `import { guard } from "@/lib/api";
import { exportStacksJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportStacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=stacks.json",
    },
  });
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
  const items = listFeatures();
  return json({ items, count: items.length });
}
`,
);

w(
  "src/app/api/goldens-sample/route.ts",
  `import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  const open = scorePlan(input, "open_vocab");
  const catalog = scorePlan(
    { ...input, plan: "catalog_only" },
    "catalog_only",
  );
  return json({ input, open, catalog });
}
`,
);

w(
  "src/app/api/webhook/route.ts",
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
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

console.log("API routes done");
