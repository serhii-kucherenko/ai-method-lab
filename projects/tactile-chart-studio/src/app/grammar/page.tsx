"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { GrammarToken } from "@/store";

export default function GrammarPage() {
  const [items, setItems] = useState<GrammarToken[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [spoken, setSpoken] = useState("");
  const [haptic, setHaptic] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: GrammarToken[] }>(
        `/api/grammar?q=${encodeURIComponent(search)}`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/grammar", {
          method: "POST",
          body: JSON.stringify({ name, trigger, spoken, haptic, notes }),
        });
        setName("");
        setTrigger("");
        setSpoken("");
        setHaptic("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Feedback grammar"
      subtitle="Edit spoken and haptic tokens triggered during chart exploration."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New token</p>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Trigger</Label>
            <Input value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="on_select_max" />
          </div>
          <div>
            <Label>Spoken</Label>
            <Input value={spoken} onChange={(e) => setSpoken(e.target.value)} />
          </div>
          <div>
            <Label>Haptic</Label>
            <Input value={haptic} onChange={(e) => setHaptic(e.target.value)} placeholder="double_pulse" />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !trigger.trim() || !spoken.trim()}
            onClick={create}
          >
            Create token
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search grammar…" />
            <Button variant="outline" onClick={() => load()} disabled={pending}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
              >
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.trigger} · {item.haptic}
                </p>
                <p className="mt-1 text-sm text-slate-600">{item.spoken}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
