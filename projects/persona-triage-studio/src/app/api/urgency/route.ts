import { guard, json } from "@/lib/api";
import { createUrgencyRun, listUrgencyRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listUrgencyRuns({
      caseId: url.searchParams.get("caseId") ?? undefined,
      personaId: url.searchParams.get("personaId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createUrgencyRun({
    caseId: String(body.caseId ?? ""),
    personaId: String(body.personaId ?? ""),
    styleFit: Number(body.styleFit ?? 0.5),
    personaCoherence: Number(body.personaCoherence ?? 0.5),
    urgencyAlignment: Number(body.urgencyAlignment ?? 0.5),
    diversityCoverage: Number(body.diversityCoverage ?? 0.5),
    reviewerNotes: body.reviewerNotes ? String(body.reviewerNotes) : "",
  });
  if (!run) return json({ error: "missing_entities" }, { status: 400 });
  return json({ run }, { status: 201 });
}
