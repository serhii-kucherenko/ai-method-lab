import { guard, json } from "@/lib/api";
import { createScenario, listScenarios } from "@/store";
import type { GraphInput } from "@/domain/types";

export function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ scenarios: listScenarios() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    graphInput?: GraphInput;
  };
  if (!body.name?.trim() || !body.graphInput) {
    return json({ error: "name_and_graphInput_required" }, { status: 400 });
  }
  return json(
    createScenario({ name: body.name, graphInput: body.graphInput }),
    { status: 201 },
  );
}
