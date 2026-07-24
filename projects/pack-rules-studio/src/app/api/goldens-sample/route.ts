import { guard, json } from "@/lib/api";
import { sampleGoldenInput } from "@/store";
import { scorePrefsOnly, scoreRulesPrefs } from "@/domain/pack";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    rulesPrefs: scoreRulesPrefs(input),
    prefsOnly: scorePrefsOnly(input),
  });
}
