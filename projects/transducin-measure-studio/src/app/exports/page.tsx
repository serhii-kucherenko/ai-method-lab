"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type ExportRow = {
  id: string;
  label: string;
  exportText: string;
  successCondition: string;
  exportChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function ExportsPage() {
  const [items, setItems] = useState<ExportRow[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("DICOM SR macular measure export");
  const [exportText, setExportText] = useState(
    "Recover SNOMED-coded DICOM SR measures before raw private-tag dumps miss coding drift.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [exportChannel, setExportChannel] = useState("soft_sim_dicom_sr");
  const [error, setError] = useState("");

  async function load() {
    const [exports, ps] = await Promise.all([
      api<{ items: ExportRow[] }>("/api/exports"),
      api<{ items: Pack[] }>("/api/measures"),
    ]);
    setItems(exports.items);
    setPacks(ps.items);
    if (!packId && ps.items[0]) setPackId(ps.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/exports", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          exportText,
          successCondition,
          exportChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="DICOM SR exports"
      subtitle="SNOMED-coded Structured Report export gates for soft-sim pack locking."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Measure pack</Label>
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
          <Label htmlFor="text">Export text</Label>
          <Input
            id="text"
            value={exportText}
            onChange={(e) => setExportText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <Input
            id="success"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channel">Export channel</Label>
          <Input
            id="channel"
            value={exportChannel}
            onChange={(e) => setExportChannel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create export</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.exportChannel} · {s.successCondition} · {s.status}
            </div>
            <p className="mt-1 text-sm">{s.exportText}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
