import { guard, json } from "@/lib/api";
import { createRulePack, listRulePacks } from "@/store";
import type { DomainKind, RulePackStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listRulePacks(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    domainKind?: DomainKind;
    status?: RulePackStatus;
    coverage?: number;
    ruleCount?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.domainKind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createRulePack({
      name: body.name,
      domainKind: body.domainKind,
      status: body.status,
      coverage: body.coverage,
      ruleCount: body.ruleCount,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
