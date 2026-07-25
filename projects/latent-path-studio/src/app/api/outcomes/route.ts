import { guard, json } from "@/lib/api";
import { archiveOutcome, createOutcome, listOutcomes } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listOutcomes({
      q: url.searchParams.get("q") ?? undefined,
      outcomeChannel: url.searchParams.get("outcomeChannel") ?? undefined,
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
    const outcome = archiveOutcome(body.id);
    if (!outcome) return json({ error: "not_found" }, { status: 404 });
    return json({ outcome });
  }
  const outcome = createOutcome({
    packId: body.packId,
    label: body.label,
    captureNotes: body.captureNotes ?? "",
    lockCondition: body.lockCondition ?? "review",
    outcomeChannel: body.outcomeChannel ?? "soft_sim_latent_path",
    notes: body.notes,
  });
  return json({ outcome }, { status: 201 });
}
