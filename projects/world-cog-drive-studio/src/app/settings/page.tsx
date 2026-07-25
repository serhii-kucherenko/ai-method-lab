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
};

type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export default function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("peer@world-cog-drive.local");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const [o, m, a] = await Promise.all([
      api<{ org: Org }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: Audit[] }>("/api/audits"),
    ]);
    setOrg(o.org);
    setMembers(m.items);
    setAudits(a.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function save() {
    if (!org) return;
    setError("");
    try {
      await api("/api/settings", {
        method: "PATCH",
        body: JSON.stringify(org),
      });
      setNote("Settings saved.");
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
        body: JSON.stringify({ email, role: "evaluator" }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function exportJson() {
    const text = await api<string>("/api/export?format=json");
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "world-cog-drive-export.json";
    a.click();
  }

  async function exportCsv() {
    const text = await api<string>("/api/export?format=csv");
    const blob = new Blob([text], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "world-cog-drive-compares.csv";
    a.click();
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, bearer auth, members, webhook HMAC, audit, and export."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {note ? <p className="mb-4 text-sm text-[var(--wc-teal)]">{note}</p> : null}
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
            <Label htmlFor="rate">Rate limit / min</Label>
            <Input
              id="rate"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="hook">Webhook URL</Label>
            <Input
              id="hook"
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
          <div className="md:col-span-2">
            <Label htmlFor="token">Bearer token</Label>
            <Input
              id="token"
              value={org.bearerToken}
              onChange={(e) => setOrg({ ...org, bearerToken: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button onClick={save}>Save settings</Button>
            <Button variant="outline" onClick={exportJson}>
              Export JSON
            </Button>
            <Button variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
          </div>
        </div>
      ) : null}
      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Members
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={invite}>Invite evaluator</Button>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {members.map((m) => (
            <li key={m.id}>
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Audit trail
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {audits.slice(0, 12).map((a) => (
            <li key={a.id}>
              <span className="text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
                {a.at}
              </span>{" "}
              {a.actor} · {a.action} — {a.detail}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
