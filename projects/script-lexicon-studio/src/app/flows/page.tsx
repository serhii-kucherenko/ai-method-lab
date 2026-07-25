import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

export type NamedFlow = {
  id: string;
  name: string;
  actor: string;
  job: string;
  steps: string[];
  success: string;
  emptyError: string;
  href: string;
  cta: string;
};

export const NAMED_FLOWS: NamedFlow[] = [
  {
    id: "create-language-pack",
    name: "Create language pack",
    actor: "NLP / localization lead",
    job: "Record the Ge'ez-script family and language assumptions for a soft-sim.",
    steps: [
      "/languages — create a pack",
      "Add version and script family",
      "Review pack status",
    ],
    success: "Language pack is listed with a version.",
    emptyError: "No packs — create the first language pack.",
    href: "/languages",
    cta: "Open languages",
  },
  {
    id: "expand-lexicon",
    name: "Expand lexicon",
    actor: "Tokenizer method scientist",
    job: "Choose languages, added subwords, and expansion weight.",
    steps: [
      "/lexicons — define expansion",
      "Set added subwords",
      "Review expansion intent",
    ],
    success: "Lexicon expansion names its languages and subword count.",
    emptyError: "Need a language pack before adding lexicons.",
    href: "/lexicons",
    cta: "Open lexicons",
  },
  {
    id: "configure-tokenizer",
    name: "Configure tokenizer",
    actor: "Localization reviewer",
    job: "Record a baseline multilingual tokenizer case and success condition.",
    steps: [
      "/tokenizers — create config",
      "Set success condition",
      "Link eval channel",
    ],
    success: "A tokenizer config records the baseline summary.",
    emptyError: "Need a language pack before adding tokenizers.",
    href: "/tokenizers",
    cta: "Open tokenizers",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B eval compare",
    actor: "Evaluation reviewer",
    job: "Compare expanded Ge'ez lexicon with baseline multilingual tokenizer.",
    steps: [
      "/evals — create an eval run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports expanded_geez_lexicon or baseline_multilingual winner and gap.",
    emptyError: "Need lexicon, tokenizer, and eval run.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "export-webhook",
    name: "Export and webhook",
    actor: "Workspace admin",
    job: "Export packs and compare results, then connect a signed webhook.",
    steps: [
      "/settings — set secret and URL",
      "Export language pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires sls-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for script-lexicon soft-sim."
    >
      <ul className="space-y-6">
        {NAMED_FLOWS.map((flow) => (
          <li
            key={flow.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
              {flow.name}
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              <span className="font-medium">actor</span>: {flow.actor}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              <span className="font-medium">job</span>: {flow.job}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              <span className="font-medium">success</span>: {flow.success}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              <span className="font-medium">emptyError</span>: {flow.emptyError}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-500">
              {flow.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <div className="mt-4">
              <Button asChild>
                <Link href={flow.href}>{flow.cta}</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
