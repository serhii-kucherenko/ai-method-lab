import { guard, json } from "@/lib/api";
import { createFleet, listFleets, paginate } from "@/store";
import type { FleetKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listFleets(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    kind?: FleetKind;
    agentCount?: number;
    riskPressure?: number;
    notes?: string;
  };
  if (!body.name?.trim()) {
    return json({ error: "name_required" }, { status: 400 });
  }
  const fleet = createFleet({
    name: body.name,
    kind: body.kind ?? "iac",
    agentCount: body.agentCount ?? 4,
    riskPressure: body.riskPressure ?? 0.5,
    notes: body.notes ?? "",
  });
  return json(fleet, { status: 201 });
}
