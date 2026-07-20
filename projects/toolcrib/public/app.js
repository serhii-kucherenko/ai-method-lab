const state = { token: null, tool: null };
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
  $("tool-view").textContent = state.tool
    ? JSON.stringify(state.tool, null, 2)
    : "";
  $("checkout").disabled = !(state.tool && state.tool.state === "available");
  $("checkin").disabled = !(state.tool && state.tool.state === "checked_out");
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
    const data = await api("POST", "/tools", { title: $("title").value });
    state.tool = data.tool;
    $("flow-status").textContent = "Stocked.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("checkout").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/tools/${state.tool.id}/transition`, {
      to: "checked_out",
      version: state.tool.version,
    });
    state.tool = data.tool;
    $("flow-status").textContent = "Checkouted.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("checkin").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/tools/${state.tool.id}/transition`, {
      to: "returned",
      version: state.tool.version,
    });
    state.tool = data.tool;
    $("flow-status").textContent = "Checkind.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
