import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const htmlDir = "public";
for (const f of readdirSync(htmlDir).filter((x) => x.endsWith(".html"))) {
  let s = readFileSync(join(htmlDir, f), "utf8");
  s = s
    .replace(/constrained packing personalization/gi, "screened itinerary")
    .replace(/constrained packing selection/gi, "screened itinerary scheduling")
    .replace(/plan-learn-adapt packing/gi, "screened itinerary planning")
    .replace(/plan-learn-adapt checklist selection/gi, "screened day scheduling")
    .replace(
      /Preference-only packing assistants overpack, skip dependencies, and include banned items\./gi,
      "Preference-only trip assistants stack beloved stops and still break cache tiers or the tier threshold.",
    )
    .replace(/capacity, bans, or dependencies/gi, "cache tiers, travel, or tier thresholds")
    .replace(/Luggage capacity/gi, "Day budget (hours)")
    .replace(/checklist selection/gi, "day scheduling")
    .replace(/commercial packing app/gi, "government AI regulation product")
    .replace(/commercial travel packing product/gi, "government AI regulation product")
    .replace(/packing gains/gi, "itinerary quality gains")
    .replace(
      /Create a project and queue a checklist packing job/gi,
      "Create a project and queue an itinerary planning job",
    )
    .replace(/Create a project and queue a itinerary/gi, "Create a project and queue an itinerary")
    .replace(/Lab sketch only — not the authors' packing/gi, "Lab sketch only — not the authors' government AI regulation product");
  writeFileSync(join(htmlDir, f), s);
}

const files = [
  "src/components/desk-shell.tsx",
  "src/app/honesty/page.tsx",
  "src/app/layout.tsx",
  "src/httpApp.ts",
  "test/smoke.test.ts",
  "test/sustain.test.ts",
  "test/ui-critical.test.ts",
  "test/crud.test.ts",
];
for (const f of files) {
  let s = readFileSync(f, "utf8");
  s = s
    .replace(/commercial packing\s+app/gi, "government AI regulation product")
    .replace(/not a commercial packing/gi, "not a government AI regulation product")
    .replace(/packing gains/gi, "itinerary quality gains")
    .replace(
      /Hard Rules, Soft Preferences:[^"]+/g,
      "Plan, Learn, Adapt: On-Device Itinerary Generation",
    )
    .replace(
      /government AI regulation product planning: A Deep Learning-based LLM-Powered Agentic AI Framework for Controlling Rules Preferencess/g,
      "Plan, Learn, Adapt: On-Device Itinerary Generation",
    )
    .replace(/2607\.15562/g, "2607.14585")
    .replace(/plan-learn-adapt preference selection/gi, "screened screened compression scheduling")
    .replace(
      /naive-naive-average\|plan-learn-adapt\|Scenario/g,
      "naive-naive-average|screened compression|Scenario|cache tiers|tier threshold",
    );
  writeFileSync(f, s);
}
console.log("html+copy patched");
