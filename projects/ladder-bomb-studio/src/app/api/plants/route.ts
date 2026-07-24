import { guard, json } from "@/lib/api";
import { createPlant, listPlants, paginate } from "@/store";
import type { PlantCriticality } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listPlants(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    siteCode?: string;
    criticality?: PlantCriticality;
    plcCount?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.siteCode?.trim()) {
    return json({ error: "name_and_site_required" }, { status: 400 });
  }
  const plant = createPlant({
    name: body.name,
    siteCode: body.siteCode,
    criticality: body.criticality ?? "medium",
    plcCount: body.plcCount ?? 2,
    notes: body.notes ?? "",
  });
  return json(plant, { status: 201 });
}
