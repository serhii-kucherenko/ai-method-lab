import { guard, json } from "@/lib/api";
import { createKineticsRun, listKineticsRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listKineticsRuns({
      surrogateId: url.searchParams.get("surrogateId") ?? undefined,
      rateTableId: url.searchParams.get("rateTableId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const kineticsRun = createKineticsRun(body);
  if (!kineticsRun) return json({ error: "missing_entities" }, { status: 400 });
  return json({ kineticsRun }, { status: 201 });
}
