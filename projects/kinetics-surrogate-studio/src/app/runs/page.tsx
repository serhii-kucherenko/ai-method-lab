"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type KineticsRun = {
  id: string;
  surrogateId: string;
  rateTableId: string;
  rateCoverage: number;
  entropyConfidence: number;
  mechanismConfidence: number;
  rateAgreement: number;
  reviewerNotes: string;
  status: string;
};

type Ref = { id: string; label: string };

export default function RunsPage() {
  const [items, setItems] = useState<KineticsRun[]>([]);
  const [surrogates, setSurrogates] = useState<Ref[]>([]);
  const [rates, setRates] = useState<Ref[]>([]);
  const [surrogateId, setSurrogateId] = useState("");
  const [rateTableId, setRateTableId] = useState("");
  const [rateCoverage, setRateCoverage] = useState("0.55");
  const [entropyConfidence, setEntropyConfidence] = useState("0.7");
  const [mechanismConfidence, setMechanismConfidence] = useState("0.72");
  const [rateAgreement, setRateAgreement] = useState("0.65");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: KineticsRun[] }>("/api/runs");
    setItems(data.items);
  }

  useEffect(() => {
    Promise.all([
      load(),
      api<{ items: Ref[] }>("/api/surrogates").then((d) => {
        setSurrogates(d.items);
        if (d.items[0]) setSurrogateId(d.items[0].id);
      }),
      api<{ items: Ref[] }>("/api/rates").then((d) => {
        setRates(d.items);
        if (d.items[0]) setRateTableId(d.items[0].id);
      }),
    ]).catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          surrogateId,
          rateTableId,
          rateCoverage: Number(rateCoverage),
          entropyConfidence: Number(entropyConfidence),
          mechanismConfidence: Number(mechanismConfidence),
          rateAgreement: Number(rateAgreement),
          reviewerNotes: notes,
        }),
      });
      setNotes("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Kinetics runs"
      subtitle="Record soft-sim cues for entropy fidelity, mechanism fit, and rate agreement."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="surrogate">Surrogate</Label>
          <select
            id="surrogate"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={surrogateId}
            onChange={(e) => setSurrogateId(e.target.value)}
          >
            {surrogates.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="rate">Rate table</Label>
          <select
            id="rate"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={rateTableId}
            onChange={(e) => setRateTableId(e.target.value)}
          >
            {rates.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="coverage">Rate coverage</Label>
          <Input
            id="coverage"
            value={rateCoverage}
            onChange={(e) => setRateCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="entropy">Entropy confidence</Label>
          <Input
            id="entropy"
            value={entropyConfidence}
            onChange={(e) => setEntropyConfidence(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="mech">Mechanism confidence</Label>
          <Input
            id="mech"
            value={mechanismConfidence}
            onChange={(e) => setMechanismConfidence(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="agree">Rate agreement</Label>
          <Input
            id="agree"
            value={rateAgreement}
            onChange={(e) => setRateAgreement(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Reviewer notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create kinetics run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No kinetics runs yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium">{r.id}</div>
              <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                coverage {r.rateCoverage} · entropy {r.entropyConfidence} ·
                mechanism {r.mechanismConfidence} · agreement {r.rateAgreement}{" "}
                · {r.status}
              </div>
              {r.reviewerNotes ? (
                <p className="mt-1 text-sm">{r.reviewerNotes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
