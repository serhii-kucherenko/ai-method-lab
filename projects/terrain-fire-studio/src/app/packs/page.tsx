"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = {
  id: string;
  label: string;
  region: string;
  elevationSpanM: number;
  fuelLoadIndex: number;
  version: string;
  status: string;
};

export default function PacksPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [label, setLabel] = useState("");
  const [region, setRegion] = useState("");
  const [version, setVersion] = useState("2026.1");
  const [error, setError] = useState("");

  async function load() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const data = await api<{ items: Pack[] }>(`/api/packs?${params}`);
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({
          label: label || `Pack ${Date.now()}`,
          region: region || "Unassigned region",
          elevationSpanM: 600,
          fuelLoadIndex: 0.55,
          version: version || "1.0",
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Terrain packs"
      subtitle="Versioned landscape packs. Search and filter by region or status."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5">
        <div>
          <Label htmlFor="label">Pack label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Northern Sierra"
          />
        </div>
        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="q">Search</Label>
          <Input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Label, region…"
          />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={create}>Create pack</Button>
          <Button
            variant="outline"
            onClick={() => {
              setStatus(status === "active" ? "" : "active");
              load().catch((e) => setError(String(e)));
            }}
          >
            Filter
          </Button>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-stone-500">
          No packs yet — create one or seed from onboarding.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-stone-500">
              <th className="py-2">Label</th>
              <th>Region</th>
              <th>Version</th>
              <th>Elevation span</th>
              <th>Fuel</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr
                key={p.id}
                className="pack-row border-b border-[var(--studio-line)]"
              >
                <td className="py-2 font-medium">{p.label}</td>
                <td>{p.region}</td>
                <td>{p.version}</td>
                <td>{p.elevationSpanM} m</td>
                <td>{p.fuelLoadIndex}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
