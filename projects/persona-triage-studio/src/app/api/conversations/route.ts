import { guard, json } from "@/lib/api";
import { createConversation, listConversations } from "@/store";
import type { UrgencyLevel } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listConversations({
      q: url.searchParams.get("q") ?? undefined,
      specialty: url.searchParams.get("specialty") ?? undefined,
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
  const conversation = createConversation({
    packId: body.packId ? String(body.packId) : undefined,
    label: String(body.label ?? "Untitled conversation"),
    clinicalContent: String(body.clinicalContent ?? ""),
    goldUrgency: (body.goldUrgency as UrgencyLevel) ?? "primary_care",
    specialty: String(body.specialty ?? "urgent_care"),
    notes: body.notes ? String(body.notes) : "",
  });
  return json({ conversation }, { status: 201 });
}
