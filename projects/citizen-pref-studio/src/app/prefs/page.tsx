"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  safetyPreference: number;
  oversightSupport: number;
  coordinationPreference: number;
  packReadiness: number;
  status: string;
};

export function PrefsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [safetyPreference, setSafety] = useState(0.7);
  const [oversightSupport, setOversight] = useState(0.72);
  const [coordinationPreference, setCoord] = useState(0.68);
  const [packReadiness, setReady] = useState(0.7);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Run[] }>("/api/prefs")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load prefs");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/prefs", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          optionId: "option-demo",
          countryId: "country-demo",
          surveyId: "survey-demo",
          safetyPreference,
          oversightSupport,
          coordinationPreference,
          packReadiness,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create run");
    }
  };

  return (
    <StudioShell
      title="Preference runs"
      subtitle="Soft-sim preference runs feed dual A/B compares — not certified polling."
    >
      <form onSubmit={create} className="mb-8 grid max-w-lg gap-3 rounded-lg border bg-white p-4">
        <Label htmlFor="safety">Safety preference</Label>
        <Input id="safety" type="number" step="0.01" min={0} max={1} value={safetyPreference} onChange={(e) => setSafety(Number(e.target.value))} />
        <Label htmlFor="oversight">Oversight support</Label>
        <Input id="oversight" type="number" step="0.01" min={0} max={1} value={oversightSupport} onChange={(e) => setOversight(Number(e.target.value))} />
        <Label htmlFor="coord">Coordination preference</Label>
        <Input id="coord" type="number" step="0.01" min={0} max={1} value={coordinationPreference} onChange={(e) => setCoord(Number(e.target.value))} />
        <Label htmlFor="ready">Pack readiness</Label>
        <Input id="ready" type="number" step="0.01" min={0} max={1} value={packReadiness} onChange={(e) => setReady(Number(e.target.value))} />
        <Button>Create pref run</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="row-lift rounded-lg border bg-white p-4">
            <p className="font-semibold">{r.id}</p>
            <p className="text-sm">
              safety {r.safetyPreference} · oversight {r.oversightSupport} · coord {r.coordinationPreference} · ready {r.packReadiness}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default PrefsPage;
