import { guard, json } from "@/lib/api";
import { listLeaderboard, upsertLeaderboard } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listLeaderboard(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    modelName?: string;
    promptVariant?: string;
    multimodalAvg?: number;
    textOnlyAvg?: number;
    runs?: number;
    notes?: string;
  };
  if (
    !body.modelName?.trim() ||
    !body.promptVariant?.trim() ||
    typeof body.multimodalAvg !== "number" ||
    typeof body.textOnlyAvg !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const item = upsertLeaderboard({
    modelName: body.modelName,
    promptVariant: body.promptVariant,
    multimodalAvg: body.multimodalAvg,
    textOnlyAvg: body.textOnlyAvg,
    runs: body.runs,
    notes: body.notes,
  });
  return json({ item }, { status: 201 });
}
