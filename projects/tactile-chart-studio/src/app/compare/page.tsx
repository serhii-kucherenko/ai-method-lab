"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ChartAsset, CompareResult } from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<CompareResult[]>([]);
  const [charts, setCharts] = useState<ChartAsset[]>([]);
  const [chartId, setChartId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [compares, chartRes] = await Promise.all([
        api<{ items: CompareResult[] }>("/api/compare"),
        api<{ items: ChartAsset[] }>("/api/charts?page=1&pageSize=50"),
      ]);
      setItems(compares.items);
      setCharts(chartRes.items);
      if (!chartId && chartRes.items[0]) setChartId(chartRes.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/compare", {
          method: "POST",
          body: JSON.stringify({ chartId, name: name || "Tactile vs visual" }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Conversational + tactile plan quality versus visual-only baseline."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Run compare</p>
          <div>
            <Label>Chart id</Label>
            <Input value={chartId} onChange={(e) => setChartId(e.target.value)} list="compare-charts" />
            <datalist id="compare-charts">
              {charts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !chartId.trim()} onClick={create}>
            Compare tactile vs visual
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{item.name}</p>
                <Badge>winner: {item.winner}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  Tactile overall:{" "}
                  <strong>{item.tactile.overall}</strong>
                </p>
                <p>
                  Visual overall: <strong>{item.visual.overall}</strong>
                </p>
                <p>Verify: {item.tactile.verifyScore}</p>
                <p>Visual verify: {item.visual.verifyScore}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
