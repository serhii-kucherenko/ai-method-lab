import { guard, json } from "@/lib/api";
import { createTerrain, listTerrains, type TerrainKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listTerrains(
      url.searchParams.get("robotId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    robotId?: string;
    name?: string;
    kind?: TerrainKind;
    roughness?: number;
    slopeGrade?: number;
    notes?: string;
  };
  if (!body.robotId || !body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createTerrain({
        robotId: body.robotId,
        name: body.name,
        kind: body.kind,
        roughness: body.roughness,
        slopeGrade: body.slopeGrade,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
