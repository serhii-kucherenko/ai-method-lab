import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { PredictInput } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json(listCompares());
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = (await req.json()) as {
    name?: string;
    panelId?: string;
    predictInput?: PredictInput;
  };
  if (!body.name?.trim() || !body.panelId || !body.predictInput) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({
        name: body.name,
        panelId: body.panelId,
        predictInput: body.predictInput,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "compare_failed" },
      { status: 400 },
    );
  }
}
