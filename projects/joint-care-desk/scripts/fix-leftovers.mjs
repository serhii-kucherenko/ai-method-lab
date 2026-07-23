import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function patch(rel, fn) {
  const p = join(root, rel);
  const before = readFileSync(p, "utf8");
  const after = fn(before);
  if (after !== before) {
    writeFileSync(p, after);
    console.log("fixed", rel);
  } else {
    console.log("no-change", rel);
  }
}

patch("src/httpApp.ts", (t) =>
  t
    .replace(
      /Agile perceptive dual-evidence locomotion for quadrupedal robots in the wild/g,
      "Evidence-Grounded AI for Musculoskeletal Care",
    )
    .replace(
      /Dual-evidence musculoskeletal quadruped plans with autonomous stage transitions for fragmented evidence — vs a parametric-memory \/ stage-blind-only naive policy that fails on admission, peri-op, discharge, and rehab\./g,
      "Dual-evidence musculoskeletal pathway plans (hospital + external + stage-aware) vs naive parametric / hospital-only / external-only / stage-blind baselines.",
    ),
);

patch("test/smoke.test.ts", (t) =>
  t
    .replace(
      /Agile perceptive dual-evidence locomotion for quadrupedal robots in the wild/g,
      "Evidence-Grounded AI for Musculoskeletal Care",
    )
    .replace(/2607\\.13579/g, "2607\\.12527"),
);

patch("src/app/scenario/page.tsx", (t) =>
  t
    .replace('useState("stairs")', 'useState("tka")')
    .replace(
      /Naive parametric baselines[\s\S]*?stage-aware transitions\./,
      "Naive baselines (parametric-memory-only / hospital-only / external-only / stage-blind) versus a dual-evidence plan with hospital evidence · external knowledge · stage-aware pathway.",
    ),
);

patch("src/app/layout.tsx", (t) =>
  t.replace(
    /Multi-skill dual-evidence pathway with stage-aware transitions versus a parametric-memory stage-blind policy — method experiment, not OrthoPilot hardware\./,
    "Dual-evidence musculoskeletal pathway plans versus naive parametric or single-world baselines — method experiment, not OrthoPilot / CHEESE / OrthoBench.",
  ),
);

patch("src/app/honesty/page.tsx", (t) =>
  t
    .replace(
      /Soft simulation of dual-evidence locomotion and risk deltas only\./,
      "Soft simulation of dual-evidence pathway plans and risk deltas only.",
    )
    .replace(
      /that label may appear only in Sources/,
      "those labels may appear only in Sources",
    ),
);

patch("src/app/page.tsx", (t) =>
  t
    .replace(
      /Scenario compare \(naive parametric policy vs dual-evidence \+ perception\)/,
      "Scenario compare (naive parametric vs dual-evidence pathway)",
    )
    .replace(
      /Soft simulation — not clinical EHR systems and never branded OrthoPilot\./,
      "Soft simulation — not a clinical EHR or OrthoPilot replacement; never brand OrthoPilot / CHEESE / OrthoBench / ORACLE.",
    ),
);
