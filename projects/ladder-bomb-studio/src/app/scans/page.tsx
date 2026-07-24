"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type {
  LadderProgram,
  ScanProfile,
  ScoreMode,
  VerifyScan,
} from "@/store";

export default function ScansPage() {
  const [programs, setPrograms] = useState<LadderProgram[]>([]);
  const [items, setItems] = useState<VerifyScan[]>([]);
  const [programId, setProgramId] = useState("");
  const [name, setName] = useState("FB-aware formal pass");
  const [mode, setMode] = useState<ScoreMode>("fb-aware");
  const [profile, setProfile] = useState<ScanProfile>("balanced");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: VerifyScan[] }>(
        "/api/scans?page=1&pageSize=20",
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const prog = await api<{ items: LadderProgram[] }>(
        "/api/programs?page=1&pageSize=50",
      );
      setPrograms(prog.items);
      if (prog.items[0]) setProgramId(prog.items[0].id);
      const scans = await api<{ items: VerifyScan[] }>(
        "/api/scans?page=1&pageSize=20",
      );
      setItems(scans.items);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<VerifyScan>("/api/scans", {
          method: "POST",
          body: JSON.stringify({ programId, name, mode, profile }),
        });
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Scans"
      subtitle="Formal verification runs — FB-aware keeps function-block bodies; dropped-FB strips them."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="animate-scan-pulse space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Start scan</p>
          <div>
            <Label htmlFor="s-prog">Program</Label>
            <select
              id="s-prog"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="s-name">Name</Label>
            <Input
              id="s-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="s-mode">Mode</Label>
              <select
                id="s-mode"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={mode}
                onChange={(e) => setMode(e.target.value as ScoreMode)}
              >
                <option value="fb-aware">fb-aware</option>
                <option value="dropped-fb">dropped-fb</option>
              </select>
            </div>
            <div>
              <Label htmlFor="s-profile">Profile</Label>
              <select
                id="s-profile"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={profile}
                onChange={(e) => setProfile(e.target.value as ScanProfile)}
              >
                <option value="balanced">balanced</option>
                <option value="strict">strict</option>
              </select>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !programId || !name.trim()}
            onClick={create}
          >
            Run scan
          </Button>
        </div>

        <ul className="space-y-2">
          {items.map((s) => (
            <li
              key={s.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{s.name}</p>
                <Badge>{s.mode}</Badge>
                <Badge variant="secondary">{s.status}</Badge>
                <Badge variant="outline">{s.profile}</Badge>
              </div>
              {s.quality ? (
                <p className="mt-2 text-sm text-slate-500">
                  Catch {s.quality.bombCatchRate} · Trigger{" "}
                  {s.quality.triggerRecovery} · FB fidelity{" "}
                  {s.quality.fbFidelity} · Overall {s.quality.overall}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
