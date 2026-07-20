const state = { token: null, stop: null };
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

function showStop() {
  $("stop-view").textContent = state.stop
    ? JSON.stringify(state.stop, null, 2)
    : "";
  $("publish").disabled = !(state.stop && state.stop.state === "parked");
  $("archive").disabled = !(state.stop && state.stop.state === "serving");
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
    const data = await api("POST", "/stops", { title: $("title").value });
    state.stop = data.stop;
    $("flow-status").textContent = "Parkeded.";
    showStop();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/stops/${state.stop.id}/transition`, {
      to: "serving",
      version: state.stop.version,
    });
    state.stop = data.stop;
    $("flow-status").textContent = "Serving.";
    showStop();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/stops/${state.stop.id}/transition`, {
      to: "packed",
      version: state.stop.version,
    });
    state.stop = data.stop;
    $("flow-status").textContent = "Packed.";
    showStop();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
