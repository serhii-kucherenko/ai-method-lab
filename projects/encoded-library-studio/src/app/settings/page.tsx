"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  defaultDeltBias: string;
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

  const load = async () => {
    try {
      const [o, m, a] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
      ]);
      setOrg(o.org);
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
    await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
    await load();
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    await api("/api/members", {
      method: "POST",
      body: JSON.stringify({ email, role: "evaluator" }),
    });
    setEmail("");
    await load();
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and webhook — platform must-haves for DELT soft-sim."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-8 space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input id="webhookUrl" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          <Label htmlFor="bias">Default DELT bias</Label>
          <Input id="bias" value={org.defaultDeltBias} onChange={(e) => setOrg({ ...org, defaultDeltBias: e.target.value })} />
          <Button>Save org</Button>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
        <div>
          <Label htmlFor="email">Invite member</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit">Invite</Button>
      </form>
      <ul className="mb-8 space-y-2">
        {members.map((m) => (
          <li key={m.id} className="text-sm">
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <div className="mb-8 flex flex-wrap gap-3">
        <a className="underline text-[var(--el-sea)]" href="/api/export?format=json">
          Export packs JSON
        </a>
        <a className="underline text-[var(--el-sea)]" href="/api/export?format=csv">
          Export compares CSV
        </a>
        <Link className="underline text-[var(--el-sea)]" href={GUIDE_PATH}>
          Tutor guide
        </Link>
      </div>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">Audit trail</h2>
      <ul className="space-y-2 text-sm">
        {audits.map((a) => (
          <li key={a.id}>
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default SettingsPage;
