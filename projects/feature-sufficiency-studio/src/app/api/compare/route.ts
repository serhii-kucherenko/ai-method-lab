import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";
import type { SufficiencyBias } from "@/store";

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
    name: String(body.name ?? "Partial vs full-feature"),
    caseId: String(body.caseId ?? ""),
    maskId: String(body.maskId ?? ""),
    sufficiencyRunId: String(body.sufficiencyRunId ?? ""),
    sufficiencyBias: body.sufficiencyBias as SufficiencyBias | undefined,
    fullFeatureAccuracy:
      body.fullFeatureAccuracy != null
        ? Number(body.fullFeatureAccuracy)
        : undefined,
    imputationOptimism:
      body.imputationOptimism != null
        ? Number(body.imputationOptimism)
        : undefined,
    missingnessPressure:
      body.missingnessPressure != null
        ? Number(body.missingnessPressure)
        : undefined,
    leakageRisk:
      body.leakageRisk != null ? Number(body.leakageRisk) : undefined,
  });
  if (!compare) return json({ error: "missing_entities" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
