import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";
import type { MemberRole } from "@/store";

export function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ members: listMembers() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { email?: string; role?: MemberRole };
  if (!body.email) return json({ error: "email_required" }, { status: 400 });
  const role = body.role ?? "analyst";
  return json(inviteMember(body.email, role), { status: 201 });
}
