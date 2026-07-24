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
  "robots/route.ts",
  `import { guard, json } from "@/lib/api";
import { createRobot, listRobots, type RobotPlatform } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listRobots(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    platform?: RobotPlatform;
    massKg?: number;
    legLengthMm?: number;
    notes?: string;
  };
  if (!body.name || !body.platform || body.massKg == null || body.legLengthMm == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createRobot({
      name: body.name,
      platform: body.platform,
      massKg: body.massKg,
      legLengthMm: body.legLengthMm,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
`,
);

write(
  "terrains/route.ts",
  `import { guard, json } from "@/lib/api";
import { createTerrain, listTerrains, type TerrainKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listTerrains(
      url.searchParams.get("robotId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    robotId?: string;
    name?: string;
    kind?: TerrainKind;
    roughness?: number;
    slopeGrade?: number;
    notes?: string;
  };
  if (!body.robotId || !body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createTerrain({
        robotId: body.robotId,
        name: body.name,
        kind: body.kind,
        roughness: body.roughness,
        slopeGrade: body.slopeGrade,
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
  "skills/route.ts",
  `import { guard, json } from "@/lib/api";
import { createSkill, listSkills, type SkillKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listSkills(
      url.searchParams.get("robotId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    robotId?: string;
    name?: string;
    kind?: SkillKind;
    coverage?: number;
    stability?: number;
    notes?: string;
  };
  if (!body.robotId || !body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSkill({
        robotId: body.robotId,
        name: body.name,
        kind: body.kind,
        coverage: body.coverage,
        stability: body.stability,
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
  "datasets/route.ts",
  `import { guard, json } from "@/lib/api";
import { createDataset, listDatasets, type DatasetKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listDatasets(
      url.searchParams.get("robotId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    robotId?: string;
    name?: string;
    kind?: DatasetKind;
    density?: number;
    episodes?: number;
    notes?: string;
  };
  if (!body.robotId || !body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createDataset({
        robotId: body.robotId,
        name: body.name,
        kind: body.kind,
        density: body.density,
        episodes: body.episodes,
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
  "transitions/route.ts",
  `import { guard, json } from "@/lib/api";
import {
  createTransition,
  listTransitions,
  type SkillKind,
  type TransitionStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listTransitions(
      url.searchParams.get("robotId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    robotId?: string;
    name?: string;
    fromSkill?: SkillKind;
    toSkill?: SkillKind;
    status?: TransitionStatus;
    smoothness?: number;
    notes?: string;
  };
  if (!body.robotId || !body.name || !body.fromSkill || !body.toSkill) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createTransition({
        robotId: body.robotId,
        name: body.name,
        fromSkill: body.fromSkill,
        toSkill: body.toSkill,
        status: body.status,
        smoothness: body.smoothness,
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
  const body = (await req.json()) as { name?: string; robotId?: string };
  if (!body.name || !body.robotId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({ name: body.name, robotId: body.robotId }),
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
  "export/transitions/route.ts",
  `import { guard } from "@/lib/api";
import { exportTransitionsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportTransitionsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=transitions.json",
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
  const multi = scorePlan(input, "multi_skill");
  const single = scorePlan({ ...input, plan: "single_gait" }, "single_gait");
  return json({ input, multi, single });
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
