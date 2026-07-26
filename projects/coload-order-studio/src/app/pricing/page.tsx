import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Bench",
    price: "$0",
    blurb: "Single evaluator soft-sim for ordered co-load drafts.",
    includes: ["1 seat", "Demo pack", "30 goldens browser", "Honesty fence"],
  },
  {
    name: "Formulation",
    price: "$480 / mo",
    blurb: "Team carrier packs and dual A/B compares for formulation leads.",
    includes: ["8 seats", "Versioned packs", "Export + webhooks", "Scoreboard"],
  },
  {
    name: "Site",
    price: "Talk to us",
    blurb: "Site license for nanomedicine analytics orgs — method-lab packaging only.",
    includes: ["Unlimited seats", "Audit export", "Rate-limit controls", "Guide link"],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical plans for method-lab packaging — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {t.name}
            </h2>
            <p className="mt-1 text-lg text-[var(--co-amber)]">{t.price}</p>
            <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {t.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--co-slate)]">
          Start onboarding
        </Link>
        {" · "}
        <Link href="/honesty" className="underline text-[var(--co-slate)]">
          Read honesty
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
