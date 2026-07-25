"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Gate = {
  id: string;
  packId: string;
  label: string;
  domain: string;
  checkpointCount: number;
  privacyWeight: number;
  status: string;
};

export default function GatesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Gate[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("IRB-shaped privacy gate (soft-sim)");
  const [domain, setDomain] = useState("hypertension");
  const [checkpointCount, setCheckpointCount] = useState("14");
  const [privacyWeight, setPrivacyWeight] = useState("0.65");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, w] = await Promise.all([
      api<{ items: Pack[] }>("/api/studies"),
      api<{ items: Gate[] }>(`/api/gates?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(w.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/gates", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          domain,
          checkpointCount: Number(checkpointCount),
          privacyWeight: Number(privacyWeight),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Governance gates"
      subtitle="Configure privacy checkpoints and privacy vs workflow weights before scoring."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search gates"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Study pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="gate-label">Label</Label>
          <Input
            id="gate-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="checkpoints">Checkpoint count</Label>
          <Input
            id="checkpoints"
            value={checkpointCount}
            onChange={(e) => setCheckpointCount(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">Privacy weight</Label>
          <Input
            id="weight"
            value={privacyWeight}
            onChange={(e) => setPrivacyWeight(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create gate</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((w) => (
          <li
            key={w.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{w.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {w.domain} · checkpoints {w.checkpointCount} · privacy{" "}
              {w.privacyWeight} · {w.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
