export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--jcd-muted)] leading-relaxed">
        Joint Care Desk is a method-lab experiment inspired by paper
        2607.12527 — not a replacement for the authors&apos; quadruped
        controller or commercial clinical AI vendors.
      </p>
      <p className="text-[var(--jcd-muted)] leading-relaxed">
        Soft simulation of dual-evidence pathway plans and risk deltas only. Never
        brand OrthoPilot as the product name — those labels may appear only in Sources
        / honesty copy.
      </p>
      <ul className="space-y-2 text-[var(--jcd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.12527v2">
            https://arxiv.org/abs/2607.12527v2
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--jcd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/26-joint-care-desk-lessons.md"
          >
            docs/guides/26-joint-care-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
