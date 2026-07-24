import { guard, json } from "@/lib/api";
import { createThicknessPlan, listThicknessPlans } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const briefId = url.searchParams.get("briefId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listThicknessPlans(briefId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    briefId?: string;
    sequenceId?: string;
    name?: string;
    thicknessesNm?: number[];
    continuity?: number;
    fabricationFeasibility?: number;
    notes?: string;
  };
  if (!body.briefId || !body.sequenceId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createThicknessPlan({
        briefId: body.briefId,
        sequenceId: body.sequenceId,
        name: body.name,
        thicknessesNm: body.thicknessesNm ?? [80, 40, 90, 45],
        continuity: body.continuity,
        fabricationFeasibility: body.fabricationFeasibility,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
