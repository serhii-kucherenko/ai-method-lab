import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  return json(listAudits(page));
}
