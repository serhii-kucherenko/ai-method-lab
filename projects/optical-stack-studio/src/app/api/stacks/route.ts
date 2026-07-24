import { guard, json } from "@/lib/api";
import { createStack, listStacks, type StackStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const briefId = url.searchParams.get("briefId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listStacks(briefId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    briefId?: string;
    sequenceId?: string;
    thicknessPlanId?: string;
    name?: string;
    status?: StackStatus;
    coherence?: number;
    notes?: string;
  };
  if (!body.briefId || !body.sequenceId || !body.thicknessPlanId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createStack({
        briefId: body.briefId,
        sequenceId: body.sequenceId,
        thicknessPlanId: body.thicknessPlanId,
        name: body.name,
        status: body.status,
        coherence: body.coherence,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
