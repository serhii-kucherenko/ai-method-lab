const state = { token: null, shift: null };
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
  $("shift-view").textContent = state.shift
    ? JSON.stringify(state.shift, null, 2)
    : "";
  $("fill").disabled = !(state.shift && state.shift.state === "open");
  $("complete").disabled = !(state.shift && state.shift.state === "filled");
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
    const data = await api("POST", "/shifts", { title: $("title").value });
    state.shift = data.shift;
    $("flow-status").textContent = "Opened.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("fill").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/shifts/${state.shift.id}/transition`, {
      to: "filled",
      version: state.shift.version,
    });
    state.shift = data.shift;
    $("flow-status").textContent = "Filled.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("complete").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/shifts/${state.shift.id}/transition`, {
      to: "completed",
      version: state.shift.version,
    });
    state.shift = data.shift;
    $("flow-status").textContent = "Completed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
