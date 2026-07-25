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
  detectionId: string;
  channelId: string;
  patientNormFit: number;
  channelCoverage: number;
  enormsStability: number;
  detectionSensitivity: number;
  status: string;
};

export default function RunsPage() {
  const [detections, setDetections] = useState<Ref[]>([]);
  const [channels, setChannels] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [detectionId, setDetectionId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [patientNormFit, setPatientNormFit] = useState(0.6);
  const [channelCoverage, setChannelCoverage] = useState(0.65);
  const [enormsStability, setEnormsStability] = useState(0.7);
  const [detectionSensitivity, setDetectionSensitivity] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [d, c, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/detections"),
      api<{ items: Ref[] }>("/api/channels"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setDetections(d.items);
    setChannels(c.items);
    setItems(r.items);
    if (!detectionId && d.items[0]) setDetectionId(d.items[0].id);
    if (!channelId && c.items[0]) setChannelId(c.items[0].id);
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
          detectionId,
          channelId,
          patientNormFit,
          channelCoverage,
          enormsStability,
          detectionSensitivity,
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
      subtitle="Soft-sim detection runs — patient fit, coverage, stability, sensitivity."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="detection">Detection</Label>
          <select
            id="detection"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={detectionId}
            onChange={(e) => setDetectionId(e.target.value)}
          >
            {detections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="channel">Channel</Label>
          <select
            id="channel"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          >
            {channels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label ?? m.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="fit">Patient norm fit</Label>
          <Input
            id="fit"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={patientNormFit}
            onChange={(e) => setPatientNormFit(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="cov">Channel coverage</Label>
          <Input
            id="cov"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={channelCoverage}
            onChange={(e) => setChannelCoverage(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="stab">E-norms stability</Label>
          <Input
            id="stab"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={enormsStability}
            onChange={(e) => setEnormsStability(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="sens">Detection sensitivity</Label>
          <Input
            id="sens"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={detectionSensitivity}
            onChange={(e) => setDetectionSensitivity(Number(e.target.value))}
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
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              fit {r.patientNormFit} · coverage {r.channelCoverage} · stability{" "}
              {r.enormsStability} · sensitivity {r.detectionSensitivity} ·{" "}
              {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
