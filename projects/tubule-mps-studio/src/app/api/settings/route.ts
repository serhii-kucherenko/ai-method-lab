import { guard, json } from "@/lib/api";
import { getOrg, listAudits, listMembers, updateOrg } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({
    org: getOrg(),
    members: listMembers(),
    audits: listAudits(),
  });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (body.action === "update_org") {
    return json(
      updateOrg({
        name: typeof body.name === "string" ? body.name : undefined,
        webhookUrl:
          typeof body.webhookUrl === "string" ? body.webhookUrl : undefined,
        rateLimitPerMinute:
          typeof body.rateLimitPerMinute === "number"
            ? body.rateLimitPerMinute
            : undefined,
      }),
    );
  }
  return json({ error: "invalid_action" }, { status: 400 });
}
