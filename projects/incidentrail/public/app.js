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
    const room = await api("POST", "/rooms", { name: "Primary" });
    let cur = (
      await api("POST", `/rooms/${room.room.id}/incidents`, {
        title: "Latency spike",
        severity: 3,
      })
    ).incident;
    cur = (
      await api("POST", `/incidents/${cur.id}/transition`, {
        to: "mitigating",
        version: cur.version,
      })
    ).incident;
    const action = await api("POST", `/incidents/${cur.id}/actions`, {
      title: "Scale up",
    });
    await api("POST", `/actions/${action.action.id}/complete`, {});
    cur = (
      await api("POST", `/incidents/${cur.id}/transition`, {
        to: "resolved",
        version: cur.version,
      })
    ).incident;
    cur = (
      await api("POST", `/incidents/${cur.id}/transition`, {
        to: "closed",
        version: cur.version,
      })
    ).incident;
    $("flow-status").textContent = "Closed.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
