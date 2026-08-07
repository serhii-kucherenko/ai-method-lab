import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISPLAY_NAME } from "@/lib/claim";

export default function FlowsPage() {
  return (
    <main className="ledger-field flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-12 sm:py-24">
        <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {DISPLAY_NAME}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Flows
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Named journeys into the live soft-sim. Start where your question is -
          matching, rollup, renewal pack, dual compare, or export review.
        </p>

        <ol className="mt-12 space-y-10 border-t border-border/60 pt-10">
          <li className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                Import & match
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Load commits and usage, then score coverage for the window.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/imports">Start</Link>
            </Button>
          </li>

          <li className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                Multi-cloud rollup
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Rank gap dollars across accounts from the scoreboard.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/scoreboard">Start</Link>
            </Button>
          </li>

          <li className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                Renewal pack
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Walk into renewals with buy, reduce, or hold recommendations.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/renewals">Start</Link>
            </Button>
          </li>

          <li className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                Dual compare
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Prove commit-matched coverage against the on-demand-blind path.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/compare">Start</Link>
            </Button>
          </li>

          <li className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                Export & review
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Take gap or renewal evidence out, then review org settings.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/gaps">Open gaps</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/settings">Open settings</Link>
              </Button>
            </div>
          </li>
        </ol>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-border/60 pt-10">
          <Button asChild>
            <Link href="/onboarding">First-run checklist</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/demo">Guided demo</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">Pricing</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
