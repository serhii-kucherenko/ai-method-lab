import { guard, json } from "@/lib/api";
import {
  archivePathway,
  createPathway,
  listPathways,
  type PathwayKind,
} from "@/store";

const KINDS: PathwayKind[] = [
  "cfir_codesign",
  "imci_status_quo",
  "hybrid_codesign",
  "referral_only",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listPathways({
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
    const row = archivePathway(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    !KINDS.includes(body.kind as PathwayKind) ||
    typeof body.modelHint !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createPathway({
    packId: body.packId,
    label: body.label,
    kind: body.kind as PathwayKind,
    modelHint: body.modelHint,
    codesignFloor:
      typeof body.codesignFloor === "number" ? body.codesignFloor : 0.4,
    clarityFloor:
      typeof body.clarityFloor === "number" ? body.clarityFloor : 0.35,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
