/** Soft-sim Bearer client. Matches DEMO_BEARER_TOKEN default in auth.ts. */
const DEMO_BEARER_TOKEN = "ccs-demo-token";

export function getApiToken(): string {
  return (
    process.env.NEXT_PUBLIC_CCS_API_TOKEN ??
    process.env.CCS_API_TOKEN ??
    DEMO_BEARER_TOKEN
  );
}

export type ApiFetchOptions = RequestInit & {
  searchParams?: Record<string, string | undefined | null>;
};

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { searchParams, headers: initHeaders, ...rest } = options;
  let url = path.startsWith("/") ? path : `/${path}`;
  if (searchParams) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value != null && value !== "") qs.set(key, value);
    }
    const encoded = qs.toString();
    if (encoded) url += (url.includes("?") ? "&" : "?") + encoded;
  }
  const headers = new Headers(initHeaders);
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${getApiToken()}`);
  }
  return fetch(url, { ...rest, headers });
}

export async function apiJson<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string }> {
  try {
    const res = await apiFetch(path, options);
    let body: unknown = null;
    const text = await res.text();
    if (text) {
      try {
        body = JSON.parse(text) as unknown;
      } catch {
        body = { message: text };
      }
    }
    if (!res.ok) {
      const message =
        body &&
        typeof body === "object" &&
        "message" in body &&
        typeof (body as { message: unknown }).message === "string"
          ? (body as { message: string }).message
          : `Request failed (${res.status}) — soft-sim lab desk`;
      return { ok: false, status: res.status, message };
    }
    return { ok: true, data: body as T };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error — soft-sim desk unreachable",
    };
  }
}
