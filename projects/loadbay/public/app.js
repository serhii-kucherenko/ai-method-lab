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
    const checker = await api("POST", "/auth/register", {
      email: `chk-${Date.now()}@loadbay.local`,
      password: "demo",
    });
    const bay = await api("POST", "/bays", { name: "Demo Bay" });
    await api("POST", `/bays/${bay.bay.id}/members`, {
      userId: checker.user.id,
      role: "checker",
    });
    const dock = await api("POST", `/bays/${bay.bay.id}/docks`, {
      label: "Dock-1",
      maxWeightKg: 10000,
    });
    let cur = (
      await api("POST", `/docks/${dock.dock.id}/loads`, {
        title: "outbound",
        weightKg: 4200,
      })
    ).load;
    cur = (
      await api("POST", `/loads/${cur.id}/transition`, {
        to: "sealed",
        version: cur.version,
      })
    ).load;
    await api("POST", `/loads/${cur.id}/seal`, {});
    await fetch(`/loads/${cur.id}/seal`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${checker.token}`,
      },
    });
    cur = (
      await api("POST", `/loads/${cur.id}/transition`, {
        to: "departed",
        version: cur.version,
      })
    ).load;
    $("flow-status").textContent = "Departed after dual checker seal.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
