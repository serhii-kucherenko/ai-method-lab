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
  modelId: string;
  imageId: string;
  stigmaClarity: number;
  adulterantContrast: number;
  cnnConfidence: number;
  textureIntegrity: number;
  status: string;
};

export function RunsPage() {
  const [models, setModels] = useState<Ref[]>([]);
  const [images, setImages] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [modelId, setModelId] = useState("");
  const [imageId, setImageId] = useState("");
  const [stigmaClarity, setStigmaClarity] = useState("0.65");
  const [adulterantContrast, setAdulterantContrast] = useState("0.7");
  const [cnnConfidence, setCnnConfidence] = useState("0.72");
  const [textureIntegrity, setTextureIntegrity] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [m, imgs, runs] = await Promise.all([
      api<{ items: Ref[] }>("/api/models"),
      api<{ items: Ref[] }>("/api/images"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setModels(m.items);
    setImages(imgs.items);
    setItems(runs.items);
    if (!modelId && m.items[0]) setModelId(m.items[0].id);
    if (!imageId && imgs.items[0]) setImageId(imgs.items[0].id);
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
          modelId,
          imageId,
          stigmaClarity: Number(stigmaClarity),
          adulterantContrast: Number(adulterantContrast),
          cnnConfidence: Number(cnnConfidence),
          textureIntegrity: Number(textureIntegrity),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Detect soft-sim runs capturing stigma and CNN proxies."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="model">Model</Label>
          <select
            id="model"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label ?? m.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="image">Image</Label>
          <select
            id="image"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={imageId}
            onChange={(e) => setImageId(e.target.value)}
          >
            {images.map((img) => (
              <option key={img.id} value={img.id}>
                {img.label ?? img.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="clarity">Stigma clarity</Label>
          <Input
            id="clarity"
            value={stigmaClarity}
            onChange={(e) => setStigmaClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contrast">Adulterant contrast</Label>
          <Input
            id="contrast"
            value={adulterantContrast}
            onChange={(e) => setAdulterantContrast(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cnn">CNN confidence</Label>
          <Input
            id="cnn"
            value={cnnConfidence}
            onChange={(e) => setCnnConfidence(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="texture">Texture integrity</Label>
          <Input
            id="texture"
            value={textureIntegrity}
            onChange={(e) => setTextureIntegrity(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Capture detect run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.id.slice(0, 8)}…</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              clarity {r.stigmaClarity} · contrast {r.adulterantContrast} · cnn{" "}
              {r.cnnConfidence} · texture {r.textureIntegrity} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
