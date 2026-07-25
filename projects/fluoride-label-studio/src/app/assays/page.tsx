"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  exchangeRate: number;
  precursorPurity: number;
  leavingGroupEase: number;
  amineAvailability: number;
  runNotes: string;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [exchangeRate, setExchangeRate] = useState("0.62");
  const [precursorPurity, setPrecursorPurity] = useState("0.7");
  const [leavingGroupEase, setLeavingGroupEase] = useState("0.74");
  const [amineAvailability, setAmineAvailability] = useState("0.68");
  const [runNotes, setRunNotes] = useState("");
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
          exchangeRate: Number(exchangeRate),
          precursorPurity: Number(precursorPurity),
          leavingGroupEase: Number(leavingGroupEase),
          amineAvailability: Number(amineAvailability),
          runNotes,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assay soft-sim"
      subtitle="Capture exchange-rate and precursor-purity inputs for dual A/B labeling compares."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="exchangeRate">Exchange rate</Label>
          <Input id="exchangeRate" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} />
          <Label htmlFor="precursorPurity">Precursor purity</Label>
          <Input id="precursorPurity" value={precursorPurity} onChange={(e) => setPrecursorPurity(e.target.value)} />
          <Label htmlFor="leavingGroupEase">Leaving-group ease</Label>
          <Input id="leavingGroupEase" value={leavingGroupEase} onChange={(e) => setLeavingGroupEase(e.target.value)} />
          <Label htmlFor="amineAvailability">Amine availability</Label>
          <Input id="amineAvailability" value={amineAvailability} onChange={(e) => setAmineAvailability(e.target.value)} />
          <Label htmlFor="runNotes">Notes</Label>
          <Input id="runNotes" value={runNotes} onChange={(e) => setRunNotes(e.target.value)} />
          <Button>Create assay</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">Assay {row.id.slice(0, 8)}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  exchange {row.exchangeRate} · purity {row.precursorPurity} · leaving {row.leavingGroupEase}
                </p>
                {row.runNotes ? <p className="mt-1 text-sm">{row.runNotes}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
