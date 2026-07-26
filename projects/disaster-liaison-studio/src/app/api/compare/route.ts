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
    typeof body.eventId !== "string" ||
    typeof body.liaisonId !== "string" ||
    typeof body.handoffId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    eventId: body.eventId,
    liaisonId: body.liaisonId,
    handoffId: body.handoffId,
  });
  if (!row) return json({ error: "deps_not_found" }, { status: 404 });
  return json(row);
}
