import { guard, json } from "@/lib/api";
import {
  createRun,
  exportRunsJson,
  listRuns,
  paginate,
} from "@/store";
import type { EmbedInput, EmbedMode, EmbedProfile } from "@/domain/types";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    return new Response(exportRunsJson(url.searchParams.get("cohortId") ?? undefined), {
      headers: { "content-type": "application/json" },
    });
  }
  const cohortId = url.searchParams.get("cohortId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listRuns(cohortId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    cohortId?: string;
    mode?: EmbedMode;
    profile?: EmbedProfile;
    slideLabel?: string;
    embedInput?: Partial<EmbedInput>;
  };
  if (!body.cohortId) {
    return json({ error: "cohort_required" }, { status: 400 });
  }
  try {
    const run = createRun({
      cohortId: body.cohortId,
      mode: body.mode,
      profile: body.profile,
      slideLabel: body.slideLabel,
      embedInput: body.embedInput,
    });
    return json(run, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "create_failed" },
      { status: 400 },
    );
  }
}
