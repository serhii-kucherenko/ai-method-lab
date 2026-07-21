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
      email: `counsel-${Date.now()}@safecase.local`,
      password: "demo",
    });
    const firm = await api("POST", "/firms", { name: "Demo Firm" });
    await api("POST", `/firms/${firm.firm.id}/members`, {
      userId: peer.user.id,
      role: "counsel",
    });
    let cur = (
      await api("POST", `/firms/${firm.firm.id}/matters`, {
        title: "Demo matter",
        retentionDays: 0,
      })
    ).matter;
    await api("POST", `/matters/${cur.id}/evidence`, { label: "note.txt" });
    cur = (
      await api("POST", `/matters/${cur.id}/transition`, {
        to: "held",
        version: cur.version,
      })
    ).matter;
    await api("POST", `/matters/${cur.id}/approve`, {});
    await fetch(`/matters/${cur.id}/approve`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${peer.token}`,
      },
    });
    cur = (
      await api("POST", `/matters/${cur.id}/transition`, {
        to: "archived",
        version: cur.version,
      })
    ).matter;
    $("flow-status").textContent = "Archived after dual counsel approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
