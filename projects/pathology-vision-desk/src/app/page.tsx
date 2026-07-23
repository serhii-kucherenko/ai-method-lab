import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SlideField } from "@/components/slide-field";

export default function HomePage() {
  return (
    <section data-home="live" className="space-y-8">
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--pvd-ink)] sm:text-5xl">
          Pathology Vision Desk
        </h1>
        <p className="max-w-xl text-lg text-[var(--pvd-muted)]">
          Compare multi-expert pathology scoring against a naive single-view
          baseline — a method experiment, not a clinical diagnostic tool.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-[var(--pvd-rose)] hover:bg-[var(--pvd-rose-deep)]"
          >
            <Link href="/scenario">Open scenario</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/honesty">Read honesty</Link>
          </Button>
        </div>
      </div>
      <SlideField className="w-full max-w-xl text-[var(--pvd-slate)]" />
      <p className="max-w-xl text-sm text-[var(--pvd-muted)]">
        Org desk for vision jobs, lifecycle, batch transitions, audit, goldens,
        and signed webhooks. Never branded as the paper short name.
      </p>
    </section>
  );
}
