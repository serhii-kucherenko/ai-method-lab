import { guard, json } from "@/lib/api";
import {
  createRun,
  exportRunsJson,
  listRuns,
  paginate,
} from "@/store";
import type { DeployInput, DeployProfile, ScoreMode } from "@/domain/types";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    const appId = url.searchParams.get("appId") ?? undefined;
    return new Response(exportRunsJson(appId ?? undefined), {
      headers: { "content-type": "application/json" },
    });
  }
  const appId = url.searchParams.get("appId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listRuns(appId ?? undefined), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    appId?: string;
    mode?: ScoreMode;
    profile?: DeployProfile;
    appLabel?: string;
    deployInput?: Partial<DeployInput>;
  };
  if (!body.appId) {
    return json({ error: "app_required" }, { status: 400 });
  }
  try {
    const run = createRun({
      appId: body.appId,
      mode: body.mode,
      profile: body.profile,
      appLabel: body.appLabel,
      deployInput: body.deployInput,
    });
    return json(run, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}
