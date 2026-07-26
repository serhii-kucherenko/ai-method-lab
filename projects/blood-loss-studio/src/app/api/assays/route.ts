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
      birthId: url.searchParams.get("birthId") ?? undefined,
      methodId: url.searchParams.get("methodId") ?? undefined,
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
    typeof body.birthId !== "string" ||
    typeof body.methodId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createAssay({
    packId: body.packId,
    birthId: body.birthId,
    methodId: body.methodId,
    label: body.label,
    kind: body.kind as AssayKind,
    swabMassFidelity:
      typeof body.swabMassFidelity === "number" ? body.swabMassFidelity : 0.5,
    hbDeltaCoverage:
      typeof body.hbDeltaCoverage === "number" ? body.hbDeltaCoverage : 0.4,
    assayFidelity:
      typeof body.assayFidelity === "number" ? body.assayFidelity : 0.6,
    assayReadout:
      typeof body.assayReadout === "number" ? body.assayReadout : 0.6,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "not_found" }, { status: 404 });
  return json(row);
}
