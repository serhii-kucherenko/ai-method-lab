/**
 * Research-only reference checker for lotblast golden fixtures.
 * Not a product. Run: node docs/ideas/check-fixtures.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function forwardBlast(graph, suspect) {
  const kind = new Map(graph.lots.map((l) => [l.tlc, l.kind]));
  const qty = new Map(graph.lots.map((l) => [l.tlc, l.qty]));
  const outs = new Map();
  for (const t of graph.transforms) {
    for (const inp of t.inputs) {
      if (!outs.has(inp.tlc)) outs.set(inp.tlc, []);
      outs.get(inp.tlc).push(t.output);
    }
  }
  const visited = new Set();
  const queue = [suspect];
  while (queue.length) {
    const tlc = queue.shift();
    if (visited.has(tlc)) continue;
    visited.add(tlc);
    for (const next of outs.get(tlc) ?? []) queue.push(next);
  }
  const finished = [...visited].filter((t) => kind.get(t) === "finished").sort();
  const shipments = graph.shipments.filter((s) => visited.has(s.tlc));
  const notify = [...new Set(shipments.map((s) => s.partner))].sort();
  const shipIds = shipments.map((s) => s.id).sort();
  const consumedAsInput = new Map();
  for (const t of graph.transforms) {
    for (const inp of t.inputs) {
      consumedAsInput.set(inp.tlc, (consumedAsInput.get(inp.tlc) ?? 0) + inp.qty);
    }
  }
  const channelBy = {};
  for (const t of finished) {
    const shipped = shipments.filter((s) => s.tlc === t).reduce((a, s) => a + s.qty, 0);
    const consumed = consumedAsInput.get(t) ?? 0;
    channelBy[t] = (qty.get(t) ?? 0) - shipped - consumed;
  }
  const units_in_channel = finished.reduce((a, t) => a + channelBy[t], 0);
  return { finished_tlcs: finished, shipment_ids: shipIds, notify_partners: notify, units_in_channel, channelBy, visited };
}

function backwardTrace(graph, finished) {
  const ins = new Map();
  for (const t of graph.transforms) {
    if (!ins.has(t.output)) ins.set(t.output, []);
    for (const inp of t.inputs) ins.get(t.output).push(inp.tlc);
  }
  const visited = new Set();
  const queue = [finished];
  while (queue.length) {
    const tlc = queue.shift();
    if (visited.has(tlc)) continue;
    visited.add(tlc);
    for (const prev of ins.get(tlc) ?? []) queue.push(prev);
  }
  visited.delete(finished);
  return [...visited].sort();
}

function sameSet(a, b) {
  const as = [...a].sort().join("\0");
  const bs = [...b].sort().join("\0");
  return as === bs;
}

function assertOverconsumeRules(doc, file) {
  let n = 0;
  for (const c of doc.cases ?? []) {
    for (const w of c.write_attempts ?? []) {
      if (w.expect !== "reject_overconsume") continue;
      const committed = new Map();
      for (const t of doc.graph.transforms) {
        for (const inp of t.inputs) {
          committed.set(inp.tlc, (committed.get(inp.tlc) ?? 0) + inp.qty);
        }
      }
      const lotQty = new Map(doc.graph.lots.map((l) => [l.tlc, l.qty]));
      for (const inp of w.inputs) {
        const available = (lotQty.get(inp.tlc) ?? 0) - (committed.get(inp.tlc) ?? 0);
        if (inp.qty <= available) {
          n++;
          console.error(`FAIL ${file}: write ${w.id} should overconsume ${inp.tlc} but available=${available}`);
        }
      }
    }
  }
  return n;
}

let failed = 0;
for (const file of readdirSync(root).filter((f) => f.endsWith(".json")).sort()) {
  const doc = JSON.parse(readFileSync(join(root, file), "utf8"));
  failed += assertOverconsumeRules(doc, file);
  for (const c of doc.cases ?? []) {
    const got = forwardBlast(doc.graph, c.suspect);
    const e = c.expect;
    const checks = [];
    if (e.finished_tlcs) checks.push(["finished_tlcs", sameSet(got.finished_tlcs, e.finished_tlcs), got.finished_tlcs, e.finished_tlcs]);
    if (e.shipment_ids) checks.push(["shipment_ids", sameSet(got.shipment_ids, e.shipment_ids), got.shipment_ids, e.shipment_ids]);
    if (e.notify_partners) checks.push(["notify_partners", sameSet(got.notify_partners, e.notify_partners), got.notify_partners, e.notify_partners]);
    if (typeof e.units_in_channel === "number") checks.push(["units_in_channel", got.units_in_channel === e.units_in_channel, got.units_in_channel, e.units_in_channel]);
    if (e.finished_tlc_cardinality != null) checks.push(["cardinality", got.finished_tlcs.length === e.finished_tlc_cardinality, got.finished_tlcs.length, e.finished_tlc_cardinality]);
    if (e.units_in_channel_by_tlc) {
      for (const [t, n] of Object.entries(e.units_in_channel_by_tlc)) {
        checks.push([`channel[${t}]`, got.channelBy[t] === n, got.channelBy[t], n]);
      }
    }
    if (e.visited_includes) {
      const ok = e.visited_includes.every((t) => got.visited.has(t));
      checks.push(["visited_includes", ok, [...got.visited].sort(), e.visited_includes]);
    }
    for (const [name, ok, g, ex] of checks) {
      if (!ok) {
        failed++;
        console.error(`FAIL ${file} suspect=${c.suspect} ${name}: got ${JSON.stringify(g)} expect ${JSON.stringify(ex)}`);
      }
    }
  }
  for (const b of doc.backward_cases ?? []) {
    const got = backwardTrace(doc.graph, b.finished);
    if (!sameSet(got, b.expect_inputs)) {
      failed++;
      console.error(`FAIL ${file} backward ${b.finished}: got ${JSON.stringify(got)} expect ${JSON.stringify(b.expect_inputs)}`);
    }
  }
  console.log(`ok ${file}`);
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nAll fixture expects match reference blast.");
