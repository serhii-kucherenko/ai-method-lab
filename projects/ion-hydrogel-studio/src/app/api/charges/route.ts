import { guard, json } from "@/lib/api";
import { archiveCharge, createCharge, listCharges } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCharges({
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
    const charge = archiveCharge(body.id);
    if (!charge) return json({ error: "not_found" }, { status: 404 });
    return json({ charge });
  }
  const charge = createCharge(body);
  if (!charge) return json({ error: "bad_refs" }, { status: 400 });
  return json({ charge }, { status: 201 });
}
