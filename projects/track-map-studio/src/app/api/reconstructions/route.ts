import { guard, json } from "@/lib/api";
import {
  archiveReconstruction,
  createReconstruction,
  listReconstructions,
} from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listReconstructions({
      q: url.searchParams.get("q") ?? undefined,
      visionChannel: url.searchParams.get("visionChannel") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
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
  if (body.action === "archive") {
    const reconstruction = archiveReconstruction(body.id);
    if (!reconstruction) return json({ error: "not_found" }, { status: 404 });
    return json({ reconstruction });
  }
  const reconstruction = createReconstruction(body);
  return json({ reconstruction }, { status: 201 });
}
