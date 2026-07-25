"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Adme = {
  id: string;
  label: string;
  admeSummary: string;
  successCondition: string;
  admeChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function AdmePage() {
  const [items, setItems] = useState<Adme[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Structure-only ADME compile");
  const [admeSummary, setAdmeSummary] = useState(
    "Soft-sim structure-only topology-compiled PBPK vs measured-lab baseline.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [admeChannel, setAdmeChannel] = useState("soft_sim_pbpk");
  const [error, setError] = useState("");

  async function load() {
    const [admes, pks] = await Promise.all([
      api<{ items: Adme[] }>(`/api/adme?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/compounds"),
    ]);
    setItems(admes.items);
    setPacks(pks.items);
    if (!packId && pks.items[0]) setPackId(pks.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/adme", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          admeSummary,
          successCondition,
          admeChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="ADME configs"
      subtitle="Configure ADME model channels and pack-lock success conditions."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search ADME"
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
          <Label htmlFor="pack">Compound pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
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
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">ADME summary</Label>
          <Input
            id="summary"
            value={admeSummary}
            onChange={(e) => setAdmeSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <select
            id="success"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          >
            {["hold_pack", "review", "lock_soft_sim", "strong_lock"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ),
            )}
          </select>
        </div>
        <div>
          <Label htmlFor="channel">ADME channel</Label>
          <Input
            id="channel"
            value={admeChannel}
            onChange={(e) => setAdmeChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create ADME config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((a) => (
          <li
            key={a.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{a.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {a.admeChannel} · {a.successCondition} · {a.status}
            </div>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {a.admeSummary}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
