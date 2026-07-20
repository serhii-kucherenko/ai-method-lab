const state = { token: null, stall: null };
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

function showStall() {
  $("stall-view").textContent = state.stall
    ? JSON.stringify(state.stall, null, 2)
    : "";
  $("publish").disabled = !(state.stall && state.stall.state === "held");
  $("archive").disabled = !(state.stall && state.stall.state === "trading");
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
    const data = await api("POST", "/stalls", { title: $("title").value });
    state.stall = data.stall;
    $("flow-status").textContent = "Helded.";
    showStall();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/stalls/${state.stall.id}/transition`, {
      to: "trading",
      version: state.stall.version,
    });
    state.stall = data.stall;
    $("flow-status").textContent = "Trading.";
    showStall();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/stalls/${state.stall.id}/transition`, {
      to: "closed",
      version: state.stall.version,
    });
    state.stall = data.stall;
    $("flow-status").textContent = "Closed.";
    showStall();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
