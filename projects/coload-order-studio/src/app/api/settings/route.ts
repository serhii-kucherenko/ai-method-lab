import { guard, json } from "@/lib/api";
import { getOrg, listAudits, listMembers, updateOrg } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({
    org: getOrg(),
    members: listMembers(),
    audits: listAudits(),
  });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "updateOrg") {
    return json({ org: updateOrg(body.org ?? body) });
  }
  return json({ error: "unknown_action" }, { status: 400 });
}
