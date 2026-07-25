import type { QuantumKernelInput, QuantumKernelQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: QuantumKernelInput;
  expectedQuantumMultiKernel: QuantumKernelQuality;
  expectedClassicalKernel: QuantumKernelQuality;
};

export const GOLDENS: Golden[] = [
  {
    "id": "qks-001",
    "input": {
      "fingerprintCoverage": 0.29,
      "kernelFidelity": 0.25,
      "targetFit": 0.28,
      "multiKernelAgreement": 0.34,
      "classicalAccuracy": 0.39,
      "classicalOptimism": 0.45,
      "bindingHardness": 0.59,
      "leakageRisk": 0.5,
      "kernelBias": "balanced",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 22.56,
      "kernelDiagnosis": 30.25,
      "fingerprintReasonScore": 27.38,
      "targetIntegrity": 34.28,
      "classicalScore": 16.4,
      "confidence": 19.35,
      "quantumContribution": 28.33,
      "classicalContribution": 15.96,
      "overall": 30.1
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 5.76,
      "kernelDiagnosis": 17.09,
      "fingerprintReasonScore": 13.13,
      "targetIntegrity": 32.39,
      "classicalScore": 40.93,
      "confidence": 17.1,
      "quantumContribution": 21.86,
      "classicalContribution": 38.6,
      "overall": 27.2
    }
  },
  {
    "id": "qks-002",
    "input": {
      "fingerprintCoverage": 0.33,
      "kernelFidelity": 0.29,
      "targetFit": 0.32,
      "multiKernelAgreement": 0.38,
      "classicalAccuracy": 0.43,
      "classicalOptimism": 0.46,
      "bindingHardness": 0.6,
      "leakageRisk": 0.51,
      "kernelBias": "fingerprint_first",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 22.22,
      "kernelDiagnosis": 33.9,
      "fingerprintReasonScore": 39.65,
      "targetIntegrity": 30.06,
      "classicalScore": 18.89,
      "confidence": 23,
      "quantumContribution": 31.63,
      "classicalContribution": 18.61,
      "overall": 33.29
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 2.43,
      "kernelDiagnosis": 18.22,
      "fingerprintReasonScore": 14.16,
      "targetIntegrity": 34.08,
      "classicalScore": 31.53,
      "confidence": 18.65,
      "quantumContribution": 20.08,
      "classicalContribution": 34.53,
      "overall": 23.49
    }
  },
  {
    "id": "qks-003",
    "input": {
      "fingerprintCoverage": 0.37,
      "kernelFidelity": 0.27,
      "targetFit": 0.36,
      "multiKernelAgreement": 0.42,
      "classicalAccuracy": 0.46,
      "classicalOptimism": 0.42,
      "bindingHardness": 0.6,
      "leakageRisk": 0.46,
      "kernelBias": "classical_first",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 12.18,
      "kernelDiagnosis": 23.71,
      "fingerprintReasonScore": 23.1,
      "targetIntegrity": 17.39,
      "classicalScore": 19.94,
      "confidence": 25.6,
      "quantumContribution": 19.15,
      "classicalContribution": 19.69,
      "overall": 20.25
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 12.17,
      "kernelDiagnosis": 17.1,
      "fingerprintReasonScore": 13.13,
      "targetIntegrity": 33.93,
      "classicalScore": 54.34,
      "confidence": 18.4,
      "quantumContribution": 26.13,
      "classicalContribution": 46.58,
      "overall": 34.52
    }
  },
  {
    "id": "qks-004",
    "input": {
      "fingerprintCoverage": 0.33,
      "kernelFidelity": 0.32,
      "targetFit": 0.39,
      "multiKernelAgreement": 0.38,
      "classicalAccuracy": 0.42,
      "classicalOptimism": 0.43,
      "bindingHardness": 0.53,
      "leakageRisk": 0.46,
      "kernelBias": "balanced",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 28.09,
      "kernelDiagnosis": 36.03,
      "fingerprintReasonScore": 32.42,
      "targetIntegrity": 42.79,
      "classicalScore": 18.93,
      "confidence": 26.1,
      "quantumContribution": 34.44,
      "classicalContribution": 19.05,
      "overall": 35.67
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 8.7,
      "kernelDiagnosis": 17.81,
      "fingerprintReasonScore": 13.75,
      "targetIntegrity": 32.79,
      "classicalScore": 42.77,
      "confidence": 18.85,
      "quantumContribution": 23.16,
      "classicalContribution": 40.22,
      "overall": 29.47
    }
  },
  {
    "id": "qks-005",
    "input": {
      "fingerprintCoverage": 0.37,
      "kernelFidelity": 0.36,
      "targetFit": 0.35,
      "multiKernelAgreement": 0.42,
      "classicalAccuracy": 0.46,
      "classicalOptimism": 0.45,
      "bindingHardness": 0.53,
      "leakageRisk": 0.47,
      "kernelBias": "quantum_strict",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 26.86,
      "kernelDiagnosis": 39.64,
      "fingerprintReasonScore": 23.89,
      "targetIntegrity": 49.01,
      "classicalScore": 21.8,
      "confidence": 27.6,
      "quantumContribution": 33.97,
      "classicalContribution": 22.19,
      "overall": 35.85
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 0,
      "kernelDiagnosis": 19.51,
      "fingerprintReasonScore": 15.76,
      "targetIntegrity": 34.77,
      "classicalScore": 32.95,
      "confidence": 21.05,
      "quantumContribution": 20.6,
      "classicalContribution": 36.31,
      "overall": 25.79
    }
  },
  {
    "id": "qks-006",
    "input": {
      "fingerprintCoverage": 0.41,
      "kernelFidelity": 0.34,
      "targetFit": 0.39,
      "multiKernelAgreement": 0.45,
      "classicalAccuracy": 0.5,
      "classicalOptimism": 0.4,
      "bindingHardness": 0.54,
      "leakageRisk": 0.42,
      "kernelBias": "balanced",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 33.94,
      "kernelDiagnosis": 39.5,
      "fingerprintReasonScore": 39.74,
      "targetIntegrity": 44.49,
      "classicalScore": 23.08,
      "confidence": 30.35,
      "quantumContribution": 39.22,
      "classicalContribution": 23.38,
      "overall": 40.37
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 11.98,
      "kernelDiagnosis": 18.04,
      "fingerprintReasonScore": 14.31,
      "targetIntegrity": 34.78,
      "classicalScore": 46.72,
      "confidence": 20.5,
      "quantumContribution": 25.17,
      "classicalContribution": 43.18,
      "overall": 32.38
    }
  },
  {
    "id": "qks-007",
    "input": {
      "fingerprintCoverage": 0.45,
      "kernelFidelity": 0.38,
      "targetFit": 0.42,
      "multiKernelAgreement": 0.49,
      "classicalAccuracy": 0.53,
      "classicalOptimism": 0.42,
      "bindingHardness": 0.55,
      "leakageRisk": 0.43,
      "kernelBias": "fingerprint_first",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 31.59,
      "kernelDiagnosis": 43.11,
      "fingerprintReasonScore": 54.51,
      "targetIntegrity": 37.19,
      "classicalScore": 25.15,
      "confidence": 33.6,
      "quantumContribution": 42,
      "classicalContribution": 25.64,
      "overall": 43.06
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 8.27,
      "kernelDiagnosis": 19.34,
      "fingerprintReasonScore": 15.59,
      "targetIntegrity": 36.3,
      "classicalScore": 34.2,
      "confidence": 22.15,
      "quantumContribution": 22.74,
      "classicalContribution": 37.5,
      "overall": 27.27
    }
  },
  {
    "id": "qks-008",
    "input": {
      "fingerprintCoverage": 0.41,
      "kernelFidelity": 0.43,
      "targetFit": 0.46,
      "multiKernelAgreement": 0.45,
      "classicalAccuracy": 0.49,
      "classicalOptimism": 0.43,
      "bindingHardness": 0.47,
      "leakageRisk": 0.44,
      "kernelBias": "classical_first",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 19.33,
      "kernelDiagnosis": 35.43,
      "fingerprintReasonScore": 27.26,
      "targetIntegrity": 25.07,
      "classicalScore": 24.32,
      "confidence": 34.35,
      "quantumContribution": 26.68,
      "classicalContribution": 25.23,
      "overall": 27.42
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 16.4,
      "kernelDiagnosis": 20.18,
      "fingerprintReasonScore": 16.31,
      "targetIntegrity": 35.17,
      "classicalScore": 58.5,
      "confidence": 22.7,
      "quantumContribution": 29.31,
      "classicalContribution": 50.95,
      "overall": 39.79
    }
  },
  {
    "id": "qks-009",
    "input": {
      "fingerprintCoverage": 0.46,
      "kernelFidelity": 0.41,
      "targetFit": 0.5,
      "multiKernelAgreement": 0.49,
      "classicalAccuracy": 0.53,
      "classicalOptimism": 0.39,
      "bindingHardness": 0.48,
      "leakageRisk": 0.38,
      "kernelBias": "balanced",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 40.05,
      "kernelDiagnosis": 45.49,
      "fingerprintReasonScore": 45.04,
      "targetIntegrity": 53.15,
      "classicalScore": 25.81,
      "confidence": 37.35,
      "quantumContribution": 45.63,
      "classicalContribution": 26.69,
      "overall": 46.22
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 14.91,
      "kernelDiagnosis": 19.07,
      "fingerprintReasonScore": 15.29,
      "targetIntegrity": 35.36,
      "classicalScore": 48.88,
      "confidence": 22.7,
      "quantumContribution": 26.7,
      "classicalContribution": 45.27,
      "overall": 35.06
    }
  },
  {
    "id": "qks-010",
    "input": {
      "fingerprintCoverage": 0.5,
      "kernelFidelity": 0.45,
      "targetFit": 0.46,
      "multiKernelAgreement": 0.53,
      "classicalAccuracy": 0.57,
      "classicalOptimism": 0.4,
      "bindingHardness": 0.49,
      "leakageRisk": 0.39,
      "kernelBias": "quantum_strict",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 36.62,
      "kernelDiagnosis": 49.14,
      "fingerprintReasonScore": 33.16,
      "targetIntegrity": 61.53,
      "classicalScore": 28.29,
      "confidence": 39,
      "quantumContribution": 44.14,
      "classicalContribution": 29.32,
      "overall": 45.47
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 3.59,
      "kernelDiagnosis": 20.18,
      "fingerprintReasonScore": 16.7,
      "targetIntegrity": 37.06,
      "classicalScore": 35.54,
      "confidence": 24.25,
      "quantumContribution": 22.61,
      "classicalContribution": 39.03,
      "overall": 29.16
    }
  },
  {
    "id": "qks-011",
    "input": {
      "fingerprintCoverage": 0.54,
      "kernelFidelity": 0.49,
      "targetFit": 0.49,
      "multiKernelAgreement": 0.57,
      "classicalAccuracy": 0.6,
      "classicalOptimism": 0.42,
      "bindingHardness": 0.49,
      "leakageRisk": 0.4,
      "kernelBias": "balanced",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 47.21,
      "kernelDiagnosis": 52.75,
      "fingerprintReasonScore": 52.38,
      "targetIntegrity": 55.79,
      "classicalScore": 30.54,
      "confidence": 42.25,
      "quantumContribution": 51.87,
      "classicalContribution": 31.82,
      "overall": 52.26
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 17.1,
      "kernelDiagnosis": 21.62,
      "fingerprintReasonScore": 18.14,
      "targetIntegrity": 38.58,
      "classicalScore": 54.12,
      "confidence": 26.1,
      "quantumContribution": 29.91,
      "classicalContribution": 50.52,
      "overall": 39.67
    }
  },
  {
    "id": "qks-012",
    "input": {
      "fingerprintCoverage": 0.5,
      "kernelFidelity": 0.48,
      "targetFit": 0.53,
      "multiKernelAgreement": 0.53,
      "classicalAccuracy": 0.56,
      "classicalOptimism": 0.37,
      "bindingHardness": 0.42,
      "leakageRisk": 0.35,
      "kernelBias": "fingerprint_first",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 38.19,
      "kernelDiagnosis": 51.28,
      "fingerprintReasonScore": 61.94,
      "targetIntegrity": 43.82,
      "classicalScore": 28.34,
      "confidence": 42.1,
      "quantumContribution": 49.22,
      "classicalContribution": 29.7,
      "overall": 49.71
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 13.23,
      "kernelDiagnosis": 19.68,
      "fingerprintReasonScore": 16.17,
      "targetIntegrity": 35.76,
      "classicalScore": 34.93,
      "confidence": 24.35,
      "quantumContribution": 23.95,
      "classicalContribution": 38.15,
      "overall": 29.57
    }
  },
  {
    "id": "qks-013",
    "input": {
      "fingerprintCoverage": 0.54,
      "kernelFidelity": 0.52,
      "targetFit": 0.56,
      "multiKernelAgreement": 0.57,
      "classicalAccuracy": 0.6,
      "classicalOptimism": 0.39,
      "bindingHardness": 0.42,
      "leakageRisk": 0.36,
      "kernelBias": "classical_first",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 29.13,
      "kernelDiagnosis": 44.88,
      "fingerprintReasonScore": 36.95,
      "targetIntegrity": 32.35,
      "classicalScore": 31.2,
      "confidence": 45.35,
      "quantumContribution": 35.81,
      "classicalContribution": 32.8,
      "overall": 36.27
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 22.62,
      "kernelDiagnosis": 21.35,
      "fingerprintReasonScore": 17.8,
      "targetIntegrity": 37.74,
      "classicalScore": 67.02,
      "confidence": 26.55,
      "quantumContribution": 33.31,
      "classicalContribution": 57.27,
      "overall": 46.48
    }
  },
  {
    "id": "qks-014",
    "input": {
      "fingerprintCoverage": 0.58,
      "kernelFidelity": 0.56,
      "targetFit": 0.6,
      "multiKernelAgreement": 0.61,
      "classicalAccuracy": 0.63,
      "classicalOptimism": 0.4,
      "bindingHardness": 0.43,
      "leakageRisk": 0.36,
      "kernelBias": "balanced",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 52.62,
      "kernelDiagnosis": 58.53,
      "fingerprintReasonScore": 57.31,
      "targetIntegrity": 64.3,
      "classicalScore": 33.07,
      "confidence": 49,
      "quantumContribution": 57.92,
      "classicalContribution": 34.8,
      "overall": 57.76
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 20.03,
      "kernelDiagnosis": 22.2,
      "fingerprintReasonScore": 18.59,
      "targetIntegrity": 38.98,
      "classicalScore": 55.96,
      "confidence": 27.85,
      "quantumContribution": 31.15,
      "classicalContribution": 52.08,
      "overall": 41.88
    }
  },
  {
    "id": "qks-015",
    "input": {
      "fingerprintCoverage": 0.62,
      "kernelFidelity": 0.54,
      "targetFit": 0.56,
      "multiKernelAgreement": 0.65,
      "classicalAccuracy": 0.67,
      "classicalOptimism": 0.36,
      "bindingHardness": 0.44,
      "leakageRisk": 0.31,
      "kernelBias": "quantum_strict",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 45.9,
      "kernelDiagnosis": 58.35,
      "fingerprintReasonScore": 42.52,
      "targetIntegrity": 73.14,
      "classicalScore": 34.55,
      "confidence": 49.6,
      "quantumContribution": 53.93,
      "classicalContribution": 36.22,
      "overall": 54.74
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 9.43,
      "kernelDiagnosis": 21.14,
      "fingerprintReasonScore": 17.93,
      "targetIntegrity": 39.27,
      "classicalScore": 38.2,
      "confidence": 27.75,
      "quantumContribution": 25.19,
      "classicalContribution": 41.9,
      "overall": 32.84
    }
  },
  {
    "id": "qks-016",
    "input": {
      "fingerprintCoverage": 0.58,
      "kernelFidelity": 0.59,
      "targetFit": 0.6,
      "multiKernelAgreement": 0.6,
      "classicalAccuracy": 0.63,
      "classicalOptimism": 0.37,
      "bindingHardness": 0.36,
      "leakageRisk": 0.32,
      "kernelBias": "balanced",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 54.46,
      "kernelDiagnosis": 60.67,
      "fingerprintReasonScore": 57.87,
      "targetIntegrity": 65.05,
      "classicalScore": 33.73,
      "confidence": 50.35,
      "quantumContribution": 59.24,
      "classicalContribution": 35.76,
      "overall": 59.01
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 22.05,
      "kernelDiagnosis": 21.91,
      "fingerprintReasonScore": 18.56,
      "targetIntegrity": 38.14,
      "classicalScore": 55.7,
      "confidence": 28.3,
      "quantumContribution": 31.27,
      "classicalContribution": 51.57,
      "overall": 42.3
    }
  },
  {
    "id": "qks-017",
    "input": {
      "fingerprintCoverage": 0.62,
      "kernelFidelity": 0.63,
      "targetFit": 0.63,
      "multiKernelAgreement": 0.64,
      "classicalAccuracy": 0.67,
      "classicalOptimism": 0.39,
      "bindingHardness": 0.37,
      "leakageRisk": 0.33,
      "kernelBias": "fingerprint_first",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 48.43,
      "kernelDiagnosis": 64.28,
      "fingerprintReasonScore": 76.01,
      "targetIntegrity": 52.45,
      "classicalScore": 36.41,
      "confidence": 53.6,
      "quantumContribution": 60.84,
      "classicalContribution": 38.61,
      "overall": 60.84
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 18.73,
      "kernelDiagnosis": 23.42,
      "fingerprintReasonScore": 20,
      "targetIntegrity": 40.11,
      "classicalScore": 39.86,
      "confidence": 30.3,
      "quantumContribution": 28.42,
      "classicalContribution": 44.24,
      "overall": 35.82
    }
  },
  {
    "id": "qks-018",
    "input": {
      "fingerprintCoverage": 0.66,
      "kernelFidelity": 0.61,
      "targetFit": 0.67,
      "multiKernelAgreement": 0.68,
      "classicalAccuracy": 0.7,
      "classicalOptimism": 0.34,
      "bindingHardness": 0.38,
      "leakageRisk": 0.27,
      "kernelBias": "classical_first",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 38.33,
      "kernelDiagnosis": 54.13,
      "fingerprintReasonScore": 45.88,
      "targetIntegrity": 39.79,
      "classicalScore": 37.08,
      "confidence": 56.35,
      "quantumContribution": 44.56,
      "classicalContribution": 39.16,
      "overall": 44.59
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 28.36,
      "kernelDiagnosis": 21.66,
      "fingerprintReasonScore": 18.31,
      "targetIntegrity": 39.67,
      "classicalScore": 74.27,
      "confidence": 29.5,
      "quantumContribution": 36.45,
      "classicalContribution": 62.25,
      "overall": 51.91
    }
  },
  {
    "id": "qks-019",
    "input": {
      "fingerprintCoverage": 0.7,
      "kernelFidelity": 0.65,
      "targetFit": 0.7,
      "multiKernelAgreement": 0.72,
      "classicalAccuracy": 0.74,
      "classicalOptimism": 0.36,
      "bindingHardness": 0.38,
      "leakageRisk": 0.28,
      "kernelBias": "balanced",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 63.81,
      "kernelDiagnosis": 67.74,
      "fingerprintReasonScore": 69.47,
      "targetIntegrity": 73.95,
      "classicalScore": 39.94,
      "confidence": 59.6,
      "quantumContribution": 68.57,
      "classicalContribution": 42.25,
      "overall": 67.83
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 26.25,
      "kernelDiagnosis": 23.32,
      "fingerprintReasonScore": 19.92,
      "targetIntegrity": 41.65,
      "classicalScore": 62.07,
      "confidence": 31.7,
      "quantumContribution": 34.64,
      "classicalContribution": 57,
      "overall": 47.36
    }
  },
  {
    "id": "qks-020",
    "input": {
      "fingerprintCoverage": 0.66,
      "kernelFidelity": 0.7,
      "targetFit": 0.66,
      "multiKernelAgreement": 0.68,
      "classicalAccuracy": 0.7,
      "classicalOptimism": 0.37,
      "bindingHardness": 0.31,
      "leakageRisk": 0.29,
      "kernelBias": "quantum_strict",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 52.86,
      "kernelDiagnosis": 70.06,
      "fingerprintReasonScore": 46.45,
      "targetIntegrity": 85.3,
      "classicalScore": 38.94,
      "confidence": 58.35,
      "quantumContribution": 62.33,
      "classicalContribution": 41.54,
      "overall": 62.59
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 13.66,
      "kernelDiagnosis": 23.93,
      "fingerprintReasonScore": 20.75,
      "targetIntegrity": 40.51,
      "classicalScore": 40.86,
      "confidence": 32.05,
      "quantumContribution": 27.94,
      "classicalContribution": 45.29,
      "overall": 37.25
    }
  },
  {
    "id": "qks-021",
    "input": {
      "fingerprintCoverage": 0.7,
      "kernelFidelity": 0.68,
      "targetFit": 0.7,
      "multiKernelAgreement": 0.72,
      "classicalAccuracy": 0.73,
      "classicalOptimism": 0.33,
      "bindingHardness": 0.31,
      "leakageRisk": 0.24,
      "kernelBias": "balanced",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 65.6,
      "kernelDiagnosis": 69.88,
      "fingerprintReasonScore": 70.62,
      "targetIntegrity": 74.7,
      "classicalScore": 39.99,
      "confidence": 60.95,
      "quantumContribution": 70.03,
      "classicalContribution": 42.54,
      "overall": 69.08
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 27.89,
      "kernelDiagnosis": 22.72,
      "fingerprintReasonScore": 19.62,
      "targetIntegrity": 40.35,
      "classicalScore": 61.19,
      "confidence": 31.8,
      "quantumContribution": 34.35,
      "classicalContribution": 55.92,
      "overall": 47.25
    }
  },
  {
    "id": "qks-022",
    "input": {
      "fingerprintCoverage": 0.74,
      "kernelFidelity": 0.72,
      "targetFit": 0.73,
      "multiKernelAgreement": 0.76,
      "classicalAccuracy": 0.77,
      "classicalOptimism": 0.34,
      "bindingHardness": 0.32,
      "leakageRisk": 0.25,
      "kernelBias": "fingerprint_first",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 57.62,
      "kernelDiagnosis": 73.52,
      "fingerprintReasonScore": 91.49,
      "targetIntegrity": 59.58,
      "classicalScore": 42.47,
      "confidence": 64.35,
      "quantumContribution": 71.35,
      "classicalContribution": 45.15,
      "overall": 70.63
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 24.57,
      "kernelDiagnosis": 23.79,
      "fingerprintReasonScore": 20.63,
      "targetIntegrity": 42.05,
      "classicalScore": 42.21,
      "confidence": 33.35,
      "quantumContribution": 30.65,
      "classicalContribution": 46.56,
      "overall": 39
    }
  },
  {
    "id": "qks-023",
    "input": {
      "fingerprintCoverage": 0.79,
      "kernelFidelity": 0.76,
      "targetFit": 0.77,
      "multiKernelAgreement": 0.8,
      "classicalAccuracy": 0.81,
      "classicalOptimism": 0.36,
      "bindingHardness": 0.33,
      "leakageRisk": 0.25,
      "kernelBias": "classical_first",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 49.04,
      "kernelDiagnosis": 67.38,
      "fingerprintReasonScore": 54.82,
      "targetIntegrity": 48.57,
      "classicalScore": 45.16,
      "confidence": 68.25,
      "quantumContribution": 54.96,
      "classicalContribution": 48.03,
      "overall": 54.71
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 33.86,
      "kernelDiagnosis": 25.25,
      "fingerprintReasonScore": 22.05,
      "targetIntegrity": 43.92,
      "classicalScore": 84.72,
      "confidence": 35.45,
      "quantumContribution": 41.96,
      "classicalContribution": 71.34,
      "overall": 60.74
    }
  },
  {
    "id": "qks-024",
    "input": {
      "fingerprintCoverage": 0.75,
      "kernelFidelity": 0.75,
      "targetFit": 0.81,
      "multiKernelAgreement": 0.76,
      "classicalAccuracy": 0.77,
      "classicalOptimism": 0.31,
      "bindingHardness": 0.25,
      "leakageRisk": 0.2,
      "kernelBias": "balanced",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 71.55,
      "kernelDiagnosis": 75.91,
      "fingerprintReasonScore": 75.74,
      "targetIntegrity": 83.36,
      "classicalScore": 43.13,
      "confidence": 68.1,
      "quantumContribution": 76.37,
      "classicalContribution": 46.07,
      "overall": 74.92
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 31.21,
      "kernelDiagnosis": 23.36,
      "fingerprintReasonScore": 20.13,
      "targetIntegrity": 41.11,
      "classicalScore": 63.65,
      "confidence": 33.9,
      "quantumContribution": 35.89,
      "classicalContribution": 57.96,
      "overall": 49.9
    }
  },
  {
    "id": "qks-025",
    "input": {
      "fingerprintCoverage": 0.79,
      "kernelFidelity": 0.79,
      "targetFit": 0.77,
      "multiKernelAgreement": 0.8,
      "classicalAccuracy": 0.8,
      "classicalOptimism": 0.33,
      "bindingHardness": 0.26,
      "leakageRisk": 0.21,
      "kernelBias": "quantum_strict",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 62.51,
      "kernelDiagnosis": 79.52,
      "fingerprintReasonScore": 55.93,
      "targetIntegrity": 97.81,
      "classicalScore": 45.2,
      "confidence": 69.6,
      "quantumContribution": 72.52,
      "classicalContribution": 48.27,
      "overall": 72.16
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 19.5,
      "kernelDiagnosis": 24.6,
      "fingerprintReasonScore": 21.69,
      "targetIntegrity": 42.63,
      "classicalScore": 43.52,
      "confidence": 35.55,
      "quantumContribution": 30.39,
      "classicalContribution": 48.06,
      "overall": 40.83
    }
  },
  {
    "id": "qks-026",
    "input": {
      "fingerprintCoverage": 0.83,
      "kernelFidelity": 0.83,
      "targetFit": 0.8,
      "multiKernelAgreement": 0.83,
      "classicalAccuracy": 0.84,
      "classicalOptimism": 0.34,
      "bindingHardness": 0.27,
      "leakageRisk": 0.22,
      "kernelBias": "balanced",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 78.52,
      "kernelDiagnosis": 83.17,
      "fingerprintReasonScore": 82.25,
      "targetIntegrity": 86,
      "classicalScore": 47.68,
      "confidence": 73,
      "quantumContribution": 82.33,
      "classicalContribution": 50.87,
      "overall": 80.67
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 33.17,
      "kernelDiagnosis": 25.67,
      "fingerprintReasonScore": 22.7,
      "targetIntegrity": 44.32,
      "classicalScore": 68.8,
      "confidence": 37.1,
      "quantumContribution": 38.93,
      "classicalContribution": 63.04,
      "overall": 54.26
    }
  },
  {
    "id": "qks-027",
    "input": {
      "fingerprintCoverage": 0.87,
      "kernelFidelity": 0.81,
      "targetFit": 0.84,
      "multiKernelAgreement": 0.87,
      "classicalAccuracy": 0.88,
      "classicalOptimism": 0.3,
      "bindingHardness": 0.27,
      "leakageRisk": 0.17,
      "kernelBias": "fingerprint_first",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 67.26,
      "kernelDiagnosis": 82.98,
      "fingerprintReasonScore": 100,
      "targetIntegrity": 67.17,
      "classicalScore": 49.35,
      "confidence": 75.6,
      "quantumContribution": 80.18,
      "classicalContribution": 52.5,
      "overall": 79.2
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 30.78,
      "kernelDiagnosis": 24.7,
      "fingerprintReasonScore": 21.75,
      "targetIntegrity": 44.62,
      "classicalScore": 45.22,
      "confidence": 37.2,
      "quantumContribution": 33.41,
      "classicalContribution": 49.71,
      "overall": 42.94
    }
  },
  {
    "id": "qks-028",
    "input": {
      "fingerprintCoverage": 0.83,
      "kernelFidelity": 0.86,
      "targetFit": 0.87,
      "multiKernelAgreement": 0.83,
      "classicalAccuracy": 0.84,
      "classicalOptimism": 0.31,
      "bindingHardness": 0.2,
      "leakageRisk": 0.17,
      "kernelBias": "classical_first",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 54.87,
      "kernelDiagnosis": 75.3,
      "fingerprintReasonScore": 59.19,
      "targetIntegrity": 54.75,
      "classicalScore": 48.34,
      "confidence": 76.1,
      "quantumContribution": 60.96,
      "classicalContribution": 51.73,
      "overall": 60.3
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 38.81,
      "kernelDiagnosis": 25.25,
      "fingerprintReasonScore": 22.17,
      "targetIntegrity": 43.48,
      "classicalScore": 86.95,
      "confidence": 37.65,
      "quantumContribution": 43.33,
      "classicalContribution": 72.59,
      "overall": 63.53
    }
  },
  {
    "id": "qks-029",
    "input": {
      "fingerprintCoverage": 0.87,
      "kernelFidelity": 0.9,
      "targetFit": 0.91,
      "multiKernelAgreement": 0.87,
      "classicalAccuracy": 0.87,
      "classicalOptimism": 0.33,
      "bindingHardness": 0.2,
      "leakageRisk": 0.18,
      "kernelBias": "balanced",
      "profile": "quantum_multi_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 83.89,
      "kernelDiagnosis": 88.91,
      "fingerprintReasonScore": 87.12,
      "targetIntegrity": 94.51,
      "classicalScore": 50.59,
      "confidence": 79.6,
      "quantumContribution": 88.34,
      "classicalContribution": 54.16,
      "overall": 86.19
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 36.33,
      "kernelDiagnosis": 26.6,
      "fingerprintReasonScore": 23.46,
      "targetIntegrity": 45,
      "classicalScore": 71.06,
      "confidence": 39.5,
      "quantumContribution": 40.49,
      "classicalContribution": 65.08,
      "overall": 56.99
    }
  },
  {
    "id": "qks-030",
    "input": {
      "fingerprintCoverage": 0.91,
      "kernelFidelity": 0.88,
      "targetFit": 0.87,
      "multiKernelAgreement": 0.91,
      "classicalAccuracy": 0.91,
      "classicalOptimism": 0.28,
      "bindingHardness": 0.21,
      "leakageRisk": 0.13,
      "kernelBias": "quantum_strict",
      "profile": "classical_kernel"
    },
    "expectedQuantumMultiKernel": {
      "mode": "quantum_multi_kernel",
      "bindingDiagnosis": 71.59,
      "kernelDiagnosis": 88.77,
      "fingerprintReasonScore": 64.69,
      "targetIntegrity": 100,
      "classicalScore": 51.88,
      "confidence": 80.35,
      "quantumContribution": 80.03,
      "classicalContribution": 55.31,
      "overall": 79.58
    },
    "expectedClassicalKernel": {
      "mode": "classical_kernel",
      "bindingDiagnosis": 25.72,
      "kernelDiagnosis": 25.06,
      "fingerprintReasonScore": 22.34,
      "targetIntegrity": 45.02,
      "classicalScore": 46.21,
      "confidence": 38.95,
      "quantumContribution": 32.87,
      "classicalContribution": 50.68,
      "overall": 44.3
    }
  }
];
