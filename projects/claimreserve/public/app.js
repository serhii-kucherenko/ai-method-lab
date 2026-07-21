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
    const a2 = await api("POST", "/auth/register", {
      email: `a2-${Date.now()}@claimreserve.local`,
      password: "demo",
    });
    const desk = await api("POST", "/desks", { name: "Demo Desk" });
    await api("POST", `/desks/${desk.desk.id}/members`, {
      userId: a2.user.id,
      role: "adjuster",
    });
    const policy = await api("POST", `/desks/${desk.desk.id}/policies`, {
      label: "Demo Policy",
      reserveCeiling: 1000,
    });
    let cur = (
      await api("POST", `/policies/${policy.policy.id}/claims`, {
        title: "demo loss",
        reserveAmount: 350,
      })
    ).claim;
    cur = (
      await api("POST", `/claims/${cur.id}/transition`, {
        to: "held",
        version: cur.version,
      })
    ).claim;
    await api("POST", `/claims/${cur.id}/settle`, {});
    await fetch(`/claims/${cur.id}/settle`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${a2.token}`,
      },
    });
    cur = (
      await api("POST", `/claims/${cur.id}/transition`, {
        to: "settled",
        version: cur.version,
      })
    ).claim;
    $("flow-status").textContent = "Settled after dual adjuster approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
