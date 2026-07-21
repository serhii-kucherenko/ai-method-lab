export type SwapInput = {
  prescribed_ndc: string;
  candidate_ndc: string;
  te_code_prescribed: string;
  te_code_candidate: string;
  same_ingredient_strength_form: boolean;
  daw: number;
  brand_medically_necessary: boolean;
};

export type SwapResult = {
  allow: boolean;
  reason?: string;
};

function tePairOk(aRaw: string, bRaw: string): { ok: true } | { ok: false; reason: string } {
  const a = aRaw.toUpperCase();
  const b = bRaw.toUpperCase();
  if (!a.startsWith("A") || !b.startsWith("A")) {
    return { ok: false, reason: "te_not_substitutable" };
  }
  const abSuffix = (t: string): string | null => {
    const m = t.match(/^AB(\d*)$/);
    return m ? m[1]! : null;
  };
  const sa = abSuffix(a);
  const sb = abSuffix(b);
  if (sa !== null && sb !== null) {
    if (sa !== sb) return { ok: false, reason: "te_suffix_mismatch" };
    return { ok: true };
  }
  if (sa !== null || sb !== null) {
    return { ok: false, reason: "te_class_mismatch" };
  }
  if (a !== b) return { ok: false, reason: "te_class_mismatch" };
  return { ok: true };
}

export function evaluateSwap(input: SwapInput): SwapResult {
  if (!input.same_ingredient_strength_form) {
    return { allow: false, reason: "ingredient_strength_form" };
  }
  if (input.brand_medically_necessary) {
    return { allow: false, reason: "brand_medically_necessary" };
  }
  if ([1, 2, 6, 7, 9].includes(Number(input.daw))) {
    return { allow: false, reason: "daw_blocks" };
  }
  const te = tePairOk(input.te_code_prescribed, input.te_code_candidate);
  if (!te.ok) return { allow: false, reason: te.reason };
  return { allow: true };
}
