import { guard, json } from "@/lib/api";
import { createPlan, exportPlansJson, listPlans, paginate } from "@/store";
import type { PlanProfile, ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    return new Response(exportPlansJson(url.searchParams.get("siteId") ?? undefined), {
      headers: { "content-type": "application/json" },
    });
  }
  const siteId = url.searchParams.get("siteId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(paginate(listPlans(siteId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    siteId?: string;
    name?: string;
    mode?: ScoreMode;
    profile?: PlanProfile;
  };
  if (!body.siteId || !body.name?.trim()) {
    return json({ error: "site_and_name_required" }, { status: 400 });
  }
  try {
    const plan = createPlan({
      siteId: body.siteId,
      name: body.name,
      mode: body.mode,
      profile: body.profile,
    });
    return json(plan, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
