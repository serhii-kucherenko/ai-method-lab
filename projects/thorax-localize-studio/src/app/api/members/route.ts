import { guard, json } from "@/lib/api";
import { inviteMember, listMembers, type MemberRole } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { email?: string; role?: MemberRole };
  if (!body.email || !body.role) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(inviteMember(body.email, body.role), { status: 201 });
}
