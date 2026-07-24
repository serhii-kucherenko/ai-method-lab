import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-amber)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-slate-400 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--studio-line)]">
        <div className="deploy-grid absolute inset-0 opacity-80" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-amber)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-200 md:text-3xl">
              Ship multimodal live — with a harness
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-400">
              Manage deploy apps, run agent-harnessed multi-check deploy plans,
              inspect latency and multimodal readiness, and compare against
              naive single-shot deploys. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/apps">Open deploy apps</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/deploy">Start deploy console</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 overflow-hidden rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 [animation-delay:120ms]">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--studio-amber)]">
              Pipeline pulse
            </p>
            <div className="flex h-40 items-end gap-2">
              {[42, 68, 55, 88, 72, 95, 78].map((h, i) => (
                <div
                  key={i}
                  className="animate-bar-rise flex-1 rounded-t bg-[var(--studio-amber)]/80"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-100">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          Realtime multimodal apps fail when teams ship a single-shot deploy
          guess. Heterogeneous pipelines need IR validation, measurement-gated
          transforms, and readiness checks — not one prompt and hope.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-100">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Harnessed deploy plans",
                d: "IR → validate → transform → measure stages instead of one-shot guesses.",
              },
              {
                t: "App / environment workspaces",
                d: "Register multimodal apps with GPU budget and latency targets.",
              },
              {
                t: "Latency & multimodal readiness",
                d: "See TTFO, throughput, sync, and correctness gates before promote.",
              },
              {
                t: "Naive single-shot compare",
                d: "Quantify harness lift against a baseline deploy with no IR loop.",
              },
              {
                t: "Auditable runs",
                d: "Export CSV audits and JSON run payloads for platform reviews.",
              },
              {
                t: "Honest framing",
                d: "Inspired by FlashRT research — not branded as FlashRT.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-medium text-[var(--studio-amber)]">{s.t}</p>
                <p className="mt-2 text-sm text-slate-400">{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-100">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-slate-400">
          <li>Register a deploy app and environment with modalities and GPU budget.</li>
          <li>Run a harnessed deploy plan through IR, validate, transform, and measure.</li>
          <li>Inspect readiness, compare to naive single-shot, and export the audit trail.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-500">
          Soft simulation for method-lab planning — not a production autoscaler.{" "}
          <Link href="/honesty" className="underline underline-offset-4">
            Honesty & Sources
          </Link>
          . Paper:{" "}
          <a
            className="underline underline-offset-4"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            arXiv
          </a>
          {AUTHORS_CODE_URL ? (
            <>
              {" · "}
              <a
                className="underline underline-offset-4"
                href={AUTHORS_CODE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Authors’ code
              </a>
            </>
          ) : null}
        </p>
      </section>
    </div>
  );
}
