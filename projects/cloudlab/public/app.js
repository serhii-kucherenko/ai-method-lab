const state = { token: null, bench: null };
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

function showBench() {
  $("bench-view").textContent = state.bench
    ? JSON.stringify(state.bench, null, 2)
    : "";
  $("publish").disabled = !(state.bench && state.bench.state === "booked");
  $("archive").disabled = !(state.bench && state.bench.state === "running");
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
    const data = await api("POST", "/benches", { title: $("title").value });
    state.bench = data.bench;
    $("flow-status").textContent = "Bookeded.";
    showBench();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/benches/${state.bench.id}/transition`, {
      to: "running",
      version: state.bench.version,
    });
    state.bench = data.bench;
    $("flow-status").textContent = "Running.";
    showBench();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/benches/${state.bench.id}/transition`, {
      to: "cleaned",
      version: state.bench.version,
    });
    state.bench = data.bench;
    $("flow-status").textContent = "Cleaned.";
    showBench();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
