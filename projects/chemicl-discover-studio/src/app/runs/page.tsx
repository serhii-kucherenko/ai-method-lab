"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Run = {
  id: string;
  multimodalCoverage: number;
  modalityFidelity: number;
  exemplarAlignment: number;
  iclPrecision: number;
  status: string;
};

export default function RunsPage() {
  const [exemplars, setExemplars] = useState<Ref[]>([]);
  const [modalities, setModalities] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [exemplarId, setExemplarId] = useState("");
  const [modalityId, setModalityId] = useState("");
  const [multimodalCoverage, setMultimodalCoverage] = useState(0.65);
  const [modalityFidelity, setModalityFidelity] = useState(0.7);
  const [exemplarAlignment, setExemplarAlignment] = useState(0.72);
  const [iclPrecision, setIclPrecision] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [t, s, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/exemplars"),
      api<{ items: Ref[] }>("/api/modalities"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setExemplars(t.items);
    setModalities(s.items);
    setItems(r.items);
    if (!exemplarId && t.items[0]) setExemplarId(t.items[0].id);
    if (!modalityId && s.items[0]) setModalityId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          exemplarId,
          modalityId,
          multimodalCoverage,
          modalityFidelity,
          exemplarAlignment,
          iclPrecision,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Soft-sim runs capturing coverage, fidelity, alignment, and ICL precision."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="exemplar">Exemplar set</Label>
          <select
            id="exemplar"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={exemplarId}
            onChange={(e) => setExemplarId(e.target.value)}
          >
            {exemplars.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label ?? t.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="modality">Modality</Label>
          <select
            id="modality"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={modalityId}
            onChange={(e) => setModalityId(e.target.value)}
          >
            {modalities.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Multimodal coverage</Label>
          <Input
            id="cov"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={multimodalCoverage}
            onChange={(e) => setMultimodalCoverage(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="fid">Modality fidelity</Label>
          <Input
            id="fid"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={modalityFidelity}
            onChange={(e) => setModalityFidelity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="align">Exemplar alignment</Label>
          <Input
            id="align"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={exemplarAlignment}
            onChange={(e) => setExemplarAlignment(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="prec">ICL precision</Label>
          <Input
            id="prec"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={iclPrecision}
            onChange={(e) => setIclPrecision(Number(e.target.value))}
          />
        </div>
        <div>
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <p className="text-sm">
              cov {r.multimodalCoverage} · fid {r.modalityFidelity} · align{" "}
              {r.exemplarAlignment} · prec {r.iclPrecision} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
