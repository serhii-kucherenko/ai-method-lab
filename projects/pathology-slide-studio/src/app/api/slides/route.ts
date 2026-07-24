import { guard, json } from "@/lib/api";
import { createSlide, listSlides, paginate } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const cohortId = url.searchParams.get("cohortId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listSlides(cohortId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    cohortId?: string;
    label?: string;
    magnification?: string;
    patchCount?: number;
    notes?: string;
  };
  if (!body.cohortId || !body.label?.trim()) {
    return json({ error: "cohort_and_label_required" }, { status: 400 });
  }
  try {
    const slide = createSlide({
      cohortId: body.cohortId,
      label: body.label,
      magnification: body.magnification ?? "20x",
      patchCount: body.patchCount ?? 1,
      notes: body.notes,
    });
    return json(slide, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "create_failed" },
      { status: 400 },
    );
  }
}
