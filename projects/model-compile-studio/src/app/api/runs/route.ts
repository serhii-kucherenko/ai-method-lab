import { guard, json } from "@/lib/api";
import {
  createRun,
  exportRunsJson,
  listRuns,
  paginate,
} from "@/store";
import type { CompileInput, CompileMode, CompileProfile } from "@/domain/types";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    return new Response(
      exportRunsJson(url.searchParams.get("modelId") ?? undefined),
      { headers: { "content-type": "application/json" } },
    );
  }
  const modelId = url.searchParams.get("modelId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listRuns(modelId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    modelId?: string;
    targetId?: string;
    mode?: CompileMode;
    profile?: CompileProfile;
    modelLabel?: string;
    compileInput?: Partial<CompileInput>;
  };
  if (!body.modelId || !body.targetId) {
    return json({ error: "model_and_target_required" }, { status: 400 });
  }
  try {
    const run = createRun({
      modelId: body.modelId,
      targetId: body.targetId,
      mode: body.mode,
      profile: body.profile,
      modelLabel: body.modelLabel,
      compileInput: body.compileInput,
    });
    return json(run, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "create_failed" },
      { status: 400 },
    );
  }
}
