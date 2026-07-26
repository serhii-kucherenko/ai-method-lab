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
  const body = (await req.json()) as Record<string, unknown>;
  if (typeof body.email !== "string") {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const role =
    body.role === "owner" || body.role === "evaluator" || body.role === "viewer"
      ? (body.role as MemberRole)
      : "viewer";
  return json(inviteMember(body.email, role));
}
