import { guard, json } from "@/lib/api";
import { createRun, listRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRuns({
      federationId: url.searchParams.get("federationId") ?? undefined,
      schemaId: url.searchParams.get("schemaId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const run = createRun(await req.json());
  if (!run) return json({ error: "missing_entities" }, { status: 400 });
  return json({ run }, { status: 201 });
}
