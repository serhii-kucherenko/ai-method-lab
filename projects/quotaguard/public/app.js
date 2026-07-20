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
      email: `fin-${Date.now()}@quotaguard.local`,
      password: "demo",
    });
    const org = await api("POST", "/orgs", { name: "Demo Org" });
    await api("POST", `/orgs/${org.org.id}/members`, {
      userId: peer.user.id,
      role: "finance",
    });
    const quota = await api("POST", `/orgs/${org.org.id}/quotas`, {
      label: "API",
      ceiling: 10000,
    });
    let cur = (
      await api("POST", `/quotas/${quota.quota.id}/charges`, {
        title: "usage",
        amount: 4000,
      })
    ).charge;
    cur = (
      await api("POST", `/charges/${cur.id}/transition`, {
        to: "held",
        version: cur.version,
      })
    ).charge;
    await api("POST", `/charges/${cur.id}/release`, {});
    await fetch(`/charges/${cur.id}/release`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${peer.token}`,
      },
    });
    cur = (
      await api("POST", `/charges/${cur.id}/transition`, {
        to: "released",
        version: cur.version,
      })
    ).charge;
    $("flow-status").textContent = "Released after dual finance approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
