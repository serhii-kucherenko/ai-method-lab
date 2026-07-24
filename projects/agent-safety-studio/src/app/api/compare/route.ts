import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { SafetyInput } from "@/domain/types";

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
    fleetId?: string;
    safetyInput?: SafetyInput;
  };
  if (!body.name?.trim() || !body.fleetId || !body.safetyInput) {
    return json({ error: "name_fleet_input_required" }, { status: 400 });
  }
  try {
    const row = createCompare({
      name: body.name,
      fleetId: body.fleetId,
      safetyInput: body.safetyInput,
    });
    return json(row, { status: 201 });
  } catch {
    return json({ error: "fleet_not_found" }, { status: 404 });
  }
}
