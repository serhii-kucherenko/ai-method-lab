import { guard, json } from "@/lib/api";
import {
  archiveDistrict,
  createDistrict,
  listDistricts,
  type DistrictKind,
} from "@/store";

const KINDS: DistrictKind[] = [
  "rural_block",
  "peri_urban",
  "urban_phc_cluster",
  "tribal_outreach",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listDistricts({
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
    const row = archiveDistrict(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    !KINDS.includes(body.kind as DistrictKind) ||
    typeof body.regionHint !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createDistrict({
    packId: body.packId,
    label: body.label,
    kind: body.kind as DistrictKind,
    regionHint: body.regionHint,
    delayCeiling:
      typeof body.delayCeiling === "number" ? body.delayCeiling : 0.4,
    coverageFloor:
      typeof body.coverageFloor === "number" ? body.coverageFloor : 0.4,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
