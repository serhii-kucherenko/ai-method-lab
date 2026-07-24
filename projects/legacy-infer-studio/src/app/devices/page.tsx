"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DeviceArch, LegacyDevice } from "@/store";

const ARCHES: DeviceArch[] = ["fermi", "kepler", "maxwell", "pascal_edge"];

export default function DevicesPage() {
  const [items, setItems] = useState<LegacyDevice[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [arch, setArch] = useState<DeviceArch>("fermi");
  const [vramGb, setVramGb] = useState("6");
  const [cc, setCc] = useState("sm_20");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: LegacyDevice[] }>(
      `/api/devices?q=${encodeURIComponent(search)}`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/devices", {
        method: "POST",
        body: JSON.stringify({
          name,
          arch,
          vramGb: Number(vramGb),
          computeCapability: cc,
          notes: "Registered from devices page",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Legacy devices"
      subtitle="Register the GPUs you actually deploy — usable VRAM first."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: confirm usable VRAM, compute capability, and that this
            studio is a plan validator — not a live CUDA driver.
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-5"
      >
        <Input
          placeholder="Device name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={arch}
          onChange={(e) => setArch(e.target.value as DeviceArch)}
        >
          {ARCHES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          placeholder="VRAM GB"
          value={vramGb}
          onChange={(e) => setVramGb(e.target.value)}
          required
        />
        <Input
          placeholder="Compute capability"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
          required
        />
        <Button type="submit">Add device</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search devices"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((d) => (
          <li
            key={d.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-[family-name:var(--font-display)] text-lg">
                {d.name}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {d.arch} · {d.computeCapability}
              </p>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {d.usableVramGb} GB usable of {d.vramGb} GB · {d.notes}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded bg-[var(--studio-signal)] animate-vram-fill"
                style={{
                  ["--vram-w" as string]: `${Math.min(100, (d.usableVramGb / d.vramGb) * 100)}%`,
                  width: `${Math.min(100, (d.usableVramGb / d.vramGb) * 100)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
