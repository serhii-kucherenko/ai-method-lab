import { guard, json } from "@/lib/api";
import { createAuditRun, listAuditRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAuditRuns({
      signalId: url.searchParams.get("signalId") ?? undefined,
      pillarId: url.searchParams.get("pillarId") ?? undefined,
      policyId: url.searchParams.get("policyId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const audit = createAuditRun({
    signalId: body.signalId ?? body.sessionId,
    pillarId: body.pillarId ?? body.wearerId,
    policyId: body.policyId ?? body.observerId,
    pillarCoverage: Number(body.pillarCoverage ?? body.egoCoverage ?? 0.5),
    policyCompleteness: Number(
      body.policyCompleteness ?? body.exoCoverage ?? 0.5,
    ),
    signalIntegrity: Number(body.signalIntegrity ?? body.fusionClarity ?? 0.5),
    packReadiness: Number(body.packReadiness ?? body.packCompleteness ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!audit) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ audit }, { status: 201 });
}
