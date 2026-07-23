import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "public/index.html",
  "public/scenario.html",
  "public/honesty.html",
  "src/app/jobs/page.tsx",
  "src/app/lifecycle/page.tsx",
  "src/components/desk-shell.tsx",
];

for (const f of files) {
  let t = readFileSync(f, "utf8");
  const o = t;
  t = t.replace(
    /Flat-terrain policies look fine until stairs, hurdles, gaps, or stones appear\./g,
    "Parametric single-shot answers look fine until missing hospital charts or external guidelines matter.",
  );
  t = t.replace(/query=corpus=stairs/g, "query=corpus=tka");
  t = t.replace(/Locomotion/g, "Pathway");
  t = t.replace(/locomotion/g, "pathway");
  t = t.replace(/not a authors'/g, "not the authors'");
  t = t.replace(
    /brand as OrthoPilot as the product name/g,
    "brand OrthoPilot as the product name",
  );
  if (t !== o) {
    writeFileSync(f, t);
    console.log("patched", f);
  } else {
    console.log("skip", f);
  }
}
