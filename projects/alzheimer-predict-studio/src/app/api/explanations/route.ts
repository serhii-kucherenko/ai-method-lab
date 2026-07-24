import { guard, json } from "@/lib/api";
import { createExplanation, listExplanations } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const runId = url.searchParams.get("runId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listExplanations(runId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    runId?: string;
    name?: string;
    salienceFeature?: string;
    salienceScore?: number;
    notes?: string;
  };
  if (!body.runId || !body.name || !body.salienceFeature) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createExplanation({
        runId: body.runId,
        name: body.name,
        salienceFeature: body.salienceFeature,
        salienceScore: body.salienceScore,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
