import { NextResponse } from "next/server";
import { checkBearer, checkRateLimit } from "@/store";

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function unauthorized() {
  return json({ error: "unauthorized" }, { status: 401 });
}

export function tooMany() {
  return json({ error: "rate_limit", message: "Too many requests" }, { status: 429 });
}

export function guard(req: Request): NextResponse | null {
  if (!checkBearer(req.headers.get("authorization"))) {
    return unauthorized();
  }
  const rl = checkRateLimit();
  if (!rl.ok) return tooMany();
  return null;
}
