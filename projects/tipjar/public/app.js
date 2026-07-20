const state = { token: null, tip: null };
const $ = (id) => document.getElementById(id);

async function api(method, path, body) {
  const headers = { "content-type": "application/json" };
  if (state.token) headers.authorization = `Bearer ${state.token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? {} : await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function showClip() {
  $("tip-view").textContent = state.tip
    ? JSON.stringify(state.tip, null, 2)
    : "";
  $("collect").disabled = !(state.tip && state.tip.state === "pledged");
  $("thank").disabled = !(state.tip && state.tip.state === "collected");
}

$("register").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/auth/register", {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = "Registered.";
    $("flow").hidden = false;
  } catch (err) {
    $("auth-status").textContent = String(err.message || err);
  }
});

$("login").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/auth/login", {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = "Logged in.";
    $("flow").hidden = false;
  } catch (err) {
    $("auth-status").textContent = String(err.message || err);
  }
});

$("create").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/tips", { title: $("title").value });
    state.tip = data.tip;
    $("flow-status").textContent = "Pledged.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("collect").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/tips/${state.tip.id}/transition`, {
      to: "collected",
      version: state.tip.version,
    });
    state.tip = data.tip;
    $("flow-status").textContent = "Collected.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("thank").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/tips/${state.tip.id}/transition`, {
      to: "thanked",
      version: state.tip.version,
    });
    state.tip = data.tip;
    $("flow-status").textContent = "Thankd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
