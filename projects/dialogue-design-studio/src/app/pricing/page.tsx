import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  { name: "Starter", price: "$0", blurb: "One feed pack soft-sim, dual scorers, honesty fence.", items: ["3 packs", "Goldens sample", "Export JSON"] },
  { name: "Team", price: "$480/mo", blurb: "Feed surfaces, badge rules, topic threads, webhook HMAC, audit.", items: ["Unlimited compares", "Members + org", "CSV export"] },
  { name: "Lab", price: "Custom", blurb: "Method-lab soft-sim for civic dialogue / T&S teams.", items: ["Scoreboard seats", "Rate-limit controls", "Onboarding guide"] },
] as const;

export function PricingPage() {
  return (
    <StudioShell title="Pricing" subtitle="Method-lab soft-sim tiers for productive open-minded dialogue feed packs — not live social network deployment.">
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <article key={t.name} className="row-lift rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
            <p className="mt-1 text-3xl text-[var(--dd-teal)]">{t.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{t.blurb}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm">
        Soft-sim method-lab pricing only. <Link href="/honesty" className="underline text-[var(--dd-teal)]">Read honesty</Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
