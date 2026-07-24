import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  const free = scorePlan(input, "imputation_free");
  const fill = scorePlan({ ...input, plan: "impute_then_predict" }, "impute_then_predict");
  return json({ input, imputationFree: free, imputeThenPredict: fill });
}
