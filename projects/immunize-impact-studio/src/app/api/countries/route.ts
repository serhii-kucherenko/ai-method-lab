import { guard, json } from "@/lib/api";
import { archiveCountry, createCountry, listCountries } from "@/store";
import type { CountryKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listCountries({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (body.action === "archive" && typeof body.id === "string") {
    const row = archiveCountry(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.regionHint !== "string" ||
    typeof body.coverageFloor !== "number" ||
    typeof body.equityCeiling !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createCountry({
    packId: body.packId,
    label: body.label,
    kind: body.kind as CountryKind,
    regionHint: body.regionHint,
    coverageFloor: body.coverageFloor,
    equityCeiling: body.equityCeiling,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "bad_pack" }, { status: 400 });
  return json(row);
}
