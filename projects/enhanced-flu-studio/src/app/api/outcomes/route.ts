import { guard, json } from "@/lib/api";
import { createOutcome, listOutcomes } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listOutcomes({
      packId: url.searchParams.get("packId") ?? undefined,
      countryId: url.searchParams.get("countryId") ?? undefined,
      programId: url.searchParams.get("programId") ?? undefined,
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
    typeof body.programId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createOutcome({
    packId: body.packId,
    countryId: body.countryId,
    programId: body.programId,
    label: body.label,
    kind: body.kind as never,
    coverage65Plus: Number(body.coverage65Plus ?? 0.5),
    eivUptakeShare: Number(body.eivUptakeShare ?? 0.5),
    winterBurdenIndex: Number(body.winterBurdenIndex ?? 0.4),
    assaySignal: Number(body.assaySignal ?? 0.5),
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "bad_refs" }, { status: 400 });
  return json(row);
}
