import { guard, json } from "@/lib/api";
import { listClassStats, upsertClassStat } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const cohortId = url.searchParams.get("cohortId") ?? undefined;
  return json({ items: listClassStats(cohortId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    cohortId?: string;
    rhythmCode?: string;
    label?: string;
    sampleCount?: number;
    prevalence?: number;
    isTail?: boolean;
  };
  if (!body.cohortId || !body.rhythmCode?.trim() || !body.label?.trim()) {
    return json({ error: "cohort_code_label_required" }, { status: 400 });
  }
  try {
    const row = upsertClassStat({
      cohortId: body.cohortId,
      rhythmCode: body.rhythmCode,
      label: body.label,
      sampleCount: body.sampleCount ?? 0,
      prevalence: body.prevalence ?? 0,
      isTail: Boolean(body.isTail),
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "upsert_failed" },
      { status: 400 },
    );
  }
}
