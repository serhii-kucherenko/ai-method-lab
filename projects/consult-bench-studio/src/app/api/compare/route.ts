import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { ConsultInput } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listCompares(page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    caseId?: string;
    overrides?: Partial<ConsultInput>;
  };
  if (!body.name?.trim() || !body.caseId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createCompare({
      name: body.name,
      caseId: body.caseId,
      overrides: body.overrides,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
