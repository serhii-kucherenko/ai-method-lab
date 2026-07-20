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
      email: `sup-${Date.now()}@crewgate.local`,
      password: "demo",
    });
    const site = await api("POST", "/sites", {
      name: "Demo Site",
      overtimeLimitHours: 8,
    });
    await api("POST", `/sites/${site.site.id}/members`, {
      userId: peer.user.id,
      role: "supervisor",
    });
    const crew = await api("POST", `/sites/${site.site.id}/crews`, {
      name: "Crew One",
    });
    let cur = (
      await api("POST", `/crews/${crew.crew.id}/shifts`, {
        title: "overtime pour",
        hours: 10,
      })
    ).shift;
    cur = (
      await api("POST", `/shifts/${cur.id}/transition`, {
        to: "active",
        version: cur.version,
      })
    ).shift;
    await api("POST", `/shifts/${cur.id}/approve`, {});
    await fetch(`/shifts/${cur.id}/approve`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${peer.token}`,
      },
    });
    cur = (
      await api("POST", `/shifts/${cur.id}/transition`, {
        to: "closed",
        version: cur.version,
      })
    ).shift;
    $("flow-status").textContent = "Closed after dual supervisor approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
