/**
 * Writes API routes, pages, tests, and assets for Consult Bench Studio.
 * Run: node scripts/write-product.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

write(
  "src/components/studio-shell.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/claim";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/cases", label: "Cases" },
  { href: "/turns", label: "Turns" },
  { href: "/departments", label: "Departments" },
  { href: "/scores", label: "Scores" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/compare", label: "Compare" },
  { href: "/settings", label: "Settings" },
  { href: "/honesty", label: "Honesty" },
] as const;

export function StudioShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <header className="border-b border-[var(--studio-line)] bg-[color-mix(in_srgb,var(--studio-panel)_92%,transparent)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--studio-mint)]"
          >
            {DISPLAY_NAME}
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(\`\${item.href}/\`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 transition-colors",
                    active
                      ? "bg-[var(--studio-mint-soft)] text-[var(--studio-ink-deep)]"
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
`,
);

const apiRoutes = {
  "src/app/api/cases/route.ts": `import { guard, json } from "@/lib/api";
import { createCase, listCases } from "@/store";
import type { CaseStatus, DepartmentKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const department = (url.searchParams.get("department") ?? undefined) as
    | DepartmentKind
    | undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listCases(q, page, pageSize, department));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    title?: string;
    department?: DepartmentKind;
    status?: CaseStatus;
    patientAgeBand?: string;
    chiefComplaint?: string;
    notes?: string;
  };
  if (!body.title?.trim() || !body.department) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createCase(body as { title: string; department: DepartmentKind });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
  "src/app/api/turns/route.ts": `import { guard, json } from "@/lib/api";
import { createTurn, listTurns } from "@/store";
import type { TurnStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const caseId = url.searchParams.get("caseId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listTurns(q, page, pageSize, caseId));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    caseId?: string;
    label?: string;
    status?: TurnStatus;
    patientText?: string;
    imageCaption?: string;
    hasImage?: boolean;
    imageRelevance?: number;
    visualGrounding?: number;
    turnIndex?: number;
    notes?: string;
  };
  if (!body.caseId || !body.label?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createTurn(body as { caseId: string; label: string });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
  "src/app/api/departments/route.ts": `import { guard, json } from "@/lib/api";
import { createDepartment, listDepartments } from "@/store";
import type { DepartmentKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listDepartments(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    department?: DepartmentKind;
    coverage?: number;
    caseCount?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.department) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createDepartment(body as { name: string; department: DepartmentKind });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
  "src/app/api/scores/route.ts": `import { guard, json } from "@/lib/api";
import { createScore, listScores, scoreConsult } from "@/store";
import type { ConsultInput, ScoreStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listScores(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    caseId?: string;
    turnId?: string;
    name?: string;
    status?: ScoreStatus;
    clinicalCoherence?: number;
    safetyDiscipline?: number;
    turnClarity?: number;
    notes?: string;
    preview?: ConsultInput;
  };
  if (body.preview) {
    return json(scoreConsult(body.preview));
  }
  if (!body.caseId || !body.turnId || !body.name?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createScore(body as { caseId: string; turnId: string; name: string });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
  "src/app/api/leaderboard/route.ts": `import { guard, json } from "@/lib/api";
import { listLeaderboard, upsertLeaderboard } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listLeaderboard(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    modelName?: string;
    promptVariant?: string;
    multimodalAvg?: number;
    textOnlyAvg?: number;
    runs?: number;
    notes?: string;
  };
  if (
    !body.modelName?.trim() ||
    !body.promptVariant?.trim() ||
    typeof body.multimodalAvg !== "number" ||
    typeof body.textOnlyAvg !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const item = upsertLeaderboard({
    modelName: body.modelName,
    promptVariant: body.promptVariant,
    multimodalAvg: body.multimodalAvg,
    textOnlyAvg: body.textOnlyAvg,
    runs: body.runs,
    notes: body.notes,
  });
  return json({ item }, { status: 201 });
}
`,
  "src/app/api/compare/route.ts": `import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { ConsultInput } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listCompares(page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    caseId?: string;
    overrides?: Partial<ConsultInput>;
  };
  if (!body.name?.trim() || !body.caseId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createCompare({
      name: body.name,
      caseId: body.caseId,
      overrides: body.overrides,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
`,
  "src/app/api/settings/route.ts": `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";
import type { OrgSettings } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ org: getOrg() });
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Partial<OrgSettings>;
  return json({ org: updateOrg(body) });
}
`,
  "src/app/api/members/route.ts": `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";
import type { MemberRole } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { email?: string; role?: MemberRole };
  if (!body.email?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const item = inviteMember(body.email, body.role);
  return json({ item }, { status: 201 });
}
`,
  "src/app/api/audits/route.ts": `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listAudits(page, pageSize));
}
`,
  "src/app/api/features/route.ts": `import { guard, json } from "@/lib/api";
import { listFeatures } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listFeatures() });
}
`,
  "src/app/api/goldens-sample/route.ts": `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";
import { scoreMultimodal, scoreTextOnly } from "@/domain/score";
import { scoreMultimodal as scoreMultimodalB, scoreTextOnly as scoreTextOnlyB } from "@/domain/scoreB";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const sample = GOLDENS.slice(0, 3).map((g) => {
    const a1 = scoreMultimodal(g.input);
    const a2 = scoreMultimodalB(g.input);
    const b1 = scoreTextOnly(g.input);
    const b2 = scoreTextOnlyB(g.input);
    return {
      id: g.id,
      dualImplMatch:
        JSON.stringify(a1) === JSON.stringify(a2) &&
        JSON.stringify(b1) === JSON.stringify(b2),
      multimodal: a1,
      textOnly: b1,
    };
  });
  return json({ count: GOLDENS.length, sample });
}
`,
  "src/app/api/webhook/route.ts": `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");
  const idempotencyKey = req.headers.get("idempotency-key");
  const result = ingestWebhook(rawBody, signature, idempotencyKey);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
  "src/app/api/export/cases/route.ts": `import { guard } from "@/lib/api";
import { exportCasesCsv } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportCasesCsv(), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="cases.csv"',
    },
  });
}
`,
  "src/app/api/export/turns/route.ts": `import { guard } from "@/lib/api";
import { exportTurnsCsv } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportTurnsCsv(), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="turns.csv"',
    },
  });
}
`,
  "src/app/api/export/scores/route.ts": `import { guard, json } from "@/lib/api";
import { exportScoresJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: exportScoresJson() });
}
`,
};

for (const [rel, content] of Object.entries(apiRoutes)) {
  write(rel, content);
}

console.log("API routes done");
