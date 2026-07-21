export type LotKind = "ingredient" | "intermediate" | "finished";

export type Lot = {
  tlc: string;
  kind: LotKind;
  qty: number;
  uom: string;
};

export type TransformInput = { tlc: string; qty: number };

export type Transform = {
  inputs: TransformInput[];
  output: string;
  scrap_qty?: number;
  scrap_uom?: string;
};

export type Shipment = {
  id: string;
  tlc: string;
  qty: number;
  partner: string;
};

export type Graph = {
  lots: Lot[];
  transforms: Transform[];
  shipments: Shipment[];
};

export type BlastResult = {
  finished_tlcs: string[];
  shipment_ids: string[];
  notify_partners: string[];
  units_in_channel: number;
  channelBy: Record<string, number>;
  visited: Set<string>;
};

export function forwardBlast(graph: Graph, suspect: string): BlastResult {
  const kind = new Map(graph.lots.map((l) => [l.tlc, l.kind]));
  const qty = new Map(graph.lots.map((l) => [l.tlc, l.qty]));
  const outs = new Map<string, string[]>();
  for (const t of graph.transforms) {
    for (const inp of t.inputs) {
      const list = outs.get(inp.tlc) ?? [];
      list.push(t.output);
      outs.set(inp.tlc, list);
    }
  }
  const visited = new Set<string>();
  const queue = [suspect];
  while (queue.length) {
    const tlc = queue.shift();
    if (!tlc || visited.has(tlc)) continue;
    visited.add(tlc);
    for (const next of outs.get(tlc) ?? []) queue.push(next);
  }
  const finished = [...visited].filter((t) => kind.get(t) === "finished").sort();
  const shipments = graph.shipments.filter((s) => visited.has(s.tlc));
  const notify = [...new Set(shipments.map((s) => s.partner))].sort();
  const shipIds = shipments.map((s) => s.id).sort();
  const consumedAsInput = new Map<string, number>();
  for (const t of graph.transforms) {
    for (const inp of t.inputs) {
      consumedAsInput.set(inp.tlc, (consumedAsInput.get(inp.tlc) ?? 0) + inp.qty);
    }
  }
  const channelBy: Record<string, number> = {};
  for (const t of finished) {
    const shipped = shipments.filter((s) => s.tlc === t).reduce((a, s) => a + s.qty, 0);
    const consumed = consumedAsInput.get(t) ?? 0;
    channelBy[t] = (qty.get(t) ?? 0) - shipped - consumed;
  }
  const units_in_channel = finished.reduce((a, t) => a + channelBy[t], 0);
  return {
    finished_tlcs: finished,
    shipment_ids: shipIds,
    notify_partners: notify,
    units_in_channel,
    channelBy,
    visited,
  };
}

export function backwardTrace(graph: Graph, finished: string): string[] {
  const ins = new Map<string, string[]>();
  for (const t of graph.transforms) {
    const list = ins.get(t.output) ?? [];
    for (const inp of t.inputs) list.push(inp.tlc);
    ins.set(t.output, list);
  }
  const visited = new Set<string>();
  const queue = [finished];
  while (queue.length) {
    const tlc = queue.shift();
    if (!tlc || visited.has(tlc)) continue;
    visited.add(tlc);
    for (const prev of ins.get(tlc) ?? []) queue.push(prev);
  }
  visited.delete(finished);
  return [...visited].sort();
}

export function wouldOverconsume(
  graph: Graph,
  attemptInputs: TransformInput[],
): boolean {
  const committed = new Map<string, number>();
  for (const t of graph.transforms) {
    for (const inp of t.inputs) {
      committed.set(inp.tlc, (committed.get(inp.tlc) ?? 0) + inp.qty);
    }
  }
  const lotQty = new Map(graph.lots.map((l) => [l.tlc, l.qty]));
  for (const inp of attemptInputs) {
    const available = (lotQty.get(inp.tlc) ?? 0) - (committed.get(inp.tlc) ?? 0);
    if (inp.qty > available) return true;
  }
  return false;
}
