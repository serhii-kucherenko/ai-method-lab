import { guard, json } from "@/lib/api";
import { createDomain, listDomains, paginate } from "@/store";
import type { DomainKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listDomains(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    kind?: DomainKind;
    complexity?: number;
    crossLinks?: number;
    notes?: string;
  };
  if (!body.name?.trim()) {
    return json({ error: "name_required" }, { status: 400 });
  }
  const domain = createDomain({
    name: body.name,
    kind: body.kind ?? "supply",
    complexity: body.complexity ?? 0.5,
    crossLinks: body.crossLinks ?? 0,
    notes: body.notes ?? "",
  });
  return json(domain, { status: 201 });
}
