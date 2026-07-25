"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  label: string;
  status: string;
  lipidAccumulation?: number;
  inflammationCue?: number;
};

export function MasldPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [lipid, setLipid] = useState("0.55");
  const [inflam, setInflam] = useState("0.4");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            `/api/masld?q=${encodeURIComponent(query)}`,
          )
        ).items,
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
      await api("/api/masld", {
        method: "POST",
        body: JSON.stringify({
          label,
          lipidAccumulation: Number(lipid),
          inflammationCue: Number(inflam),
          phenotypeHint: "lipid,inflammation,MASLD",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="MASLD cases"
      subtitle="Configure soft-sim lipid and inflammation phenotypes — not clinical MASLD diagnosis."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="lipid">Lipid accumulation</Label>
          <Input
            id="lipid"
            value={lipid}
            onChange={(e) => setLipid(e.target.value)}
          />
          <Label htmlFor="inflam">Inflammation cue</Label>
          <Input
            id="inflam"
            value={inflam}
            onChange={(e) => setInflam(e.target.value)}
          />
          <Button>Create MASLD case</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search MASLD"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="button" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  lipid {row.lipidAccumulation} · inflammation{" "}
                  {row.inflammationCue}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default MasldPage;
