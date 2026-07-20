const state = { token: null, plot: null };
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

function showPlot() {
  $("plot-view").textContent = state.plot
    ? JSON.stringify(state.plot, null, 2)
    : "";
  $("publish").disabled = !(state.plot && state.plot.state === "claimed");
  $("archive").disabled = !(state.plot && state.plot.state === "growing");
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
    const data = await api("POST", "/plots", { title: $("title").value });
    state.plot = data.plot;
    $("flow-status").textContent = "Claimeded.";
    showPlot();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/plots/${state.plot.id}/transition`, {
      to: "growing",
      version: state.plot.version,
    });
    state.plot = data.plot;
    $("flow-status").textContent = "Growing.";
    showPlot();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/plots/${state.plot.id}/transition`, {
      to: "harvested",
      version: state.plot.version,
    });
    state.plot = data.plot;
    $("flow-status").textContent = "Harvested.";
    showPlot();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
