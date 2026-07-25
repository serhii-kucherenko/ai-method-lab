import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div
          aria-hidden
          className="grid-pulse absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,155,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(26,155,184,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-cyan)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-slate-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
            Channel-aware bit plans for edge CPUs — before you ship uniform W3
            and pray about memory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--studio-cyan)] px-5 py-2.5 text-sm font-medium text-[var(--studio-ink-deep)] transition hover:brightness-110"
            >
              Open model packs
            </Link>
            <Link
              href="/honesty"
              className="rounded-md border border-slate-500 px-5 py-2.5 text-sm text-slate-200 transition hover:border-slate-300"
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
          Edge CPU deployers are stuck choosing coarse W3 or W4. That either
          wastes memory headroom or overshoots latency. Channel-aware mixed
          precision exists in research — teams need a studio to plan it before
          silicon week.
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
                "Channel bit-width plan board",
                "Assign palette bits under a fractional average-bit budget guided by saliency.",
              ],
              [
                "Uniform vs channel-aware compare",
                "Falsify whether channel plans beat a naive single bit-width baseline.",
              ],
              [
                "Compile / runtime soft-sim",
                "Cluster regularity, kernel paths, and layout merge — without claiming silicon.",
              ],
              [
                "Latency / memory honesty",
                "Envelope budgets that stay labeled as method-lab estimates.",
              ],
              [
                "Model packs for constrained targets",
                "Register packs against laptop, workstation, and mobile CPU profiles.",
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
          Packs, channels, targets, runtime plans, memory budgets, dual compare,
          org settings, webhook, export, and an honesty fence — twenty-plus live
          capabilities for edge quantization planning.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            How it works
          </h2>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-600">
            <li>Register a model pack and an edge CPU target.</li>
            <li>Build a channel bit-width plan under your average-bit budget.</li>
            <li>Soft-sim the compile/runtime cluster path.</li>
            <li>Compare channel-aware quality against a uniform baseline.</li>
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Honesty
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Method-lab soft-sim inspired by PolyQ&apos;s channel/compile pattern.
          Not PolyQ, not measured silicon, not authors&apos; product.{" "}
          <Link
            href="/honesty"
            className="text-[var(--studio-cyan-deep)] underline-offset-2 hover:underline"
          >
            Full fence
          </Link>
          .
        </p>
        <p className="mt-6 text-sm text-slate-500">
          Sources:{" "}
          <a
            className="underline-offset-2 hover:underline"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            arXiv {PAPER_URL.split("/").pop()}
          </a>{" "}
          · authors&apos; code: none
        </p>
        <div className="mt-10">
          <Link
            href="/packs"
            className="rounded-md bg-[var(--studio-cyan)] px-5 py-2.5 text-sm font-medium text-[var(--studio-ink-deep)]"
          >
            Open model packs
          </Link>
        </div>
      </section>
    </div>
  );
}
