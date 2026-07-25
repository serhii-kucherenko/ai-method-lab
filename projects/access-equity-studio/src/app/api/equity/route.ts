import { guard, json } from "@/lib/api";
import {
  archiveEquityGate,
  createAccessRun,
  createEquityGate,
  listAccessRuns,
  listEquityGates,
} from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  if (url.searchParams.get("runs") === "1") {
    return json(listAccessRuns({
      equityGateId: url.searchParams.get("equityGateId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }));
  }
  return json(listEquityGates({
    q: url.searchParams.get("q") ?? undefined,
    equityChannel: url.searchParams.get("equityChannel") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    packId: url.searchParams.get("packId") ?? undefined,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 20),
  }));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const gate = archiveEquityGate(body.id);
    if (!gate) return json({ error: "not_found" }, { status: 404 });
    return json({ gate });
  }
  if (body.action === "run") {
    const run = createAccessRun({
      equityGateId: body.equityGateId,
      cohortId: body.cohortId,
      screenId: body.screenId,
      pathwayId: body.pathwayId,
      accessReach: Number(body.accessReach ?? 0.6),
      equityGapClosure: Number(body.equityGapClosure ?? 0.6),
      taskSharingFidelity: Number(body.taskSharingFidelity ?? 0.6),
      packReadiness: Number(body.packReadiness ?? 0.6),
      runNotes: body.runNotes,
    });
    if (!run) return json({ error: "refs_not_found" }, { status: 400 });
    return json({ run }, { status: 201 });
  }
  const gate = createEquityGate({
    packId: body.packId,
    label: body.label,
    gateNotes: body.gateNotes ?? "",
    lockCondition: body.lockCondition ?? "review",
    equityChannel: body.equityChannel ?? "soft_sim_access_equity",
    notes: body.notes,
  });
  return json({ gate }, { status: 201 });
}
