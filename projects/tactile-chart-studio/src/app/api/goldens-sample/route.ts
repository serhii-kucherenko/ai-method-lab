import { guard, json } from "@/lib/api";
import { sampleGoldenInput } from "@/store";
import { scoreTactile, scoreVisual } from "@/domain/tactile";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    tactile: scoreTactile(input),
    visual: scoreVisual(input),
  });
}
