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
  bearerToken: string;
  rateLimitPerMinute: number;
  defaultImplementationBias: string;
  defaultMode: string;
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
      const [o, m, a] = await Promise.all([
        api<Org>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
      ]);
      setOrg(o);
      setMembers(m.items);
      setAudits(a.items);
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
      setOrg(await api<Org>("/api/settings", { method: "POST", body: JSON.stringify(org) }));
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not save");
    }
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "evaluator" }),
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
      setExportMsg(`${format.toUpperCase()} export ready (${text.length} chars)`);
    } catch (x) {
      setError(x instanceof Error ? x.message : "Export failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, webhook, bearer auth, and rate limits — platform must-haves."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {exportMsg ? <p className="mb-4 text-sm text-[var(--pi-teal)]">{exportMsg}</p> : null}
      <div className="grid gap-8 lg:grid-cols-2">
        {org ? (
          <form onSubmit={save} className="space-y-3 rounded-lg border bg-white p-4">
            <Label htmlFor="name">Org name</Label>
            <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input id="webhook" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
            <Label htmlFor="rl">Rate limit / min</Label>
            <Input
              id="rl"
              type="number"
              value={org.rateLimitPerMinute}
              onChange={(e) =>
                setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
              }
            />
            <Button type="submit">Save settings</Button>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => void doExport("json")}>
                Export JSON
              </Button>
              <Button type="button" variant="outline" onClick={() => void doExport("csv")}>
                Export CSV
              </Button>
            </div>
          </form>
        ) : null}
        <div className="space-y-6">
          <form onSubmit={invite} className="space-y-3 rounded-lg border bg-white p-4">
            <Label htmlFor="email">Invite member</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit">Invite evaluator</Button>
            <ul className="mt-3 space-y-1 text-sm">
              {members.map((m) => (
                <li key={m.id}>{m.email} · {m.role}</li>
              ))}
            </ul>
          </form>
          <div className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold">Audit</h2>
            <ul className="mt-2 max-h-64 space-y-1 overflow-auto text-sm">
              {audits.map((a) => (
                <li key={a.id}>
                  {a.at.slice(0, 19)} · {a.actor} · {a.action} — {a.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </StudioShell>
  );
}

export default SettingsPage;
