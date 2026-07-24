import { guard, json } from "@/lib/api";
import {
  createCohort,
  listCohorts,
  paginate,
} from "@/store";

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
    organSite?: string;
    stainProtocol?: string;
    caseTags?: string[];
    slideCount?: number;
  };
  if (!body.name?.trim()) {
    return json({ error: "name_required" }, { status: 400 });
  }
  const cohort = createCohort({
    name: body.name,
    organSite: body.organSite ?? "Unknown",
    stainProtocol: body.stainProtocol ?? "H&E",
    caseTags: body.caseTags ?? [],
    slideCount: body.slideCount ?? 1,
  });
  return json(cohort, { status: 201 });
}
