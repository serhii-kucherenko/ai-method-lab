import { guard, json } from "@/lib/api";
import {
  createRun,
  exportRunsJson,
  listRuns,
  paginate,
} from "@/store";
import type { PlanInput, PlanProfile, ScoreMode } from "@/domain/types";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    const domainId = url.searchParams.get("domainId") ?? undefined;
    return new Response(exportRunsJson(domainId ?? undefined), {
      headers: { "content-type": "application/json" },
    });
  }
  const domainId = url.searchParams.get("domainId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listRuns(domainId ?? undefined), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    domainId?: string;
    mode?: ScoreMode;
    profile?: PlanProfile;
    domainLabel?: string;
    planInput?: Partial<PlanInput>;
  };
  if (!body.domainId) {
    return json({ error: "domain_required" }, { status: 400 });
  }
  try {
    const run = createRun({
      domainId: body.domainId,
      mode: body.mode,
      profile: body.profile,
      domainLabel: body.domainLabel,
      planInput: body.planInput,
    });
    return json(run, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}
