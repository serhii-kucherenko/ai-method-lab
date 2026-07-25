import { guard, json } from "@/lib/api";
import { archiveCountry, createCountry, listCountries } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCountries({
      q: url.searchParams.get("q") ?? undefined,
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
    const row = archiveCountry(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ country: row });
  }
  const row = createCountry({
    packId: body.packId,
    label: body.label,
    region: body.region,
    countryHint: body.countryHint ?? "",
    strataCount: Number(body.strataCount ?? 1),
    prefMin: Number(body.prefMin ?? 0.3),
    prefMax: Number(body.prefMax ?? 0.9),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!row) return json({ error: "bad_request" }, { status: 400 });
  return json({ country: row }, { status: 201 });
}
