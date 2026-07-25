import {
  type QuantumKernelInput,
  type QuantumKernelQuality,
  biasWeight,
  bindingLoad,
  clamp,
  round2,
} from "./types";

/**
 * Quantum multiple-kernel QSAR scorer (good path A):
 * rewards fingerprint coverage, kernel fidelity, and target fit under binding hardness.
 */
export function scoreQuantumMultiKernel(
  input: QuantumKernelInput,
): QuantumKernelQuality {
  const quantum = input.profile === "quantum_multi_kernel";
  const boost = quantum ? 1.12 : 0.96;
  const wQ = biasWeight(input.kernelBias, "quantum_strict");
  const wF = biasWeight(input.kernelBias, "fingerprint_first");
  const wC = biasWeight(input.kernelBias, "classical_first");
  const avgBias = (wQ + wF + wC) / 3;
  const load = bindingLoad(input.bindingHardness, input.fingerprintCoverage);

  const bindingDiagnosis = round2(
    clamp(
      (input.fingerprintCoverage * 55 + input.kernelFidelity * 25 - load * 10) *
        boost *
        avgBias +
        (quantum ? 8 : 0) -
        input.leakageRisk * (quantum ? 6 : 14) -
        (input.kernelBias === "classical_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const kernelDiagnosis = round2(
    clamp(
      input.kernelFidelity * 60 * boost +
        input.fingerprintCoverage * 25 +
        (quantum ? 8 : 0) -
        input.classicalOptimism * (quantum ? 4 : 16) -
        (input.kernelBias === "classical_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const fingerprintReasonScore = round2(
    clamp(
      input.multiKernelAgreement * 58 * boost * wF +
        input.fingerprintCoverage * 28 +
        (quantum ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const targetIntegrity = round2(
    clamp(
      input.targetFit * 50 * boost * wQ +
        input.kernelFidelity * 25 +
        input.fingerprintCoverage * 15 +
        (quantum ? 8 : 0) -
        (input.kernelBias === "classical_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const classicalScore = round2(
    clamp(
      input.classicalAccuracy * 55 * boost +
        input.classicalOptimism * 20 -
        input.bindingHardness * 18 -
        (quantum ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.fingerprintCoverage * 40 +
        input.kernelFidelity * 30 +
        input.targetFit * 25 -
        input.classicalOptimism * 15,
      0,
      100,
    ),
  );
  const quantumContribution = round2(
    clamp(
      bindingDiagnosis * 0.26 +
        kernelDiagnosis * 0.24 +
        fingerprintReasonScore * 0.28 +
        targetIntegrity * 0.22,
      0,
      100,
    ),
  );
  const classicalContribution = round2(
    clamp(
      classicalScore * 0.7 +
        input.classicalAccuracy * 20 +
        input.classicalOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      quantumContribution * (quantum ? 0.82 : 0.4) +
        classicalContribution * (quantum ? 0.18 : 0.6) +
        (quantum ? 4 : 0) -
        (input.kernelBias === "classical_first" && quantum ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "quantum_multi_kernel",
    bindingDiagnosis,
    kernelDiagnosis,
    fingerprintReasonScore,
    targetIntegrity,
    classicalScore,
    confidence,
    quantumContribution,
    classicalContribution,
    overall,
  };
}

/**
 * Classical kernel baseline (path B):
 * rewards classical accuracy + optimism, weak on quantum multi-kernel honesty.
 */
export function scoreClassicalKernel(
  input: QuantumKernelInput,
): QuantumKernelQuality {
  const classical = input.profile === "classical_kernel";
  const boost = classical ? 1.08 : 0.92;
  const wC = biasWeight(input.kernelBias, "classical_first");
  const load = bindingLoad(input.bindingHardness, input.fingerprintCoverage);

  const bindingDiagnosis = round2(
    clamp(
      input.classicalAccuracy * 35 * boost +
        wC * 10 -
        input.bindingHardness * 22 -
        input.leakageRisk * 12 -
        (input.kernelBias === "quantum_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const kernelDiagnosis = round2(
    clamp(
      input.classicalOptimism * 40 * boost +
        input.classicalAccuracy * 25 -
        load * 15 -
        input.fingerprintCoverage * 8,
      0,
      100,
    ),
  );
  const fingerprintReasonScore = round2(
    clamp(
      input.classicalOptimism * 38 * boost +
        input.classicalAccuracy * 20 -
        input.targetFit * (classical ? 5 : 0) -
        load * 18 -
        (classical ? 0 : 6),
      0,
      100,
    ),
  );
  const targetIntegrity = round2(
    clamp(
      input.classicalAccuracy * 42 * boost +
        input.classicalOptimism * 28 -
        input.fingerprintCoverage * 10 +
        (classical ? 5 : 0),
      0,
      100,
    ),
  );
  const classicalScore = round2(
    clamp(
      input.classicalAccuracy * 58 * boost * wC +
        input.classicalOptimism * 32 -
        input.bindingHardness * 10 +
        (classical ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.classicalOptimism * 45 +
        input.classicalAccuracy * 35 -
        input.bindingHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const quantumContribution = round2(
    clamp(
      bindingDiagnosis * 0.2 +
        kernelDiagnosis * 0.2 +
        fingerprintReasonScore * 0.2 +
        targetIntegrity * 0.2 +
        classicalScore * 0.2,
      0,
      100,
    ),
  );
  const classicalContribution = round2(
    clamp(
      classicalScore * 0.55 +
        input.classicalOptimism * 30 +
        input.classicalAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      classicalContribution * (classical ? 0.78 : 0.5) +
        quantumContribution * (classical ? 0.22 : 0.5) -
        input.bindingHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "classical_kernel",
    bindingDiagnosis,
    kernelDiagnosis,
    fingerprintReasonScore,
    targetIntegrity,
    classicalScore,
    confidence,
    quantumContribution,
    classicalContribution,
    overall,
  };
}
