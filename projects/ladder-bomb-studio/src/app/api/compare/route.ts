import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { LadderInput } from "@/store";

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
    programId?: string;
    ladderInput?: LadderInput;
  };
  if (!body.name?.trim() || !body.programId || !body.ladderInput) {
    return json({ error: "name_program_input_required" }, { status: 400 });
  }
  try {
    const row = createCompare({
      name: body.name,
      programId: body.programId,
      ladderInput: body.ladderInput,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
