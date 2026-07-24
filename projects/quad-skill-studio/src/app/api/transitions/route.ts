import { guard, json } from "@/lib/api";
import {
  createTransition,
  listTransitions,
  type SkillKind,
  type TransitionStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listTransitions(
      url.searchParams.get("robotId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    robotId?: string;
    name?: string;
    fromSkill?: SkillKind;
    toSkill?: SkillKind;
    status?: TransitionStatus;
    smoothness?: number;
    notes?: string;
  };
  if (!body.robotId || !body.name || !body.fromSkill || !body.toSkill) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createTransition({
        robotId: body.robotId,
        name: body.name,
        fromSkill: body.fromSkill,
        toSkill: body.toSkill,
        status: body.status,
        smoothness: body.smoothness,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
