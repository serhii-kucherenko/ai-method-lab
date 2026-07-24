import { guard, json } from "@/lib/api";
import {
  createIntervention,
  listInterventions,
  updateInterventionStatus,
} from "@/store";
import type { InterventionStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const siteId = url.searchParams.get("siteId") ?? undefined;
  return json({ items: listInterventions(siteId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    planId?: string;
    action?: string;
    notes?: string;
    status?: InterventionStatus;
  };
  if (!body.planId || !body.action?.trim()) {
    return json({ error: "plan_and_action_required" }, { status: 400 });
  }
  try {
    const row = createIntervention({
      planId: body.planId,
      action: body.action,
      notes: body.notes,
      status: body.status,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    id?: string;
    status?: InterventionStatus;
  };
  if (!body.id || !body.status) {
    return json({ error: "id_and_status_required" }, { status: 400 });
  }
  try {
    return json(updateInterventionStatus(body.id, body.status));
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
