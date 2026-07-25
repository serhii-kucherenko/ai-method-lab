"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import { GUIDE_PATH } from "@/claim";

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

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("peer@atlas-flow.local");
  const [error, setError] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  async function load() {
    const [o, m, a] = await Promise.all([
      api<{ org: Org }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: Audit[] }>("/api/audits?limit=20"),
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
      await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
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

  async function doExport(format: "json" | "csv") {
    setExportMsg("");
    try {
      const text = await api<string>(`/api/export?format=${format}`);
      setExportMsg(
        typeof text === "string"
          ? `Exported ${format} (${text.length} chars)`
          : `Exported ${format}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook secret, bearer auth, audit trail, and exports."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
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
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
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
            <Label htmlFor="token">Bearer token</Label>
            <Input
              id="token"
              value={org.bearerToken}
              onChange={(e) => setOrg({ ...org, bearerToken: e.target.value })}
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
          <div className="flex items-end gap-2">
            <Button onClick={save}>Save org</Button>
            <Button variant="outline" onClick={() => doExport("json")}>
              Export JSON
            </Button>
            <Button variant="outline" onClick={() => doExport("csv")}>
              Export CSV
            </Button>
          </div>
        </div>
      ) : null}
      {exportMsg ? <p className="mb-4 text-sm">{exportMsg}</p> : null}
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
        <ul className="mt-4 space-y-2 text-sm">
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
          {audits.map((a) => (
            <li key={a.id}>
              {a.at} · {a.actor} · {a.action} · {a.detail}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/honesty" className="text-[var(--af-teal)] underline">
            Honesty fence
          </Link>
          {" · "}
          <Link href={GUIDE_PATH} className="text-[var(--af-teal)] underline">
            Tutor guide
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default SettingsPage;
