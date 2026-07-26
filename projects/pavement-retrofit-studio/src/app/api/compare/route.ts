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
    typeof body.corridorId !== "string" ||
    typeof body.treatmentId !== "string" ||
    typeof body.assayId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    corridorId: body.corridorId,
    treatmentId: body.treatmentId,
    assayId: body.assayId,
  });
  if (!row) return json({ error: "deps_not_found" }, { status: 404 });
  return json(row);
}
