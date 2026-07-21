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
    const c2 = await api("POST", "/auth/register", {
      email: `c2-${Date.now()}@captable.local`,
      password: "demo",
    });
    const firm = await api("POST", "/firms", { name: "Demo Firm" });
    await api("POST", `/firms/${firm.firm.id}/members`, {
      userId: c2.user.id,
      role: "counsel",
    });
    const round = await api("POST", `/firms/${firm.firm.id}/rounds`, {
      label: "Series Seed",
      authorized: 1000,
    });
    let cur = (
      await api("POST", `/rounds/${round.round.id}/allocations`, {
        title: "founder pool",
        shares: 250,
      })
    ).allocation;
    cur = (
      await api("POST", `/allocations/${cur.id}/transition`, {
        to: "held",
        version: cur.version,
      })
    ).allocation;
    await api("POST", `/allocations/${cur.id}/close`, {});
    await fetch(`/allocations/${cur.id}/close`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${c2.token}`,
      },
    });
    cur = (
      await api("POST", `/allocations/${cur.id}/transition`, {
        to: "closed",
        version: cur.version,
      })
    ).allocation;
    $("flow-status").textContent = "Closed after dual counsel approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
