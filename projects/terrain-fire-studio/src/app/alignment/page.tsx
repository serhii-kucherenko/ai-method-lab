"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Aerial = { id: string; captureDate: string; packId: string };
type Plan = {
  id: string;
  packId: string;
  aerialId: string;
  controlPointDensity: number;
  elevationPriorStrength: number;
  seamBudgetM: number;
  alignmentBias: string;
  status: string;
};

export default function AlignmentPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [aerials, setAerials] = useState<Aerial[]>([]);
  const [items, setItems] = useState<Plan[]>([]);
  const [packId, setPackId] = useState("");
  const [aerialId, setAerialId] = useState("");
  const [control, setControl] = useState("0.7");
  const [prior, setPrior] = useState("0.75");
  const [seam, setSeam] = useState("4.5");
  const [bias, setBias] = useState("elevation_first");
  const [error, setError] = useState("");

  async function load() {
    const packData = await api<{ items: Pack[] }>("/api/packs");
    setPacks(packData.items);
    const pid = packId || packData.items[0]?.id || "";
    if (!packId && pid) setPackId(pid);
    const aerialData = await api<{ items: Aerial[] }>(
      `/api/aerials?packId=${pid}`,
    );
    setAerials(aerialData.items);
    const aid = aerialId || aerialData.items[0]?.id || "";
    if (!aerialId && aid) setAerialId(aid);
    const planData = await api<{ items: Plan[] }>(
      `/api/alignment?packId=${pid}`,
    );
    setItems(planData.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/alignment", {
        method: "POST",
        body: JSON.stringify({
          packId,
          aerialId,
          controlPointDensity: Number(control),
          elevationPriorStrength: Number(prior),
          seamBudgetM: Number(seam),
          alignmentBias: bias,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Alignment plans"
      subtitle="Control density, elevation priors, and seam budgets before compare."
    >
      {packs.length === 0 || aerials.length === 0 ? (
        <p className="text-sm text-stone-500">
          Need a pack and an aerial first — open Packs and Aerials, or seed from
          onboarding.
        </p>
      ) : (
        <>
          <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
            <div>
              <Label htmlFor="pack">Pack</Label>
              <select
                id="pack"
                className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
                value={packId}
                onChange={(e) => setPackId(e.target.value)}
              >
                {packs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="aerial">Aerial</Label>
              <select
                id="aerial"
                className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
                value={aerialId}
                onChange={(e) => setAerialId(e.target.value)}
              >
                {aerials.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.captureDate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="bias">Alignment bias</Label>
              <select
                id="bias"
                className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
                value={bias}
                onChange={(e) => setBias(e.target.value)}
              >
                <option value="tight_control">Tight control</option>
                <option value="balanced">Balanced</option>
                <option value="elevation_first">Elevation first</option>
                <option value="photo_drape">Photo drape</option>
              </select>
            </div>
            <div>
              <Label htmlFor="control">Control density</Label>
              <Input
                id="control"
                value={control}
                onChange={(e) => setControl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="prior">Elevation prior</Label>
              <Input
                id="prior"
                value={prior}
                onChange={(e) => setPrior(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="seam">Seam budget (m)</Label>
              <Input
                id="seam"
                value={seam}
                onChange={(e) => setSeam(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={create}>Create plan</Button>
            </div>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          {items.length === 0 ? (
            <p className="text-sm text-stone-500">No alignment plans yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--studio-line)] text-stone-500">
                  <th className="py-2">Bias</th>
                  <th>Control</th>
                  <th>Prior</th>
                  <th>Seam budget</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--studio-line)]">
                    <td className="py-2 font-medium">{p.alignmentBias}</td>
                    <td>{p.controlPointDensity}</td>
                    <td>{p.elevationPriorStrength}</td>
                    <td>{p.seamBudgetM} m</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </StudioShell>
  );
}
