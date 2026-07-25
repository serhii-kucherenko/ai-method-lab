import { guard, json } from "@/lib/api";
import { createScene, listScenes } from "@/store";
import type { Corridor } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listScenes({
      q: url.searchParams.get("q") ?? undefined,
      corridor: url.searchParams.get("corridor") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const scene = createScene({
    packId: body.packId ? String(body.packId) : undefined,
    label: String(body.label ?? "Untitled coarse scene"),
    corridor: String(body.corridor ?? "urban") as Corridor,
    structureHash: String(body.structureHash ?? ""),
    horizonSteps: Number(body.horizonSteps ?? 8),
    structureFit: Number(body.structureFit ?? 0.5),
    notes: body.notes ? String(body.notes) : "",
  });
  return json({ scene }, { status: 201 });
}
