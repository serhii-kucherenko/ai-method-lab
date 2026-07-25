import { guard, json } from "@/lib/api";
import {
  archiveRepresentation,
  createRepresentation,
  listRepresentations,
} from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRepresentations({
      q: url.searchParams.get("q") ?? undefined,
      signalChannel: url.searchParams.get("signalChannel") ?? undefined,
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
    const representation = archiveRepresentation(body.id);
    if (!representation) return json({ error: "not_found" }, { status: 404 });
    return json({ representation });
  }
  const representation = createRepresentation(body);
  return json({ representation }, { status: 201 });
}
