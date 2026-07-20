const state = { token: null, userId: null };
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
    state.userId = data.user.id;
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
    const auditor = await api("POST", "/auth/register", {
      email: `auditor-${Date.now()}@policyforge.local`,
      password: "demo",
    });
    const pack = await api("POST", "/packs", { name: "Baseline" });
    await api("POST", `/packs/${pack.pack.id}/members`, {
      userId: auditor.user.id,
      role: "auditor",
    });
    const rule = await api("POST", `/packs/${pack.pack.id}/rules`, {
      name: "no-public",
      expression: "public == false",
      severityThreshold: 3,
    });
    let cur = (
      await api("POST", `/rules/${rule.rule.id}/violations`, {
        title: "public bucket",
        severity: 5,
      })
    ).violation;
    await api("POST", `/violations/${cur.id}/approve-waive`, {});
    const auditorHeaders = {
      "content-type": "application/json",
      authorization: `Bearer ${auditor.token}`,
    };
    await fetch(`/violations/${cur.id}/approve-waive`, {
      method: "POST",
      headers: auditorHeaders,
    });
    cur = (
      await api("POST", `/violations/${cur.id}/transition`, {
        to: "waived",
        version: cur.version,
      })
    ).violation;
    cur = (
      await api("POST", `/violations/${cur.id}/transition`, {
        to: "enforced",
        version: cur.version,
      })
    ).violation;
    $("flow-status").textContent = "Enforced after dual waive.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
