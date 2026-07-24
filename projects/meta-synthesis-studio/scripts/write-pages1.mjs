import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function w(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

w(
  "src/app/questions/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ReviewQuestion } from "@/store";

export default function QuestionsPage() {
  const [items, setItems] = useState<ReviewQuestion[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [population, setPopulation] = useState("");
  const [intervention, setIntervention] = useState("");
  const [comparator, setComparator] = useState("");
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: ReviewQuestion[] }>(
        \`/api/questions?q=\${encodeURIComponent(search)}&page=1&pageSize=20\`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/questions", {
          method: "POST",
          body: JSON.stringify({
            title,
            population,
            intervention,
            comparator,
            outcome,
            notes,
          }),
        });
        setTitle("");
        setPopulation("");
        setIntervention("");
        setComparator("");
        setOutcome("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Review questions"
      subtitle="Open PICO questions that drive search, screen, extract, and pool."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-stone-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-500">
          <li>Create a review question with population, intervention, comparator, outcome.</li>
          <li>Attach search strategies, screen citations, and extract effects.</li>
          <li>Run agentic pooled analysis and compare against an ad-hoc baseline.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">New question</p>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Statins vs placebo for LDL…" />
          </div>
          <div>
            <Label>Population</Label>
            <Input value={population} onChange={(e) => setPopulation(e.target.value)} />
          </div>
          <div>
            <Label>Intervention</Label>
            <Input value={intervention} onChange={(e) => setIntervention(e.target.value)} />
          </div>
          <div>
            <Label>Comparator</Label>
            <Input value={comparator} onChange={(e) => setComparator(e.target.value)} />
          </div>
          <div>
            <Label>Outcome</Label>
            <Input value={outcome} onChange={(e) => setOutcome(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !title.trim() || !population.trim() || !outcome.trim()}
            onClick={create}
          >
            Create question
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions…"
            />
            <Button variant="outline" disabled={pending} onClick={() => load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li
                key={item.id}
                className="animate-queue-slide rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
                style={{ animationDelay: \`\${i * 40}ms\` }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-stone-900">{item.title}</p>
                  <Badge variant="outline">{item.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-stone-500">{item.pico}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/searches/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ReviewQuestion, SearchStrategy } from "@/store";

export default function SearchesPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [items, setItems] = useState<SearchStrategy[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [name, setName] = useState("");
  const [databases, setDatabases] = useState("PubMed, Embase");
  const [queryString, setQueryString] = useState("");
  const [hitEstimate, setHitEstimate] = useState("100");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      const qid = questionId || qs.items[0]?.id || "";
      if (!questionId && qid) setQuestionId(qid);
      const res = await api<{ items: SearchStrategy[] }>(
        \`/api/searches?questionId=\${encodeURIComponent(qid)}\`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/searches", {
        method: "POST",
        body: JSON.stringify({
          questionId,
          name,
          databases,
          queryString,
          hitEstimate: Number(hitEstimate) || 0,
        }),
      });
      setName("");
      setQueryString("");
      refresh();
    });
  }

  return (
    <StudioShell
      title="Search strategies"
      subtitle="Craft database queries linked to a review question."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">New strategy</p>
          <div>
            <Label>Question</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Databases</Label>
            <Input value={databases} onChange={(e) => setDatabases(e.target.value)} />
          </div>
          <div>
            <Label>Query</Label>
            <Input value={queryString} onChange={(e) => setQueryString(e.target.value)} />
          </div>
          <div>
            <Label>Hit estimate</Label>
            <Input value={hitEstimate} onChange={(e) => setHitEstimate(e.target.value)} />
          </div>
          <Button disabled={pending || !name.trim() || !queryString.trim() || !questionId} onClick={create}>
            Save strategy
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <p className="font-medium text-stone-900">{item.name}</p>
              <p className="mt-1 text-sm text-stone-500">{item.databases}</p>
              <p className="mt-2 font-mono text-xs text-stone-600">{item.queryString}</p>
              <p className="mt-2 text-xs text-stone-400">~{item.hitEstimate} hits</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/screens/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ReviewQuestion, ScreenDecision, ScreenVerdict, SearchStrategy } from "@/store";

export default function ScreensPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [searches, setSearches] = useState<SearchStrategy[]>([]);
  const [items, setItems] = useState<ScreenDecision[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [citation, setCitation] = useState("");
  const [verdict, setVerdict] = useState<ScreenVerdict>("include");
  const [reason, setReason] = useState("");
  const [pending, start] = useTransition();

  function refresh(qid?: string) {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      const id = qid || questionId || qs.items[0]?.id || "";
      if (!questionId && id) setQuestionId(id);
      const ss = await api<{ items: SearchStrategy[] }>(
        \`/api/searches?questionId=\${encodeURIComponent(id)}\`,
      );
      setSearches(ss.items);
      if (!searchId && ss.items[0]) setSearchId(ss.items[0].id);
      const sc = await api<{ items: ScreenDecision[] }>(
        \`/api/screens?questionId=\${encodeURIComponent(id)}\`,
      );
      setItems(sc.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/screens", {
        method: "POST",
        body: JSON.stringify({ questionId, searchId, citation, verdict, reason }),
      });
      setCitation("");
      setReason("");
      refresh(questionId);
    });
  }

  return (
    <StudioShell
      title="Screen queue"
      subtitle="Decide include, exclude, or maybe — with a reason on the trail."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Screen decision</p>
          <div>
            <Label>Question</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={questionId}
              onChange={(e) => {
                setQuestionId(e.target.value);
                refresh(e.target.value);
              }}
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Search</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            >
              {searches.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Citation</Label>
            <Input value={citation} onChange={(e) => setCitation(e.target.value)} placeholder="Author Year · design · n" />
          </div>
          <div>
            <Label>Verdict</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={verdict}
              onChange={(e) => setVerdict(e.target.value as ScreenVerdict)}
            >
              <option value="include">include</option>
              <option value="exclude">exclude</option>
              <option value="maybe">maybe</option>
            </select>
          </div>
          <div>
            <Label>Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button disabled={pending || !citation.trim() || !searchId} onClick={create}>
            Record decision
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="animate-queue-slide rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              style={{ animationDelay: \`\${i * 50}ms\` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-stone-900">{item.citation}</p>
                <Badge variant="outline">{item.verdict}</Badge>
              </div>
              <p className="mt-1 text-sm text-stone-500">{item.reason || "—"}</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

console.log("pages batch 1 done");
