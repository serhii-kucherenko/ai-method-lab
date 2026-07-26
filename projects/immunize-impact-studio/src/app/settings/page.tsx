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
  defaultImpactBias: string;
  defaultMode: string;
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
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      setOrg(await api<Org>("/api/settings"));
      setMembers((await api<{ items: Member[] }>("/api/members")).items);
      setAudits((await api<{ items: Audit[] }>("/api/audit")).items);
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
      setMsg("Settings saved");
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

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook, audit trail, and export — platform must-haves for immunization-program analytics."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {msg ? <p className="mb-4 text-sm text-[var(--ii-teal)]">{msg}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-10 max-w-lg space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input
            id="webhookUrl"
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
          />
          <Label htmlFor="bias">Default impact bias</Label>
          <Input
            id="bias"
            value={org.defaultImpactBias}
            onChange={(e) => setOrg({ ...org, defaultImpactBias: e.target.value })}
          />
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
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="outline" type="button">
              <a href={`/api/export?format=json`}>Export packs JSON</a>
            </Button>
            <Button asChild variant="outline" type="button">
              <a href={`/api/export?format=csv`}>Export compares CSV</a>
            </Button>
          </div>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-8 flex max-w-lg gap-2">
        <Input
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Invite</Button>
      </form>
      <h2 className="mb-2 font-semibold">Members</h2>
      <ul className="mb-8 space-y-1 text-sm">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <h2 className="mb-2 font-semibold">Audit</h2>
      <ul className="space-y-1 text-sm">
        {audits.slice(0, 12).map((a) => (
          <li key={a.id}>
            {a.at} · {a.actor} · {a.action} · {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default SettingsPage;
