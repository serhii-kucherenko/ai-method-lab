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
  defaultGovernanceBias: string;
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
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [o, m, a] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audits"),
      ]);
      setOrg(o.org);
      setMembers(m.items);
      setAudits(a.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load settings");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    try {
      setOrg(
        (
          await api<{ org: Org }>("/api/settings", {
            method: "POST",
            body: JSON.stringify(org),
          })
        ).org,
      );
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not save settings");
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
      setError(x instanceof Error ? x.message : "Could not invite member");
    }
  };

  const download = async (format: "json" | "csv") => {
    const text = await api<string>(`/api/export?format=${format}`);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([text], {
        type: format === "json" ? "application/json" : "text/csv",
      }),
    );
    a.download = `surveil-gate.${format}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Organization controls, exports, webhooks, and audit history."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {org ? (
          <form
            onSubmit={save}
            className="space-y-3 rounded-lg border bg-white p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              Organization
            </h2>
            <Label htmlFor="org">Name</Label>
            <Input
              id="org"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
            <Label htmlFor="url">Webhook URL</Label>
            <Input
              id="url"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
            <Label htmlFor="secret">Webhook secret</Label>
            <Input
              id="secret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
            <Label htmlFor="bias">Default governance bias</Label>
            <Input
              id="bias"
              value={org.defaultGovernanceBias}
              onChange={(e) =>
                setOrg({ ...org, defaultGovernanceBias: e.target.value })
              }
            />
            <Button>Save org</Button>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => void download("json")}>
                Export JSON
              </Button>
              <Button type="button" variant="outline" onClick={() => void download("csv")}>
                Export CSV
              </Button>
            </div>
          </form>
        ) : null}
        <div className="space-y-6">
          <form
            onSubmit={invite}
            className="space-y-3 rounded-lg border bg-white p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              Members
            </h2>
            <Label htmlFor="email">Invite email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button>Invite evaluator</Button>
            <ul className="mt-3 space-y-1 text-sm">
              {members.map((m) => (
                <li key={m.id}>
                  {m.email} · {m.role}
                </li>
              ))}
            </ul>
          </form>
          <section className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              Audit trail
            </h2>
            <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
              {audits.map((a) => (
                <li key={a.id}>
                  {a.at} · {a.actor} · {a.action} — {a.detail}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </StudioShell>
  );
}

export default SettingsPage;
