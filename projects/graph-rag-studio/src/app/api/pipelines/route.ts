import { guard, json } from "@/lib/api";
import {
  advancePipeline,
  createPipeline,
  listPipelines,
  paginate,
} from "@/store";
import type { ConstructionProfile } from "@/domain/types";

export function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const corpusId = url.searchParams.get("corpusId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listPipelines(corpusId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    corpusId?: string;
    profile?: ConstructionProfile;
  };
  if (!body.corpusId) {
    return json({ error: "corpusId_required" }, { status: 400 });
  }
  try {
    const run = createPipeline({
      corpusId: body.corpusId,
      profile: body.profile,
    });
    return json(run, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return json({ error: msg }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { id?: string; action?: string };
  if (!body.id || body.action !== "advance") {
    return json({ error: "invalid_action" }, { status: 400 });
  }
  try {
    return json(advancePipeline(body.id));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "illegal_stage_advance" ? 409 : 400;
    return json({ error: msg }, { status });
  }
}
