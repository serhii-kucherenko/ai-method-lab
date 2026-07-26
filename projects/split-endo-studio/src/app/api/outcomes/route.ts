import { guard, json } from "@/lib/api";
import { createOutcome, listOutcomes } from "@/store";
import type { OutcomeKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listOutcomes({
      packId: url.searchParams.get("packId") ?? undefined,
      caseId: url.searchParams.get("caseId") ?? undefined,
      approachId: url.searchParams.get("approachId") ?? undefined,
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
    typeof body.caseId !== "string" ||
    typeof body.approachId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.bloodLoss !== "number" ||
    typeof body.hospitalStay !== "number" ||
    typeof body.complicationRate !== "number" ||
    typeof body.assaySignal !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createOutcome({
    packId: body.packId,
    caseId: body.caseId,
    approachId: body.approachId,
    label: body.label,
    kind: body.kind as OutcomeKind,
    bloodLoss: body.bloodLoss,
    hospitalStay: body.hospitalStay,
    complicationRate: body.complicationRate,
    assaySignal: body.assaySignal,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "deps_not_found" }, { status: 404 });
  return json(row);
}
