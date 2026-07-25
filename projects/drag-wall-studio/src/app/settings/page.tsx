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
type Audit = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export default function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
    load().catch((e) =>
      setError(
        e instanceof Error
          ? `Auth fail or load error: ${e.message}`
          : String(e),
      ),
    );
  }, []);

  async function save() {
    if (!org) return;
    setError("");
    try {
      const next = await api<{ org: Org }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          webhookUrl: org.webhookUrl,
          webhookSecret: org.webhookSecret,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(next.org);
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
      setEmail("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function download(format: string) {
    setError("");
    try {
      const text = await api<string>(`/api/export?format=${format}`);
      const blob = new Blob([text], {
        type: format.includes("csv") ? "text/csv" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        format === "compares-csv"
          ? "drag-wall-compares.csv"
          : "channel-packs.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Workspace, members, webhook HMAC, audit trail, and channel-pack exports."
    >
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {org ? (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
          <div>
            <Label>Org name</Label>
            <p className="mt-1 text-sm text-slate-700">{org.name}</p>
          </div>
          <div>
            <Label>Bearer token</Label>
            <p className="mt-1 font-mono text-sm text-slate-700">
              {org.bearerToken}
            </p>
          </div>
          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="webhookSecret">Webhook secret</Label>
            <Input
              id="webhookSecret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="rate">Rate limit / minute</Label>
            <Input
              id="rate"
              type="number"
              value={org.rateLimitPerMinute}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <Button onClick={() => save()}>Save settings</Button>
            <Button variant="outline" onClick={() => download("packs-json")}>
              Export channel packs
            </Button>
            <Button variant="outline" onClick={() => download("compares-csv")}>
              Export drag compares
            </Button>
          </div>
        </div>
      ) : null}

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Members
      </h2>
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="email@org.local"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => invite()}>Invite member</Button>
      </div>
      <ul className="mb-10 space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-2 text-sm"
          >
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Audit trail
      </h2>
      <ul className="space-y-2">
        {audits.map((a) => (
          <li
            key={a.id}
            className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-2 text-sm text-slate-600"
          >
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
