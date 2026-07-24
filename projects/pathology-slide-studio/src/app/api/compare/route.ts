import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { EmbedInput } from "@/domain/types";

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
    cohortId?: string;
    embedInput?: EmbedInput;
  };
  if (!body.name?.trim() || !body.cohortId || !body.embedInput) {
    return json({ error: "invalid_compare" }, { status: 400 });
  }
  try {
    const row = createCompare({
      name: body.name,
      cohortId: body.cohortId,
      embedInput: body.embedInput,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "compare_failed" },
      { status: 400 },
    );
  }
}
