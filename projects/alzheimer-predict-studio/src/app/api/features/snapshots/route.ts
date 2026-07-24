import { guard, json } from "@/lib/api";
import { createSnapshot, listSnapshots, type SnapshotStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const cohortId = url.searchParams.get("cohortId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSnapshots(cohortId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    cohortId?: string;
    name?: string;
    status?: SnapshotStatus;
    missingnessRate?: number;
    maskQuality?: number;
    featureCount?: number;
    notes?: string;
  };
  if (!body.cohortId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSnapshot({
        cohortId: body.cohortId,
        name: body.name,
        status: body.status,
        missingnessRate: body.missingnessRate,
        maskQuality: body.maskQuality,
        featureCount: body.featureCount,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
