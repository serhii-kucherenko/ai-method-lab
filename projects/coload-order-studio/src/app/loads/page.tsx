"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };

export function LoadsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [kind, setKind] = useState("dtx_then_icg");
  const [orderHint, setOrderHint] = useState("docetaxel-first,icg-second");
  const [photoFloor, setPhotoFloor] = useState("0.45");
  const [leakCeiling, setLeakCeiling] = useState("0.35");

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(`/api/loads?q=${encodeURIComponent(query)}`))
          .items,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/loads", {
        method: "POST",
        body: JSON.stringify({ packId, label, kind, orderHint, photoFloor: Number(photoFloor), leakCeiling: Number(leakCeiling) }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/loads", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="Load sequences" subtitle="Configure chemo-then-photo (or staged) load order before assay soft-sim.">
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Order kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="orderHint">Order hint</Label>
          <Input id="orderHint" value={orderHint} onChange={(e) => setOrderHint(e.target.value)} required />
          <Label htmlFor="photoFloor">Photo floor</Label>
          <Input id="photoFloor" value={photoFloor} onChange={(e) => setPhotoFloor(e.target.value)} />
          <Label htmlFor="leakCeiling">Leak ceiling</Label>
          <Input id="leakCeiling" value={leakCeiling} onChange={(e) => setLeakCeiling(e.target.value)} />
          <Button type="submit">Create</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li
                key={row.id}
                className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium">{row.label}</p>
                  <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    {row.kind} · {row.orderHint} · {row.status}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void archive(row.id)}
                >
                  Archive
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default LoadsPage;
