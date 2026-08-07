import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISPLAY_NAME } from "@/lib/claim";

const STEPS = [
  {
    n: 1,
    title: "Import",
    body: "Bring soft-sim usage (and optional commit inventory) into a batch you can inspect.",
    href: "/imports",
    cta: "Open imports",
  },
  {
    n: 2,
    title: "Match",
    body: "Align Savings Plans, RIs, and CUDs to accounts — then score coverage on the matched view.",
    href: "/commitments",
    cta: "Open commitments",
  },
  {
    n: 3,
    title: "Gap",
    body: "Read under-cover and unused commit dollars as findings you can defend in the renewals room.",
    href: "/gaps",
    cta: "Open gaps",
  },
  {
    n: 4,
    title: "A vs B compare",
    body: "Run commit-matched versus on-demand-blind so the dual claim is visible before you renew.",
    href: "/compare",
    cta: "Open compare",
  },
  {
    n: 5,
    title: "Renew",
    body: "Build a renewal pack with buy / reduce / hold actions tied to gap dollars.",
    href: "/renewals",
    cta: "Open renewals",
  },
] as const;

export default function DemoPage() {
  return (
    <main className="ledger-field flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 sm:px-12 sm:py-24">
        <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {DISPLAY_NAME}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Guided demo
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Walk Import → Match → Gap → Renew on live soft-sim routes, including an
          A vs B compare step. Soft-sim only — not live cloud billing.
        </p>

        <ol className="mt-12 space-y-10">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="border-t border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] pt-8"
            >
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Step {step.n}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={step.href}>{step.cta}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/imports">Start at Import</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/coverage">Jump to coverage</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
