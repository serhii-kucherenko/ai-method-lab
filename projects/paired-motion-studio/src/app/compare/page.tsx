"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Result = {
  fusion: { overall: number };
  egoOnly: { overall: number };
  winner: string;
  gap: number;
};

export function ComparePage() {
  const [sessions, setSessions] = useState<Ref[]>([]);
  const [wearers, setWearers] = useState<Ref[]>([]);
  const [observers, setObservers] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [name, setName] = useState("Paired motion A/B");
  const [sessionId, setSession] = useState("");
  const [wearerId, setWearer] = useState("");
  const [observerId, setObserver] = useState("");
  const [runId, setRun] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [s, w, o, r] = await Promise.all([
          api<{ items: Ref[] }>("/api/sessions"),
          api<{ items: Ref[] }>("/api/wearers"),
          api<{ items: Ref[] }>("/api/observers"),
          api<{ items: Ref[] }>("/api/runs"),
        ]);
        setSessions(s.items);
        setWearers(w.items);
        setObservers(o.items);
        setRuns(r.items);
        setSession(s.items[0]?.id || "");
        setWearer(w.items[0]?.id || "");
        setObserver(o.items[0]?.id || "");
        setRun(r.items[0]?.id || "");
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not load comparison references",
        );
      }
    })();
  }, []);

  const compare = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setResult(
        (
          await api<{ compare: Result }>("/api/compare", {
            method: "POST",
            body: JSON.stringify({
              name,
              sessionId,
              wearerId,
              observerId,
              runId,
            }),
          })
        ).compare,
      );
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not run comparison");
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
      title="A/B compare"
      subtitle="Compare distributed ego+exo fusion with an ego-only baseline."
    >
      <form
        onSubmit={compare}
        className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2"
      >
        <div>
          <Label htmlFor="name">Comparison name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label>Session</Label>
          {select(sessionId, setSession, sessions)}
        </div>
        <div>
          <Label>Wearer</Label>
          {select(wearerId, setWearer, wearers)}
        </div>
        <div>
          <Label>Observer</Label>
          {select(observerId, setObserver, observers)}
        </div>
        <div>
          <Label>Run</Label>
          {select(runId, setRun, runs)}
        </div>
        <Button className="w-fit">Run A/B compare</Button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {result ? (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border bg-white p-5">
            <p className="text-sm">Fusion overall</p>
            <strong className="text-3xl">{result.fusion.overall}</strong>
          </article>
          <article className="rounded-lg border bg-white p-5">
            <p className="text-sm">Ego-only overall</p>
            <strong className="text-3xl">{result.egoOnly.overall}</strong>
          </article>
          <article className="rounded-lg border border-[var(--pm-amber)] bg-[var(--studio-warn-soft)] p-5">
            <p className="text-sm">Winner · gap</p>
            <strong className="text-xl">
              {result.winner} · {result.gap}
            </strong>
          </article>
        </section>
      ) : null}
    </StudioShell>
  );
}

export default ComparePage;
