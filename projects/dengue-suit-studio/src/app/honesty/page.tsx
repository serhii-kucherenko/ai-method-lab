import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What Dengue Suit Studio is — and what it must never claim."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This is a Method Lab soft-sim for comparing CMIP6 thermal-suitability
          dengue risk maps against static historical baselines before locking a
          surveillance pack.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not live outbreak prediction</li>
          <li>Not clinical diagnosis</li>
          <li>Not operational mosquito control deployment</li>
          <li>Not the authors&apos; dengue atlas or official climate product</li>
        </ul>
        <p>
          Source paper:{" "}
          <a href={PAPER_URL} className="underline text-[var(--ds-teal)]">
            medRxiv 10.64898/2026.07.02.26357126
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--ds-teal)]">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
