import {
  type AuthorInput,
  type AuthorQuality,
  biasWeight,
  experienceLoad,
  clamp,
  round2,
} from "./types";

/**
 * Scaffolded visual authoring scorer (good path A):
 * rewards skeleton coverage, scaffold fidelity, and nav integrity under hardness.
 */
export function scoreScaffoldedAuthoring(input: AuthorInput): AuthorQuality {
  const scaffolded = input.profile === "scaffolded_authoring";
  const boost = scaffolded ? 1.12 : 0.96;
  const wS = biasWeight(input.authorBias, "scaffold_strict");
  const wLabel = biasWeight(input.authorBias, "label_first");
  const wL = biasWeight(input.authorBias, "linear_first");
  const avgBias = (wS + wLabel + wL) / 3;
  const load = experienceLoad(input.experienceHardness, input.skeletonCoverage);

  const structureCoverage = round2(
    clamp(
      (input.skeletonCoverage * 55 +
        input.scaffoldFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (scaffolded ? 8 : 0) -
        input.leakageRisk * (scaffolded ? 6 : 14) -
        (input.authorBias === "linear_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const scaffoldDiagnosis = round2(
    clamp(
      input.scaffoldFidelity * 60 * boost +
        input.skeletonCoverage * 25 +
        (scaffolded ? 8 : 0) -
        input.flattenOptimism * (scaffolded ? 4 : 16) -
        (input.authorBias === "linear_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const navigationOptScore = round2(
    clamp(
      input.navIntegrity * 58 * boost * wLabel +
        input.skeletonCoverage * 28 +
        (scaffolded ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const labelIntegrity = round2(
    clamp(
      input.labelFit * 50 * boost * wS +
        input.scaffoldFidelity * 25 +
        input.skeletonCoverage * 15 +
        (scaffolded ? 8 : 0) -
        (input.authorBias === "linear_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const linearScore = round2(
    clamp(
      input.linearPassRate * 55 * boost +
        input.flattenOptimism * 20 -
        input.experienceHardness * 18 -
        (scaffolded ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.skeletonCoverage * 40 +
        input.scaffoldFidelity * 30 +
        input.labelFit * 25 -
        input.flattenOptimism * 15,
      0,
      100,
    ),
  );
  const scaffoldContribution = round2(
    clamp(
      structureCoverage * 0.26 +
        scaffoldDiagnosis * 0.24 +
        navigationOptScore * 0.28 +
        labelIntegrity * 0.22,
      0,
      100,
    ),
  );
  const linearContribution = round2(
    clamp(
      linearScore * 0.7 +
        input.linearPassRate * 20 +
        input.flattenOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      scaffoldContribution * (scaffolded ? 0.82 : 0.4) +
        linearContribution * (scaffolded ? 0.18 : 0.6) +
        (scaffolded ? 4 : 0) -
        (input.authorBias === "linear_first" && scaffolded ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "scaffolded_authoring",
    structureCoverage,
    scaffoldDiagnosis,
    navigationOptScore,
    labelIntegrity,
    linearScore,
    confidence,
    scaffoldContribution,
    linearContribution,
    overall,
  };
}

/**
 * Naive linear baseline (path B):
 * rewards linear pass rate + flatten optimism, weak on scaffold honesty.
 */
export function scoreNaiveLinear(input: AuthorInput): AuthorQuality {
  const linear = input.profile === "naive_linear";
  const boost = linear ? 1.08 : 0.92;
  const wL = biasWeight(input.authorBias, "linear_first");
  const load = experienceLoad(input.experienceHardness, input.skeletonCoverage);

  const structureCoverage = round2(
    clamp(
      input.linearPassRate * 35 * boost +
        wL * 10 -
        input.experienceHardness * 22 -
        input.leakageRisk * 12 -
        (input.authorBias === "scaffold_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const scaffoldDiagnosis = round2(
    clamp(
      input.flattenOptimism * 40 * boost +
        input.linearPassRate * 25 -
        load * 15 -
        input.skeletonCoverage * 8,
      0,
      100,
    ),
  );
  const navigationOptScore = round2(
    clamp(
      input.flattenOptimism * 38 * boost +
        input.linearPassRate * 20 -
        input.labelFit * (linear ? 5 : 0) -
        load * 18 -
        (linear ? 0 : 6),
      0,
      100,
    ),
  );
  const labelIntegrity = round2(
    clamp(
      input.linearPassRate * 42 * boost +
        input.flattenOptimism * 28 -
        input.skeletonCoverage * 10 +
        (linear ? 5 : 0),
      0,
      100,
    ),
  );
  const linearScore = round2(
    clamp(
      input.linearPassRate * 58 * boost * wL +
        input.flattenOptimism * 32 -
        input.experienceHardness * 10 +
        (linear ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.flattenOptimism * 45 +
        input.linearPassRate * 35 -
        input.experienceHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const scaffoldContribution = round2(
    clamp(
      structureCoverage * 0.2 +
        scaffoldDiagnosis * 0.2 +
        navigationOptScore * 0.2 +
        labelIntegrity * 0.2 +
        linearScore * 0.2,
      0,
      100,
    ),
  );
  const linearContribution = round2(
    clamp(
      linearScore * 0.55 +
        input.flattenOptimism * 30 +
        input.linearPassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      linearContribution * (linear ? 0.78 : 0.5) +
        scaffoldContribution * (linear ? 0.22 : 0.5) -
        input.experienceHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_linear",
    structureCoverage,
    scaffoldDiagnosis,
    navigationOptScore,
    labelIntegrity,
    linearScore,
    confidence,
    scaffoldContribution,
    linearContribution,
    overall,
  };
}
