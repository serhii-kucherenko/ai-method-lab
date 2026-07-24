import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { GuardInput } from "@/store";

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
    siteId?: string;
    guardInput?: GuardInput;
  };
  if (!body.name?.trim() || !body.siteId || !body.guardInput) {
    return json({ error: "name_site_input_required" }, { status: 400 });
  }
  try {
    const row = createCompare({
      name: body.name,
      siteId: body.siteId,
      guardInput: body.guardInput,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
