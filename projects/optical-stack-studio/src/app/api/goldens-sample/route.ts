import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  const open = scorePlan(input, "open_vocab");
  const catalog = scorePlan(
    { ...input, plan: "catalog_only" },
    "catalog_only",
  );
  return json({ input, open, catalog });
}
