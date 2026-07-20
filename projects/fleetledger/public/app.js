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
    const mechanic = await api("POST", "/auth/register", {
      email: `mech-${Date.now()}@fleetledger.local`,
      password: "demo",
    });
    const fleet = await api("POST", "/fleets", { name: "Demo Yard" });
    await api("POST", `/fleets/${fleet.fleet.id}/members`, {
      userId: mechanic.user.id,
      role: "mechanic",
    });
    const asset = await api("POST", `/fleets/${fleet.fleet.id}/assets`, {
      label: "Van-7",
      serviceIntervalHours: 100,
    });
    let cur = (
      await api("POST", `/assets/${asset.asset.id}/work-orders`, {
        title: "interval overdue",
        hoursDue: 180,
      })
    ).workOrder;
    cur = (
      await api("POST", `/work-orders/${cur.id}/transition`, {
        to: "parts",
        version: cur.version,
      })
    ).workOrder;
    await api("POST", `/work-orders/${cur.id}/sign-off`, {});
    await fetch(`/work-orders/${cur.id}/sign-off`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${mechanic.token}`,
      },
    });
    cur = (
      await api("POST", `/work-orders/${cur.id}/transition`, {
        to: "closed",
        version: cur.version,
      })
    ).workOrder;
    $("flow-status").textContent = "Closed after dual mechanic sign-off.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
