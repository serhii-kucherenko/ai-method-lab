"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  defaultLabelBias: string;
  rateLimitPerMinute: number;
};

type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [exportNote, setExportNote] = useState("");

  const load = async () => {
    try {
      const o = await api<{ org: Org }>("/api/settings");
      setOrg(o.org);
      setName(o.org.name);
      setMembers((await api<{ items: Member[] }>("/api/members")).items);
      setAudits((await api<{ items: Audit[] }>("/api/audit")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load settings");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api<{ org: Org }>("/api/settings", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setOrg(res.org);
    } catch (x) {
      setError(x instanceof Error ? x.message : "Save failed");
    }
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "viewer" }),
      });
      setEmail("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Invite failed");
    }
  };

  const doExport = async (format: "json" | "csv") => {
    try {
      const text = await api<string>(`/api/export?format=${format}`);
      setExportNote(`Exported ${format} (${text.length} chars)`);
    } catch (x) {
      setError(x instanceof Error ? x.message : "Export failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org defaults, members, audit trail, export, and webhook secrets — platform must-haves."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={saveOrg} className="space-y-3 rounded-lg border bg-white p-4">
          <h2 className="font-semibold">Org</h2>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          {org ? (
            <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Bias {org.defaultLabelBias} · rate {org.rateLimitPerMinute}/min · webhook secret set
            </p>
          ) : null}
          <Button>Save org</Button>
        </form>
        <form onSubmit={invite} className="space-y-3 rounded-lg border bg-white p-4">
          <h2 className="font-semibold">Invite member</h2>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button>Invite viewer</Button>
          <ul className="mt-3 space-y-1 text-sm">
            {members.map((m) => (
              <li key={m.id}>
                {m.email} · {m.role}
              </li>
            ))}
          </ul>
        </form>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => void doExport("json")}>
          Export packs JSON
        </Button>
        <Button type="button" variant="outline" onClick={() => void doExport("csv")}>
          Export compares CSV
        </Button>
        <Link href="/honesty">
          <Button type="button" variant="secondary">
            Honesty fence
          </Button>
        </Link>
        <Link href="/docs/guides/131-fluoride-label-studio-lessons.md">
          <Button type="button" variant="ghost">
            Guide
          </Button>
        </Link>
      </div>
      {exportNote ? <p className="mt-3 text-sm">{exportNote}</p> : null}
      <section className="mt-10">
        <h2 className="mb-3 font-semibold">Audit trail</h2>
        <ul className="space-y-2 text-sm">
          {audits.map((a) => (
            <li key={a.id} className="rounded border bg-white px-3 py-2">
              <span className="text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                {a.at}
              </span>{" "}
              · {a.actor} · {a.action} — {a.detail}
            </li>
          ))}
        </ul>
      </section>
    </StudioShell>
  );
}

export default SettingsPage;
