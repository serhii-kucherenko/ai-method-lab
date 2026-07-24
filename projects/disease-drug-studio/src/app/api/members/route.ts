import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";
import type { MemberRole } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = (await req.json()) as { email?: string; role?: MemberRole };
  if (!body.email?.trim() || !body.role) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(inviteMember(body.email.trim(), body.role), { status: 201 });
}
