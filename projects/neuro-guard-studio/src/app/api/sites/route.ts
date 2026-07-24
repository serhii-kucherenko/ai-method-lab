import { guard, json } from "@/lib/api";
import { createSite, listSites, paginate } from "@/store";
import type { SiteCriticality } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listSites(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    code?: string;
    criticality?: SiteCriticality;
    zone?: string;
    notes?: string;
  };
  if (!body.name?.trim() || !body.code?.trim()) {
    return json({ error: "name_and_code_required" }, { status: 400 });
  }
  const site = createSite({
    name: body.name,
    code: body.code,
    criticality: body.criticality ?? "medium",
    zone: body.zone ?? "",
    notes: body.notes ?? "",
  });
  return json(site, { status: 201 });
}
