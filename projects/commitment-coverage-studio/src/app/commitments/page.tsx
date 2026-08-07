import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISPLAY_NAME } from "@/lib/claim";

export default function CommitmentsPlaceholderPage() {
  return (
    <main className="ledger-field flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16 sm:px-12">
        <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {DISPLAY_NAME}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
          Commitments
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Commitment inventory lands in a later phase. This route keeps the landing CTA
          honest without a desk shell.
        </p>
        <div className="mt-10">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
