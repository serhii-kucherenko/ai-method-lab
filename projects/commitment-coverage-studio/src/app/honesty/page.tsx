import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DISPLAY_NAME,
  HONESTY_NOT_SIBLINGS,
  HONESTY_SOFT_SIM,
  HONESTY_SOURCES_NOTE,
  HONESTY_TITLE,
  SOURCES_HEADING,
} from "@/lib/claim";

export default function HonestyPage() {
  return (
    <main className="ledger-field flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 sm:px-12 sm:py-24">
        <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {DISPLAY_NAME}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {HONESTY_TITLE}
        </h1>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {HONESTY_SOFT_SIM}
        </p>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {HONESTY_NOT_SIBLINGS}
        </p>

        <section className="mt-14 border-t border-border/60 pt-10">
          <h2 className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {SOURCES_HEADING}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {HONESTY_SOURCES_NOTE}
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/commitments">Open commitments</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
