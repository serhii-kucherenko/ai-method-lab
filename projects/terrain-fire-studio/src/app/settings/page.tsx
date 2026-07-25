"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, API_TOKEN } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  rateLimitPerMinute: number;
};
type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export default function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("planner@agency.local");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const o = await api<{ org: Org }>("/api/settings");
    setOrg(o.org);
    const m = await api<{ items: Member[] }>("/api/members");
    setMembers(m.items);
    const a = await api<{ items: Audit[] }>("/api/audits?limit=20");
    setAudits(a.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function saveOrg() {
    if (!org) return;
    setError("");
    try {
      const res = await api<{ org: Org }>("/api/settings", {
        method: "POST",
        body: JSON.stringify(org),
      });
      setOrg(res.org);
      setMsg("Org saved.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function invite() {
    setError("");
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "planner" }),
      });
      setMsg(`Invited ${email}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function download(format: string, filename: string) {
    const res = await fetch(`/api/export?format=${format}`, {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const text = await res.text();
    const blob = new Blob([text], {
      type: format.includes("csv") ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook, audit trail, and exports."
    >
      {org ? (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Org name</Label>
            <Input
              id="name"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="wh">Webhook URL</Label>
            <Input
              id="wh"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="secret">Webhook secret</Label>
            <Input
              id="secret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="rl">Rate limit / min</Label>
            <Input
              id="rl"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 60,
                })
              }
            />
          </div>
          <div className="flex items-end">
            <Button onClick={saveOrg}>Save org</Button>
          </div>
        </div>
      ) : null}

      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Invite member
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={invite}>Invite planner</Button>
        </div>
        <ul className="mt-4 space-y-1 text-sm">
          {members.map((m) => (
            <li key={m.id}>
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => download("packs-json", "packs.json")}
        >
          Export packs JSON
        </Button>
        <Button
          variant="outline"
          onClick={() => download("compares-csv", "compares.csv")}
        >
          Export compares CSV
        </Button>
        <Button asChild variant="outline">
          <Link href={GUIDE_PATH}>Tutor guide</Link>
        </Button>
      </div>

      <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl">
        Audit trail
      </h2>
      <table className="mb-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--studio-line)] text-stone-500">
            <th className="py-2">When</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((a) => (
            <tr key={a.id} className="border-b border-[var(--studio-line)]">
              <td className="py-2">{a.at.slice(0, 19)}</td>
              <td>{a.actor}</td>
              <td>{a.action}</td>
              <td className="max-w-xs truncate">{a.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {msg ? <p className="text-sm text-[var(--studio-ridge)]">{msg}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
