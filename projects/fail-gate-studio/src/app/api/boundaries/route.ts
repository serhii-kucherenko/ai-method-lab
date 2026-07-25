import { guard, json } from "@/lib/api";
import { createInspection, listInspections } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listInspections({
      caseId: url.searchParams.get("caseId") ?? undefined,
      taxonomyId: url.searchParams.get("taxonomyId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const inspection = createInspection({
    caseId: String(body.caseId ?? ""),
    taxonomyId: String(body.taxonomyId ?? ""),
    boundaryFit: Number(body.boundaryFit ?? 0.5),
    evidenceStrength: Number(body.evidenceStrength ?? 0.5),
    taxonomyCoherence: Number(body.taxonomyCoherence ?? 0.5),
    reviewerNotes: body.reviewerNotes ? String(body.reviewerNotes) : "",
  });
  if (!inspection) {
    return json({ error: "case_or_taxonomy_required" }, { status: 400 });
  }
  return json({ inspection }, { status: 201 });
}
