"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = {
  id: string;
  label: string;
  version: string;
  captureFocus: string;
  status: string;
};

export function CapturesPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [captureFocus, setFocus] = useState("");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Pack[] }>(
            `/api/captures?q=${encodeURIComponent(query)}`,
          )
        ).items,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load packs");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/captures", {
        method: "POST",
        body: JSON.stringify({ label, version, captureFocus }),
      });
      setLabel("");
      setFocus("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create pack");
    }
  };

  const archive = async (id: string) => {
    await api("/api/captures", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Capture packs"
      subtitle="Version the capture context before comparing fusion methods."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
          />
          <Label htmlFor="focus">Capture focus</Label>
          <Input
            id="focus"
            value={captureFocus}
            onChange={(e) => setFocus(e.target.value)}
            required
          />
          <Button>Create pack</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search capture packs"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search packs"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((pack) => (
              <article
                key={pack.id}
                className="row-lift flex justify-between rounded-lg border bg-white p-4"
              >
                <div>
                  <h2 className="font-semibold">{pack.label}</h2>
                  <p className="text-sm text-slate-600">
                    v{pack.version} · {pack.captureFocus} · {pack.status}
                  </p>
                </div>
                {pack.status !== "archived" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void archive(pack.id)}
                  >
                    Archive
                  </Button>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default CapturesPage;
