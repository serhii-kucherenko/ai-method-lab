import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

const GOLDEN_STUB = {
  id: "qks-stub",
  input: {
    fingerprintCoverage: 0.42,
    kernelFidelity: 0.68,
    targetFit: 0.74,
    multiKernelAgreement: 0.65,
    classicalAccuracy: 0.82,
    classicalOptimism: 0.7,
    bindingHardness: 0.55,
    leakageRisk: 0.28,
    kernelBias: "balanced" as const,
    profile: "quantum_multi_kernel" as const,
  },
  expectedQuantumMultiKernel: {
    mode: "quantum_multi_kernel" as const,
    bindingDiagnosis: 0,
    kernelDiagnosis: 0,
    fingerprintReasonScore: 0,
    targetIntegrity: 0,
    classicalScore: 0,
    confidence: 0,
    quantumContribution: 0,
    classicalContribution: 0,
    overall: 0,
  },
  expectedClassicalKernel: {
    mode: "classical_kernel" as const,
    bindingDiagnosis: 0,
    kernelDiagnosis: 0,
    fingerprintReasonScore: 0,
    targetIntegrity: 0,
    classicalScore: 0,
    confidence: 0,
    quantumContribution: 0,
    classicalContribution: 0,
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
