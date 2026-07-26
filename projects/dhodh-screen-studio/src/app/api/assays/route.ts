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
      screenId: url.searchParams.get("screenId") ?? undefined,
      hitId: url.searchParams.get("hitId") ?? undefined,
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
    typeof body.screenId !== "string" ||
    typeof body.hitId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createAssay({
    packId: body.packId,
    screenId: body.screenId,
    hitId: body.hitId,
    label: body.label,
    kind: body.kind as AssayKind,
    dockingFit: typeof body.dockingFit === "number" ? body.dockingFit : 0.5,
    libraryHitRate:
      typeof body.libraryHitRate === "number" ? body.libraryHitRate : 0.4,
    pharmacophoreMatch:
      typeof body.pharmacophoreMatch === "number"
        ? body.pharmacophoreMatch
        : 0.6,
    assayReadout:
      typeof body.assayReadout === "number" ? body.assayReadout : 0.6,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "not_found" }, { status: 404 });
  return json(row);
}
