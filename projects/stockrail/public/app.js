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
    const peer = await api("POST", "/auth/register", {
      email: `mgr-${Date.now()}@stockrail.local`,
      password: "demo",
    });
    const st = await api("POST", "/stores", { name: "Demo Store" });
    await api("POST", `/stores/${st.store.id}/members`, {
      userId: peer.user.id,
      role: "manager",
    });
    const sku = await api("POST", `/stores/${st.store.id}/skus`, {
      code: "DEMO-1",
      qty: 20,
    });
    let cur = (
      await api("POST", `/skus/${sku.sku.id}/adjustments`, {
        title: "cycle count",
        delta: -2,
      })
    ).adjustment;
    cur = (
      await api("POST", `/adjustments/${cur.id}/transition`, {
        to: "staged",
        version: cur.version,
      })
    ).adjustment;
    await api("POST", `/adjustments/${cur.id}/approve`, {});
    await fetch(`/adjustments/${cur.id}/approve`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${peer.token}`,
      },
    });
    cur = (
      await api("POST", `/adjustments/${cur.id}/transition`, {
        to: "applied",
        version: cur.version,
      })
    ).adjustment;
    $("flow-status").textContent = "Applied after dual manager approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
