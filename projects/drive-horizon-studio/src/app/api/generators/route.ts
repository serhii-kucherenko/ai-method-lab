import { guard, json } from "@/lib/api";
import { createGenerator, listGenerators } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listGenerators({
      sceneId: url.searchParams.get("sceneId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const generator = createGenerator({
    sceneId: String(body.sceneId ?? ""),
    fidelity: Number(body.fidelity ?? 0.5),
    temporalConsistency: Number(body.temporalConsistency ?? 0.5),
    textureRichness: Number(body.textureRichness ?? 0.5),
    reviewerNotes: body.reviewerNotes ? String(body.reviewerNotes) : "",
  });
  if (!generator) return json({ error: "missing_scene" }, { status: 400 });
  return json({ generator }, { status: 201 });
}
