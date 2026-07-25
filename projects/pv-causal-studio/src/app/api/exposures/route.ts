import { guard, json } from "@/lib/api";
import { archiveExposure, createExposure, listExposures } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listExposures({
      q: url.searchParams.get("q") ?? undefined,
      signalChannel: url.searchParams.get("signalChannel") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const exposure = archiveExposure(body.id);
    if (!exposure) return json({ error: "not_found" }, { status: 404 });
    return json({ exposure });
  }
  const exposure = createExposure({
    packId: body.packId,
    label: body.label,
    regimen: body.regimen ?? body.recipe ?? "",
    lockCondition: body.lockCondition,
    signalChannel:
      body.signalChannel ?? "soft_sim_pv_causal_signal",
    notes: body.notes,
  });
  return json({ exposure }, { status: 201 });
}
