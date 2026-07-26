"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  therapist: { overall: number; supportScore: number };
  waitlist: { overall: number; supportScore: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [cohorts, setCohorts] = useState<Ref[]>([]);
  const [modules, setModules] = useState<Ref[]>([]);
  const [sessions, setSessions] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Therapist vs waitlist");
  const [packId, setPackId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [sessionRunId, setSessionRunId] = useState("");
  const [careBias, setCareBias] = useState("balanced");

  const load = async () => {
    try {
      const [packList, cohortList, moduleList, sessionList, compares] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/cohorts"),
        api<{ items: Ref[] }>("/api/modules"),
        api<{ items: Ref[] }>("/api/sessions"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(packList.items);
      setCohorts(cohortList.items);
      setModules(moduleList.items);
      setSessions(sessionList.items);
      setItems(compares.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
      if (!cohortId && cohortList.items[0]) setCohortId(cohortList.items[0].id);
      if (!moduleId && moduleList.items[0]) setModuleId(moduleList.items[0].id);
      if (!sessionRunId && sessionList.items[0]) setSessionRunId(sessionList.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, packId, cohortId, moduleId, sessionRunId, careBias }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual soft-sim: therapist-supported iCBT (A) versus waitlist / self-guided baseline (B)."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="cohort">Cohort</Label>
          <select id="cohort" className="w-full rounded-md border px-3 py-2 text-sm" value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
            {cohorts.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="module">Module</Label>
          <select id="module" className="w-full rounded-md border px-3 py-2 text-sm" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            {modules.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="session">Session</Label>
          <select id="session" className="w-full rounded-md border px-3 py-2 text-sm" value={sessionRunId} onChange={(e) => setSessionRunId(e.target.value)}>
            {sessions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="bias">Care bias</Label>
          <select id="bias" className="w-full rounded-md border px-3 py-2 text-sm" value={careBias} onChange={(e) => setCareBias(e.target.value)}>
            <option value="balanced">balanced</option>
            <option value="therapist_first">therapist_first</option>
            <option value="self_guided_first">self_guided_first</option>
            <option value="waitlist_first">waitlist_first</option>
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-3">
          {items.map((row) => (
            <li key={row.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-[var(--aw-sage)]">winner {row.winner} · gap {row.gap}</p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">Therapist-supported</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                    <div className="score-bar h-full bg-[var(--aw-sage)]" style={{ width: `${row.therapist.overall}%` }} />
                  </div>
                  <p className="mt-1 text-sm">{row.therapist.overall}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">Waitlist / self-guided</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                    <div className="score-bar h-full bg-[var(--aw-amber)]" style={{ width: `${row.waitlist.overall}%` }} />
                  </div>
                  <p className="mt-1 text-sm">{row.waitlist.overall}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
