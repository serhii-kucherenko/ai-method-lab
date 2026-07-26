import { guard, json } from "@/lib/api";
import { createPanel, listPanels } from "@/store";
import type { PanelKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listPanels({
      packId: url.searchParams.get("packId") ?? undefined,
      countryId: url.searchParams.get("countryId") ?? undefined,
      antigenId: url.searchParams.get("antigenId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.packId !== "string" ||
    typeof body.countryId !== "string" ||
    typeof body.antigenId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.dtp3Coverage !== "number" ||
    typeof body.measlesCoverage !== "number" ||
    typeof body.underFiveMortality !== "number" ||
    typeof body.assaySignal !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createPanel({
    packId: body.packId,
    countryId: body.countryId,
    antigenId: body.antigenId,
    label: body.label,
    kind: body.kind as PanelKind,
    dtp3Coverage: body.dtp3Coverage,
    measlesCoverage: body.measlesCoverage,
    underFiveMortality: body.underFiveMortality,
    assaySignal: body.assaySignal,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "bad_refs" }, { status: 400 });
  return json(row);
}
