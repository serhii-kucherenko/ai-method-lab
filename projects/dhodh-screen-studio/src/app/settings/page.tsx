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
  rateLimitPerMinute: number;
  defaultScoringBias: string;
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
  const [exportNote, setExportNote] = useState("");

  const load = async () => {
    try {
      const s = await api<{
        org: Org;
        members: Member[];
        audits: Audit[];
      }>("/api/settings");
      setOrg(s.org);
      setMembers(s.members);
      setAudits(s.audits);
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
      await api("/api/settings", {
        method: "POST",
        body: JSON.stringify({ action: "update_org", ...org }),
      });
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
        body: JSON.stringify({ email, role: "evaluator" }),
      });
      setEmail("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not invite");
    }
  };

  const doExport = async (fmt: "json" | "csv") => {
    try {
      const data = await api<string>(`/api/export?format=${fmt}`);
      setExportNote(`Exported ${fmt} (${data.length} chars)`);
    } catch (x) {
      setError(x instanceof Error ? x.message : "Export failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and webhook soft-sim controls."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {exportNote ? <p className="mb-4 text-sm text-[var(--ds-teal)]">{exportNote}</p> : null}
      <div className="grid gap-8 lg:grid-cols-2">
        {org ? (
          <form onSubmit={save} className="space-y-3 rounded-lg border bg-white p-4">
            <h2 className="font-semibold">Organization</h2>
            <Label htmlFor="name">Name</Label>
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
            <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Default mode: {org.defaultMode} · bias: {org.defaultScoringBias}
            </p>
            <Button type="submit">Save org</Button>
          </form>
        ) : null}
        <div className="space-y-6">
          <form onSubmit={invite} className="space-y-3 rounded-lg border bg-white p-4">
            <h2 className="font-semibold">Invite member</h2>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Invite evaluator</Button>
            <ul className="mt-3 space-y-1 text-sm">
              {members.map((m) => (
                <li key={m.id}>
                  {m.email} · {m.role}
                </li>
              ))}
            </ul>
          </form>
          <div className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold">Export</h2>
            <div className="mt-3 flex gap-2">
              <Button type="button" variant="outline" onClick={() => void doExport("json")}>
                Export JSON
              </Button>
              <Button type="button" variant="outline" onClick={() => void doExport("csv")}>
                Export CSV
              </Button>
            </div>
            <p className="mt-2 text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Guide: docs/guides/153-dhodh-screen-studio-lessons.md
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-lg border bg-white p-4">
        <h2 className="font-semibold">Audit trail</h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
          {audits.map((a) => (
            <li key={a.id}>
              {a.at} · {a.actor} · {a.action} — {a.detail}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default SettingsPage;
