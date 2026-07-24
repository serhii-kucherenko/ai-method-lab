"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ChartAsset, TactileLayer } from "@/store";

export default function LayersPage() {
  const [items, setItems] = useState<TactileLayer[]>([]);
  const [charts, setCharts] = useState<ChartAsset[]>([]);
  const [chartId, setChartId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState("series");
  const [texture, setTexture] = useState("ridged");
  const [elevation, setElevation] = useState("0.6");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [layers, chartRes] = await Promise.all([
        api<{ items: TactileLayer[] }>("/api/layers"),
        api<{ items: ChartAsset[] }>("/api/charts?page=1&pageSize=50"),
      ]);
      setItems(layers.items);
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
        await api("/api/layers", {
          method: "POST",
          body: JSON.stringify({
            chartId,
            name,
            kind,
            texture,
            elevation: Number(elevation) || 0.5,
            notes,
          }),
        });
        setName("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Tactile layers"
      subtitle="Stack layered tactile presentation — overview, axis, series, outlier, summary."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="animate-peel space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New layer</p>
          <div>
            <Label>Chart id</Label>
            <Input value={chartId} onChange={(e) => setChartId(e.target.value)} list="chart-ids" />
            <datalist id="chart-ids">
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
          <div>
            <Label>Kind</Label>
            <Input value={kind} onChange={(e) => setKind(e.target.value)} placeholder="overview | axis | series | outlier | summary" />
          </div>
          <div>
            <Label>Texture</Label>
            <Input value={texture} onChange={(e) => setTexture(e.target.value)} />
          </div>
          <div>
            <Label>Elevation (0–1)</Label>
            <Input value={elevation} onChange={(e) => setElevation(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !chartId.trim()} onClick={create}>
            Create layer
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="animate-peel rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{item.name}</p>
                <Badge variant="secondary">{item.kind}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {item.texture} · elevation {item.elevation} · order {item.order}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
