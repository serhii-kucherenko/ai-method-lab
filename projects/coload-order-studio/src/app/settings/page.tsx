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
  defaultLoadBias: string;
  rateLimitPerMinute: number;
};
type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = async () => {
    const s = await api<{
      org: Org;
      members: Member[];
      audits: Audit[];
    }>("/api/settings");
    setOrg(s.org);
    setMembers(s.members);
    setAudits(s.audits);
  };

  useEffect(() => {
    void refresh().catch((e) => setMsg(e instanceof Error ? e.message : "Error"));
  }, []);

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, audit, export, webhooks.">
        <p>{msg || "Loading…"}</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell title="Settings" subtitle="Org, members, audit, export, webhooks.">
      {msg ? <p className="mb-4 text-sm text-[var(--co-slate)]">{msg}</p> : null}
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className="space-y-3 rounded-lg border bg-white p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await api("/api/settings", {
              method: "POST",
              body: JSON.stringify({ action: "updateOrg", org }),
            });
            setMsg("Org saved");
            await refresh();
          }}
        >
          <Label htmlFor="orgName">Org name</Label>
          <Input
            id="orgName"
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
          />
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input
            id="webhook"
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
          />
          <Label htmlFor="bias">Default load bias</Label>
          <Input
            id="bias"
            value={org.defaultLoadBias}
            onChange={(e) => setOrg({ ...org, defaultLoadBias: e.target.value })}
          />
          <Button type="submit">Save org</Button>
        </form>
        <div className="space-y-4">
          <form
            className="space-y-3 rounded-lg border bg-white p-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await api("/api/members", {
                method: "POST",
                body: JSON.stringify({ email, role: "evaluator" }),
              });
              setEmail("");
              await refresh();
            }}
          >
            <Label htmlFor="email">Invite member</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Invite</Button>
          </form>
          <ul className="rounded-lg border bg-white p-4 text-sm">
            {members.map((m) => (
              <li key={m.id}>
                {m.email} · {m.role}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const text = await api<string>("/api/export?format=json");
                const blob = new Blob([text], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "coload-packs.json";
                a.click();
              }}
            >
              Export JSON
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const text = await api<string>("/api/export?format=csv");
                const blob = new Blob([text], { type: "text/csv" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "coload-compares.csv";
                a.click();
              }}
            >
              Export CSV
            </Button>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <h3 className="font-medium">Audit trail</h3>
            <ul className="mt-2 max-h-48 space-y-1 overflow-auto text-xs">
              {audits.map((a) => (
                <li key={a.id}>
                  {a.at} · {a.actor} · {a.action} · {a.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </StudioShell>
  );
}

export default SettingsPage;
