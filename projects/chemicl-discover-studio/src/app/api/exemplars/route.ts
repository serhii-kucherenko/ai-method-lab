import { guard, json } from "@/lib/api";
import { archiveExemplar, createExemplar, listExemplars } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listExemplars({
      q: url.searchParams.get("q") ?? undefined,
      chemistryChannel: url.searchParams.get("chemistryChannel") ?? undefined,
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
    const exemplar = archiveExemplar(body.id);
    if (!exemplar) return json({ error: "not_found" }, { status: 404 });
    return json({ exemplar });
  }
  const exemplar = createExemplar(body);
  return json({ exemplar }, { status: 201 });
}
