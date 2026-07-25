import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const compare = runCompare({
    name: body.name,
    inpaintId: body.inpaintId ?? body.reconstructionId,
    ppgChannelId: body.ppgChannelId ?? body.poseConfigId,
    runId: body.runId,
    inpaintBias: body.inpaintBias ?? body.trackBias ?? body.bias,
    alignmentConfidence: body.alignmentConfidence ?? body.kinematicsConfidence,
    alignmentOptimism: body.alignmentOptimism ?? body.kinematicsOptimism,
    segmentHardness: body.segmentHardness ?? body.deformHardness,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
