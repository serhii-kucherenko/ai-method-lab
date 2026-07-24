import { guard, json } from "@/lib/api";
import { createDataset, listDatasets, type DatasetKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listDatasets(
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
    kind?: DatasetKind;
    density?: number;
    episodes?: number;
    notes?: string;
  };
  if (!body.robotId || !body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createDataset({
        robotId: body.robotId,
        name: body.name,
        kind: body.kind,
        density: body.density,
        episodes: body.episodes,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
