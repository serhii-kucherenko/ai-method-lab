import { guard, json } from "@/lib/api";
import {
  getOrg,
  inviteMember,
  listAudits,
  listMembers,
  updateOrg,
} from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  if (url.searchParams.get("view") === "members") {
    return json({ members: listMembers() });
  }
  if (url.searchParams.get("view") === "audits") {
    const page = Number(url.searchParams.get("page") ?? "1");
    return json(listAudits(page));
  }
  return json({ org: getOrg(), members: listMembers() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  try {
    if (body.action === "invite") {
      return json(inviteMember(body.email, body.role), { status: 201 });
    }
    if (body.action === "updateOrg") {
      return json(updateOrg(body.patch ?? {}));
    }
    return json({ error: "unknown_action" }, { status: 400 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
