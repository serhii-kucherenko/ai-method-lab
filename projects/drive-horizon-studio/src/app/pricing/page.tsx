"use client";

import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Bench",
    price: "$0 method-lab",
    blurb: "Single evaluator seat, seeded packs, dual compare.",
    includes: ["1 evaluator seat", "Public seed packs", "A/B dual score", "Honesty fence"],
  },
  {
    name: "Team",
    price: "Hypothetical seats",
    blurb: "Sim eval team seats with audit and export.",
    includes: ["Up to 8 seats", "Audit trail", "JSON/CSV export", "Webhook ingest"],
  },
  {
    name: "Pack license",
    price: "Scenario packs",
    blurb: "Versioned scenario packs + scoreboard for planner lock reviews.",
    includes: ["Versioned scenario packs", "Scoreboard", "Org settings", "Corridor templates"],
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical bench seats + scenario packs — method-lab packaging, not a live checkout."
    >
      <p className="mb-8 text-sm text-slate-500">
        No card required. This is method-lab experiment packaging for seats and
        scenario packs — not a live billing product.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              {t.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--studio-signal)]">
              {t.price}
            </p>
            <p className="mt-3 text-sm text-slate-600">{t.blurb}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link href="/onboarding" className="mt-8 inline-block text-[var(--studio-teal)] underline">
        Continue to onboarding
      </Link>
    </StudioShell>
  );
}
