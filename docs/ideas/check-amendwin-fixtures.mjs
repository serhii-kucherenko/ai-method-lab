/**
 * Research-only checker for amendwin fixtures.
 * Run: node docs/ideas/check-amendwin-fixtures.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function cmpIso(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortVersions(versions) {
  return [...versions].sort((a, b) => {
    const c = cmpIso(a.effective_at, b.effective_at);
    return c !== 0 ? c : a.id.localeCompare(b.id);
  });
}

function resolveVersion(versions, asOf) {
  const sorted = sortVersions(versions);
  const candidates = sorted.filter((v) => cmpIso(v.effective_at, asOf) <= 0);
  if (!candidates.length) throw new Error(`no version for ${asOf}`);
  return candidates[candidates.length - 1];
}

function canPublish(existing, next) {
  if (!existing.length) return true;
  const latest = sortVersions(existing)[existing.length - 1];
  return cmpIso(next.effective_at, latest.effective_at) >= 0;
}

function scoreVisit(versions, subject, visit, importantCodes, asOfMissed) {
  if (visit.locked && visit.classification) {
    const important =
      ["missed", "out_of_window"].includes(visit.classification) &&
      importantCodes.includes(visit.code);
    return {
      version_id: visit.scored_version_id,
      classification: visit.classification,
      important,
    };
  }

  const asOf = visit.actual ?? asOfMissed;
  if (!asOf) throw new Error("need actual or as_of_missed");
  const v = resolveVersion(versions, asOf);
  const w = v.visits[visit.code];
  if (!w) throw new Error(`unknown visit ${visit.code}`);
  const target = addDays(subject.enrollment, w.target_day);
  const open = addDays(target, -w.before);
  const close = addDays(target, w.after);

  let classification;
  if (!visit.actual) {
    classification = cmpIso(asOfMissed, close) > 0 ? "missed" : "pending";
  } else {
    const a = visit.actual;
    if (cmpIso(a, open) < 0 || cmpIso(a, close) > 0) classification = "out_of_window";
    else if (cmpIso(a, target) < 0) classification = "early";
    else if (cmpIso(a, target) > 0) classification = "late";
    else classification = "on_time";
  }

  const important =
    ["missed", "out_of_window"].includes(classification) &&
    importantCodes.includes(visit.code);
  return { version_id: v.id, classification, important };
}

let failed = 0;
for (const file of readdirSync(root)
  .filter((f) => f.startsWith("amendwin-") && f.endsWith(".json"))
  .sort()) {
  const doc = JSON.parse(readFileSync(join(root, file), "utf8"));
  const important = doc.important_codes ?? [];
  for (const attempt of doc.publish_attempts ?? []) {
    const ok = canPublish(doc.versions, attempt.version);
    if (attempt.expect === "reject_unordered_effective") {
      if (ok) {
        console.error(`FAIL ${file}: expected reject publish`);
        failed += 1;
      }
    }
  }
  for (const c of doc.cases ?? []) {
    const got = scoreVisit(
      doc.versions,
      doc.subject,
      c.visit,
      important,
      c.as_of_missed,
    );
    const e = c.expect;
    if (got.version_id !== e.version_id || got.classification !== e.classification || got.important !== e.important) {
      console.error(`FAIL ${file}`, { got, expect: e });
      failed += 1;
    }
  }
  console.log(`ok ${file}`);
}

if (failed) {
  console.error(`${failed} failure(s)`);
  process.exit(1);
}
console.log("all amendwin fixtures green");
