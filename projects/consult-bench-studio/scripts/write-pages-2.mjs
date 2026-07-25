/**
 * Remaining pages for Consult Bench Studio.
 * Run: node scripts/write-pages-2.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

write(
  "src/app/scores/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  ConsultCase,
  ConsultQuality,
  MultimodalTurn,
  ResponseScoreRecord,
} from "@/store";

export default function ScoresPage() {
  const [items, setItems] = useState<ResponseScoreRecord[]>([]);
  const [cases, setCases] = useState<ConsultCase[]>([]);
  const [turns, setTurns] = useState<MultimodalTurn[]>([]);
  const [caseId, setCaseId] = useState("");
  const [turnId, setTurnId] = useState("");
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<{
    multimodal: ConsultQuality;
    textOnly: ConsultQuality;
  } | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [scores, caseRes, turnRes] = await Promise.all([
      api<{ items: ResponseScoreRecord[] }>("/api/scores"),
      api<{ items: ConsultCase[] }>("/api/cases"),
      api<{ items: MultimodalTurn[] }>("/api/turns"),
    ]);
    setItems(scores.items);
    setCases(caseRes.items);
    setTurns(turnRes.items);
    if (!caseId && caseRes.items[0]) setCaseId(caseRes.items[0].id);
    if (!turnId && turnRes.items[0]) setTurnId(turnRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/scores", {
        method: "POST",
        body: JSON.stringify({
          caseId,
          turnId,
          name,
          clinicalCoherence: 0.75,
          safetyDiscipline: 0.78,
          turnClarity: 0.72,
          status: "computed",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onPreview() {
    setError("");
    try {
      const turn = turns.find((t) => t.id === turnId);
      const c = cases.find((x) => x.id === caseId);
      const res = await api<{
        multimodal: ConsultQuality;
        textOnly: ConsultQuality;
      }>("/api/scores", {
        method: "POST",
        body: JSON.stringify({
          preview: {
            imageRelevance: turn?.imageRelevance ?? 0.8,
            visualGrounding: turn?.visualGrounding ?? 0.75,
            clinicalCoherence: 0.75,
            turnClarity: 0.72,
            safetyDiscipline: 0.78,
            textFluency: 0.3,
            departmentFit: 0.76,
            historyCoverage: 0.7,
            urgencyRecognition: 0.68,
            hallucinationRisk: 0.2,
            department: c?.department ?? "general",
            plan: "multimodal",
          },
        }),
      });
      setPreview(res);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Next-response scores"
      subtitle="Record and preview dual scores — multimodal-aware plan quality vs text-only baseline."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={turnId}
          onChange={(e) => setTurnId(e.target.value)}
        >
          {turns.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <Input
          className="md:col-span-2"
          placeholder="Score name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <Button type="submit">Save score</Button>
          <Button type="button" variant="outline" onClick={onPreview}>
            Preview dual score
          </Button>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      {preview ? (
        <div className="score-rise mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h3 className="font-[family-name:var(--font-display)] text-lg">
              A · Multimodal
            </h3>
            <p className="mt-2 text-3xl text-[var(--studio-mint-deep)]">
              {preview.multimodal.overall}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              visual {preview.multimodal.visualFidelity} · clinical{" "}
              {preview.multimodal.clinicalPlan} · safety{" "}
              {preview.multimodal.safetyScore}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h3 className="font-[family-name:var(--font-display)] text-lg">
              B · Text-only
            </h3>
            <p className="mt-2 text-3xl text-slate-700">
              {preview.textOnly.overall}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              visual {preview.textOnly.visualFidelity} · clinical{" "}
              {preview.textOnly.clinicalPlan} · safety{" "}
              {preview.textOnly.safetyScore}
            </p>
          </div>
        </div>
      ) : null}

      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg">
              {s.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {s.status} · clinical {s.clinicalCoherence} · safety{" "}
              {s.safetyDiscipline} · clarity {s.turnClarity}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/leaderboard/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { LeaderboardEntry } from "@/store";

export default function LeaderboardPage() {
  const [items, setItems] = useState<LeaderboardEntry[]>([]);
  const [modelName, setModelName] = useState("");
  const [promptVariant, setPromptVariant] = useState("image-first");
  const [multimodalAvg, setMultimodalAvg] = useState("70");
  const [textOnlyAvg, setTextOnlyAvg] = useState("48");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: LeaderboardEntry[] }>("/api/leaderboard");
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/leaderboard", {
        method: "POST",
        body: JSON.stringify({
          modelName,
          promptVariant,
          multimodalAvg: Number(multimodalAvg),
          textOnlyAvg: Number(textOnlyAvg),
        }),
      });
      setModelName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Model leaderboard"
      subtitle="Rank models and prompt variants by multimodal vs text-only gap."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Model name"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          required
        />
        <Input
          placeholder="Prompt variant"
          value={promptVariant}
          onChange={(e) => setPromptVariant(e.target.value)}
          required
        />
        <Input
          placeholder="Multimodal avg"
          value={multimodalAvg}
          onChange={(e) => setMultimodalAvg(e.target.value)}
        />
        <Input
          placeholder="Text-only avg"
          value={textOnlyAvg}
          onChange={(e) => setTextOnlyAvg(e.target.value)}
        />
        <div className="md:col-span-2">
          <Button type="submit">Upsert row</Button>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      <div className="overflow-x-auto rounded-lg border border-[var(--studio-line)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--studio-panel)] text-slate-500">
            <tr>
              <th className="px-3 py-2">Model</th>
              <th className="px-3 py-2">Prompt</th>
              <th className="px-3 py-2">A multimodal</th>
              <th className="px-3 py-2">B text-only</th>
              <th className="px-3 py-2">Gap</th>
              <th className="px-3 py-2">Runs</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t border-[var(--studio-line)]">
                <td className="px-3 py-2 font-medium">{r.modelName}</td>
                <td className="px-3 py-2">{r.promptVariant}</td>
                <td className="px-3 py-2 text-[var(--studio-mint-deep)]">
                  {r.multimodalAvg}
                </td>
                <td className="px-3 py-2">{r.textOnlyAvg}</td>
                <td className="px-3 py-2">{r.gap}</td>
                <td className="px-3 py-2">{r.runs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/compare/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, ConsultCase } from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<CompareResult[]>([]);
  const [cases, setCases] = useState<ConsultCase[]>([]);
  const [caseId, setCaseId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, caseRes] = await Promise.all([
      api<{ items: CompareResult[] }>("/api/compare"),
      api<{ items: ConsultCase[] }>("/api/cases"),
    ]);
    setItems(compares.items);
    setCases(caseRes.items);
    if (!caseId && caseRes.items[0]) setCaseId(caseRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, caseId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Multimodal vs text-only"
      subtitle="Falsify the claim: does image-aware scoring beat a text-only baseline on this case?"
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Compare run name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <div className="md:col-span-2">
          <Button type="submit">Run compare</Button>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="score-rise rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg">
                {c.name}
              </h2>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                winner: {c.winner}
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">A multimodal</p>
                <p className="text-2xl text-[var(--studio-mint-deep)]">
                  {c.multimodal.overall}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">B text-only</p>
                <p className="text-2xl text-slate-700">{c.textOnly.overall}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/settings/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const [orgRes, memRes, featRes] = await Promise.all([
      api<{ org: OrgSettings }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: string[] }>("/api/features"),
    ]);
    setOrg(orgRes.org);
    setMembers(memRes.items);
    setFeatures(featRes.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setError("");
    try {
      const res = await api<{ org: OrgSettings }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(res.org);
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

  return (
    <StudioShell
      title="Org settings"
      subtitle="Bearer auth, webhook secret, member invites, and feature inventory."
    >
      {org ? (
        <form
          onSubmit={onSave}
          className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
        >
          <Input
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
          />
          <Input
            placeholder="Webhook URL"
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
          />
          <Input
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) =>
              setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
            }
          />
          <p className="text-sm text-slate-500">
            Bearer token (dev): <code>{org.bearerToken}</code>
          </p>
          <div className="md:col-span-2">
            <Button type="submit">Save settings</Button>
          </div>
        </form>
      ) : null}

      <form
        onSubmit={onInvite}
        className="mb-8 flex flex-wrap gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          className="max-w-sm"
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Invite member</Button>
      </form>

      <ul className="mb-8 space-y-1 text-sm text-slate-600">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Feature inventory ({features.length})
      </h2>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ol>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
`,
);

write(
  "src/app/honesty/page.tsx",
  `import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  DISPLAY_NAME,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this studio is — and what it is not."
    >
      <div className="space-y-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6 text-slate-700">
        <p>
          <strong>{DISPLAY_NAME}</strong> is a Method Lab experiment for scoring
          multimodal (text+image) medical consult next-responses. It is inspired
          by research on real-world multimodal consult evaluation. It is{" "}
          <strong>not</strong> clinical certification, FDA clearance, or a live
          hospital chat system.
        </p>
        <p>
          Do <strong>not</strong> brand this product as MedRealMM. Scores are a
          soft simulation for method-lab comparison of multimodal-aware vs
          text-only baselines.
        </p>
        <p>
          Authors&apos; public code for the source paper:{" "}
          {AUTHORS_CODE_URL ? (
            <a href={AUTHORS_CODE_URL} className="underline-offset-2 hover:underline">
              {AUTHORS_CODE_URL}
            </a>
          ) : (
            <em>none published</em>
          )}
          .
        </p>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
            Sources
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Paper:{" "}
              <a
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {PAPER_URL}
              </a>
            </li>
            <li>
              Guide:{" "}
              <Link
                href="/docs/guides/61-consult-bench-studio-lessons.md"
                className="underline-offset-2 hover:underline"
              >
                docs/guides/61-consult-bench-studio-lessons.md
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
`,
);

console.log("pages batch 2 done");
