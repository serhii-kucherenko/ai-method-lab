import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  const localize = scorePlan(input, "classify_localize");
  const classify = scorePlan({ ...input, plan: "classify_only" }, "classify_only");
  return json({ input, classifyLocalize: localize, classifyOnly: classify });
}
