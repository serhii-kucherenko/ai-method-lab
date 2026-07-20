const state = { token: null };
const $ = (id) => document.getElementById(id);

async function api(method, path, body) {
  const headers = { "content-type": "application/json" };
  if (state.token) headers.authorization = `Bearer ${state.token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

async function auth(kind) {
  try {
    const data = await api("POST", `/auth/${kind}`, {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = `Signed in as ${data.user.email}`;
    $("flow").hidden = false;
  } catch (e) {
    $("auth-status").textContent = e.message;
  }
}

$("register").onclick = () => auth("register");
$("login").onclick = () => auth("login");

$("run").onclick = async () => {
  try {
    const domain = await api("POST", "/domains", { name: "Catalog" });
    const contract = await api("POST", `/domains/${domain.domain.id}/contracts`, {
      name: "items.v1",
      schemaJson: '{"type":"object"}',
      sloLatencyMs: 500,
    });
    let cur = (
      await api("POST", `/contracts/${contract.contract.id}/breaches`, {
        title: "p95 latency",
        latencyMs: 1200,
      })
    ).breach;
    cur = (
      await api("POST", `/breaches/${cur.id}/transition`, {
        to: "remediating",
        version: cur.version,
        remediation_note: "Added covering index",
      })
    ).breach;
    cur = (
      await api("POST", `/breaches/${cur.id}/transition`, {
        to: "closed",
        version: cur.version,
      })
    ).breach;
    $("flow-status").textContent = "Closed.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
