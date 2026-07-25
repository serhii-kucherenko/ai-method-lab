import { guard, json } from "@/lib/api";
import { createPlan, listPlans } from "@/store";
import type { AlignmentBias } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPlans({
      packId: url.searchParams.get("packId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const plan = createPlan({
    packId: String(body.packId ?? ""),
    aerialId: String(body.aerialId ?? ""),
    controlPointDensity: Number(body.controlPointDensity ?? 0.5),
    elevationPriorStrength: Number(body.elevationPriorStrength ?? 0.5),
    seamBudgetM: Number(body.seamBudgetM ?? 4),
    alignmentBias: (body.alignmentBias ?? "balanced") as AlignmentBias,
    notes: body.notes ? String(body.notes) : "",
  });
  if (!plan) return json({ error: "pack_or_aerial_required" }, { status: 400 });
  return json({ plan }, { status: 201 });
}
