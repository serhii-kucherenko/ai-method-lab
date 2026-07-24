import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-signal)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-slate-500 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--studio-line)]">
        <div className="infer-grid absolute inset-0 opacity-35" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Stage-validated all-GPU plans for tight legacy VRAM
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Edge teams register legacy cards, gate inference stages, and keep
              multimodal assistants resident — instead of hoping host offload
              fits. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/devices"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-signal)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open device registry
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Compare vs naive offload
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-graphite)]">
              Usable VRAM · stage pass
            </p>
            {[
              ["Usable VRAM headroom", 78],
              ["Stage agreement", 88],
              ["Host spill avoided", 92],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className={`animate-fade-up space-y-1 ${i === 1 ? "animate-stage-flash rounded-md p-1" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-slate-100">
                  <div
                    className="h-full rounded bg-[var(--studio-signal)] animate-vram-fill"
                    style={{
                      ["--vram-w" as string]: `${pct}%`,
                      width: `${pct}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-500">
          Modern multimodal models blow past tiny legacy VRAM when plans naively
          spill weights or decode to the host. Teams need stage-validated
          all-GPU residency plans that prove each gate before production hope.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-white/70 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Legacy device registry",
                d: "Track Fermi-era and edge cards with usable VRAM and compute capability.",
              },
              {
                t: "Stage-validated plans",
                d: "Gate vision encode, merge, prefill, and decode against reference agreement.",
              },
              {
                t: "Kernel / VRAM budgets",
                d: "Account for resident footprints before the first all-GPU run.",
              },
              {
                t: "All-GPU validation runs",
                d: "Score stage-validated plans and surface OOM risk early.",
              },
              {
                t: "Offload compare",
                d: "Put stage-validated quality next to naive host-spill baselines.",
              },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {item.t}
                </h3>
                <p className="mt-2 text-slate-500">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-slate-600">
          <li>Register the legacy GPU you actually have.</li>
          <li>Define stage gates and kernel budgets that fit usable VRAM.</li>
          <li>Run all-GPU validation and compare against naive offload.</li>
        </ol>
      </section>

      <footer className="border-t border-[var(--studio-line)] bg-white/80 py-10">
        <div className="mx-auto max-w-6xl space-y-3 px-4 text-sm text-slate-500">
          <p>
            Method-lab studio inspired by stage-validated all-GPU inference on
            constrained legacy hardware. Not a live CUDA driver for production
            Tesla-class cards. Not branded as the paper system.
          </p>
          <p>
            Sources:{" "}
            <a
              className="text-[var(--studio-signal)] underline-offset-2 hover:underline"
              href={PAPER_URL}
              target="_blank"
              rel="noreferrer"
            >
              arXiv {PAPER_URL.replace("https://arxiv.org/abs/", "")}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
