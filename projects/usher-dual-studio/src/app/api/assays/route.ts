import { guard, json } from "@/lib/api";
import { createAssay, listAssays } from "@/store";
import type { AssayKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listAssays({
      packId: url.searchParams.get("packId") ?? undefined,
      alleleId: url.searchParams.get("alleleId") ?? undefined,
      vectorId: url.searchParams.get("vectorId") ?? undefined,
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
    typeof body.alleleId !== "string" ||
    typeof body.vectorId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createAssay({
    packId: body.packId,
    alleleId: body.alleleId,
    vectorId: body.vectorId,
    label: body.label,
    kind: body.kind as AssayKind,
    myo7aRescue:
      typeof body.myo7aRescue === "number" ? body.myo7aRescue : 0.5,
    myo7bActivation:
      typeof body.myo7bActivation === "number" ? body.myo7bActivation : 0.4,
    alleleGap: typeof body.alleleGap === "number" ? body.alleleGap : 0.6,
    assayReadout:
      typeof body.assayReadout === "number" ? body.assayReadout : 0.6,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "not_found" }, { status: 404 });
  return json(row);
}
