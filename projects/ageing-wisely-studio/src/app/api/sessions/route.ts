import { guard, json } from "@/lib/api";
import { createSessionRun, listSessionRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSessionRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      cohortId: url.searchParams.get("cohortId") ?? undefined,
      moduleId: url.searchParams.get("moduleId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createSessionRun({
    packId: body.packId,
    cohortId: body.cohortId,
    moduleId: body.moduleId,
    label: body.label,
    kind: body.kind,
    therapistSupportFidelity: Number(body.therapistSupportFidelity ?? 0.5),
    moduleCompletion: Number(body.moduleCompletion ?? 0.5),
    engagementAdherence: Number(body.engagementAdherence ?? 0.5),
    sessionSignal: Number(body.sessionSignal ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
