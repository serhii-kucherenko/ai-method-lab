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
  const body = (await req.json()) as Record<string, unknown>;
  if (typeof body.email !== "string") {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const role = (typeof body.role === "string" ? body.role : "viewer") as MemberRole;
  return json(inviteMember(body.email, role));
}
