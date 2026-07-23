import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EcgTrace } from "@/components/ecg-trace";

export default function HomePage() {
  return (
    <section data-home="live" className="space-y-8">
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--hrd-ink)] sm:text-5xl">
          Heart Rhythm Desk
        </h1>
        <p className="max-w-xl text-lg text-[var(--hrd-muted)]">
          Compare long-tail-aware rhythm scoring against a naive majority
          baseline — a method experiment, not a clinical ECG reader.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-[var(--hrd-teal)] hover:bg-[var(--hrd-teal-deep)]">
            <Link href="/scenario">Open scenario</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/honesty">Read honesty</Link>
          </Button>
        </div>
      </div>
      <EcgTrace className="w-full max-w-xl text-[var(--hrd-signal)]" />
      <p className="max-w-xl text-sm text-[var(--hrd-muted)]">
        Org desk for rhythm jobs, lifecycle, batch transitions, audit, goldens,
        and signed webhooks. Never branded as the paper short name.
      </p>
    </section>
  );
}
