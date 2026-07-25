"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Run = {
  id: string;
  signalClarity: number;
  caseVelocity: number;
  geoSpreadProxy: number;
  labConfirmProxy: number;
  status: string;
};

export function RunsPage() {
  const [thresholds, setThresholds] = useState<Ref[]>([]);
  const [classifications, setClassifications] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [thresholdId, setThresholdId] = useState("");
  const [classificationId, setClassificationId] = useState("");
  const [signalClarity, setSignalClarity] = useState(0.65);
  const [caseVelocity, setCaseVelocity] = useState(0.7);
  const [geoSpreadProxy, setGeoSpreadProxy] = useState(0.72);
  const [labConfirmProxy, setLabConfirmProxy] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [t, s, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/thresholds"),
      api<{ items: Ref[] }>("/api/classifications"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setThresholds(t.items);
    setClassifications(s.items);
    setItems(r.items);
    if (!thresholdId && t.items[0]) setThresholdId(t.items[0].id);
    if (!classificationId && s.items[0]) setClassificationId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          thresholdId,
          classificationId,
          signalClarity,
          caseVelocity,
          geoSpreadProxy,
          labConfirmProxy,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Soft-sim runs capturing signal clarity, case velocity, geo spread, and lab confirm."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="threshold">Threshold</Label>
          <select
            id="threshold"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={thresholdId}
            onChange={(e) => setThresholdId(e.target.value)}
          >
            {thresholds.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label ?? t.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="classification">Classification</Label>
          <select
            id="classification"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={classificationId}
            onChange={(e) => setClassificationId(e.target.value)}
          >
            {classifications.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="signal">Signal clarity</Label>
          <Input
            id="signal"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={signalClarity}
            onChange={(e) => setSignalClarity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="velocity">Case velocity</Label>
          <Input
            id="velocity"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={caseVelocity}
            onChange={(e) => setCaseVelocity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="geo">Geo spread proxy</Label>
          <Input
            id="geo"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={geoSpreadProxy}
            onChange={(e) => setGeoSpreadProxy(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="lab">Lab confirm proxy</Label>
          <Input
            id="lab"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={labConfirmProxy}
            onChange={(e) => setLabConfirmProxy(Number(e.target.value))}
          />
        </div>
        <div>
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <p className="text-sm">
              signal {r.signalClarity} · velocity {r.caseVelocity} · geo{" "}
              {r.geoSpreadProxy} · lab {r.labConfirmProxy} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
