import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { GenerationInput } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = (await req.json()) as {
    name?: string;
    programId?: string;
    generationInput?: GenerationInput;
  };
  if (!body.name?.trim() || !body.programId || !body.generationInput) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const row = createCompare({
      name: body.name,
      programId: body.programId,
      generationInput: body.generationInput,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "compare_failed" },
      { status: 400 },
    );
  }
}
