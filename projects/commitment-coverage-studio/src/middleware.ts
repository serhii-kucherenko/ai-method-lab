import { NextResponse, type NextRequest } from "next/server";
import {
  checkRateLimit,
  rateLimitDeniedResponse,
  rateLimitHeaders,
} from "@/lib/rate-limit";

const MUTATING = new Set(["POST", "PATCH", "PUT", "DELETE"]);

function clientKey(req: NextRequest): string {
  const auth = req.headers.get("authorization") ?? "";
  const bearer = /^Bearer\s+(.+)$/i.exec(auth.trim())?.[1]?.trim();
  if (bearer) return `bearer:${bearer}`;
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return `ip:${fwd.split(",")[0]!.trim()}`;
  return "ip:unknown";
}

/**
 * Rate-limit every mutating /api/* request (D-11, PLT-05).
 * Pure TS Map — Edge-safe, no better-sqlite3.
 */
export function middleware(req: NextRequest) {
  if (!MUTATING.has(req.method)) {
    return NextResponse.next();
  }
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const result = checkRateLimit(clientKey(req));
  if (!result.allowed) {
    return rateLimitDeniedResponse(result);
  }

  const res = NextResponse.next();
  const headers = rateLimitHeaders(result);
  for (const [key, value] of Object.entries(headers)) {
    res.headers.set(key, value);
  }
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
