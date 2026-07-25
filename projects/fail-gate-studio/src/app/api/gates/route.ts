import { guard, json } from "@/lib/api";
import { createTaxonomy, listTaxonomies } from "@/store";
import type { GateType, SeverityBand } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTaxonomies({
      caseId: url.searchParams.get("caseId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const taxonomy = createTaxonomy({
    caseId: String(body.caseId ?? ""),
    gateType: (body.gateType ?? "refusal") as GateType,
    severityBand: (body.severityBand ?? "moderate") as SeverityBand,
    boundaryCode: String(body.boundaryCode ?? ""),
    notes: body.notes ? String(body.notes) : "",
  });
  if (!taxonomy) return json({ error: "case_required" }, { status: 400 });
  return json({ taxonomy }, { status: 201 });
}
