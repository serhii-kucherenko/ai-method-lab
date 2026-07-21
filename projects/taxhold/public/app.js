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
      email: `to-${Date.now()}@taxhold.local`,
      password: "demo",
    });
    const desk = await api("POST", "/desks", { name: "Demo Desk" });
    await api("POST", `/desks/${desk.desk.id}/members`, {
      userId: peer.user.id,
      role: "tax_officer",
    });
    const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const period = await api("POST", `/desks/${desk.desk.id}/periods`, {
      label: "Q-demo",
      dueAt: past,
      lateDays: 0,
    });
    let cur = (
      await api("POST", `/periods/${period.period.id}/filings`, {
        title: "demo filing",
      })
    ).filing;
    cur = (
      await api("POST", `/filings/${cur.id}/transition`, {
        to: "held",
        version: cur.version,
      })
    ).filing;
    await api("POST", `/filings/${cur.id}/approve`, {});
    await fetch(`/filings/${cur.id}/approve`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${peer.token}`,
      },
    });
    cur = (
      await api("POST", `/filings/${cur.id}/transition`, {
        to: "filed",
        version: cur.version,
      })
    ).filing;
    $("flow-status").textContent = "Filed after dual tax officer approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
