import { guard, json } from "@/lib/api";
import { archiveLabel, createLabel, listLabels } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listLabels({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
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
  if (body.action === "archive") {
    const row = archiveLabel(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ label: row });
  }
  const row = createLabel(body);
  if (!row) return json({ error: "invalid_pack" }, { status: 400 });
  return json({ label: row }, { status: 201 });
}
