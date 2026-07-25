"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open manipulator packs",
    detail: "Review the seed arm and end-effector pack.",
    href: "/manipulators",
  },
  {
    title: "Define contact points",
    detail: "Confirm fingertip and palm contact intent.",
    href: "/contacts",
  },
  {
    title: "Create a contact plan",
    detail: "Add a plan with a soft-sim success condition.",
    href: "/plans",
  },
  {
    title: "Attach sensing cues",
    detail: "Record tactile and vision confidence for contact.",
    href: "/sensing",
  },
  {
    title: "Run demo compare",
    detail: "Score contact-centric tactile+vision vs vision-only and read the gap.",
    href: "/compare",
  },
] as const;

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function runCompare() {
    setError("");
    try {
      const [plans, contacts, runs] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/plans"),
        api<{ items: { id: string }[] }>("/api/contacts"),
        api<{ items: { id: string }[] }>("/api/sensing"),
      ]);
      const planId = plans.items[0]?.id;
      const contactId = contacts.items[0]?.id;
      const sensingRunId = runs.items[0]?.id;
      if (!planId || !contactId || !sensingRunId) {
        throw new Error("missing_seed_entities");
      }
      const data = await api<{
        compare: { winner: string; gap: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          planId, contactId, sensingRunId, bias: "balanced",
        }),
      });
      setMsg(`Winner ${data.compare.winner} · gap ${data.compare.gap}`);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Complete steps in order — later steps stay blocked until prior ones are marked done."
    >
      <ol className="space-y-4">
        {STEPS.map((s, i) => {
          const unlocked = i <= step;
          return (
            <li
              key={s.title}
              className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-900">
                    Step {i + 1}: {s.title}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{s.detail}</p>
                </div>
                {unlocked ? (
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link href={s.href}>Open</Link>
                    </Button>
                    {i < STEPS.length - 1 ? (
                      <Button
                        disabled={step !== i}
                        onClick={() => setStep(i + 1)}
                      >
                        Next step
                      </Button>
                    ) : (
                      <Button disabled={step !== i} onClick={() => runCompare()}>
                        Run demo compare
                      </Button>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">
                    Step blocked until prior done
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {msg ? (
        <p className="mt-6 text-sm text-[var(--studio-orange)]">{msg}</p>
      ) : null}
      {done ? (
        <p className="mt-2 text-sm text-slate-600">
          Demo complete — inspect{" "}
          <Link href="/scoreboard" className="underline">
            scoreboard
          </Link>
          .
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
