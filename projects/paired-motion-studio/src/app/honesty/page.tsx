import { CLAIM } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What Paired Motion Studio does and does not claim."
    >
      <div className="grid max-w-3xl gap-5">
        <article className="rounded-lg border border-[var(--pm-amber)] bg-[var(--studio-warn-soft)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Soft-sim only
          </h2>
          <p className="mt-3">{CLAIM}</p>
        </article>
        <ul className="space-y-3 rounded-lg border bg-white p-6">
          <li>Not live HMD fleet control.</li>
          <li>Not a production mocap suit replacement.</li>
          <li>Not Meta / Aria deployment.</li>
          <li>Not the EgoExoMoCap brand or authors&apos; system.</li>
        </ul>
        <p className="text-sm text-slate-600">
          Use results as a transparent method comparison prior; validate capture
          decisions through appropriate hardware and organizational processes.
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
