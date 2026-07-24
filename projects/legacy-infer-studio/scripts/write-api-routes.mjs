/**
 * Write API route handlers for Legacy Infer Studio.
 */
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
  "devices/route.ts",
  `import { guard, json } from "@/lib/api";
import { createDevice, listDevices, type DeviceArch } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listDevices(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    arch?: DeviceArch;
    vramGb?: number;
    usableVramGb?: number;
    computeCapability?: string;
    notes?: string;
  };
  if (!body.name || !body.arch || body.vramGb == null || !body.computeCapability) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createDevice({
      name: body.name,
      arch: body.arch,
      vramGb: body.vramGb,
      usableVramGb: body.usableVramGb,
      computeCapability: body.computeCapability,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
`,
);

write(
  "stages/route.ts",
  `import { guard, json } from "@/lib/api";
import {
  createStage,
  listStages,
  type InferStageKind,
  type StageStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listStages(
      url.searchParams.get("deviceId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deviceId?: string;
    name?: string;
    kind?: InferStageKind;
    status?: StageStatus;
    agreement?: number;
    notes?: string;
  };
  if (!body.deviceId || !body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createStage({
        deviceId: body.deviceId,
        name: body.name,
        kind: body.kind,
        status: body.status,
        agreement: body.agreement,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
`,
);

write(
  "budgets/route.ts",
  `import { guard, json } from "@/lib/api";
import { createBudget, listBudgets, type KernelOp } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listBudgets(
      url.searchParams.get("deviceId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deviceId?: string;
    name?: string;
    op?: KernelOp;
    vramMb?: number;
    efficiency?: number;
    notes?: string;
  };
  if (!body.deviceId || !body.name || !body.op) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createBudget({
        deviceId: body.deviceId,
        name: body.name,
        op: body.op,
        vramMb: body.vramMb,
        efficiency: body.efficiency,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
`,
);

write(
  "kernels/route.ts",
  `import { guard, json } from "@/lib/api";
import { createKernel, listKernels, type KernelOp } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listKernels(
      url.searchParams.get("deviceId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deviceId?: string;
    name?: string;
    op?: KernelOp;
    rewriteSummary?: string;
    speedupHint?: number;
    notes?: string;
  };
  if (!body.deviceId || !body.name || !body.op || !body.rewriteSummary) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createKernel({
        deviceId: body.deviceId,
        name: body.name,
        op: body.op,
        rewriteSummary: body.rewriteSummary,
        speedupHint: body.speedupHint,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
`,
);

write(
  "runs/route.ts",
  `import { guard, json } from "@/lib/api";
import {
  createRun,
  listRuns,
  type PlanKind,
  type ScoreMode,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(listRuns(url.searchParams.get("deviceId") ?? undefined));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deviceId?: string;
    name?: string;
    mode?: ScoreMode;
    plan?: PlanKind;
  };
  if (!body.deviceId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createRun({
        deviceId: body.deviceId,
        name: body.name,
        mode: body.mode,
        plan: body.plan,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
`,
);

write(
  "compare/route.ts",
  `import { guard, json } from "@/lib/api";
import { createCompare, listCompares, type InferInput } from "@/store";

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
    deviceId?: string;
    patch?: Partial<InferInput>;
  };
  if (!body.name || !body.deviceId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({
        name: body.name,
        deviceId: body.deviceId,
        patch: body.patch,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
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
  "export/runs/route.ts",
  `import { guard } from "@/lib/api";
import { exportRunsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportRunsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="runs.json"',
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
import { scoreStageValidated, scoreNaiveOffload } from "@/domain/infer";
import { sampleGoldenInput } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    stageValidated: scoreStageValidated(input),
    naiveOffload: scoreNaiveOffload({ ...input, plan: "naive_offload" }),
  });
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
