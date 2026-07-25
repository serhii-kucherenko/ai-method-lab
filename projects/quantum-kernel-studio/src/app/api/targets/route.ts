import { guard, json } from "@/lib/api";
import { createTarget, listTargets } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTargets({
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
  const target = createTarget(await req.json());
  return json({ target }, { status: 201 });
}
