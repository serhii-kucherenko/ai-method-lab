import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    examId?: string;
  };
  if (!body.name || !body.examId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({ name: body.name, examId: body.examId }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
