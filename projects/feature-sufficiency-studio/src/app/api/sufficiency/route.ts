import { guard, json } from "@/lib/api";
import { createSufficiencyRun, listSufficiencyRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSufficiencyRuns({
      caseId: url.searchParams.get("caseId") ?? undefined,
      maskId: url.searchParams.get("maskId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createSufficiencyRun({
    caseId: String(body.caseId ?? ""),
    maskId: String(body.maskId ?? ""),
    maskCoverage: Number(body.maskCoverage ?? 0.5),
    featureSalience: Number(body.featureSalience ?? 0.5),
    cohortFit: Number(body.cohortFit ?? 0.5),
    labelAgreement: Number(body.labelAgreement ?? 0.5),
    reviewerNotes: body.reviewerNotes ? String(body.reviewerNotes) : undefined,
  });
  if (!run) return json({ error: "missing_entities" }, { status: 400 });
  return json({ run }, { status: 201 });
}
