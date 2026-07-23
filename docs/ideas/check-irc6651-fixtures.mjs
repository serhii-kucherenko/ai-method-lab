/**
 * Paper fixture checker for irc6651 (research — not a product).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { forecast6651 } from "./irc6651-oracle.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "fixtures");

function near(a, b) {
  return Math.abs(Number(a) - Number(b)) < 1e-6;
}

const files = readdirSync(dir)
  .filter((f) => f.startsWith("irc6651-") && f.endsWith(".json"))
  .sort();

let failed = 0;
for (const file of files) {
  const fx = JSON.parse(readFileSync(join(dir, file), "utf8"));
  const got = forecast6651(fx.input);
  const exp = fx.expect;
  let ok = got.status === exp.status;
  if (exp.status === "ok") {
    ok =
      ok &&
      near(got.ftf, exp.ftf) &&
      near(got.ftp, exp.ftp) &&
      near(got.combined, exp.combined);
  } else {
    ok = ok && got.reason === exp.reason;
  }
  if (!ok) {
    failed += 1;
    console.error("FAIL", file, { got, expect: exp });
  } else {
    console.log("OK", fx.id);
  }
}

if (failed) {
  console.error(`irc6651 fixtures: ${failed} failure(s) of ${files.length}`);
  process.exit(1);
}
console.log(`irc6651 fixtures: ${files.length} green`);
