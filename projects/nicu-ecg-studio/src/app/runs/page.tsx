"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Channel = { id: string; label: string };
type Inpaint = { id: string; label: string };
type Run = {
  id: string;
  inpaintId: string;
  ppgChannelId: string;
  ppgCoverage: number;
  inpaintFidelity: number;
  ecgRecovery: number;
  packCompleteness: number;
  runNotes: string;
  status: string;
};

export function RunsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [inpaints, setInpaints] = useState<Inpaint[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [inpaintId, setInpaintId] = useState("");
  const [ppgChannelId, setPpgChannelId] = useState("");
  const [ppgCoverage, setPpgCoverage] = useState("0.7");
  const [inpaintFidelity, setInpaintFidelity] = useState("0.72");
  const [ecgRecovery, setEcgRecovery] = useState("0.68");
  const [packCompleteness, setPackCompleteness] = useState("0.65");
  const [runNotes, setRunNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, r, runs] = await Promise.all([
      api<{ items: Channel[] }>("/api/ppg"),
      api<{ items: Inpaint[] }>("/api/inpaints"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setChannels(p.items);
    setInpaints(r.items);
    setItems(runs.items);
    if (!ppgChannelId && p.items[0]) setPpgChannelId(p.items[0].id);
    if (!inpaintId && r.items[0]) setInpaintId(r.items[0].id);
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
          inpaintId,
          ppgChannelId,
          ppgCoverage: Number(ppgCoverage),
          inpaintFidelity: Number(inpaintFidelity),
          ecgRecovery: Number(ecgRecovery),
          packCompleteness: Number(packCompleteness),
          runNotes,
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
      subtitle="Capture soft-sim proxies for alignment-free PPG-guided ECG runs."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="inpaint">Inpaint recipe</Label>
          <select
            id="inpaint"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={inpaintId}
            onChange={(e) => setInpaintId(e.target.value)}
          >
            {inpaints.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="ppg">PPG channel</Label>
          <select
            id="ppg"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={ppgChannelId}
            onChange={(e) => setPpgChannelId(e.target.value)}
          >
            {channels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="ppgC">PPG coverage (0–1)</Label>
          <Input id="ppgC" value={ppgCoverage} onChange={(e) => setPpgCoverage(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="fid">Inpaint fidelity (0–1)</Label>
          <Input id="fid" value={inpaintFidelity} onChange={(e) => setInpaintFidelity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="ecg">ECG recovery (0–1)</Label>
          <Input id="ecg" value={ecgRecovery} onChange={(e) => setEcgRecovery(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pack">Pack completeness (0–1)</Label>
          <Input id="pack" value={packCompleteness} onChange={(e) => setPackCompleteness(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Run notes</Label>
          <Input id="notes" value={runNotes} onChange={(e) => setRunNotes(e.target.value)} />
        </div>
        <div>
          <Button onClick={() => create()}>Create ecg run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.id.slice(0, 8)}… · {r.status}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              ppg {r.ppgCoverage} · fidelity {r.inpaintFidelity} · ecg{" "}
              {r.ecgRecovery} · pack {r.packCompleteness}
            </p>
            {r.runNotes ? <p className="mt-1 text-sm">{r.runNotes}</p> : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
