import Link from "next/link";
import { BelowFold } from "@/components/landing/below-fold";
import { Button } from "@/components/ui/button";
import {
  DISPLAY_NAME,
  LANDING_HEADLINE,
  LANDING_SUPPORT,
} from "@/lib/claim";

export default function Home() {
  return (
    <main className="ledger-field flex flex-1 flex-col">
      <section className="flex min-h-screen w-full flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="brand-fade max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl text-xl font-medium leading-snug text-foreground sm:text-2xl">
            {LANDING_HEADLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {LANDING_SUPPORT}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/commitments">Open commitments</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">See demo</Link>
            </Button>
          </div>
        </div>
      </section>
      <BelowFold />
    </main>
  );
}
