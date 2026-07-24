import { guard, json } from "@/lib/api";
import { inviteMember, listMembers, paginate } from "@/store";
import type { MemberRole } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(paginate(listMembers(), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { email?: string; role?: MemberRole };
  if (!body.email?.trim()) {
    return json({ error: "email_required" }, { status: 400 });
  }
  const member = inviteMember(body.email, body.role ?? "viewer");
  return json(member, { status: 201 });
}
