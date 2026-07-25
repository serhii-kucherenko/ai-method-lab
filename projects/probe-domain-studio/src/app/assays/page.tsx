"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  cooperativity: number;
  domainCoverage: number;
  bridgeCompleteness: number;
  specificityDelta: number;
  status: string;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [cooperativity, setCooperativity] = useState("0.65");
  const [domainCoverage, setDomainCoverage] = useState("0.7");
  const [bridgeCompleteness, setBridgeCompleteness] = useState("0.72");
  const [specificityDelta, setSpecificityDelta] = useState("0.68");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/assays")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/assays", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          probeId: "probe-demo",
          domainId: "domain-demo",
          targetId: "target-demo",
          cooperativity: Number(cooperativity),
          domainCoverage: Number(domainCoverage),
          bridgeCompleteness: Number(bridgeCompleteness),
          specificityDelta: Number(specificityDelta),
          runNotes: "Assay soft-sim run",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell title="Assay runs" subtitle="Soft-sim cooperativity, domain coverage, bridge completeness, and specificity before dual compare.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="coop">Cooperativity</Label>
          <Input id="coop" value={cooperativity} onChange={(e) => setCooperativity(e.target.value)} />
          <Label htmlFor="cov">Domain coverage</Label>
          <Input id="cov" value={domainCoverage} onChange={(e) => setDomainCoverage(e.target.value)} />
          <Label htmlFor="bridge">Bridge completeness</Label>
          <Input id="bridge" value={bridgeCompleteness} onChange={(e) => setBridgeCompleteness(e.target.value)} />
          <Label htmlFor="spec">Specificity delta</Label>
          <Input id="spec" value={specificityDelta} onChange={(e) => setSpecificityDelta(e.target.value)} />
          <Button>Create assay run</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.id}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  coop {row.cooperativity} · coverage {row.domainCoverage} · bridge {row.bridgeCompleteness} · spec {row.specificityDelta}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
