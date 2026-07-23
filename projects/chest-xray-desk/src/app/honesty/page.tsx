export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--cxd-muted)] leading-relaxed">
        Chest Xray Desk is a method-lab experiment inspired by paper
        2607.09305 — not a replacement for the authors&apos; Thailand deep learning system and
        not a clinical diagnostic product. Never brand this desk as a medical
        device.
      </p>
      <p className="text-[var(--cxd-muted)] leading-relaxed">
        Soft simulation of classify to localize to clinically validate plans
        versus classification-only, localization without clinical gate, and
        unverified single-threshold alerts baselines. Display name is Chest Xray Desk only.
      </p>
      <ul className="space-y-2 text-[var(--cxd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.09305v1">
            https://arxiv.org/abs/2607.09305v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--cxd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/31-chest-xray-desk-lessons.md"
          >
            docs/guides/31-chest-xray-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
