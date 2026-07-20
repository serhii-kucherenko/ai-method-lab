const state = { token: null, desk: null };
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
  $("desk-view").textContent = state.desk
    ? JSON.stringify(state.desk, null, 2)
    : "";
  $("occupy").disabled = !(state.desk && state.desk.state === "open");
  $("clear").disabled = !(state.desk && state.desk.state === "occupied");
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
    const data = await api("POST", "/desks", { title: $("title").value });
    state.desk = data.desk;
    $("flow-status").textContent = "Opened.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("occupy").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/desks/${state.desk.id}/transition`, {
      to: "occupied",
      version: state.desk.version,
    });
    state.desk = data.desk;
    $("flow-status").textContent = "Occupyed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("clear").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/desks/${state.desk.id}/transition`, {
      to: "cleared",
      version: state.desk.version,
    });
    state.desk = data.desk;
    $("flow-status").textContent = "Cleard.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
