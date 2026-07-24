"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { OptimizeRun, TravelerProfile } from "@/store";

export default function OptimizePage() {
  const [profiles, setProfiles] = useState<TravelerProfile[]>([]);
  const [runs, setRuns] = useState<OptimizeRun[]>([]);
  const [profileId, setProfileId] = useState("");
  const [name, setName] = useState("");
  const [lift, setLift] = useState("0.12");
  const [hold, setHold] = useState("0.96");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [p, o] = await Promise.all([
        api<{ items: TravelerProfile[] }>("/api/profiles"),
        api<{ items: OptimizeRun[] }>("/api/optimize"),
      ]);
      setProfiles(p.items);
      setRuns(o.items);
      if (!profileId && p.items[0]) setProfileId(p.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/optimize", {
        method: "POST",
        body: JSON.stringify({
          profileId,
          name,
          status: "done",
          preferenceLift: Number(lift),
          ruleHold: Number(hold),
        }),
      });
      setName("");
      load();
    });
  }

  return (
    <StudioShell
      title="Optimize"
      subtitle="Preference learning passes that lift fit while holding hard rules."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Profile</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Pass name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Preference lift</Label>
          <Input value={lift} onChange={(e) => setLift(e.target.value)} />
        </div>
        <div>
          <Label>Rule hold</Label>
          <Input value={hold} onChange={(e) => setHold(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !name || !profileId}>
            Run optimize pass
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {runs.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{r.name}</p>
            <p className="text-sm text-slate-500">
              {r.status} · lift {r.preferenceLift} · hold {r.ruleHold}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
