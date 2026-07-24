import { guard, json } from "@/lib/api";
import { createCohort, listCohorts, paginate } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listCohorts(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    source?: string;
    leadCount?: number;
    hoursRecorded?: number;
    subjectCount?: number;
    tags?: string[];
  };
  if (!body.name?.trim()) {
    return json({ error: "name_required" }, { status: 400 });
  }
  const cohort = createCohort({
    name: body.name,
    source: body.source ?? "unspecified",
    leadCount: body.leadCount ?? 1,
    hoursRecorded: body.hoursRecorded ?? 1,
    subjectCount: body.subjectCount ?? 1,
    tags: body.tags ?? [],
  });
  return json(cohort, { status: 201 });
}
