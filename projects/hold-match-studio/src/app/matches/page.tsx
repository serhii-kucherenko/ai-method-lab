"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Match = {
  id: string;
  orderLabel: string;
  driverLabel: string;
  zone: string;
  pickupEtaMin: number;
  fareProxy: number;
  supplyDemandStress: number;
  status: string;
};

export default function MatchesPage() {
  const [items, setItems] = useState<Match[]>([]);
  const [q, setQ] = useState("");
  const [zone, setZone] = useState("");
  const [orderLabel, setOrderLabel] = useState("");
  const [driverLabel, setDriverLabel] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (zone) params.set("zone", zone);
    const data = await api<{ items: Match[] }>(`/api/matches?${params}`);
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/matches", {
        method: "POST",
        body: JSON.stringify({
          orderLabel: orderLabel || `ORD-${Date.now()}`,
          driverLabel: driverLabel || "DRV-NEW",
          zone: zone || "Downtown",
          status: "open",
        }),
      });
      setOrderLabel("");
      setDriverLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Matches"
      subtitle="Driver–order candidate registry. Search and filter by zone."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="order">Order label</Label>
          <Input
            id="order"
            value={orderLabel}
            onChange={(e) => setOrderLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="driver">Driver label</Label>
          <Input
            id="driver"
            value={driverLabel}
            onChange={(e) => setDriverLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="zone">Zone filter</Label>
          <Input
            id="zone"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={create}>Create match</Button>
          <Button
            variant="outline"
            onClick={() => load().catch((e) => setError(String(e)))}
          >
            Search
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Label htmlFor="q">Search</Label>
        <Input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Order, driver, zone…"
        />
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No matches yet — create one or seed from onboarding.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-slate-500">
              <th className="py-2">Order</th>
              <th>Driver</th>
              <th>Zone</th>
              <th>ETA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="border-b border-[var(--studio-line)]">
                <td className="py-2 font-medium">{m.orderLabel}</td>
                <td>{m.driverLabel}</td>
                <td>{m.zone}</td>
                <td>{m.pickupEtaMin}m</td>
                <td>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
