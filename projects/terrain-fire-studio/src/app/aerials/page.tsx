"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Aerial = {
  id: string;
  packId: string;
  captureDate: string;
  resolutionCm: number;
  cloudCover: number;
  overlapRatio: number;
  status: string;
};

export default function AerialsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Aerial[]>([]);
  const [packId, setPackId] = useState("");
  const [captureDate, setCaptureDate] = useState("2026-07-01");
  const [resolutionCm, setResolutionCm] = useState("25");
  const [error, setError] = useState("");

  async function load() {
    const packData = await api<{ items: Pack[] }>("/api/packs");
    setPacks(packData.items);
    const pid = packId || packData.items[0]?.id || "";
    if (!packId && pid) setPackId(pid);
    const params = new URLSearchParams();
    if (pid) params.set("packId", pid);
    const data = await api<{ items: Aerial[] }>(`/api/aerials?${params}`);
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/aerials", {
        method: "POST",
        body: JSON.stringify({
          packId,
          captureDate,
          resolutionCm: Number(resolutionCm),
          cloudCover: 0.15,
          overlapRatio: 0.7,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Aerial refreshes"
      subtitle="Ingest new aerial strips with capture metadata before alignment."
    >
      {packs.length === 0 ? (
        <p className="text-sm text-stone-500">
          Need a terrain pack first — create one on Packs or seed from
          onboarding.
        </p>
      ) : (
        <>
          <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
            <div>
              <Label htmlFor="pack">Pack</Label>
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
              <Label htmlFor="date">Capture date</Label>
              <Input
                id="date"
                value={captureDate}
                onChange={(e) => setCaptureDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="res">Resolution (cm)</Label>
              <Input
                id="res"
                value={resolutionCm}
                onChange={(e) => setResolutionCm(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={create}>Add aerial</Button>
              <Button
                variant="outline"
                onClick={() => load().catch((e) => setError(String(e)))}
              >
                Refresh
              </Button>
            </div>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          {items.length === 0 ? (
            <p className="text-sm text-stone-500">No aerials for this pack yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--studio-line)] text-stone-500">
                  <th className="py-2">Capture</th>
                  <th>Resolution</th>
                  <th>Cloud</th>
                  <th>Overlap</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id} className="border-b border-[var(--studio-line)]">
                    <td className="py-2 font-medium">{a.captureDate}</td>
                    <td>{a.resolutionCm} cm</td>
                    <td>{a.cloudCover}</td>
                    <td>{a.overlapRatio}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </StudioShell>
  );
}
