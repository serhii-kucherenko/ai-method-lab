import { guard, json } from "@/lib/api";
import { archiveDistill, createDistill, listDistills } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listDistills({
      q: url.searchParams.get("q") ?? undefined,
      taskChannel: url.searchParams.get("taskChannel") ?? undefined,
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
    const row = archiveDistill(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ distill: row });
  }
  const row = createDistill(body);
  return json({ distill: row }, { status: 201 });
}
