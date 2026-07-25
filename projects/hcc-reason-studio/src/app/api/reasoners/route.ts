import { guard, json } from "@/lib/api";
import { createReasoner, listReasoners } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listReasoners({
      q: url.searchParams.get("q") ?? undefined,
      reasonerChannel: url.searchParams.get("reasonerChannel") ?? undefined,
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
  const reasoner = createReasoner(body);
  return json({ reasoner }, { status: 201 });
}
