export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--hsd-muted)] leading-relaxed">
        Heart Scan Desk is a method-lab experiment inspired by paper
        2607.11287 — not a replacement for the authors&apos; foundation model and
        not a clinical diagnostic product. Never brand this desk as a medical
        device.
      </p>
      <p className="text-[var(--hsd-muted)] leading-relaxed">
        Soft simulation of unified cardiac CT segmentation+phenotyping plans
        versus segmentation-only, phenotype-from-raw-pixels-only, and
        single-center unchecked baselines. Display name is Heart Scan Desk only.
      </p>
      <ul className="space-y-2 text-[var(--hsd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.11287v1">
            https://arxiv.org/abs/2607.11287v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--hsd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/30-heart-scan-desk-lessons.md"
          >
            docs/guides/30-heart-scan-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
