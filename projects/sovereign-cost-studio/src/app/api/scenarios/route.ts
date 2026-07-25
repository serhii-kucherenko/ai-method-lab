import { guard, json } from "@/lib/api";
import { archiveScenario, createScenario, listScenarios } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listScenarios({
      q: url.searchParams.get("q") ?? undefined,
      regionChannel: url.searchParams.get("regionChannel") ?? undefined,
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
    const scenario = archiveScenario(body.id);
    if (!scenario) return json({ error: "not_found" }, { status: 404 });
    return json({ scenario });
  }
  const scenario = createScenario(body);
  return json({ scenario }, { status: 201 });
}
