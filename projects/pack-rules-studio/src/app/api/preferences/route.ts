import { guard, json } from "@/lib/api";
import { createPreference, listPreferences } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listPreferences(profileId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createPreference(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
