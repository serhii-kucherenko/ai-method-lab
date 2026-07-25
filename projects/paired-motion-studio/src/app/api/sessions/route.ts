import { guard, json } from "@/lib/api";
import { archiveSession, createSession, listSessions } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSessions({
      q: url.searchParams.get("q") ?? undefined,
      captureChannel: url.searchParams.get("captureChannel") ?? undefined,
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
    const session = archiveSession(body.id);
    if (!session) return json({ error: "not_found" }, { status: 404 });
    return json({ session });
  }
  const session = createSession({
    packId: body.packId,
    label: body.label,
    sessionNotes: body.sessionNotes ?? body.recipeNotes ?? "",
    lockCondition: body.lockCondition ?? "review",
    captureChannel: body.captureChannel ?? body.designChannel ?? "",
    notes: body.notes,
  });
  return json({ session }, { status: 201 });
}
