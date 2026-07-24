"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { IiotSite, SensorMetric, SensorStream } from "@/store";

const METRICS: SensorMetric[] = [
  "pressure",
  "vibration",
  "temperature",
  "flow",
  "current",
  "network",
];

export default function SensorsPage() {
  const [sites, setSites] = useState<IiotSite[]>([]);
  const [items, setItems] = useState<SensorStream[]>([]);
  const [siteId, setSiteId] = useState("");
  const [q, setQ] = useState("");
  const [maxAnomaly, setMaxAnomaly] = useState("");
  const [name, setName] = useState("");
  const [metric, setMetric] = useState<SensorMetric>("vibration");
  const [sampleRateHz, setSampleRateHz] = useState("100");
  const [anomalyScore, setAnomalyScore] = useState("0.4");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const params = new URLSearchParams({ page: "1", pageSize: "50" });
      if (siteId) params.set("siteId", siteId);
      if (q) params.set("q", q);
      if (maxAnomaly) params.set("maxAnomaly", maxAnomaly);
      const res = await api<{ items: SensorStream[] }>(`/api/sensors?${params}`);
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const s = await api<{ items: IiotSite[] }>("/api/sites?page=1&pageSize=50");
      setSites(s.items);
      if (s.items[0]) setSiteId(s.items[0].id);
      const sens = await api<{ items: SensorStream[] }>("/api/sensors?page=1&pageSize=50");
      setItems(sens.items);
    });
  }, []);

  function create() {
    start(async () => {
      try {
        await api<SensorStream>("/api/sensors", {
          method: "POST",
          body: JSON.stringify({
            siteId,
            name,
            metric,
            sampleRateHz: Number(sampleRateHz),
            anomalyScore: Number(anomalyScore),
            notes,
          }),
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
      title="Sensors"
      subtitle="Attach time-series sensor streams with anomaly scores that feed defense planners."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Add sensor stream</p>
          <div>
            <Label htmlFor="sens-site">Site</Label>
            <select id="sens-site" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="sens-name">Name</Label>
            <Input id="sens-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sens-metric">Metric</Label>
            <select id="sens-metric" className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={metric} onChange={(e) => setMetric(e.target.value as SensorMetric)}>
              {METRICS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="sens-hz">Sample rate (Hz)</Label>
            <Input id="sens-hz" value={sampleRateHz} onChange={(e) => setSampleRateHz(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sens-anom">Anomaly score (0–1)</Label>
            <Input id="sens-anom" value={anomalyScore} onChange={(e) => setAnomalyScore(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sens-notes">Notes</Label>
            <Input id="sens-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !siteId} onClick={create}>
            Add sensor
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search metric / name" className="min-w-[10rem] flex-1" />
            <Input value={maxAnomaly} onChange={(e) => setMaxAnomaly(e.target.value)} placeholder="Max anomaly" className="w-28" />
            <Button variant="outline" onClick={load}>Filter</Button>
          </div>
          <ul className="space-y-2">
            {items.map((s) => (
              <li key={s.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{s.name}</p>
                  <Badge variant="secondary">{s.metric}</Badge>
                  <Badge>anom {s.anomalyScore}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {s.sampleRateHz} Hz · {s.notes || "No notes"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
