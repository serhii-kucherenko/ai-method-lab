import { guard, json } from "@/lib/api";
import { getLatestSignals } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const runId = url.searchParams.get("runId") ?? undefined;
  return json(getLatestSignals(runId));
}
