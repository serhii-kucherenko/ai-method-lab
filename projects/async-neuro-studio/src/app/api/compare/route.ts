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
    name: body.name ?? "compare",
    videoId: body.videoId,
    siteId: body.siteId,
    protocolId: body.protocolId,
    examId: body.examId,
    examBias: body.examBias ?? body.bias,
    adHocAdherence: body.adHocAdherence,
    examinerDrift: body.examinerDrift,
    captureNoise: body.captureNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
