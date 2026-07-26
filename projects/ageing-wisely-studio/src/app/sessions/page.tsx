"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string };
type Ref = { id: string; label: string };

export function SessionsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [cohorts, setCohorts] = useState<Ref[]>([]);
  const [modules, setModules] = useState<Ref[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("guided_checkin");
  const [therapistSupportFidelity, setTherapistSupportFidelity] = useState("0.7");
  const [moduleCompletion, setModuleCompletion] = useState("0.65");
  const [engagementAdherence, setEngagementAdherence] = useState("0.7");
  const [sessionSignal, setSessionSignal] = useState("0.7");

  const load = async () => {
    try {
      const [sessions, packList, cohortList, moduleList] = await Promise.all([
        api<{ items: Row[] }>("/api/sessions"),
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/cohorts"),
        api<{ items: Ref[] }>("/api/modules"),
      ]);
      setItems(sessions.items);
      setPacks(packList.items);
      setCohorts(cohortList.items);
      setModules(moduleList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
      if (!cohortId && cohortList.items[0]) setCohortId(cohortList.items[0].id);
      if (!moduleId && moduleList.items[0]) setModuleId(moduleList.items[0].id);
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
      await api("/api/sessions", {
        method: "POST",
        body: JSON.stringify({
          packId,
          cohortId,
          moduleId,
          label,
          kind,
          therapistSupportFidelity: Number(therapistSupportFidelity),
          moduleCompletion: Number(moduleCompletion),
          engagementAdherence: Number(engagementAdherence),
          sessionSignal: Number(sessionSignal),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Sessions"
      subtitle="Soft-sim session runs for therapist-supported iCBT — not live therapy or clinical diagnosis."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="cohort">Cohort</Label>
          <select id="cohort" className="w-full rounded-md border px-3 py-2 text-sm" value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
            {cohorts.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="module">Module</Label>
          <select id="module" className="w-full rounded-md border px-3 py-2 text-sm" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            {modules.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="support">Therapist support fidelity</Label>
          <Input id="support" value={therapistSupportFidelity} onChange={(e) => setTherapistSupportFidelity(e.target.value)} />
          <Label htmlFor="completion">Module completion</Label>
          <Input id="completion" value={moduleCompletion} onChange={(e) => setModuleCompletion(e.target.value)} />
          <Label htmlFor="engagement">Engagement adherence</Label>
          <Input id="engagement" value={engagementAdherence} onChange={(e) => setEngagementAdherence(e.target.value)} />
          <Label htmlFor="signal">Session signal</Label>
          <Input id="signal" value={sessionSignal} onChange={(e) => setSessionSignal(e.target.value)} />
          <Button type="submit">Create</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                support {row.therapistSupportFidelity as number} · completion {row.moduleCompletion as number} · engagement {row.engagementAdherence as number}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default SessionsPage;
