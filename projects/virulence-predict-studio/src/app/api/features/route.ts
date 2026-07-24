import { guard, json } from "@/lib/api";
import { getLatestFeatures, listRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const runId = url.searchParams.get("runId") ?? undefined;
  const latest = getLatestFeatures(runId);
  if (!latest) {
    const runs = listRuns();
    return json({
      run: null,
      features: null,
      availableRuns: runs
        .filter((r) => r.features)
        .map((r) => ({
          id: r.id,
          proteinLabel: r.proteinLabel,
          mode: r.mode,
        })),
    });
  }
  return json({
    run: latest.run,
    features: latest.features,
    availableRuns: listRuns()
      .filter((r) => r.features)
      .map((r) => ({
        id: r.id,
        proteinLabel: r.proteinLabel,
        mode: r.mode,
      })),
  });
}
