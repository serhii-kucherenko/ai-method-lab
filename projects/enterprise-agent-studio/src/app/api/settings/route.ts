import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";
import type { OrgSettings } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function PUT(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Partial<OrgSettings>;
  return json(updateOrg(body));
}
