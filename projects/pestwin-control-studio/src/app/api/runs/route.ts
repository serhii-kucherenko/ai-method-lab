import { guard, json } from "@/lib/api";
import {
  archivePopulation,
  createPopulation,
  listPopulations,
} from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPopulations({
      q: url.searchParams.get("q") ?? undefined,
      vectorChannel: url.searchParams.get("vectorChannel") ?? undefined,
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
    const population = archivePopulation(body.id);
    if (!population) return json({ error: "not_found" }, { status: 404 });
    return json({ population });
  }
  const population = createPopulation(body);
  return json({ population }, { status: 201 });
}
