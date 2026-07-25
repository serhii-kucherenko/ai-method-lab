import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

const GOLDEN_STUB = {
  id: "dws-stub",
  input: {
    wallCoverage: 0.42,
    sensorFidelity: 0.68,
    channelFit: 0.74,
    closedLoopAgreement: 0.65,
    openLoopAccuracy: 0.82,
    openLoopOptimism: 0.7,
    dragPressure: 0.55,
    leakageRisk: 0.28,
    controlBias: "balanced" as const,
    profile: "es_closed_loop" as const,
  },
  expectedEsClosedLoop: {
    mode: "es_closed_loop" as const,
    dragDiagnosis: 0,
    shearDiagnosis: 0,
    actuatorReasonScore: 0,
    sensorIntegrity: 0,
    openLoopScore: 0,
    confidence: 0,
    closedLoopContribution: 0,
    openLoopContribution: 0,
    overall: 0,
  },
  expectedOpenLoopGradient: {
    mode: "open_loop_gradient" as const,
    dragDiagnosis: 0,
    shearDiagnosis: 0,
    actuatorReasonScore: 0,
    sensorIntegrity: 0,
    openLoopScore: 0,
    confidence: 0,
    closedLoopContribution: 0,
    openLoopContribution: 0,
    overall: 0,
  },
};

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  try {
    const first = GOLDENS[0];
    if (first) return json({ golden: first });
  } catch {
    // GOLDENS may be unavailable at runtime
  }
  return json({ golden: GOLDEN_STUB });
}
