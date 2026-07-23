/**
 * Paper toy checker for Employer Shared Responsibility Desk (research only).
 * Hardcoded illustrative APA — not product code, not live IRS amounts.
 */
const TOY_YEAR_APA_A_ANNUAL = 3340; // ILLUSTRATIVE toy-year constant
const TOY_YEAR_APA_B_ANNUAL = 5010; // ILLUSTRATIVE toy-year constant
const MONTHLY_A = TOY_YEAR_APA_A_ANNUAL / 12;
const MONTHLY_B = TOY_YEAR_APA_B_ANNUAL / 12;

function monthPayment({ fte, offerAdequate, ptcFte }) {
  if (ptcFte <= 0) return 0;
  const aCap = Math.max(0, fte - 30) * MONTHLY_A;
  if (!offerAdequate) return aCap;
  return Math.min(ptcFte * MONTHLY_B, aCap);
}

const toys = [
  {
    id: "NoOffer80",
    months: [{ fte: 80, offerAdequate: false, ptcFte: 1 }],
    expect: (80 - 30) * MONTHLY_A,
  },
  {
    id: "OfferB10",
    months: [{ fte: 100, offerAdequate: true, ptcFte: 10 }],
    expect: 10 * MONTHLY_B,
  },
  {
    id: "CapBinds40",
    months: [{ fte: 50, offerAdequate: true, ptcFte: 40 }],
    expect: (50 - 30) * MONTHLY_A,
  },
  {
    id: "SafeOfferZero",
    months: [{ fte: 90, offerAdequate: true, ptcFte: 0 }],
    expect: 0,
  },
  {
    id: "MonthWalkMixed",
    months: [
      { fte: 60, offerAdequate: false, ptcFte: 1 },
      { fte: 60, offerAdequate: true, ptcFte: 8 },
    ],
    expect: (60 - 30) * MONTHLY_A + 8 * MONTHLY_B,
  },
  {
    id: "ForgetMinus30",
    months: [{ fte: 80, offerAdequate: false, ptcFte: 1 }],
    expect: (80 - 30) * MONTHLY_A,
  },
];

function near(a, b) {
  return Math.abs(a - b) < 1e-6;
}

let failed = 0;
for (const toy of toys) {
  const got = toy.months.reduce((sum, m) => sum + monthPayment(m), 0);
  if (!near(got, toy.expect)) {
    failed += 1;
    console.error("FAIL", toy.id, { got, expect: toy.expect });
  } else {
    console.log("OK", toy.id, `dollars=${got}`);
  }
}

if (failed) {
  console.error(`employer-shared-responsibility-desk toys: ${failed} failure(s)`);
  process.exit(1);
}
console.log(
  `employer-shared-responsibility-desk toys: ${toys.length} green (illustrative APA A=${TOY_YEAR_APA_A_ANNUAL} B=${TOY_YEAR_APA_B_ANNUAL})`,
);
