import { guard, json } from "@/lib/api";
import { archiveTrait, createTrait, listTraits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTraits({
      q: url.searchParams.get("q") ?? undefined,
      assayChannel: url.searchParams.get("assayChannel") ?? undefined,
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
    const trait = archiveTrait(body.id);
    if (!trait) return json({ error: "not_found" }, { status: 404 });
    return json({ trait });
  }
  const trait = createTrait(body);
  return json({ trait }, { status: 201 });
}
