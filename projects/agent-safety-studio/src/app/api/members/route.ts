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
  if (!body.email?.trim()) {
    return json({ error: "email_required" }, { status: 400 });
  }
  const member = inviteMember(body.email.trim(), body.role ?? "viewer");
  return json(member, { status: 201 });
}
