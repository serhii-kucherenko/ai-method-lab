"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ExploreSession, VerifyTurn } from "@/store";

export default function VerifyPage() {
  const [items, setItems] = useState<VerifyTurn[]>([]);
  const [sessions, setSessions] = useState<ExploreSession[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [phase, setPhase] = useState("select");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [confirmed, setConfirmed] = useState(true);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [verifies, sess] = await Promise.all([
        api<{ items: VerifyTurn[] }>("/api/verifies"),
        api<{ items: ExploreSession[] }>("/api/sessions"),
      ]);
      setItems(verifies.items);
      setSessions(sess.items);
      if (!sessionId && sess.items[0]) setSessionId(sess.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/verifies", {
          method: "POST",
          body: JSON.stringify({
            sessionId,
            phase,
            prompt,
            response,
            confirmed,
          }),
        });
        setPrompt("");
        setResponse("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Select · confirm · ask · verify"
      subtitle="Discipline the conversational loop so selections are confirmed before answers."
    >
      <div className="mb-4 animate-confirm-pulse inline-flex rounded-lg border border-[var(--studio-sand)] bg-[var(--studio-sand-soft)] px-3 py-2 text-sm text-slate-700">
        Confirm pulse — selections must be verified before asking.
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New verify turn</p>
          <div>
            <Label>Session id</Label>
            <Input value={sessionId} onChange={(e) => setSessionId(e.target.value)} list="verify-sessions" />
            <datalist id="verify-sessions">
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <Label>Phase</Label>
            <Input value={phase} onChange={(e) => setPhase(e.target.value)} placeholder="select | confirm | ask | verify" />
          </div>
          <div>
            <Label>Prompt</Label>
            <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          <div>
            <Label>Response</Label>
            <Input value={response} onChange={(e) => setResponse(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Confirmed
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !prompt.trim() || !sessionId.trim()} onClick={create}>
            Record turn
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{item.phase}</Badge>
                {item.confirmed ? (
                  <Badge className="bg-[var(--studio-sand)] text-white">confirmed</Badge>
                ) : null}
              </div>
              <p className="mt-2 font-medium text-slate-900">{item.prompt}</p>
              <p className="text-sm text-slate-500">{item.response}</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
