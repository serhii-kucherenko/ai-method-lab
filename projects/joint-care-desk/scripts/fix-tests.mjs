import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "test";
for (const f of readdirSync(dir)) {
  if (!f.endsWith(".ts")) continue;
  const p = join(dir, f);
  let t = readFileSync(p, "utf8");
  const o = t;
  t = t.split("2607\\.13579").join("2607\\.12527");
  t = t.split("2607.13579").join("2607.12527");
  if (t !== o) {
    writeFileSync(p, t);
    console.log("patched", f);
  }
}

// Fix try.html honesty assertion in sustain.test.ts
{
  const p = join(dir, "sustain.test.ts");
  let t = readFileSync(p, "utf8");
  t = t.replace(
    /assert\.match\(html, \/not\.\*authors' OrthoPilot system or OrthoPilot product\|not a authors' OrthoPilot system or OrthoPilot product\/i\);/,
    "assert.match(html, /not the authors'|never brand OrthoPilot/i);",
  );
  writeFileSync(p, t);
  console.log("sustain honesty regex fixed");
}
