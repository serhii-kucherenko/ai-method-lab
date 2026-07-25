"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Kernel = { id: string; label: string };
type Target = { id: string; label: string };
type Run = {
  id: string;
  targetId: string;
  kernelId: string;
  fingerprintCoverage: number;
  kernelConfidence: number;
  targetConfidence: number;
  multiKernelAgreement: number;
  reviewerNotes: string;
  status: string;
};

export default function RunsPage() {
  const [kernels, setKernels] = useState<Kernel[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [targetId, setTargetId] = useState("");
  const [kernelId, setKernelId] = useState("");
  const [fingerprintCoverage, setFingerprintCoverage] = useState("0.58");
  const [kernelConf, setKernelConf] = useState("0.7");
  const [targetConf, setTargetConf] = useState("0.74");
  const [agreement, setAgreement] = useState("0.68");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [a, s, r] = await Promise.all([
      api<{ items: Kernel[] }>("/api/kernels"),
      api<{ items: Target[] }>("/api/targets"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setKernels(a.items);
    setTargets(s.items);
    setItems(r.items);
    if (!kernelId && a.items[0]) setKernelId(a.items[0].id);
    if (!targetId && s.items[0]) setTargetId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          targetId,
          kernelId,
          fingerprintCoverage: Number(fingerprintCoverage),
          kernelConfidence: Number(kernelConf),
          targetConfidence: Number(targetConf),
          multiKernelAgreement: Number(agreement),
          reviewerNotes: notes,
        }),
      });
      setNotes("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="QSAR runs"
      subtitle="Record quantum multi-kernel soft-sim runs against a target and kernel config."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="target">Target case</Label>
          <select
            id="target"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {targets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="kernel">Kernel config</Label>
          <select
            id="kernel"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={kernelId}
            onChange={(e) => setKernelId(e.target.value)}
          >
            {kernels.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="fp">Fingerprint coverage</Label>
          <Input
            id="fp"
            value={fingerprintCoverage}
            onChange={(e) => setFingerprintCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="kernelConf">Kernel confidence</Label>
          <Input
            id="kernelConf"
            value={kernelConf}
            onChange={(e) => setKernelConf(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="targetConf">Target confidence</Label>
          <Input
            id="targetConf"
            value={targetConf}
            onChange={(e) => setTargetConf(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="agreement">Multi-kernel agreement</Label>
          <Input
            id="agreement"
            value={agreement}
            onChange={(e) => setAgreement(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Reviewer notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create QSAR run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No QSAR runs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{r.id}</div>
              <div className="mt-1 text-sm text-slate-500">
                coverage {r.fingerprintCoverage} · kernel {r.kernelConfidence} ·
                target {r.targetConfidence} · agreement {r.multiKernelAgreement}
              </div>
              {r.reviewerNotes ? (
                <p className="mt-1 text-sm text-slate-600">{r.reviewerNotes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
