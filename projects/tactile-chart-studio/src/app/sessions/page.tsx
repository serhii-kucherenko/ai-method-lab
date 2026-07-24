"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ChartAsset, ExploreSession } from "@/store";

export default function SessionsPage() {
  const [items, setItems] = useState<ExploreSession[]>([]);
  const [charts, setCharts] = useState<ChartAsset[]>([]);
  const [chartId, setChartId] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [sessions, chartRes] = await Promise.all([
        api<{ items: ExploreSession[] }>("/api/sessions"),
        api<{ items: ChartAsset[] }>("/api/charts?page=1&pageSize=50"),
      ]);
      setItems(sessions.items);
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
        await api("/api/sessions", {
          method: "POST",
          body: JSON.stringify({ chartId, name, notes }),
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
      title="Explore sessions"
      subtitle="Conversational chart exploration sessions for BLV users."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New session</p>
          <div>
            <Label>Chart id</Label>
            <Input value={chartId} onChange={(e) => setChartId(e.target.value)} list="session-charts" />
            <datalist id="session-charts">
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
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !chartId.trim()} onClick={create}>
            Start session
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{item.name}</p>
                <Badge variant="secondary">{item.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">{item.turns} turns · {item.id}</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
