import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChallengeStrip } from "@/components/challenge-strip";

const SELLING = [
  "Compare game-theoretic multi-agent plans against single-agent, flat majority vote without game structure, and confidence-only baselines",
  "Keep truth plan jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so truth scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / arena / claim-set profile catalog",
  "Truth job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (single_agent / majority_vote / confidence-only vs game-theoretic multi-agent)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Challenge+payoff+agents plan strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a truth job under an arena / claim-set profile",
  "Run scenario compare — single-agent, majority_vote, and confidence-only vs game-theoretic multi-agent bands",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--tgd-ink)] sm:text-4xl md:text-5xl">
            Truth Game Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--tgd-ink)] sm:text-3xl">
            Challenge — payoff — multi-agent truth plans
          </h1>
          <p className="max-w-xl text-lg text-[var(--tgd-muted)]">
            Game-theoretic multi-agent truth plans with structured challenge and payoff among agents — against single-agent unchecked answers,
            majority-vote baselines, or confidence-only filters.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--tgd-steel)] hover:bg-[var(--tgd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <ChallengeStrip className="w-full max-w-xl text-[var(--tgd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tgd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--tgd-muted)] leading-relaxed">
          Hallucination risk climbs when agents answer alone, vote flat, or trust confidence alone. Single-agent plans skip structured challenge; flat majority vote skips payoff scoring; confidence-only filters ignore multi-agent game structure.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tgd-ink)]">
          Product
        </h2>
        <p className="text-[var(--tgd-muted)] leading-relaxed">
          Truth Game Desk scores game-theoretic multi-agent plans beside
          naive single-agent and majority-vote baselines, with jobs,
          audit, and dual-impl goldens. Soft simulation — not a hallucination-elimination product and not a claim to replace authors' framework.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tgd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--tgd-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tgd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--tgd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tgd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-[var(--tgd-muted)]">
          {STEPS.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl border-t border-[var(--tgd-line)] pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tgd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--tgd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a hallucination-elimination product and not a claim to replace the authors&apos; game-theory multi-agent framework.
          Never brand this desk as the authors' framework or a hallucination cure.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tgd-ink)]">
          Sources
        </h2>
        <p className="text-sm text-[var(--tgd-muted)]">
          Paper:{" "}
          <a
            className="underline underline-offset-2"
            href="https://arxiv.org/abs/2607.08403v1"
          >
            arXiv:2607.08403
          </a>
          . Authors&apos; code: none published.
        </p>
      </section>
    </div>
  );
}
