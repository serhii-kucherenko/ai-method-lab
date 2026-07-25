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
  bearerToken: string;
  defaultPriorBias: string;
  rateLimitPerMinute: number;
};
type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("evaluator@omic-prior.local");
  const [error, setError] = useState("");
  const [exportMsg, setExportMsg] = useState("");

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
      const res = await api<{ org: Org }>("/api/settings", {
        method: "POST",
        body: JSON.stringify(org),
      });
      setOrg(res.org);
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
      setExportMsg(`Exported ${format}: ${text.length} bytes`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook HMAC, audit, and export — platform must-haves."
    >
      {org ? (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Org name</Label>
            <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="bias">Default prior bias</Label>
            <select
              id="bias"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
              value={org.defaultPriorBias}
              onChange={(e) => setOrg({ ...org, defaultPriorBias: e.target.value })}
            >
              {["balanced", "priors_first", "trait_first", "baseline_first"].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="wh">Webhook URL</Label>
            <Input id="wh" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="secret">Webhook secret</Label>
            <Input id="secret" value={org.webhookSecret} onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="token">Bearer token</Label>
            <Input id="token" value={org.bearerToken} onChange={(e) => setOrg({ ...org, bearerToken: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="rl">Rate limit / min</Label>
            <Input
              id="rl"
              type="number"
              value={org.rateLimitPerMinute}
              onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })}
            />
          </div>
          <div><Button onClick={() => save()}>Save org</Button></div>
        </div>
      ) : null}

      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Members</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input className="max-w-xs" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={() => invite()}>Invite evaluator</Button>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {members.map((m) => (
            <li key={m.id}>{m.email} · {m.role}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => doExport("json")}>Export packs JSON</Button>
        <Button variant="outline" onClick={() => doExport("csv")}>Export compares CSV</Button>
        {exportMsg ? <p className="text-sm">{exportMsg}</p> : null}
      </div>

      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Audit trail</h2>
        <ul className="mt-3 max-h-64 space-y-1 overflow-auto text-sm">
          {audits.map((a) => (
            <li key={a.id}>{a.at} · {a.actor} · {a.action} · {a.detail}</li>
          ))}
        </ul>
      </div>

      <p className="text-sm">
        Guide:{" "}
        <Link href={GUIDE_PATH} className="underline text-[var(--op-teal)]">{GUIDE_PATH}</Link>
      </p>
      {error ? <p className="mt-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
    </StudioShell>
  );
}

export default SettingsPage;
