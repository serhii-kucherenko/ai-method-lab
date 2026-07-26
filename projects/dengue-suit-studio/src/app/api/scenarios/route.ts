import { guard, json } from "@/lib/api";
import { archiveScenario, createScenario, listScenarios } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listScenarios({
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
    const row = archiveScenario(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ scenario: row });
  }
  const scenario = createScenario({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    horizonHint: body.horizonHint ?? "",
    thermalFloor: Number(body.thermalFloor ?? 0.4),
    shiftFloor: Number(body.shiftFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!scenario) return json({ error: "bad_pack" }, { status: 400 });
  return json({ scenario }, { status: 201 });
}
