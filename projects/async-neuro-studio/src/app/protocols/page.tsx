"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Protocol = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  stepCount: number;
  status: string;
};

type Pack = { id: string; label: string };

export function ProtocolsPage() {
  const [items, setItems] = useState<Protocol[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("full_async");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      const [protocols, packRes] = await Promise.all([
        api<{ items: Protocol[] }>(
          `/api/protocols?q=${encodeURIComponent(query)}`,
        ),
        api<{ items: Pack[] }>("/api/packs"),
      ]);
      setItems(protocols.items);
      setPacks(packRes.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load protocols");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/protocols", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          fidelityHint: "protocol_fidelity",
          stepCount: 8,
          severityFloor: 0.35,
        }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create protocol");
    }
  };

  return (
    <StudioShell
      title="Exam protocols"
      subtitle="Define async neurological exam steps before scoring captures."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="kind">Kind</Label>
          <Input
            id="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            required
          />
          <Button>Create protocol</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search protocols"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search protocols"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((row) => (
              <article key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <h2 className="font-semibold">{row.label}</h2>
                <p className="text-sm text-slate-600">
                  {row.kind} · {row.stepCount} steps · {row.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default ProtocolsPage;
