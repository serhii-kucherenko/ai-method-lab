import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function w(rel, s) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, s);
}

w(
  "src/app/settings/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { AuditEntry, Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  async function load() {
    const [o, m, a] = await Promise.all([
      api<OrgSettings>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: AuditEntry[] }>("/api/audits"),
    ]);
    setOrg(o);
    setMembers(m.items);
    setAudits(a.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setError("");
    try {
      const next = await api<OrgSettings>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(next);
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onInvite(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "reader" }),
      });
      setEmail("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onExport(kind: string) {
    setExportMsg("");
    try {
      const text = await api<string>(\`/api/export?kind=\${kind}\`);
      setExportMsg(\`Exported \${kind} (\${String(text).length} chars)\`);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook, exports, and audit trail."
    >
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {org ? (
        <form
          onSubmit={onSave}
          className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
        >
          <Input
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
            placeholder="Org name"
          />
          <Input
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            placeholder="Webhook URL"
          />
          <Input
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) =>
              setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
            }
            placeholder="Rate limit / min"
          />
          <Button type="submit">Save org</Button>
        </form>
      ) : null}

      <form onSubmit={onInvite} className="mb-8 flex flex-wrap gap-2">
        <Input
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="secondary">
          Invite member
        </Button>
      </form>

      <ul className="mb-8 space-y-2 text-sm">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <div className="mb-8 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => onExport("packs")}>
          Export packs JSON
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onExport("retrieves")}
        >
          Export retrieves CSV
        </Button>
      </div>
      {exportMsg ? <p className="mb-4 text-sm text-slate-600">{exportMsg}</p> : null}

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Audit trail
      </h2>
      <ul className="space-y-2 text-sm text-slate-600">
        {audits.slice(0, 12).map((a) => (
          <li key={a.id}>
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/honesty/page.tsx",
  `import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim embeddings for a method-lab product — not MatBind, not wet-lab spectra."
    >
      <div className="space-y-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <p className="text-slate-700">
          <strong>{DISPLAY_NAME}</strong> ({TAGLINE}) is inspired by the MatBind
          pattern of a shared embedding space across structure, diffraction-like
          patterns, density of states, and language. This studio does{" "}
          <em>not</em> ship MatBind weights, measured XRD/DOS instruments, or
          production materials databases.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>Scores are soft-simulation plan / retrieve quality only.</li>
          <li>Dual score A = multimodal bind; B = single-modality baseline.</li>
          <li>Authors published no public code with the digest used here.</li>
        </ul>
        <p className="text-sm text-slate-500">
          Sources:{" "}
          <a className="underline" href={PAPER_URL}>
            {PAPER_URL}
          </a>
          {" · "}
          authors&apos; code:{" "}
          {AUTHORS_CODE_URL ? (
            <a className="underline" href={AUTHORS_CODE_URL}>
              {AUTHORS_CODE_URL}
            </a>
          ) : (
            "none published"
          )}
        </p>
        <Link
          href="/packs"
          className="inline-block text-[var(--studio-teal-deep)] underline-offset-2 hover:underline"
        >
          Back to crystal packs
        </Link>
      </div>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/page.tsx",
  `import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div
          aria-hidden
          className="lattice-pulse absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,100,102,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(17,100,102,0.14) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-jade)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-emerald-50 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-emerald-100/85 md:text-lg">
            Find the same crystal when structure, diffraction, DOS, and language
            disagree — before you trust a single-modality neighbor list.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--studio-jade)] px-5 py-2.5 text-sm font-medium text-[var(--studio-ink-deep)] transition hover:brightness-110"
            >
              Open studio
            </Link>
            <Link
              href="/honesty"
              className="rounded-md border border-emerald-400/40 px-5 py-2.5 text-sm text-emerald-50 transition hover:border-emerald-200"
            >
              Honesty fence
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Materials teams juggle CIF-like structure notes, powder fingerprints,
          electronic DOS summaries, and written specs. Neighbors from one
          modality often contradict another — and there is no shared desk to
          audit the disagreement.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            The product
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">{CLAIM}</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              [
                "Crystal pack registry",
                "Name formula and space-group hints before lanes attach.",
              ],
              [
                "Four descriptor lanes",
                "Structure, diffraction, DOS, and language stay first-class.",
              ],
              [
                "Shared bind-space explorer",
                "Project lanes into a soft-sim bind space you can score.",
              ],
              [
                "Multimodal vs single retrieve",
                "Falsify whether bind beats a single-modality baseline.",
              ],
              [
                "Honesty fence",
                "Labeled soft-sim — not MatBind rebrand, not wet-lab spectra.",
              ],
            ].map(([title, body]) => (
              <li key={title} className="plan-rise">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Features
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Packs, lanes, bind projections, dual scoring, retrieve compare, org
          settings, members, webhook, exports, goldens sample, and audit trail —
          twenty-plus capabilities behind the studio chrome.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            How it works
          </h2>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-600">
            <li>Register a crystal pack.</li>
            <li>Attach structure, diffraction, DOS, and language lanes.</li>
            <li>Project a bind space and score multimodal vs single.</li>
            <li>Run retrieve compare and export the audit trail.</li>
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Honesty / limits
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Method-lab soft-sim embeddings only. Not MatBind. Not measured wet-lab
          spectra. See the{" "}
          <Link href="/honesty" className="text-[var(--studio-teal-deep)] underline">
            honesty fence
          </Link>
          .
        </p>
      </section>

      <section className="border-t border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Sources
          </h2>
          <p className="mt-3 text-slate-600">
            Paper:{" "}
            <a className="underline" href={PAPER_URL}>
              {PAPER_URL}
            </a>
            <br />
            Authors&apos; code: none published
          </p>
          <Link
            href="/packs"
            className="mt-8 inline-block rounded-md bg-[var(--studio-teal)] px-5 py-2.5 text-sm font-medium text-white"
          >
            Open studio
          </Link>
        </div>
      </section>
    </div>
  );
}
`,
);

// Copy app-up test from edge-quant
copyFileSync(
  join(root, "../edge-quant-studio/test/app-up.test.ts"),
  join(root, "test/app-up.test.ts"),
);

console.log("settings honesty landing ok");
