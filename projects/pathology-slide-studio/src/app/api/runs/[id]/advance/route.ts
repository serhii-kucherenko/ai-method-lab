import { guard, json } from "@/lib/api";
import { advanceRun } from "@/store";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = guard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    return json(advanceRun(id));
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "advance_failed" },
      { status: 400 },
    );
  }
}
