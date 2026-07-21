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
    const h2 = await api("POST", "/auth/register", {
      email: `hr2-${Date.now()}@payclaw.local`,
      password: "demo",
    });
    const firm = await api("POST", "/firms", { name: "Demo Firm" });
    await api("POST", `/firms/${firm.firm.id}/members`, {
      userId: h2.user.id,
      role: "hr_lead",
    });
    const run = await api("POST", `/firms/${firm.firm.id}/runs`, {
      label: "Demo Run",
      owed: 1000,
      paid: 1250,
    });
    let cur = (
      await api("POST", `/runs/${run.run.id}/clawbacks`, {
        title: "overpay recovery",
        amount: 200,
      })
    ).clawback;
    cur = (
      await api("POST", `/clawbacks/${cur.id}/transition`, {
        to: "held",
        version: cur.version,
      })
    ).clawback;
    await api("POST", `/clawbacks/${cur.id}/release`, {});
    await fetch(`/clawbacks/${cur.id}/release`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${h2.token}`,
      },
    });
    cur = (
      await api("POST", `/clawbacks/${cur.id}/transition`, {
        to: "released",
        version: cur.version,
      })
    ).clawback;
    $("flow-status").textContent = "Released after dual HR approval.";
    $("view").textContent = JSON.stringify(cur, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
