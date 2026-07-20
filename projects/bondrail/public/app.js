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
    const t2 = await api("POST", "/auth/register", {
      email: `t2-${Date.now()}@bondrail.local`,
      password: "demo",
    });
    const ws = await api("POST", "/workspaces", { name: "Demo Treasury" });
    await api("POST", `/workspaces/${ws.workspace.id}/members`, {
      userId: t2.user.id,
      role: "treasurer",
    });
    const bond = await api("POST", `/workspaces/${ws.workspace.id}/bonds`, {
      label: "Line-1",
      collateral: 1000,
      floor: 200,
    });
    let cur = (
      await api("POST", `/bonds/${bond.bond.id}/draws`, {
        title: "working capital",
        amount: 250,
      })
    ).draw;
    cur = (
      await api("POST", `/draws/${cur.id}/transition`, {
        to: "held",
        version: cur.version,
      })
    ).draw;
    await api("POST", `/draws/${cur.id}/release`, {});
    await fetch(`/draws/${cur.id}/release`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${t2.token}`,
      },
    });
    cur = (
      await api("POST", `/draws/${cur.id}/transition`, {
        to: "released",
        version: cur.version,
      })
    ).draw;
    $("flow-status").textContent = "Released after dual treasurer approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
