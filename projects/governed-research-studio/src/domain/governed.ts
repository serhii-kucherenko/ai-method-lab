import {
  type ResearchInput,
  type ResearchQuality,
  biasWeight,
  clamp,
  round2,
  studyLoad,
} from "./types";

/**
 * Governed end-to-end research scorer (good path A):
 * rewards gate coverage, workflow integrity, evidence provenance, privacy.
 */
export function scoreGoverned(input: ResearchInput): ResearchQuality {
  const gov = input.profile === "governed";
  const boost = gov ? 1.12 : 0.96;
  const wG = biasWeight(input.researchBias, "gate_first");
  const wW = biasWeight(input.researchBias, "workflow_first");
  const wA = biasWeight(input.researchBias, "agent_first");
  const avgBias = (wG + wW + wA) / 3;
  const load = studyLoad(input.studyHardness, input.gateCoverage);

  const gateScore = round2(
    clamp(
      (input.gateCoverage * 55 +
        input.workflowIntegrity * 25 -
        load * 10) *
        boost *
        avgBias +
        (gov ? 8 : 0) -
        input.leakageRisk * (gov ? 6 : 14) -
        (input.researchBias === "agent_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const workflowScore = round2(
    clamp(
      input.workflowIntegrity * 60 * boost +
        input.gateCoverage * 25 +
        (gov ? 8 : 0) -
        input.agentOptimism * (gov ? 4 : 16) -
        (input.researchBias === "agent_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const evidenceScore = round2(
    clamp(
      input.evidenceProvenance * 58 * boost * wW +
        input.gateCoverage * 28 +
        (gov ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const privacyScore = round2(
    clamp(
      input.privacyControl * 50 * boost * wG +
        input.workflowIntegrity * 25 +
        input.gateCoverage * 15 +
        (gov ? 8 : 0) -
        (input.researchBias === "agent_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const ungatedScore = round2(
    clamp(
      input.ungatedPassRate * 55 * boost +
        input.agentOptimism * 20 -
        input.studyHardness * 18 -
        (gov ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.gateCoverage * 40 +
        input.workflowIntegrity * 30 +
        input.evidenceProvenance * 25 -
        input.agentOptimism * 15,
      0,
      100,
    ),
  );
  const governedContribution = round2(
    clamp(
      gateScore * 0.26 +
        workflowScore * 0.24 +
        evidenceScore * 0.28 +
        privacyScore * 0.22,
      0,
      100,
    ),
  );
  const ungatedContribution = round2(
    clamp(
      ungatedScore * 0.7 +
        input.ungatedPassRate * 20 +
        input.agentOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      governedContribution * (gov ? 0.82 : 0.4) +
        ungatedContribution * (gov ? 0.18 : 0.6) +
        (gov ? 4 : 0) -
        (input.researchBias === "agent_first" && gov ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "governed",
    gateScore,
    workflowScore,
    evidenceScore,
    privacyScore,
    ungatedScore,
    confidence,
    governedContribution,
    ungatedContribution,
    overall,
  };
}

/**
 * Ungated agent baseline (path B):
 * rewards ungated pass rate + agent optimism, weak on gate honesty.
 */
export function scoreUngated(input: ResearchInput): ResearchQuality {
  const ungated = input.profile === "ungated";
  const boost = ungated ? 1.08 : 0.92;
  const wA = biasWeight(input.researchBias, "agent_first");
  const load = studyLoad(input.studyHardness, input.gateCoverage);

  const gateScore = round2(
    clamp(
      input.ungatedPassRate * 35 * boost +
        wA * 10 -
        input.studyHardness * 22 -
        input.leakageRisk * 12 -
        (input.researchBias === "gate_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const workflowScore = round2(
    clamp(
      input.agentOptimism * 40 * boost +
        input.ungatedPassRate * 25 -
        load * 15 -
        input.gateCoverage * 8,
      0,
      100,
    ),
  );
  const evidenceScore = round2(
    clamp(
      input.agentOptimism * 38 * boost +
        input.ungatedPassRate * 20 -
        input.evidenceProvenance * (ungated ? 5 : 0) -
        load * 18 -
        (ungated ? 0 : 6),
      0,
      100,
    ),
  );
  const privacyScore = round2(
    clamp(
      input.ungatedPassRate * 42 * boost +
        input.agentOptimism * 28 -
        input.gateCoverage * 10 +
        (ungated ? 5 : 0),
      0,
      100,
    ),
  );
  const ungatedScore = round2(
    clamp(
      input.ungatedPassRate * 58 * boost * wA +
        input.agentOptimism * 32 -
        input.studyHardness * 10 +
        (ungated ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.agentOptimism * 45 +
        input.ungatedPassRate * 35 -
        input.studyHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const governedContribution = round2(
    clamp(
      gateScore * 0.2 +
        workflowScore * 0.2 +
        evidenceScore * 0.2 +
        privacyScore * 0.2 +
        ungatedScore * 0.2,
      0,
      100,
    ),
  );
  const ungatedContribution = round2(
    clamp(
      ungatedScore * 0.55 +
        input.agentOptimism * 30 +
        input.ungatedPassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      ungatedContribution * (ungated ? 0.78 : 0.5) +
        governedContribution * (ungated ? 0.22 : 0.5) -
        input.studyHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "ungated",
    gateScore,
    workflowScore,
    evidenceScore,
    privacyScore,
    ungatedScore,
    confidence,
    governedContribution,
    ungatedContribution,
    overall,
  };
}
