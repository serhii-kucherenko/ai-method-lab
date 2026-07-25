import { guard, json } from "@/lib/api";
import { createSensingRun, listSensingRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSensingRuns({
      planId: url.searchParams.get("planId") ?? undefined,
      contactId: url.searchParams.get("contactId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const run = createSensingRun(await req.json());
  if (!run) return json({ error: "missing_entities" }, { status: 400 });
  return json({ run }, { status: 201 });
}
