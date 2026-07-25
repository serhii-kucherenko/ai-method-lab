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
  egoCoverage: number;
  exoCoverage: number;
  fusionClarity: number;
  packCompleteness: number;
  status: string;
};

export function RunsPage() {
  const [sessions, setSessions] = useState<Ref[]>([]);
  const [wearers, setWearers] = useState<Ref[]>([]);
  const [observers, setObservers] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [wearerId, setWearerId] = useState("");
  const [observerId, setObserverId] = useState("");
  const [egoCoverage, setEgo] = useState("0.7");
  const [exoCoverage, setExo] = useState("0.72");
  const [fusionClarity, setFusion] = useState("0.68");
  const [packCompleteness, setPack] = useState("0.65");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [s, w, o, r] = await Promise.all([
        api<{ items: Ref[] }>("/api/sessions"),
        api<{ items: Ref[] }>("/api/wearers"),
        api<{ items: Ref[] }>("/api/observers"),
        api<{ items: Run[] }>("/api/runs"),
      ]);
      setSessions(s.items);
      setWearers(w.items);
      setObservers(o.items);
      setItems(r.items);
      if (!sessionId && s.items[0]) setSessionId(s.items[0].id);
      if (!wearerId && w.items[0]) setWearerId(w.items[0].id);
      if (!observerId && o.items[0]) setObserverId(o.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load runs");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          wearerId,
          observerId,
          egoCoverage: Number(egoCoverage),
          exoCoverage: Number(exoCoverage),
          fusionClarity: Number(fusionClarity),
          packCompleteness: Number(packCompleteness),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create run");
    }
  };

  const select = (
    value: string,
    set: (v: string) => void,
    items: Ref[],
  ) => (
    <select
      className="w-full rounded-md border p-2"
      value={value}
      onChange={(e) => set(e.target.value)}
    >
      {items.map((x) => (
        <option key={x.id} value={x.id}>
          {x.label || x.id.slice(0, 8)}
        </option>
      ))}
    </select>
  );

  return (
    <StudioShell
      title="Runs"
      subtitle="Record soft-sim coverage and fusion clarity for a session."
    >
      <form
        onSubmit={create}
        className="mb-8 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2"
      >
        <div>
          <Label>Session</Label>
          {select(sessionId, setSessionId, sessions)}
        </div>
        <div>
          <Label>Wearer</Label>
          {select(wearerId, setWearerId, wearers)}
        </div>
        <div>
          <Label>Observer</Label>
          {select(observerId, setObserverId, observers)}
        </div>
        <div>
          <Label htmlFor="ego">Ego coverage</Label>
          <Input
            id="ego"
            value={egoCoverage}
            onChange={(e) => setEgo(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="exo">Exo coverage</Label>
          <Input
            id="exo"
            value={exoCoverage}
            onChange={(e) => setExo(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fusion">Fusion clarity</Label>
          <Input
            id="fusion"
            value={fusionClarity}
            onChange={(e) => setFusion(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pack">Pack completeness</Label>
          <Input
            id="pack"
            value={packCompleteness}
            onChange={(e) => setPack(e.target.value)}
          />
        </div>
        <Button className="w-fit">Create run</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="space-y-3">
        {items.map((r) => (
          <article key={r.id} className="row-lift rounded-lg border bg-white p-4">
            <h2 className="font-semibold">{r.id.slice(0, 8)}</h2>
            <p className="text-sm text-slate-600">
              ego {r.egoCoverage} · exo {r.exoCoverage} · fusion{" "}
              {r.fusionClarity} · pack {r.packCompleteness} · {r.status}
            </p>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default RunsPage;
