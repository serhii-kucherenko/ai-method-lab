const state = { token: null, pass: null };
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
  $("pass-view").textContent = state.pass
    ? JSON.stringify(state.pass, null, 2)
    : "";
  $("approve").disabled = !(state.pass && state.pass.state === "requested");
  $("check_in").disabled = !(state.pass && state.pass.state === "approved");
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
    const data = await api("POST", "/passes", { title: $("title").value });
    state.pass = data.pass;
    $("flow-status").textContent = "Requested.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("approve").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/passes/${state.pass.id}/transition`, {
      to: "approved",
      version: state.pass.version,
    });
    state.pass = data.pass;
    $("flow-status").textContent = "Approveed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("check_in").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/passes/${state.pass.id}/transition`, {
      to: "checked_in",
      version: state.pass.version,
    });
    state.pass = data.pass;
    $("flow-status").textContent = "CheckInd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
