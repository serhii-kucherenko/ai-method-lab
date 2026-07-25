import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Track Map Studio — read before locking a pack."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          This product is a method-lab soft-sim bench. It does not claim live
          robot control, clinical diagnostic use, or FDA clearance.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not live robot control or intraoperative guidance</li>
          <li>Not clinical diagnostic use</li>
          <li>Not FDA cleared</li>
          <li>Not Track2Map and not the authors&apos; system</li>
          <li>Not a substitute for kinematics validation on hardware</li>
        </ul>
        <p>
          Dual scorers are soft-sim proxies:{" "}
          <code>online_deformable_slam</code> vs{" "}
          <code>offline_kinematics_prior_baseline</code>.
        </p>
        <p>
          Paper:{" "}
          <a className="underline text-[var(--tm-teal)]" href={PAPER_URL}>
            arXiv 2607.08408
          </a>{" "}
          · authors&apos; code: none published
        </p>
        <p>
          <Link href="/tracks" className="underline text-[var(--tm-teal)]">
            Back to tracks
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
