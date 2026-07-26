import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.name !== "string" ||
    typeof body.packId !== "string" ||
    typeof body.countryId !== "string" ||
    typeof body.antigenId !== "string" ||
    typeof body.panelId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    countryId: body.countryId,
    antigenId: body.antigenId,
    panelId: body.panelId,
    impactBias: body.impactBias as never,
    overclaimRisk:
      typeof body.overclaimRisk === "number" ? body.overclaimRisk : undefined,
    equityGap:
      typeof body.equityGap === "number" ? body.equityGap : undefined,
    panelYears:
      typeof body.panelYears === "number" ? body.panelYears : undefined,
    antigenBreadth:
      typeof body.antigenBreadth === "number" ? body.antigenBreadth : undefined,
  });
  if (!row) return json({ error: "bad_refs" }, { status: 400 });
  return json(row);
}
