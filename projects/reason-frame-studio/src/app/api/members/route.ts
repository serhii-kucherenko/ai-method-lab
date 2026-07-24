import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";
import type { MemberRole } from "@/store";

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
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const item = inviteMember(body.email, body.role ?? "reader");
  return json({ item }, { status: 201 });
}
