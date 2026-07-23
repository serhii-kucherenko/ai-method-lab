import { readFileSync, writeFileSync } from "fs";

const files = [
  "test/crud.test.ts",
  "test/sustain.test.ts",
  "test/ui-critical.test.ts",
  "public/honesty.html",
  "public/scenario.html",
];

for (const f of files) {
  let s = readFileSync(f, "utf8");
  s = s.replaceAll("2607\\.15562", "2607\\.15552");
  s = s.replaceAll("2607.15562", "2607.15552");
  s = s.replaceAll("18-itinerary-plan-desk-lessons", "19-itinerary-plan-desk-lessons");
  writeFileSync(f, s);
}

// Fix broken regex that treated plan/learn/adapt as end of regex
{
  const f = "test/ui-critical.test.ts";
  let s = readFileSync(f, "utf8");
  s = s.replace(
    /must: \[\/data-scenario="live"\/, \/naive-preference-only\|plan\/learn\/adapt\|Scenario\|opening hours\|day budget\/i\],/,
    'must: [/data-scenario="live"/, /naive-preference-only|plan-learn-adapt|plan\\/learn\\/adapt|Scenario|opening hours|day budget/i],',
  );
  writeFileSync(f, s);
}

{
  const f = "public/scenario.html";
  let s = readFileSync(f, "utf8");
  s = s
    .replace(
      "<h1>naive-preference-only vs plan-learn-adapt</h1>",
      "<h1>naive-preference-only vs plan/learn/adapt</h1>",
    )
    .replace(
      "against plan-learn-adapt preference selection",
      "against plan/learn/adapt scheduling",
    )
    .replace(
      "after creating a job. plan-learn-adapt selection should stay feasible while the",
      "after creating a job. plan/learn/adapt scheduling should stay feasible while the",
    );
  writeFileSync(f, s);
}

console.log("fixed ids, guides, scenario regex");
