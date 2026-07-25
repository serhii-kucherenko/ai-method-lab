import { guard, json } from "@/lib/api";
import { createRun, listRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRuns({
      inpaintId: url.searchParams.get("inpaintId") ?? undefined,
      ppgChannelId: url.searchParams.get("ppgChannelId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createRun({
    inpaintId: body.inpaintId ?? body.reconstructionId,
    ppgChannelId: body.ppgChannelId ?? body.poseConfigId,
    ppgCoverage: body.ppgCoverage ?? body.deformCoverage,
    inpaintFidelity: body.inpaintFidelity ?? body.slamFidelity,
    ecgRecovery: body.ecgRecovery ?? body.poseGrounding,
    packCompleteness: body.packCompleteness,
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
