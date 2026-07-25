import { guard, json } from "@/lib/api";
import { createControllerRun, listControllerRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listControllerRuns({
      sensorId: url.searchParams.get("sensorId") ?? undefined,
      actuatorId: url.searchParams.get("actuatorId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const run = createControllerRun(await req.json());
  if (!run) return json({ error: "missing_entities" }, { status: 400 });
  return json({ run }, { status: 201 });
}
