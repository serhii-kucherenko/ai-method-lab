import { DEV_TOKEN } from "@/claim";

export const API_TOKEN = DEV_TOKEN;

export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${API_TOKEN}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      typeof err === "object" && err && "error" in err
        ? String((err as { error: string }).error)
        : res.statusText,
    );
  }
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/csv") || ct.includes("text/plain")) {
    return (await res.text()) as T;
  }
  return (await res.json()) as T;
}
