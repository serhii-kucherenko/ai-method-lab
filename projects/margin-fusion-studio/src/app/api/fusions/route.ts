import { guard, json } from "@/lib/api";
import { createFusion, listFusions } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listFusions({
      q: url.searchParams.get("q") ?? undefined,
      fusionChannel: url.searchParams.get("fusionChannel") ?? undefined,
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
  const fusion = createFusion(body);
  return json({ fusion }, { status: 201 });
}
