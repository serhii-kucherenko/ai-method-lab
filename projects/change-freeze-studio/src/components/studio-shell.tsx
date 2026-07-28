import Link from "next/link";
import { DISPLAY_NAME } from "@/claim";

export const NAV = [
  "plants",
  "freezes",
  "windows",
  "requests",
  "violations",
  "approvals",
  "compare",
  "scoreboard",
] as const;

export function StudioShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-slate-100">
      <header className="border-b border-slate-700/70 px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link className="font-[family-name:var(--font-display)] text-xl text-yellow-400" href="/">
            {DISPLAY_NAME}
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
            {NAV.map((n) => (
              <Link key={n} href={`/${n}`}>
                {n}
              </Link>
            ))}
            <Link href="/settings">settings</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-yellow-400">
          OT change-freeze workspace
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">{title}</h1>
        {children}
      </main>
    </div>
  );
}
