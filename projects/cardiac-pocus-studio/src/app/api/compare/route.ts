import { guard, json } from "@/lib/api";
import { listCompares, runCompare, type ImagingBias } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.name !== "string" ||
    typeof body.packId !== "string" ||
    typeof body.examId !== "string" ||
    typeof body.patternId !== "string" ||
    typeof body.assayId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    examId: body.examId,
    patternId: body.patternId,
    assayId: body.assayId,
    imagingBias:
      typeof body.imagingBias === "string"
        ? (body.imagingBias as ImagingBias)
        : undefined,
    overclaimRisk:
      typeof body.overclaimRisk === "number" ? body.overclaimRisk : undefined,
  });
  if (!row) return json({ error: "refs_not_found" }, { status: 404 });
  return json(row);
}
