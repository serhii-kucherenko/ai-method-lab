import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");

test("ui-critical: honesty page Kill A + catalog + batch + audit pages", () => {
  const honesty = readFileSync(join(publicDir, "money-honesty.html"), "utf8");
  assert.match(honesty, /Kill A/i);
  assert.match(honesty, /Safety consultants and settlement counsel still/i);
  assert.match(honesty, /forecast\s*\/\s*method experiment/i);
  assert.match(honesty, /serial\s*≠\s*additive|serial ≠ additive/i);
  assert.match(honesty, /citations\.html/i);

  const catalog = readFileSync(join(publicDir, "citations.html"), "utf8");
  assert.match(catalog, /Citations catalog/i);
  assert.match(catalog, /data-catalog="live"/);
  assert.match(catalog, /Bearer /);

  const batch = readFileSync(join(publicDir, "batch.html"), "utf8");
  assert.match(batch, /data-batch="live"/);
  assert.match(batch, /Batch forecast/i);

  const audit = readFileSync(join(publicDir, "audit.html"), "utf8");
  assert.match(audit, /data-audit="live"/);
  assert.match(audit, /Audit log/i);

  const settings = readFileSync(join(publicDir, "settings.html"), "utf8");
  assert.match(settings, /data-settings="live"/);
  assert.match(settings, /Org settings/i);
});
