const state = { token: null, hold: null };
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

function showHold() {
  $("hold-view").textContent = state.hold
    ? JSON.stringify(state.hold, null, 2)
    : "";
  $("publish").disabled = !(state.hold && state.hold.state === "reserved");
  $("archive").disabled = !(state.hold && state.hold.state === "fitted");
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
    const data = await api("POST", "/holds", { title: $("title").value });
    state.hold = data.hold;
    $("flow-status").textContent = "Reserveded.";
    showHold();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/holds/${state.hold.id}/transition`, {
      to: "fitted",
      version: state.hold.version,
    });
    state.hold = data.hold;
    $("flow-status").textContent = "Fitted.";
    showHold();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/holds/${state.hold.id}/transition`, {
      to: "returned",
      version: state.hold.version,
    });
    state.hold = data.hold;
    $("flow-status").textContent = "Returned.";
    showHold();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
