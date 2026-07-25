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
  rateLimitPerMinute: number;
  defaultLineageBias: string;
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
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit?limit=20"),
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
    try {
      await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Save failed");
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
      setError(x instanceof Error ? x.message : "Invite failed");
    }
  };

  const doExport = async (format: "json" | "csv") => {
    try {
      const text = await api<string>(`/api/export?format=${format}`);
      setExportMsg(
        `Exported ${format.toUpperCase()} (${String(text).length} chars)`,
      );
    } catch (x) {
      setError(x instanceof Error ? x.message : "Export failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, webhook secret, and export for organoid soft-sim packs."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-8 space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input
            id="name"
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
          />
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input
            id="webhook"
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
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
          <Button>Save settings</Button>
        </form>
      ) : null}
      <form
        onSubmit={invite}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4"
      >
        <div>
          <Label htmlFor="email">Invite member</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button>Invite</Button>
      </form>
      <ul className="mb-8 space-y-2">
        {members.map((m) => (
          <li key={m.id} className="text-sm">
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <div className="mb-8 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => void doExport("json")}>
          Export packs JSON
        </Button>
        <Button type="button" variant="outline" onClick={() => void doExport("csv")}>
          Export compares CSV
        </Button>
        {exportMsg ? <p className="text-sm">{exportMsg}</p> : null}
      </div>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Audit trail
      </h2>
      <ul className="space-y-2 text-sm">
        {audits.map((a) => (
          <li key={a.id} className="rounded border bg-white p-3">
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default SettingsPage;
