"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  defaultCareBias: string;
  rateLimitPerMinute: number;
};
type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  const load = async () => {
    try {
      const [settings, memberList, auditList] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
      ]);
      setOrg(settings.org);
      setMembers(memberList.items);
      setAudits(auditList.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    try {
      const res = await api<{ org: Org }>("/api/settings", {
        method: "POST",
        body: JSON.stringify(org),
      });
      setOrg(res.org);
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not save");
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
      setError(x instanceof Error ? x.message : "Could not invite");
    }
  };

  const doExport = async (format: "json" | "csv") => {
    try {
      const text = await api<string>(`/api/export?format=${format}`);
      setExportMsg(`Exported ${format} (${text.length} chars)`);
    } catch (x) {
      setError(x instanceof Error ? x.message : "Export failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and webhook configuration for the care soft-sim bench."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-8 max-w-lg space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input id="webhook" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          <Label htmlFor="secret">Webhook secret</Label>
          <Input id="secret" value={org.webhookSecret} onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })} />
          <Label htmlFor="bias">Default care bias</Label>
          <Input id="bias" value={org.defaultCareBias} onChange={(e) => setOrg({ ...org, defaultCareBias: e.target.value })} />
          <Label htmlFor="rate">Rate limit / minute</Label>
          <Input
            id="rate"
            value={String(org.rateLimitPerMinute)}
            onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })}
          />
          <Button type="submit">Save org</Button>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-8 flex max-w-lg gap-2">
        <Input placeholder="member@org.local" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit">Invite</Button>
      </form>
      <ul className="mb-8 space-y-1 text-sm">
        {members.map((m) => (
          <li key={m.id}>{m.email} · {m.role}</li>
        ))}
      </ul>
      <div className="mb-8 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => void doExport("json")}>Export packs JSON</Button>
        <Button type="button" variant="outline" onClick={() => void doExport("csv")}>Export compares CSV</Button>
        {exportMsg ? <span className="text-sm text-[var(--aw-sage)]">{exportMsg}</span> : null}
      </div>
      <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl">Audit</h2>
      <ul className="space-y-2 text-sm">
        {audits.map((a) => (
          <li key={a.id} className="rounded border bg-white px-3 py-2">
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Guide: docs/guides/136-ageing-wisely-studio-lessons.md · Offline demo: try.html
      </p>
    </StudioShell>
  );
}

export default SettingsPage;
