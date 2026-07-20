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
    const o2 = await api("POST", "/auth/register", {
      email: `ro2-${Date.now()}@riskhold.local`,
      password: "demo",
    });
    const book = await api("POST", "/books", { name: "Demo Book" });
    await api("POST", `/books/${book.book.id}/members`, {
      userId: o2.user.id,
      role: "risk_officer",
    });
    let pos = (
      await api("POST", `/books/${book.book.id}/positions`, {
        label: "EQ-1",
        exposure: 2500,
        riskLimit: 1000,
      })
    ).position;
    pos = (
      await api("POST", `/positions/${pos.id}/transition`, {
        to: "held",
        version: pos.version,
      })
    ).position;
    await api("POST", `/positions/${pos.id}/clear`, {});
    await fetch(`/positions/${pos.id}/clear`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${o2.token}`,
      },
    });
    pos = (
      await api("POST", `/positions/${pos.id}/transition`, {
        to: "cleared",
        version: pos.version,
      })
    ).position;
    $("flow-status").textContent = "Cleared after dual risk officer approval.";
    $("view").textContent = JSON.stringify(pos, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
