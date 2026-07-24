import { guard, json } from "@/lib/api";
import { advanceRun, createRun, listRuns, paginate } from "@/store";
import type { GenerationInput, GenerationMode, TrainingProfile } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const programId = url.searchParams.get("programId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listRuns(programId), page, pageSize));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = (await req.json()) as {
    programId?: string;
    mode?: GenerationMode;
    profile?: TrainingProfile;
    generationInput?: Partial<GenerationInput>;
    action?: "create" | "advance";
    runId?: string;
  };

  if (body.action === "advance") {
    if (!body.runId) return json({ error: "invalid_body" }, { status: 400 });
    try {
      return json(advanceRun(body.runId));
    } catch (e) {
      return json(
        { error: e instanceof Error ? e.message : "advance_failed" },
        { status: 400 },
      );
    }
  }

  if (!body.programId) return json({ error: "invalid_body" }, { status: 400 });
  try {
    const run = createRun({
      programId: body.programId,
      mode: body.mode,
      profile: body.profile,
      generationInput: body.generationInput,
    });
    return json(run, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "create_failed" },
      { status: 400 },
    );
  }
}
