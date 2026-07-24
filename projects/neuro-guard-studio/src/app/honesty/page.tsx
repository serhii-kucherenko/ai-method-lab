import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this studio is — and what it is not."
    >
      <div className="max-w-2xl space-y-6 text-slate-600">
        <p>
          <strong className="text-slate-900">{DISPLAY_NAME}</strong> is a
          method-lab soft simulation of neuro-agentic IIoT defense planning with
          Counterfactual Physics Injection. It does not run live ICS control,
          does not claim TimesFM or production PLC orchestration, and is not
          branded as the paper&apos;s Neuro-Agentic Control product.
        </p>
        <p>Claim under test: {CLAIM}</p>
        <p>
          Dual score: <strong className="text-slate-900">A</strong> = neuro-agentic
          plan quality (LLM planner + CPI before act).{" "}
          <strong className="text-slate-900">B</strong> = reactive threshold
          baseline that alerts and acts without a counterfactual.
        </p>
        <p>
          Branding: never marketed as the paper system name. Inspired by the
          research pattern only.
        </p>
        <div>
          <p className="font-medium text-slate-900">Sources</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Paper:{" "}
              <a className="underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; code:{" "}
              {AUTHORS_CODE_URL ? (
                <a className="underline" href={AUTHORS_CODE_URL}>
                  {AUTHORS_CODE_URL}
                </a>
              ) : (
                "none published with the paper"
              )}
            </li>
          </ul>
        </div>
        <p>
          <Link href="/sites" className="underline">
            Back to sites
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
