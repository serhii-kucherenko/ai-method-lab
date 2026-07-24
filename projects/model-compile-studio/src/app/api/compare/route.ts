import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { CompileInput } from "@/domain/types";

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
    modelId?: string;
    compileInput?: CompileInput;
  };
  if (!body.name || !body.modelId || !body.compileInput) {
    return json({ error: "fields_required" }, { status: 400 });
  }
  try {
    const row = createCompare({
      name: body.name,
      modelId: body.modelId,
      compileInput: body.compileInput,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "compare_failed" },
      { status: 400 },
    );
  }
}
