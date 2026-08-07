import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISPLAY_NAME } from "@/lib/claim";

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
          <li className="border-t border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] pt-8">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Step 1
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
              Import
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Bring soft-sim usage (and optional commit inventory) into a batch
              you can inspect.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/imports">Open imports</Link>
              </Button>
            </div>
          </li>
          <li className="border-t border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] pt-8">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Step 2
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
              Match
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Align Savings Plans, RIs, and CUDs to accounts — then score coverage
              on the matched view.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/commitments">Open commitments</Link>
              </Button>
            </div>
          </li>
          <li className="border-t border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] pt-8">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Step 3
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
              Gap
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Read under-cover and unused commit dollars as findings you can
              defend in the renewals room.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/gaps">Open gaps</Link>
              </Button>
            </div>
          </li>
          <li className="border-t border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] pt-8">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Step 4
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
              A vs B compare
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Run commit-matched versus on-demand-blind so the dual claim is
              visible before you renew.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/compare">Open compare</Link>
              </Button>
            </div>
          </li>
          <li className="border-t border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] pt-8">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Step 5
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
              Renew
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Build a renewal pack with buy / reduce / hold actions tied to gap
              dollars.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/renewals">Open renewals</Link>
              </Button>
            </div>
          </li>
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
