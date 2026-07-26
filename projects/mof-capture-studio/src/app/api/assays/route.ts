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
      waterId: url.searchParams.get("waterId") ?? undefined,
      sorbentId: url.searchParams.get("sorbentId") ?? undefined,
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
    typeof body.waterId !== "string" ||
    typeof body.sorbentId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createAssay({
    packId: body.packId,
    waterId: body.waterId,
    sorbentId: body.sorbentId,
    label: body.label,
    kind: body.kind as AssayKind,
    ionExchangeFidelity:
      typeof body.ionExchangeFidelity === "number"
        ? body.ionExchangeFidelity
        : 0.5,
    conventionalCapacity:
      typeof body.conventionalCapacity === "number"
        ? body.conventionalCapacity
        : 0.4,
    assayFidelity:
      typeof body.assayFidelity === "number" ? body.assayFidelity : 0.6,
    assayReadout:
      typeof body.assayReadout === "number" ? body.assayReadout : 0.6,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "not_found" }, { status: 404 });
  return json(row);
}
