import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const compare = runCompare(await req.json());
  if (!compare) return json({ error: "missing_entities" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
